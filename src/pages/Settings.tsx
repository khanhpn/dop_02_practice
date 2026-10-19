import { useRef, useState } from "react";
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
  serializeBackup,
} from "../core/storage";
import type { StudyState } from "../core/types";
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
  const { state, update, replace } = useStudy();
  const file = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<StudyState | null>(null);
  const [reset, setReset] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const [draft, setDraft] = useState({ ...state.settings });
  const [validation, setValidation] = useState("");
  async function importFile(selected: File | undefined) {
    if (!selected) return;
    try {
      if (selected.size > 10_000_000)
        throw new Error("Tệp sao lưu vượt quá 10 MB.");
      setPending(parseBackup(await selected.text()));
      setMessage(null);
    } catch (e) {
      setMessage({ text: (e as Error).message, error: true });
    } finally {
      if (file.current) file.current.value = "";
    }
  }
  function save() {
    const candidate = { ...state, settings: draft };
    try {
      parseBackup(serializeBackup(candidate));
      if (draft.examDate <= draft.startDate)
        throw new Error("Ngày thi mục tiêu phải sau ngày bắt đầu học.");
      update((s) => ({ ...s, settings: draft }));
      setValidation("");
      setMessage({ text: "Đã lưu lịch học và tuỳ chọn.", error: false });
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
              trước khi xoá dữ liệu trình duyệt hoặc đổi máy, rồi nhập lại bản
              sao đó để học tiếp. Website chạy trên máy và website trên GitHub
              Pages lưu dữ liệu riêng; muốn chuyển tiến độ giữa hai nơi, bạn cần
              xuất rồi nhập bản sao lưu.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadOutlined />}
                onClick={() => download(serializeBackup(state))}
              >
                Xuất bản sao lưu
              </Button>
              <Button
                startIcon={<FileUploadOutlined />}
                onClick={() => file.current?.click()}
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
              {Object.keys(state.notes).filter((id) => state.notes[id]).length}{" "}
              ghi chú · {state.attempts.length} lượt luyện tập
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
              Bắt đầu lại hành trình
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Xuất bản sao lưu trước khi xoá tiến độ. Thao tác này chỉ tác
              động dữ liệu của website trong trình duyệt này.
            </Typography>
            <Button
              color="error"
              variant="outlined"
              onClick={() => setReset(true)}
            >
              Xoá tiến độ trên trình duyệt
            </Button>
          </Card>
        </Stack>
      </Box>
      <Dialog open={!!pending} onClose={() => setPending(null)}>
        <DialogTitle>Thay tiến độ hiện tại bằng bản sao lưu?</DialogTitle>
        <DialogContent>
          <Typography>
            Bản sao lưu có {pending?.completed.length} bài hoàn thành,{" "}
            {pending?.attempts.length} lượt luyện tập. Dữ liệu hiện tại sẽ được
            thay bằng bản này.
          </Typography>
          <Button
            startIcon={<FileDownloadOutlined />}
            onClick={() => download(serializeBackup(state))}
            sx={{ mt: 2 }}
          >
            Sao lưu dữ liệu hiện tại trước
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPending(null)}>Huỷ</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (pending) {
                replace(pending);
                setDraft({ ...pending.settings });
                setPending(null);
                setMessage({
                  text: "Đã nhập bản sao lưu thành công.",
                  error: false,
                });
              }
            }}
          >
            Nhập và thay thế dữ liệu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={reset} onClose={() => setReset(false)}>
        <DialogTitle>Xoá toàn bộ tiến độ?</DialogTitle>
        <DialogContent>
          <Typography>
            Ghi chú, bài đã lưu, kết quả luyện tập và lượt làm bài đang dở sẽ bị
            xoá. Chỉ có thể khôi phục những dữ liệu này nếu bạn đã giữ bản sao lưu.
          </Typography>
          <Button onClick={() => download(serializeBackup(state))}>
            Xuất bản sao lưu trước
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReset(false)}>Giữ lại dữ liệu</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              const fresh = emptyState();
              replace(fresh);
              setDraft({ ...fresh.settings });
              setReset(false);
              setMessage({
                text: "Đã xoá tiến độ học trên website. Bạn có thể khôi phục bằng bản sao lưu đã xuất.",
                error: false,
              });
            }}
          >
            Xác nhận xoá tiến độ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
