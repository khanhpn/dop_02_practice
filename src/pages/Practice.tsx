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
          "Chưa có câu hỏi phù hợp với bộ lọc này. Hãy chọn bài hoặc nhóm kiến thức khác; nếu chưa có lịch sử trả lời, bạn có thể bắt đầu bằng một lượt luyện tập.",
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
            Lượt làm bài đã lưu có câu hỏi không còn trong nội dung hiện tại.
            Hãy bắt đầu một bộ câu hỏi mới.
          </Alert>
        )}
      </>
    );
  return (
    <>
      <PageHeading
        eyebrow="LUYỆN TẬP ĐỂ HIỂU VỮNG HƠN"
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
              <Typography variant="h3">Bạn có một lượt làm bài đang dở</Typography>
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
              Tiếp tục bài đang làm
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
            label="CHẾ ĐỘ THI THỬ"
            color="primary"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography variant="h2" sx={{ fontSize: 24 }}>
            Thử sức với một đề đầy đủ
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13, mt: 1.5 }}>
            75 câu hỏi được phân bổ theo trọng số của 6 nhóm kiến thức, trộn thứ tự và chỉ hiển thị
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
            Bắt đầu thi thử
          </Button>
        </Card>
        <Card sx={{ p: 3 }}>
          <Typography className="eyebrow" color="secondary" sx={{ mb: 2 }}>
            ÔN TẬP THÔNG MINH
          </Typography>
          <Typography variant="h2" sx={{ fontSize: 24 }}>
            Củng cố phần kiến thức còn yếu
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: 13, mt: 1.5, mb: 3 }}
          >
            Mỗi câu sai đều có lời giải và liên kết đến phần kiến thức cần ôn. Câu trả lời
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
            Luyện theo nhóm kiến thức
          </Typography>
          <TextField
            fullWidth
            select
            label="Chọn nhóm kiến thức"
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
            Mỗi lượt luyện tập có tối đa 30 câu, được lấy ngẫu nhiên từ nhóm kiến thức bạn chọn.
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
            Luyện nhóm kiến thức này
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
            Làm trọn bộ câu hỏi sau khi đọc bài và hoàn thành bài thực hành.
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
                    ? "Thi thử"
                    : a.mode === "review"
                      ? "Ôn tập"
                      : a.mode === "domain"
                        ? "Luyện theo nhóm kiến thức"
                        : "Câu hỏi theo bài học"}{" "}
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
        <DialogTitle>Bắt đầu lượt làm bài mới?</DialogTitle>
        <DialogContent>
          <Typography>
            Lượt làm bài đang dở sẽ được thay thế. Nếu muốn hoàn thành lượt cũ,
            hãy chọn “Tiếp tục bài đang làm”.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplaceConfirm(null)}>Giữ lượt đang làm</Button>
          <Button
            variant="contained"
            onClick={() => {
              replaceConfirm?.();
              setReplaceConfirm(null);
            }}
          >
            Bắt đầu lượt mới
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
