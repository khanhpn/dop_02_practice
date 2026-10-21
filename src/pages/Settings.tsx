import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";
import { useStudy } from "../core/StudyContext";
import {
  dateOnly,
  emptyState,
  parseBackup,
  parseFullBackup,
  serializeBackup,
  serializeFullBackup,
} from "../core/storage";
import type { StudyState } from "../core/types";
import type { NotesSnapshot, StudyNote } from "../notes/types";
import { readNotesSnapshot } from "../notes/db";
import { useNotes } from "../notes/useNotes";
import { migrateLegacyNotes } from "../notes/migrate";
import { EXAM_GUIDE, SNAPSHOT_DATE, lessons, questions } from "../content";
import { PageHeading } from "../components/PageHeading";
function download(text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `dop-study-backup-${dateOnly()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Settings() {
  const { state, update, replacePersisted } = useStudy();
  const notesStore = useNotes();
  const file = useRef<HTMLInputElement>(null);
  const operation = useRef(false);
  const [pending, setPending] = useState<{ state: StudyState; notes: NotesSnapshot | null } | null>(null);
  const [reset, setReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const [noteCount, setNoteCount] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const [draft, setDraft] = useState({ ...state.settings });
  const [validation, setValidation] = useState("");
  useEffect(() => { void readNotesSnapshot().then((snapshot) => setNoteCount(snapshot.notes.length)).catch(() => setNoteCount(null)); }, []);
  function legacyNotesSnapshot(legacy: Record<string, string>): NotesSnapshot {
    const now = Date.now();
    const notes: StudyNote[] = Object.entries(legacy).filter(([, body]) => body.trim()).map(([lessonId, bodyMarkdown]) => ({ id: `legacy:${lessonId}`, categoryId: null, lessonId, title: "Ghi chú từ bài học", bodyMarkdown, tags: [], pinned: false, needsReview: false, createdAt: now, updatedAt: now }));
    return { version: 2, categories: [], notes };
  }
  async function exportCurrent() {
    if (operation.current) return;
    operation.current = true;
    setBusy(true);
    try {
      await notesStore.flush();
      if (Object.keys(state.notes).length > 0) {
        await migrateLegacyNotes(state.notes);
        await notesStore.reload();
      }
      const snapshot = await readNotesSnapshot();
      const text = serializeFullBackup({ ...state, notes: {} }, snapshot);
      parseFullBackup(text);
      download(text);
      setNoteCount(snapshot.notes.length);
      setMessage(null);
    } catch (cause) { setMessage({ text: `Không xuất được bản sao lưu: ${(cause as Error).message}`, error: true }); }
    finally { operation.current = false; setBusy(false); }
  }
  async function importFile(selected: File | undefined) {
    if (!selected) return;
    try {
      if (selected.size > 60_000_000)
        throw new Error("Tệp sao lưu vượt quá 60 MB.");
      setPending(parseFullBackup(await selected.text()));
      setMessage(null);
    } catch (e) {
      setMessage({ text: (e as Error).message, error: true });
    } finally {
      if (file.current) file.current.value = "";
    }
  }
  async function restoreFull() {
    if (!pending || operation.current) return;
    operation.current = true;
    setBusy(true);
    let oldNotes: NotesSnapshot | null = null;
    try {
      await notesStore.flush();
      oldNotes = await readNotesSnapshot();
      const nextNotes = pending.notes ?? legacyNotesSnapshot(pending.state.notes);
      await notesStore.replaceAll(nextNotes);
      try { replacePersisted({ ...pending.state, notes: {} }); }
      catch (cause) {
        try { await notesStore.replaceAll(oldNotes); }
        catch { throw new Error("Không lưu được tiến độ và cũng không khôi phục được kho ghi chú cũ. Đừng đóng thẻ trình duyệt này. Hãy dùng bản sao lưu để khôi phục dữ liệu."); }
        throw cause;
      }
      setNoteCount(nextNotes.notes.length);
      setDraft({ ...pending.state.settings });
      setPending(null);
      setMessage({ text: "Đã nhập tiến độ và ghi chú từ bản sao lưu.", error: false });
    } catch (cause) { setMessage({ text: `Không nhập được bản sao lưu: ${(cause as Error).message}`, error: true }); }
    finally { operation.current = false; setBusy(false); }
  }
  async function resetAll() {
    if (operation.current) return;
    operation.current = true;
    setBusy(true);
    try {
      await notesStore.flush();
      const before = await readNotesSnapshot();
      await notesStore.replaceAll({ version: 2, categories: [], notes: [] });
      const fresh = emptyState();
      try { replacePersisted(fresh); }
      catch (cause) {
        try { await notesStore.replaceAll(before); }
        catch { throw new Error("Không xóa được tiến độ và cũng không khôi phục được kho ghi chú. Đừng đóng thẻ trình duyệt này. Hãy dùng bản sao lưu để khôi phục dữ liệu."); }
        throw cause;
      }
      setNoteCount(0);
      setDraft({ ...fresh.settings });
      setReset(false);
      setMessage({ text: "Đã xóa tiến độ và ghi chú trên trình duyệt này.", error: false });
    } catch (cause) { setMessage({ text: `Không xóa được toàn bộ dữ liệu: ${(cause as Error).message}`, error: true }); }
    finally { operation.current = false; setBusy(false); }
  }
  function save() {
    const candidate = { ...state, settings: draft };
    try {
      parseBackup(serializeBackup(candidate));
      if (draft.examDate <= draft.startDate)
        throw new Error("Ngày thi mục tiêu phải sau ngày bắt đầu học.");
      update((s) => ({ ...s, settings: draft }));
      setValidation("");
      setMessage({ text: "Đã lưu lịch học và tùy chọn.", error: false });
    } catch (e) {
      setValidation((e as Error).message);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="KHÔNG GIAN HỌC THEO NHỊP CỦA BẠN"
        title="Điều chỉnh mục tiêu, giữ trọn tiến độ"
        description="Đặt lịch học phù hợp với bạn và sao lưu tiến độ để tiếp tục học khi đổi máy."
      />
      {message && (
        <Alert
          severity={message.error ? "error" : "success"}
          sx={{ mb: 3 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        <Card sx={{ p: 3 }}>
          <Typography variant="h3" sx={{ mb: 3 }}>
            Mục tiêu học tập
          </Typography>
          <Stack spacing={2.5}>
            <TextField
              type="date"
              label="Ngày thi mục tiêu"
              value={draft.examDate}
              onChange={(e) => setDraft({ ...draft, examDate: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              type="date"
              label="Ngày bắt đầu lộ trình"
              value={draft.startDate}
              onChange={(e) =>
                setDraft({ ...draft, startDate: e.target.value })
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              type="number"
              label="Số giờ học mỗi ngày"
              value={draft.dailyHours}
              onChange={(e) =>
                setDraft({ ...draft, dailyHours: Number(e.target.value) })
              }
              slotProps={{ htmlInput: { min: 1, max: 12 } }}
            />
            <TextField
              select
              label="Giao diện"
              value={draft.theme}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  theme: e.target.value as "light" | "dark",
                })
              }
            >
              <MenuItem value="light">Sáng — dễ đọc bài dài</MenuItem>
              <MenuItem value="dark">Tối — dịu mắt buổi tối</MenuItem>
            </TextField>
            <TextField
              select
              label="Ngôn ngữ câu hỏi mặc định"
              value={draft.questionLocale}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  questionLocale: e.target.value as "en" | "vi",
                })
              }
            >
              <MenuItem value="en">Tiếng Anh — luyện thi</MenuItem>
              <MenuItem value="vi">Tiếng Việt — tham khảo</MenuItem>
            </TextField>
            {validation && <Alert severity="error">{validation}</Alert>}
            <Button variant="contained" onClick={save}>
              Lưu thay đổi
            </Button>
          </Stack>
        </Card>
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ mb: 1.5 }}>
              Lưu giữ và chuyển dữ liệu học tập
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tiến độ, ghi chú và kết quả chỉ được lưu trong trình duyệt bạn
              đang dùng, không tự đồng bộ sang máy khác. Hãy xuất bản sao lưu
              trước khi xóa dữ liệu trình duyệt hoặc đổi máy, rồi nhập lại bản
              sao đó để học tiếp. Bản website chạy trên máy và bản trên GitHub
              Pages lưu dữ liệu riêng; muốn chuyển tiến độ giữa hai nơi, bạn cần
              xuất rồi nhập bản sao lưu.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadOutlined />}
                onClick={() => void exportCurrent()}
                disabled={busy}
              >
                Xuất bản sao lưu
              </Button>
              <Button
                startIcon={<FileUploadOutlined />}
                onClick={() => file.current?.click()}
                disabled={busy}
              >
                Nhập bản sao lưu
              </Button>
              <input
                ref={file}
                hidden
                type="file"
                accept="application/json,.json"
                onChange={(e) => void importFile(e.target.files?.[0])}
                aria-label="Chọn tệp sao lưu"
              />
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2 }}
            >
              {state.completed.length} bài hoàn thành ·{" "}
              {noteCount ?? "…"} ghi chú · {state.attempts.length} lượt luyện tập
            </Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ mb: 1.5 }}>
              Nội dung & nguồn tham khảo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              AWS DOP-C02 · Hướng dẫn thi được đối chiếu ngày {SNAPSHOT_DATE}.{" "}
              {lessons.length} bài học và {questions.length} câu hỏi đã biên
              soạn. Mỗi bài dẫn nguồn AWS để đọc sâu và đối chiếu.
            </Typography>
            <Link
              href={EXAM_GUIDE}
              target="_blank"
              rel="noreferrer"
              sx={{ fontSize: 13 }}
            >
              Mở hướng dẫn thi chính thức của AWS ↗
            </Link>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Câu hỏi luyện tập do dự án biên soạn, không phải câu hỏi thi chính
              thức. Ngân hàng câu hỏi và đề thi thử giúp xác định phần kiến thức cần củng cố;
              không bảo đảm kết quả thi.
            </Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ mb: 1.5 }}>
              Xóa dữ liệu học tập
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Xuất bản sao lưu trước khi xóa tiến độ và ghi chú. Thao tác này chỉ tác
              động đến dữ liệu của website trong trình duyệt này.
            </Typography>
            <Button
              color="error"
              variant="outlined"
              onClick={() => setReset(true)}
              disabled={busy}
            >
              Xóa dữ liệu trên trình duyệt này
            </Button>
          </Card>
        </Stack>
      </Box>
      <Dialog open={!!pending} onClose={() => { if (!busy) setPending(null); }}>
        <DialogTitle>Thay dữ liệu hiện tại bằng bản sao lưu?</DialogTitle>
        <DialogContent>
          <Typography>
            Bản sao lưu có {pending?.state.completed.length} bài hoàn thành,{" "}
            {pending?.state.attempts.length} lượt luyện tập và{" "}
            {pending?.notes?.notes.length ?? Object.keys(pending?.state.notes ?? {}).length} ghi chú.
            Tiến độ, kết quả luyện tập, cài đặt và toàn bộ ghi chú hiện tại sẽ được thay bằng dữ liệu trong bản sao lưu.
          </Typography>
          <Button
            startIcon={<FileDownloadOutlined />}
            onClick={() => void exportCurrent()}
            disabled={busy}
            sx={{ mt: 2 }}
          >
            Sao lưu dữ liệu hiện tại trước
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPending(null)} disabled={busy}>Hủy</Button>
          <Button
            variant="contained"
            onClick={() => void restoreFull()}
            disabled={busy}
          >
            Nhập và thay thế dữ liệu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={reset} onClose={() => { if (!busy) setReset(false); }}>
        <DialogTitle>Xóa toàn bộ dữ liệu học tập?</DialogTitle>
        <DialogContent>
          <Typography>
            Toàn bộ ghi chú, danh mục ghi chú, tiến độ học, kết quả luyện tập và lượt làm bài
            đang dở sẽ bị xóa khỏi trình duyệt này. Cài đặt sẽ trở về mặc định. Chỉ có thể khôi phục dữ liệu nếu bạn đã xuất bản sao lưu.
          </Typography>
          <Button onClick={() => void exportCurrent()} disabled={busy}>
            Xuất bản sao lưu trước
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReset(false)} disabled={busy}>Giữ lại dữ liệu</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void resetAll()}
            disabled={busy}
          >
            Xác nhận xóa dữ liệu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
