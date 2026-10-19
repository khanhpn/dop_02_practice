import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import { useStudy } from "../core/StudyContext";
import { domains, lessons, questions, questionById } from "../content";
import { selectMock, shuffle } from "../core/quiz";
import type { ActiveSession, PracticeMode } from "../core/types";
import type { Question } from "../content/types";
import { QuizRunner } from "../components/QuizRunner";
import { PageHeading } from "../components/PageHeading";
export function Practice() {
  const { state, update } = useStudy();
  const [domain, setDomain] = useState(1);
  const [lessonId, setLessonId] = useState(lessons[0]?.id ?? "");
  const [error, setError] = useState("");
  const [view, setView] = useState<ActiveSession | null>(null);
  const [replaceConfirm, setReplaceConfirm] = useState<(() => void) | null>(
    null,
  );
  const wrong = questions.filter(
    (q) => state.history[q.id] && !state.history[q.id].correct,
  );
  const due = questions.filter(
    (q) => state.history[q.id]?.nextReview <= Date.now(),
  );
  const items = useMemo(
    () =>
      view
        ? view.questionIds
            .map((id) => questionById.get(id))
            .filter((q): q is Question => !!q)
        : [],
    [view],
  );
  function begin(mode: PracticeMode, pool: Question[]) {
    const start = () => {
      if (!pool.length) {
        setError(
          "Chưa có câu phù hợp trong bộ lọc này. Hãy chọn bài khác hoặc luyện một số câu trước.",
        );
        return;
      }
      const session: ActiveSession = {
        id: `${mode}-${Date.now()}`,
        mode,
        questionIds: pool.map((q) => q.id),
        answers: {},
        flagged: [],
        index: 0,
        startedAt: Date.now(),
        expiresAt: mode === "mock" ? Date.now() + 180 * 60000 : null,
      };
      update((s) => ({ ...s, activeSession: session }));
      setView(session);
      setError("");
    };
    if (state.activeSession) setReplaceConfirm(() => start);
    else start();
  }
  function mock() {
    try {
      begin("mock", selectMock(questions));
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (view)
    return (
      <>
        <PageHeading
          eyebrow={
            view.mode === "mock"
              ? "MÔ PHỎNG PHÒNG THI"
              : "HIỂU SAI Ở ĐÂU, ÔN LẠI Ở ĐÓ"
          }
          title={
            view.mode === "mock"
              ? "Một đề thi. Tập trung hết mình."
              : "Luyện tập có chủ đích"
          }
          description={
            view.mode === "mock"
              ? "75 câu · 180 phút · Không hiển thị đáp án trong lúc làm. Tiến độ được lưu khi tải lại trang; thời gian vẫn tính từ lúc bắt đầu."
              : "Câu hỏi bằng tiếng Anh, có thể chuyển sang tiếng Việt để tham khảo. Sau khi trả lời, bạn sẽ được giải thích từng lựa chọn bằng tiếng Việt."
          }
          action={
            <Button
              onClick={() => setView(null)}
              startIcon={<HistoryRounded />}
            >
              Về khu luyện tập
            </Button>
          }
        />
        {items.length === view.questionIds.length ? (
          <QuizRunner
            key={view.id}
            items={items}
            initial={view}
            persist
            onExit={() => setView(null)}
          />
        ) : (
          <Alert severity="warning">
            Phiên lưu có câu hỏi không còn trong phiên bản nội dung này. Hãy bắt
            đầu bộ câu hỏi mới.
          </Alert>
        )}
      </>
    );
  return (
    <>
      <PageHeading
        eyebrow="PRACTICE MAKES PROGRESS"
        title="Hiểu sâu hơn qua từng câu hỏi"
        description="Chọn câu hỏi theo bài học, theo nhóm kiến thức hoặc làm một đề thi thử. Đọc lời giải để hiểu vì sao đáp án phù hợp và biết cần ôn lại phần nào."
      />
      <Alert severity="info" icon={false} sx={{ mb: 3 }}>
        Các câu hỏi được tự biên soạn theo phạm vi DOP-C02, không phải câu hỏi
        lấy từ đề thi thật. Bộ câu hỏi có dạng chọn một đáp án và chọn nhiều đáp
        án. Tỷ lệ trả lời đúng ở đây không quy đổi trực tiếp thành điểm thi AWS
        (scaled score). Mỗi bài học đều có nguồn tham khảo và ngày rà soát.
      </Alert>
      {error && (
        <Alert severity="warning" onClose={() => setError("")} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {state.activeSession && (
        <Card sx={{ p: 3, mb: 3, borderColor: "secondary.main" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={2}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h3">Bạn có một phiên đang làm dở</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.7 }}
              >
                {state.activeSession.mode === "mock"
                  ? "Thi thử có đồng hồ"
                  : "Luyện tập"}{" "}
                · {Object.keys(state.activeSession.answers).length}/
                {state.activeSession.questionIds.length} đã trả lời.{" "}
                {state.activeSession.expiresAt
                  ? "Đồng hồ vẫn tính từ lúc bắt đầu."
                  : ""}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PlayArrowRounded />}
              onClick={() => setView(state.activeSession)}
            >
              Tiếp tục phiên đã lưu
            </Button>
          </Stack>
        </Card>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2.5,
        }}
      >
        <Card
          sx={{
            p: 3,
            bgcolor:
              state.settings.theme === "light" ? "#f0f5ef" : "background.paper",
          }}
        >
          <Chip
            size="small"
            label="EXAM MODE"
            color="primary"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography variant="h2" sx={{ fontSize: 24 }}>
            Thử sức với một đề đầy đủ
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13, mt: 1.5 }}>
            75 câu hỏi được lấy theo trọng số 6 domain, trộn thứ tự và chỉ mở
            giải thích khi nộp bài.
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 2, mb: 3 }}>
            <Chip label="180 phút" size="small" />
            <Chip label="Lưu & tiếp tục" size="small" />
            <Chip label="Đánh dấu xem lại" size="small" />
          </Stack>
          <Button
            variant="contained"
            onClick={mock}
            endIcon={<PlayArrowRounded />}
          >
            Bắt đầu mock exam
          </Button>
        </Card>
        <Card sx={{ p: 3 }}>
          <Typography className="eyebrow" color="secondary" sx={{ mb: 2 }}>
            ÔN TẬP THÔNG MINH
          </Typography>
          <Typography variant="h2" sx={{ fontSize: 24 }}>
            Khép lại những khoảng trống
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: 13, mt: 1.5, mb: 3 }}
          >
            Mỗi câu sai đều có giải thích và link quay về kiến thức. Câu trả lời
            đúng được hẹn ôn lại sau 1, 2, 4, 8… ngày.
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button
              startIcon={<ReplayRounded />}
              variant="outlined"
              onClick={() => begin("review", shuffle(wrong))}
            >
              Ôn {wrong.length} câu sai
            </Button>
            <Button onClick={() => begin("review", shuffle(due))}>
              Đến hạn ôn · {due.length}
            </Button>
          </Stack>
        </Card>
        <Card sx={{ p: 3 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Luyện theo domain
          </Typography>
          <TextField
            fullWidth
            select
            label="Chọn domain"
            value={domain}
            onChange={(e) => setDomain(Number(e.target.value))}
            sx={{ mb: 2 }}
          >
            {domains.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                D{d.id} · {d.title} ({d.weight}%)
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Một phiên tối đa 30 câu, lấy ngẫu nhiên từ domain bạn muốn củng cố.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FactCheckOutlined />}
            onClick={() =>
              begin(
                "domain",
                shuffle(questions.filter((q) => q.domainId === domain)).slice(
                  0,
                  30,
                ),
              )
            }
          >
            Luyện domain này
          </Button>
        </Card>
        <Card sx={{ p: 3 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Luyện theo bài học
          </Typography>
          <TextField
            fullWidth
            select
            label="Chọn bài học"
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            sx={{ mb: 2 }}
          >
            {lessons.map((l) => (
              <MenuItem key={l.id} value={l.id}>
                {String(l.number).padStart(2, "0")}. {l.title}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Làm trọn bộ câu hỏi sau khi đọc bài và thực hành lab.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PlayArrowRounded />}
            onClick={() =>
              begin(
                "lesson",
                questions.filter((q) => q.lessonId === lessonId),
              )
            }
          >
            Luyện bài đã chọn
          </Button>
        </Card>
      </Box>
      <Typography variant="h3" sx={{ mt: 4, mb: 2 }}>
        Những lần luyện tập gần đây
      </Typography>
      {state.attempts.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <HistoryRounded
            sx={{ fontSize: 30, color: "text.secondary", mb: 1 }}
          />
          <Typography color="text.secondary">
            Lần luyện tập đầu tiên đang chờ bạn.
          </Typography>
        </Card>
      ) : (
        <Stack spacing={1.2}>
          {state.attempts.slice(0, 10).map((a) => (
            <Card
              key={a.id}
              sx={{
                p: 2.2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 650, fontSize: 13 }}>
                  {a.mode === "mock"
                    ? "Mock exam"
                    : a.mode === "review"
                      ? "Ôn tập"
                      : a.mode === "domain"
                        ? "Luyện domain"
                        : "Quiz bài học"}{" "}
                  · {a.questionIds.length} câu
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(a.at).toLocaleString("vi-VN")}
                </Typography>
              </Box>
              <Chip
                label={`${a.score}%`}
                color={a.score >= 80 ? "success" : "default"}
                variant="outlined"
              />
            </Card>
          ))}
        </Stack>
      )}
      <Dialog open={!!replaceConfirm} onClose={() => setReplaceConfirm(null)}>
        <DialogTitle>Bắt đầu phiên mới?</DialogTitle>
        <DialogContent>
          <Typography>
            Phiên đang làm sẽ được thay thế. Bạn có thể tiếp tục phiên cũ bằng
            nút “Tiếp tục phiên đã lưu”.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplaceConfirm(null)}>Giữ phiên cũ</Button>
          <Button
            variant="contained"
            onClick={() => {
              replaceConfirm?.();
              setReplaceConfirm(null);
            }}
          >
            Bắt đầu phiên mới
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
