import { useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography } from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlined from "@mui/icons-material/EditOutlined";
import SearchRounded from "@mui/icons-material/SearchRounded";
import NoteAltOutlined from "@mui/icons-material/NoteAltOutlined";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { lessonById, lessonPath, lessons } from "../content";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { PageHeading } from "../components/PageHeading";
import { useNotes } from "../notes/useNotes";
import type { NoteCategory } from "../notes/types";
import type { NotesSnapshot } from "../notes/types";
import { downloadNotesJson, readNotesFile } from "../notes/files";
import { migrateLegacyNotes } from "../notes/migrate";
import { useStudy } from "../core/StudyContext";
import { useEffect } from "react";

type CategoryDialog = { category: NoteCategory | null; name: string } | null;
type Deletion = { type: "note" | "category"; id: string; title: string } | null;

export function Notes() {
  const data = useNotes();
  const { state } = useStudy();
  const [params, setParams] = useSearchParams();
  const lessonFilter = params.get("lesson");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [uncategorized, setUncategorized] = useState(false);
  const [categorySaving, setCategorySaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<CategoryDialog>(null);
  const [deletion, setDeletion] = useState<Deletion>(null);
  const [message, setMessage] = useState("");
  const importInput = useRef<HTMLInputElement>(null);
  const [importCandidate, setImportCandidate] = useState<NotesSnapshot | null>(null);
  const [mobilePane, setMobilePane] = useState<"categories" | "list" | "editor">("categories");
  useEffect(() => { void migrateLegacyNotes(state.notes).then(() => data.reload()).catch((cause: unknown) => setMessage(`Chưa chuyển được ghi chú cũ: ${(cause as Error).message}`)); }, [state.notes, data.reload]);
  const filtered = useMemo(() => data.notes.filter((note) => {
    if (lessonFilter && note.lessonId !== lessonFilter) return false;
    if (uncategorized && note.categoryId !== null) return false;
    if (categoryId && note.categoryId !== categoryId) return false;
    const term = search.trim().toLocaleLowerCase("vi");
    return !term || `${note.title} ${note.bodyMarkdown}`.toLocaleLowerCase("vi").includes(term);
  }).sort((a, b) => b.updatedAt - a.updatedAt), [data.notes, lessonFilter, categoryId, uncategorized, search]);
  const selected = data.notes.find((note) => note.id === selectedId) ?? null;
  const categoryNameTaken = !!dialog && data.categories.some((category) => category.id !== dialog.category?.id && category.name.trim().toLocaleLowerCase("vi") === dialog.name.trim().toLocaleLowerCase("vi"));

  function selectCategory(id: string | null) { setCategoryId(id); setUncategorized(false); setSelectedId(null); setMobilePane("list"); }
  function selectNote(id: string) { setSelectedId(id); setMobilePane("editor"); }
  function addNote() {
    const note = data.createNote(lessonFilter, categoryId);
    setSearch(""); setSelectedId(note.id); setMobilePane("editor");
  }
  async function saveCategory() {
    if (!dialog?.name.trim() || categorySaving) return;
    if (categoryNameTaken) {
      setMessage("Tên danh mục đã có. Hãy chọn tên khác."); return;
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
  function exportCurrent() {
    try { downloadNotesJson({ version: 1, categories: data.categories, notes: data.notes }); setMessage(""); }
    catch (cause) { setMessage(`Không xuất được JSON: ${(cause as Error).message}`); }
  }
  async function readImport(file: File | undefined) {
    if (!file) return;
    try { setImportCandidate(await readNotesFile(file)); setMessage(""); }
    catch (cause) { setMessage((cause as Error).message); }
    finally { if (importInput.current) importInput.current.value = ""; }
  }
  async function confirmImport() {
    if (!importCandidate) return;
    try { await data.replaceAll(importCandidate); setImportCandidate(null); setSelectedId(null); setCategoryId(null); setUncategorized(false); setSearch(""); setMobilePane("list"); setMessage(""); }
    catch (cause) { setMessage(`Không nhập được ghi chú: ${(cause as Error).message}`); }
  }
  return <>
    <PageHeading eyebrow="KIẾN THỨC CỦA RIÊNG BẠN" title="Ghi chú để nhớ lâu hơn" description="Gom các điểm dễ nhầm, ví dụ thực tế và cách giải đề vào một nơi. Nội dung tự lưu trong trình duyệt; hãy xuất JSON định kỳ để giữ bản sao trên máy." action={<Stack direction="row" gap={1} flexWrap="wrap"><Button variant="outlined" startIcon={<FileDownloadOutlined />} onClick={exportCurrent}>Xuất JSON</Button><Button variant="contained" startIcon={<FileUploadOutlined />} onClick={() => importInput.current?.click()}>Nhập JSON</Button><input ref={importInput} hidden type="file" accept="application/json,.json" aria-label="Chọn file ghi chú JSON" onChange={(event) => void readImport(event.target.files?.[0])} /></Stack>} />
    {(data.error || message) && <Alert severity="error" sx={{ mb: 2 }}>{message || data.error}{data.error && <Button color="inherit" size="small" onClick={() => { void data.flush().then(() => data.reload()).catch(() => undefined); }}>Thử lưu lại</Button>}</Alert>}
    {lessonFilter && <Chip sx={{ mb: 2 }} label={`Đang xem ghi chú của ${lessonById.get(lessonFilter)?.title ?? lessonFilter}`} onDelete={() => { setParams({}); setSelectedId(null); }} />}
    <Box className={`notes-workspace pane-${mobilePane}`}>
      <Box className="notes-categories">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}><Typography className="notes-pane-title">Danh mục</Typography><IconButton size="small" aria-label="Tạo danh mục" onClick={() => setDialog({ category: null, name: "" })}><AddRounded /></IconButton></Stack>
        <Button fullWidth className="notes-category-item" variant={categoryId === null && !uncategorized ? "contained" : "text"} onClick={() => selectCategory(null)}>Tất cả ghi chú <span>{data.notes.length}</span></Button>
        <Button fullWidth className="notes-category-item" variant={uncategorized ? "contained" : "text"} onClick={() => { selectCategory(null); setUncategorized(true); }}>Chưa phân loại <span>{data.notes.filter((note) => note.categoryId === null).length}</span></Button>
        {data.categories.map((category) => <Box key={category.id} className="notes-category-row"><Button className="notes-category-item" variant={categoryId === category.id ? "contained" : "text"} onClick={() => selectCategory(category.id)}>{category.name}<span>{countInCategory(category.id)}</span></Button><IconButton size="small" aria-label={`Sửa ${category.name}`} onClick={() => setDialog({ category, name: category.name })}><EditOutlined fontSize="small" /></IconButton><IconButton size="small" aria-label={`Xóa ${category.name}`} onClick={() => setDeletion({ type: "category", id: category.id, title: category.name })}><DeleteOutlineRounded fontSize="small" /></IconButton></Box>)}
        <Box className="notes-storage-hint">Lưu trên trình duyệt này · Có thể xuất ra file JSON</Box>
      </Box>
      <Box className="notes-list">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}><Stack direction="row" alignItems="center" gap={1}><IconButton className="notes-mobile-back" aria-label="Về danh mục" onClick={() => setMobilePane("categories")}><ArrowBackRounded /></IconButton><Typography className="notes-pane-title">Ghi chú <span className="notes-count">{filtered.length}</span></Typography></Stack><Button variant="contained" size="small" startIcon={<AddRounded />} onClick={addNote}>Viết mới</Button></Stack>
        <TextField size="small" fullWidth placeholder="Tìm trong ghi chú…" value={search} onChange={(event) => setSearch(event.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment> } }} sx={{ mb: 2 }} />
        <Box className="notes-list-scroll">
          {filtered.length === 0 && <Box className="notes-empty"><NoteAltOutlined sx={{ fontSize: 34 }} /><Typography variant="h4">{search.trim() ? "Không tìm thấy ghi chú" : "Chưa có ghi chú nào"}</Typography><Typography variant="body2" color="text.secondary">{search.trim() ? "Thử từ khóa khác hoặc xóa từ khóa để xem lại danh sách." : "Tạo ghi chú để lưu thông tin vào danh mục này."}</Typography>{search.trim() && <Button onClick={() => setSearch("")}>Xóa từ khóa</Button>}<Button onClick={addNote}>Tạo ghi chú</Button></Box>}
          {filtered.map((note) => <button type="button" key={note.id} className={`notes-list-item ${selectedId === note.id ? "is-selected" : ""}`} onClick={() => selectNote(note.id)}><strong>{note.title.trim() || "Ghi chú chưa đặt tên"}</strong><span>{note.bodyMarkdown.replace(/[#*`>\[\]]/g, "").slice(0, 110) || "Bắt đầu viết nội dung…"}</span><small>{note.lessonId ? lessonById.get(note.lessonId)?.title ?? "Bài học" : "Ghi chú tự do"} · {new Date(note.updatedAt).toLocaleDateString("vi-VN")}</small></button>)}
        </Box>
      </Box>
      <Box className="notes-detail">
        {selected ? <><Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}><Stack direction="row" gap={1} alignItems="center"><IconButton className="notes-mobile-back" aria-label="Về danh sách" onClick={() => setMobilePane("list")}><ArrowBackRounded /></IconButton><Typography variant="caption" color="text.secondary">GHI CHÚ CÁ NHÂN</Typography></Stack><IconButton color="error" aria-label="Xóa ghi chú" onClick={() => setDeletion({ type: "note", id: selected.id, title: selected.title || "ghi chú chưa đặt tên" })}><DeleteOutlineRounded /></IconButton></Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ mb: 2 }}><TextField select size="small" label="Danh mục" value={selected.categoryId ?? ""} onChange={(event) => data.updateNote({ ...selected, categoryId: event.target.value || null })} sx={{ minWidth: 190 }}><MenuItem value="">Chưa phân loại</MenuItem>{data.categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}</TextField><TextField select size="small" label="Bài học liên kết" value={selected.lessonId ?? ""} onChange={(event) => data.updateNote({ ...selected, lessonId: event.target.value || null })} sx={{ minWidth: 220 }}><MenuItem value="">Không gắn bài học</MenuItem>{lessons.map((lesson) => <MenuItem key={lesson.id} value={lesson.id}>{lesson.number}. {lesson.title}</MenuItem>)}</TextField></Stack>
          {selectedLesson && <Button component={RouterLink} to={lessonPath(selectedLesson.id)} size="small" sx={{ mb: 1 }}>Mở bài học liên kết ↗</Button>}
          <MarkdownEditor note={selected} status={data.status} onChange={data.updateNote} onBlur={() => { void data.flush().catch(() => undefined); }} />
        </> : <Box className="notes-empty notes-detail-empty"><NoteAltOutlined sx={{ fontSize: 48 }} /><Typography variant="h3">Một ý nhỏ hôm nay, nhớ lâu khi vào phòng thi.</Typography><Typography color="text.secondary">Chọn một ghi chú hoặc viết mới để bắt đầu.</Typography><Button variant="contained" startIcon={<AddRounded />} onClick={addNote}>Viết ghi chú</Button></Box>}
      </Box>
    </Box>
    <Dialog open={!!dialog} onClose={() => { if (!categorySaving) setDialog(null); }} fullWidth maxWidth="xs"><DialogTitle>{dialog?.category ? "Đổi tên danh mục" : "Tạo danh mục mới"}</DialogTitle><DialogContent><TextField autoFocus fullWidth label="Tên danh mục" error={categoryNameTaken} helperText={categoryNameTaken ? "Tên danh mục đã có. Hãy chọn tên khác." : undefined} disabled={categorySaving} value={dialog?.name ?? ""} onChange={(event) => setDialog((current) => current ? { ...current, name: event.target.value } : null)} slotProps={{ htmlInput: { maxLength: 120 } }} onKeyDown={(event) => { if (event.key === "Enter") void saveCategory(); }} sx={{ mt: 1 }} /></DialogContent><DialogActions><Button disabled={categorySaving} onClick={() => setDialog(null)}>Hủy</Button><Button variant="contained" disabled={!dialog?.name.trim() || categorySaving || categoryNameTaken} onClick={() => void saveCategory()}>Lưu</Button></DialogActions></Dialog>
    <Dialog open={!!deletion} onClose={() => setDeletion(null)} fullWidth maxWidth="xs"><DialogTitle>{deletion?.type === "category" ? "Xóa danh mục?" : "Xóa ghi chú?"}</DialogTitle><DialogContent><Typography>{deletion?.type === "category" ? `“${deletion.title}” có ${countInCategory(deletion.id)} ghi chú. Những ghi chú này sẽ chuyển về Chưa phân loại, không bị xóa.` : `Ghi chú “${deletion?.title}” sẽ bị xóa khỏi trình duyệt này. Hãy xuất JSON trước nếu muốn giữ lại.`}</Typography></DialogContent><DialogActions><Button onClick={() => setDeletion(null)}>Giữ lại</Button><Button color="error" variant="contained" onClick={() => void remove()}>Xác nhận xóa</Button></DialogActions></Dialog>
    <Dialog open={!!importCandidate} onClose={() => setImportCandidate(null)} fullWidth maxWidth="sm"><DialogTitle>Thay bộ ghi chú hiện tại?</DialogTitle><DialogContent><Typography>File có {importCandidate?.categories.length} danh mục và {importCandidate?.notes.length} ghi chú. Nếu nhập, toàn bộ ghi chú hiện có trong trình duyệt này sẽ được thay bằng nội dung file.</Typography><Button startIcon={<FileDownloadOutlined />} onClick={exportCurrent} sx={{ mt: 2 }}>Xuất ghi chú hiện tại trước</Button></DialogContent><DialogActions><Button onClick={() => setImportCandidate(null)}>Hủy</Button><Button variant="contained" onClick={() => void confirmImport()}>Nhập và thay thế</Button></DialogActions></Dialog>
  </>;
}
