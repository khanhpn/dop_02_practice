import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography } from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlined from "@mui/icons-material/EditOutlined";
import SearchRounded from "@mui/icons-material/SearchRounded";
import NoteAltOutlined from "@mui/icons-material/NoteAltOutlined";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";
import PushPinOutlined from "@mui/icons-material/PushPinOutlined";
import PushPinRounded from "@mui/icons-material/PushPinRounded";
import BookmarkBorderRounded from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRounded from "@mui/icons-material/BookmarkRounded";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { domains, lessonById, lessonPath, lessons } from "../content";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { useNotes } from "../notes/useNotes";
import type { NoteCategory, StudyNote } from "../notes/types";
import type { NotesSnapshot } from "../notes/types";
import { downloadNotesJson, readNotesFile } from "../notes/files";
import { migrateLegacyNotes } from "../notes/migrate";
import { readNotesSnapshot } from "../notes/db";
import { useStudy } from "../core/StudyContext";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";

type CategoryDialog = { category: NoteCategory | null; name: string } | null;
type Deletion = { type: "note" | "category"; id: string; title: string } | null;
type QuickFilter = "all" | "pinned" | "review" | "uncategorized";
const templates = [
  { name: "Khái niệm", body: "## Hiểu đơn giản\n\n## Cơ chế hoạt động\n\n## Khi nào nên dùng\n\n## Dễ nhầm với\n" },
  { name: "Bẫy đề", body: "## Tình huống trong đề\n\n## Dấu hiệu quyết định\n\n## Vì sao đáp án đúng\n\n## Vì sao các phương án khác sai\n" },
  { name: "Thực hành", body: "## Mục tiêu\n\n## Chuẩn bị\n\n## Các bước thực hiện\n\n## Kết quả mong đợi\n\n## Lỗi gặp phải và cách xử lý\n\n## Dọn dẹp tài nguyên\n" },
  { name: "Lỗi từng gặp", body: "## Triệu chứng\n\n## Nguyên nhân gốc rễ\n\n## Cách kiểm tra\n\n## Cách khắc phục\n\n## Điều cần nhớ khi gặp lại\n" },
] as const;

export function Notes() {
  const theme = useTheme();
  const data = useNotes();
  const { state, update } = useStudy();
  const [params, setParams] = useSearchParams();
  const lessonFilter = params.get("lesson");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [uncategorized, setUncategorized] = useState(false);
  const [categorySaving, setCategorySaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [tagFilter, setTagFilter] = useState("");
  const [domainFilter, setDomainFilter] = useState(0);
  const [sortBy, setSortBy] = useState<"recent" | "title">("recent");
  const [tagDraft, setTagDraft] = useState("");
  const [templateMenu, setTemplateMenu] = useState(false);
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [dialog, setDialog] = useState<CategoryDialog>(null);
  const [deletion, setDeletion] = useState<Deletion>(null);
  const [message, setMessage] = useState("");
  const importInput = useRef<HTMLInputElement>(null);
  const operation = useRef(false);
  const [busy, setBusy] = useState(false);
  const [importCandidate, setImportCandidate] = useState<NotesSnapshot | null>(null);
  const [mobilePane, setMobilePane] = useState<"categories" | "list" | "editor">("categories");
  useEffect(() => {
    if (Object.keys(state.notes).length === 0) return;
    void migrateLegacyNotes(state.notes)
      .then(async () => { await data.reload(); update((current) => ({ ...current, notes: {} })); })
      .catch((cause: unknown) => setMessage(`Chưa chuyển được ghi chú cũ: ${(cause as Error).message}`));
  }, [state.notes, data.reload, update]);
  const filtered = useMemo(() => data.notes.filter((note) => {
    if (lessonFilter && note.lessonId !== lessonFilter) return false;
    if (uncategorized && note.categoryId !== null) return false;
    if (categoryId && note.categoryId !== categoryId) return false;
    if (quickFilter === "pinned" && !note.pinned) return false;
    if (quickFilter === "review" && !note.needsReview) return false;
    if (quickFilter === "uncategorized" && note.categoryId !== null) return false;
    if (tagFilter && !note.tags.includes(tagFilter)) return false;
    if (domainFilter && (!note.lessonId || lessonById.get(note.lessonId)?.domainId !== domainFilter)) return false;
    const term = search.trim().toLocaleLowerCase("vi");
    return !term || `${note.title} ${note.bodyMarkdown} ${note.tags.join(" ")}`.toLocaleLowerCase("vi").includes(term);
  }).sort((a, b) => sortBy === "title" ? a.title.localeCompare(b.title, "vi") : b.updatedAt - a.updatedAt), [data.notes, lessonFilter, categoryId, uncategorized, quickFilter, tagFilter, domainFilter, search, sortBy]);
  const allTags = useMemo(() => [...new Set(data.notes.flatMap((note) => note.tags))].sort((a, b) => a.localeCompare(b, "vi")), [data.notes]);
  const selected = data.notes.find((note) => note.id === selectedId) ?? null;
  const categoryNameTaken = !!dialog && data.categories.some((category) => category.id !== dialog.category?.id && category.name.trim().toLocaleLowerCase("vi") === dialog.name.trim().toLocaleLowerCase("vi"));

  function selectCategory(id: string | null) { setCategoryId(id); setUncategorized(false); setSelectedId(null); setMobilePane("list"); }
  function selectNote(id: string) { setSelectedId(id); setMetadataOpen(false); setMobilePane("editor"); }
  function addNote(template?: typeof templates[number]) {
    const note = data.createNote(lessonFilter, categoryId);
    if (template) data.updateNote({ ...note, title: template.name, bodyMarkdown: template.body, needsReview: template.name === "Bẫy đề" });
    setSearch(""); setQuickFilter("all"); setTagFilter(""); setDomainFilter(0); setSelectedId(note.id); setMetadataOpen(false); setMobilePane("editor"); setTemplateMenu(false);
  }
  function addTag(note: StudyNote) {
    const tag = tagDraft.trim().replace(/^#/, "");
    if (tag && !note.tags.includes(tag) && note.tags.length < 30) data.updateNote({ ...note, tags: [...note.tags, tag] });
    setTagDraft("");
  }
  async function saveCategory() {
    if (!dialog?.name.trim() || categorySaving) return;
    if (categoryNameTaken) {
      setMessage("Tên danh mục đã tồn tại. Hãy chọn tên khác."); return;
    }
    setCategorySaving(true);
    try {
      if (dialog.category) await data.renameCategory(dialog.category, dialog.name);
      else { const category = await data.createCategory(dialog.name); selectCategory(category.id); }
      setDialog(null); setMessage("");
    } catch (cause) { setMessage(`Không lưu được danh mục: ${(cause as Error).message}`); }
    finally { setCategorySaving(false); }
  }
  async function remove() {
    if (!deletion) return;
    try {
      if (deletion.type === "note") { await data.removeNote(deletion.id); setSelectedId(null); setMobilePane("list"); }
      else { await data.removeCategory(deletion.id); setCategoryId(null); setMobilePane("categories"); }
      setDeletion(null); setMessage("");
    } catch (cause) { setMessage(`Không xóa được dữ liệu: ${(cause as Error).message}`); }
  }
  const countInCategory = (id: string) => data.notes.filter((note) => note.categoryId === id).length;
  const selectedLesson = selected?.lessonId ? lessonById.get(selected.lessonId) : null;
  async function exportCurrent() {
    if (operation.current) return;
    operation.current = true; setBusy(true);
    try {
      let saveFailed = false;
      try { await data.flush(); }
      catch { saveFailed = true; }
      try { await migrateLegacyNotes(state.notes); }
      catch { saveFailed = true; }
      let snapshot: NotesSnapshot;
      try { snapshot = await readNotesSnapshot(); }
      catch { snapshot = { version: 2, categories: data.categories, notes: [] }; saveFailed = true; }
      if (saveFailed) {
        const merged = new Map(snapshot.notes.map((note) => [note.id, note]));
        for (const [lessonId, bodyMarkdown] of Object.entries(state.notes)) {
          if (!bodyMarkdown.trim()) continue;
          const id = `legacy:${lessonId}`;
          if (!merged.has(id)) {
            const now = Date.now();
            merged.set(id, { id, categoryId: null, lessonId, title: "Ghi chú từ bài học", bodyMarkdown, tags: [], pinned: false, needsReview: false, createdAt: now, updatedAt: now });
          }
        }
        data.notes.forEach((note) => merged.set(note.id, note));
        const categories = new Map(snapshot.categories.map((category) => [category.id, category]));
        data.categories.forEach((category) => categories.set(category.id, category));
        snapshot = { version: 2, categories: [...categories.values()], notes: [...merged.values()].map((note) => note.categoryId && !categories.has(note.categoryId) ? { ...note, categoryId: null } : note) };
      }
      downloadNotesJson(snapshot);
      setMessage(saveFailed ? "Đã xuất các ghi chú đang có, gồm cả bản nháp. Do lỗi lưu trữ, tệp có thể chưa đầy đủ. Hãy kiểm tra tệp trước khi đóng thẻ trình duyệt." : "");
    }
    catch (cause) { setMessage(`Không xuất được ghi chú ra tệp JSON: ${(cause as Error).message}`); }
    finally { operation.current = false; setBusy(false); }
  }
  async function readImport(file: File | undefined) {
    if (!file) return;
    try { setImportCandidate(await readNotesFile(file)); setMessage(""); }
    catch (cause) { setMessage((cause as Error).message); }
    finally { if (importInput.current) importInput.current.value = ""; }
  }
  async function confirmImport() {
    if (!importCandidate || operation.current) return;
    operation.current = true; setBusy(true);
    try { await data.replaceAll(importCandidate); setImportCandidate(null); setSelectedId(null); setCategoryId(null); setUncategorized(false); setSearch(""); setMobilePane("list"); setMessage(""); }
    catch (cause) { setMessage(`Không nhập được ghi chú: ${(cause as Error).message}`); }
    finally { operation.current = false; setBusy(false); }
  }
  const dark = theme.palette.mode === "dark";
  const surfaceStyle = { "--notes-surface": dark ? "#19292d" : "#fff", "--notes-sidebar": dark ? "#142327" : "#f5f8f4", "--notes-border": dark ? "#30433e" : "#dce5dd", "--notes-hover": dark ? "#223b36" : "#f4f8f3", "--notes-selected": dark ? "#2b5044" : "#eaf4ed", "--notes-text": dark ? "#e8f0ec" : "#26392f", "--notes-muted": dark ? "#a2b5af" : "#60726a" } as CSSProperties;
  return <Box className="notes-page" style={surfaceStyle}>
    <Stack className="notes-topbar" direction="row" alignItems="center" justifyContent="space-between" gap={1}>
      <Typography variant="h3">Ghi chú</Typography>
      <Stack direction="row" gap={1}>
        <Button size="small" variant="text" startIcon={<FileDownloadOutlined />} onClick={() => void exportCurrent()} disabled={busy}>Xuất JSON</Button>
        <Button size="small" variant="text" startIcon={<FileUploadOutlined />} onClick={() => importInput.current?.click()} disabled={busy}>Nhập JSON</Button>
        <input ref={importInput} hidden type="file" accept="application/json,.json" aria-label="Chọn tệp ghi chú JSON" onChange={(event) => void readImport(event.target.files?.[0])} />
      </Stack>
    </Stack>
    {(data.error || message) && <Alert severity="error" sx={{ mb: 2 }}>{message || data.error}{data.error && <Button color="inherit" size="small" onClick={() => { void data.flush().then(() => data.reload()).catch(() => undefined); }}>Thử lưu lại</Button>}</Alert>}
    {lessonFilter && <Chip sx={{ mb: 2 }} label={`Đang xem ghi chú của ${lessonById.get(lessonFilter)?.title ?? lessonFilter}`} onDelete={() => { setParams({}); setSelectedId(null); }} />}
    <Box className={`notes-workspace pane-${mobilePane}`}>
      <Box className="notes-categories">
        <IconButton size="small" aria-label="Tạo danh mục" title="Tạo danh mục" onClick={() => setDialog({ category: null, name: "" })}><AddRounded /></IconButton>
        <Button fullWidth className="notes-category-item" variant={categoryId === null && !uncategorized ? "contained" : "text"} onClick={() => selectCategory(null)}>Tất cả ghi chú <span className="notes-category-count">{data.notes.length}</span></Button>
        <Button fullWidth className="notes-category-item" variant={uncategorized ? "contained" : "text"} onClick={() => { selectCategory(null); setUncategorized(true); }}>Chưa phân loại <span className="notes-category-count">{data.notes.filter((note) => note.categoryId === null).length}</span></Button>
        <Button fullWidth className="notes-category-item" variant={quickFilter === "pinned" ? "contained" : "text"} onClick={() => { setQuickFilter(quickFilter === "pinned" ? "all" : "pinned"); setMobilePane("list"); }} startIcon={<PushPinOutlined fontSize="small" />}>Đã ghim <span className="notes-category-count">{data.notes.filter((note) => note.pinned).length}</span></Button>
        <Button fullWidth className="notes-category-item" variant={quickFilter === "review" ? "contained" : "text"} onClick={() => { setQuickFilter(quickFilter === "review" ? "all" : "review"); setMobilePane("list"); }} startIcon={<BookmarkBorderRounded fontSize="small" />}>Cần ôn lại <span className="notes-category-count">{data.notes.filter((note) => note.needsReview).length}</span></Button>
        {data.categories.map((category) => <Box key={category.id} className="notes-category-row"><Button className="notes-category-item" variant={categoryId === category.id ? "contained" : "text"} onClick={() => selectCategory(category.id)} title={category.name}><span className="notes-category-name">{category.name}</span><span className="notes-category-count">{countInCategory(category.id)}</span></Button><IconButton size="small" aria-label={`Đổi tên danh mục ${category.name}`} onClick={() => setDialog({ category, name: category.name })}><EditOutlined fontSize="small" /></IconButton><IconButton size="small" aria-label={`Xóa danh mục ${category.name}`} onClick={() => setDeletion({ type: "category", id: category.id, title: category.name })}><DeleteOutlineRounded fontSize="small" /></IconButton></Box>)}
      </Box>
      <Box className="notes-list">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}><Stack direction="row" alignItems="center" gap={1}><IconButton className="notes-mobile-back" aria-label="Về danh mục" onClick={() => setMobilePane("categories")}><ArrowBackRounded /></IconButton><Typography className="notes-pane-title">Ghi chú <span className="notes-count">{filtered.length}</span></Typography></Stack><Button variant="contained" size="small" startIcon={<AddRounded />} onClick={() => addNote()}>Viết mới</Button></Stack>
        <Button size="small" onClick={() => setTemplateMenu((open) => !open)} sx={{ mb: 1 }}>Tạo từ mẫu {templateMenu ? "▴" : "▾"}</Button>
        {templateMenu && <Stack direction="row" gap={.7} flexWrap="wrap" sx={{ mb: 1.5 }}>{templates.map((template) => <Chip key={template.name} label={template.name} clickable onClick={() => addNote(template)} />)}</Stack>}
        <TextField size="small" fullWidth placeholder="Tìm trong ghi chú…" value={search} onChange={(event) => setSearch(event.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment> } }} sx={{ mb: 2 }} />
        <Stack direction="row" gap={1} sx={{ mb: 1.5 }}><TextField select size="small" label="Nhóm kiến thức" value={domainFilter} onChange={(event) => setDomainFilter(Number(event.target.value))} sx={{ flex: 1 }}><MenuItem value={0}>Tất cả nhóm kiến thức</MenuItem>{domains.map((domain) => <MenuItem key={domain.id} value={domain.id}>D{domain.id} · {domain.shortLabel}</MenuItem>)}</TextField><TextField select size="small" label="Sắp xếp" value={sortBy} onChange={(event) => setSortBy(event.target.value as "recent" | "title")} sx={{ minWidth: 110 }}><MenuItem value="recent">Mới cập nhật</MenuItem><MenuItem value="title">A–Z</MenuItem></TextField></Stack>
        {allTags.length > 0 && <TextField select size="small" fullWidth label="Lọc theo nhãn" value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} sx={{ mb: 1.5 }}><MenuItem value="">Tất cả nhãn</MenuItem>{allTags.map((tag) => <MenuItem key={tag} value={tag}>#{tag}</MenuItem>)}</TextField>}
        <Box className="notes-list-scroll">
          {filtered.length === 0 && <Box className="notes-empty"><NoteAltOutlined sx={{ fontSize: 34 }} /><Typography variant="h4">{data.notes.length ? "Không tìm thấy ghi chú phù hợp" : "Chưa có ghi chú nào"}</Typography><Typography variant="body2" color="text.secondary">{data.notes.length ? "Thử đổi từ khóa hoặc điều chỉnh bộ lọc." : "Ghi lại điều bạn dễ quên trước khi bắt đầu ôn thi."}</Typography><Button onClick={() => { setSearch(""); setTagFilter(""); setDomainFilter(0); setQuickFilter("all"); setUncategorized(false); setCategoryId(null); setParams({}); }}>Xóa bộ lọc</Button><Button onClick={() => addNote()}>Tạo ghi chú</Button></Box>}
          {filtered.map((note) => <button type="button" key={note.id} className={`notes-list-item ${selectedId === note.id ? "is-selected" : ""}`} onClick={() => selectNote(note.id)}><strong>{note.pinned && <PushPinRounded sx={{ fontSize: 15, verticalAlign: "middle", mr: .4 }} />}{note.title.trim() || "Ghi chú chưa đặt tên"}</strong><span>{note.bodyMarkdown.replace(/[#*`>\[\]]/g, "").slice(0, 110) || "Bắt đầu viết nội dung…"}</span><small>{note.lessonId ? lessonById.get(note.lessonId)?.title ?? "Bài học" : "Ghi chú tự do"} · {new Date(note.updatedAt).toLocaleDateString("vi-VN")}</small><span className="notes-card-tags">{note.needsReview && <em>Cần ôn lại</em>}{note.tags.slice(0, 2).map((tag) => <em key={tag}>#{tag}</em>)}</span></button>)}
        </Box>
      </Box>
      <Box className="notes-detail">
        {selected ? <><Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}><IconButton className="notes-mobile-back" aria-label="Về danh sách" onClick={() => setMobilePane("list")}><ArrowBackRounded /></IconButton><Stack direction="row" sx={{ ml: "auto" }}><Button size="small" onClick={() => setMetadataOpen((open) => !open)} aria-expanded={metadataOpen}>Thông tin {metadataOpen ? "▴" : "▾"}</Button><IconButton aria-label={selected.pinned ? "Bỏ ghim" : "Ghim ghi chú"} color={selected.pinned ? "primary" : "default"} onClick={() => data.updateNote({ ...selected, pinned: !selected.pinned })}>{selected.pinned ? <PushPinRounded /> : <PushPinOutlined />}</IconButton><IconButton aria-label={selected.needsReview ? "Bỏ đánh dấu cần ôn lại" : "Đánh dấu cần ôn lại"} color={selected.needsReview ? "warning" : "default"} onClick={() => data.updateNote({ ...selected, needsReview: !selected.needsReview })}>{selected.needsReview ? <BookmarkRounded /> : <BookmarkBorderRounded />}</IconButton><IconButton color="error" aria-label="Xóa ghi chú" onClick={() => setDeletion({ type: "note", id: selected.id, title: selected.title || "ghi chú chưa đặt tên" })}><DeleteOutlineRounded /></IconButton></Stack></Stack>
          {metadataOpen && <Box className="notes-metadata"><Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ mb: 1.5 }}><TextField select size="small" label="Danh mục" value={selected.categoryId ?? ""} onChange={(event) => data.updateNote({ ...selected, categoryId: event.target.value || null })} sx={{ minWidth: 190 }}><MenuItem value="">Chưa phân loại</MenuItem>{data.categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}</TextField><TextField select size="small" label="Bài học liên quan" value={selected.lessonId ?? ""} onChange={(event) => data.updateNote({ ...selected, lessonId: event.target.value || null })} sx={{ minWidth: 220 }}><MenuItem value="">Không gắn với bài học</MenuItem>{lessons.map((lesson) => <MenuItem key={lesson.id} value={lesson.id}>{lesson.number}. {lesson.title}</MenuItem>)}</TextField></Stack><Stack direction="row" alignItems="center" gap={.7} flexWrap="wrap">{selected.tags.map((tag) => <Chip key={tag} size="small" label={`#${tag}`} onDelete={() => data.updateNote({ ...selected, tags: selected.tags.filter((item) => item !== tag) })} />)}<TextField size="small" placeholder="Thêm nhãn, nhấn Enter" aria-label="Thêm nhãn" value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(selected); } }} slotProps={{ htmlInput: { maxLength: 40 } }} sx={{ width: 180 }} />{selectedLesson && <Button component={RouterLink} to={lessonPath(selectedLesson.id)} size="small">Mở bài học ↗</Button>}</Stack></Box>}
          <MarkdownEditor note={selected} status={data.status} onChange={data.updateNote} onBlur={() => { void data.flush().catch(() => undefined); }} />
        </> : <Box className="notes-empty notes-detail-empty"><NoteAltOutlined sx={{ fontSize: 48 }} /><Button variant="contained" startIcon={<AddRounded />} onClick={() => addNote()}>Viết ghi chú</Button><Button onClick={() => setTemplateMenu((open) => !open)}>Tạo từ mẫu</Button>{templateMenu && <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center">{templates.map((template) => <Button key={template.name} variant="outlined" size="small" onClick={() => addNote(template)}>{template.name}</Button>)}</Stack>}</Box>}
      </Box>
    </Box>
    <Dialog open={!!dialog} onClose={() => { if (!categorySaving) setDialog(null); }} fullWidth maxWidth="xs"><DialogTitle>{dialog?.category ? "Đổi tên danh mục" : "Tạo danh mục mới"}</DialogTitle><DialogContent><TextField autoFocus fullWidth label="Tên danh mục" error={categoryNameTaken} helperText={categoryNameTaken ? "Tên danh mục đã tồn tại. Hãy chọn tên khác." : undefined} disabled={categorySaving} value={dialog?.name ?? ""} onChange={(event) => setDialog((current) => current ? { ...current, name: event.target.value } : null)} slotProps={{ htmlInput: { maxLength: 120 } }} onKeyDown={(event) => { if (event.key === "Enter") void saveCategory(); }} sx={{ mt: 1 }} /></DialogContent><DialogActions><Button disabled={categorySaving} onClick={() => setDialog(null)}>Hủy</Button><Button variant="contained" disabled={!dialog?.name.trim() || categorySaving || categoryNameTaken} onClick={() => void saveCategory()}>Lưu</Button></DialogActions></Dialog>
    <Dialog open={!!deletion} onClose={() => setDeletion(null)} fullWidth maxWidth="xs"><DialogTitle>{deletion?.type === "category" ? "Xóa danh mục?" : "Xóa ghi chú?"}</DialogTitle><DialogContent><Typography>{deletion?.type === "category" ? `“${deletion.title}” có ${countInCategory(deletion.id)} ghi chú. Những ghi chú này sẽ chuyển sang mục “Chưa phân loại” và không bị xóa.` : `Ghi chú “${deletion?.title}” sẽ bị xóa khỏi trình duyệt này. Hãy xuất tệp JSON trước nếu muốn giữ bản sao.`}</Typography></DialogContent><DialogActions><Button onClick={() => setDeletion(null)}>Giữ lại</Button><Button color="error" variant="contained" onClick={() => void remove()}>Xác nhận xóa</Button></DialogActions></Dialog>
    <Dialog open={!!importCandidate} onClose={() => { if (!busy) setImportCandidate(null); }} fullWidth maxWidth="sm"><DialogTitle>Thay thế toàn bộ ghi chú hiện tại?</DialogTitle><DialogContent><Typography>Tệp có {importCandidate?.categories.length} danh mục và {importCandidate?.notes.length} ghi chú. Khi nhập, toàn bộ danh mục và ghi chú hiện có trong trình duyệt này sẽ được thay bằng nội dung trong tệp.</Typography><Button startIcon={<FileDownloadOutlined />} onClick={() => void exportCurrent()} disabled={busy} sx={{ mt: 2 }}>Sao lưu ghi chú hiện tại trước</Button></DialogContent><DialogActions><Button onClick={() => setImportCandidate(null)} disabled={busy}>Hủy</Button><Button variant="contained" onClick={() => void confirmImport()} disabled={busy}>Nhập và thay thế</Button></DialogActions></Dialog>
  </Box>;
}
