import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  Radio,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import FlagOutlined from "@mui/icons-material/FlagOutlined";
import FlagRounded from "@mui/icons-material/FlagRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import TimerOutlined from "@mui/icons-material/TimerOutlined";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { Link as RouterLink } from "react-router-dom";
import type { Question } from "../content/types";
import type { ActiveSession } from "../core/types";
import { useStudy } from "../core/StudyContext";
import { gradeQuestion } from "../core/quiz";
import { recordAnswers } from "../core/storage";
import { lessonById, lessonPath } from "../content";

function Explanation({
  question,
  selected,
  locale,
}: {
  question: Question;
  selected: string[];
  locale: "en" | "vi";
}) {
  return (
    <Box sx={{ mt: 2.5 }}>
      <Alert
        severity={
          gradeQuestion(question.correct, selected) ? "success" : "warning"
        }
        sx={{ mb: 2 }}
      >
        <strong>
          {gradeQuestion(question.correct, selected)
            ? "Chính xác."
            : "Hãy xem lại lý do chọn từng đáp án."}
        </strong>{" "}
        Đáp án: {question.correct.join(", ")}.<br />
        {question.explanation}
      </Alert>
      <Stack spacing={1.2}>
        {question.options.map((o) => (
          <Box
            key={o.id}
            sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}
          >
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.7 }}>
              {question.correct.includes(o.id) ? (
                <CheckCircleRounded color="success" sx={{ fontSize: 16 }} />
              ) : (
                <CancelRounded color="disabled" sx={{ fontSize: 16 }} />
              )}
              <Typography sx={{ fontSize: 12, fontWeight: 650 }}>
                {o.id}. {o[locale]}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontSize: 12.5 }}>
              {o.explanation}
            </Typography>
          </Box>
        ))}
      </Stack>
      <Button
        component={RouterLink}
        to={lessonPath(question.lessonId, question.reviewSection)}
        endIcon={<ArrowForwardRounded />}
        sx={{ mt: 2 }}
      >
        Ôn lại kiến thức:{" "}
        {lessonById
          .get(question.lessonId)
          ?.sections.find((s) => s.id === question.reviewSection)?.title ??
          "Mục liên quan"}
      </Button>
    </Box>
  );
}

export function QuizRunner({
  items,
  initial,
  persist = false,
  onExit,
}: {
  items: Question[];
  initial?: ActiveSession;
  persist?: boolean;
  onExit?: () => void;
}) {
  const { state, update } = useStudy();
  const [session, setSession] = useState<ActiveSession>(
    () =>
      initial ?? {
        id: `lesson-${Date.now()}`,
        mode: "lesson",
        questionIds: items.map((q) => q.id),
        answers: {},
        flagged: [],
        index: 0,
        startedAt: Date.now(),
        expiresAt: null,
      },
  );
  const [checked, setChecked] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [reviewIndex, setReviewIndex] = useState(0);
  const finishing = useRef(false);
  const locale = state.settings.questionLocale;
  const timed = session.mode === "mock";
  const current = items[session.index];
  const answered = Object.keys(session.answers).filter(
    (id) => session.answers[id]?.length,
  ).length;
  const remaining = session.expiresAt
    ? Math.max(0, Math.ceil((session.expiresAt - now) / 1000))
    : 0;
  function change(next: ActiveSession) {
    setSession(next);
    if (persist) update((s) => ({ ...s, activeSession: next }));
  }
  function finish() {
    if (finishing.current) return;
    finishing.current = true;
    update((s) => {
      const result = recordAnswers(s, items, session.answers, session.mode);
      return persist && s.activeSession?.id === session.id
        ? { ...result, activeSession: null }
        : result;
    });
    setDone(true);
    setConfirm(false);
  }
  useEffect(() => {
    if (!timed || done) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [timed, done]);
  useEffect(() => {
    if (timed && session.expiresAt && now >= session.expiresAt && !done)
      finish();
  });
  if (items.length === 0 || !current)
    return <Alert severity="info">Chưa có câu hỏi phù hợp.</Alert>;
  const correctCount = items.filter((q) =>
    gradeQuestion(q.correct, session.answers[q.id] ?? []),
  ).length;
  if (done) {
    const q = items[reviewIndex];
    return (
      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography className="eyebrow" color="secondary">
            KẾT QUẢ LUYỆN TẬP
          </Typography>
          <Typography
            sx={{
              fontSize: 56,
              fontWeight: 700,
              color: "primary.main",
              letterSpacing: -2,
            }}
          >
            {Math.round((correctCount / items.length) * 100)}
            <span style={{ fontSize: 22 }}>%</span>
          </Typography>
          <Typography variant="h3">
            {correctCount}/{items.length} câu đúng
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Đây là tỷ lệ trả lời đúng khi luyện tập, không quy đổi thành điểm theo thang chuẩn hoá (scaled score) của AWS.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3,1fr)" },
            gap: 1,
            mt: 2,
            mb: 3,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((d) => {
            const domainQs = items.filter((x) => x.domainId === d);
            if (!domainQs.length) return null;
            const count = domainQs.filter((x) =>
              gradeQuestion(x.correct, session.answers[x.id] ?? []),
            ).length;
            return (
              <Box
                key={d}
                sx={{ bgcolor: "action.hover", p: 1.5, borderRadius: 2 }}
              >
                <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
                  NHÓM KIẾN THỨC {d}
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 650 }}>
                  {count}/{domainQs.length} đúng
                </Typography>
              </Box>
            );
          })}
        </Box>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Xem lại từng câu
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.6} sx={{ mb: 3 }}>
          {items.map((item, i) => (
            <Button
              key={item.id}
              size="small"
              variant={reviewIndex === i ? "contained" : "outlined"}
              color={
                gradeQuestion(item.correct, session.answers[item.id] ?? [])
                  ? "success"
                  : "warning"
              }
              onClick={() => setReviewIndex(i)}
              sx={{ minWidth: 34, px: 0.5, py: 0.5 }}
            >
              {i + 1}
            </Button>
          ))}
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography className="eyebrow">CÂU {reviewIndex + 1}</Typography>
          <LocaleSwitch />
        </Stack>
        <Typography sx={{ mt: 2, fontWeight: 550 }}>
          {q.prompt[locale]}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Bạn chọn: {session.answers[q.id]?.join(", ") || "Chưa trả lời"}
        </Typography>
        <Explanation
          question={q}
          selected={session.answers[q.id] ?? []}
          locale={locale}
        />
        <Stack direction="row" gap={2} sx={{ mt: 3 }}>
          <Button
            startIcon={<ReplayRounded />}
            onClick={() => {
              finishing.current = false;
              setDone(false);
              setChecked([]);
              change({
                ...session,
                id: `retry-${Date.now()}`,
                answers: {},
                flagged: [],
                index: 0,
                startedAt: Date.now(),
                expiresAt: timed ? Date.now() + 180 * 60 * 1000 : null,
              });
            }}
          >
            Làm lại bộ câu hỏi
          </Button>
          {onExit && (
            <Button variant="outlined" onClick={onExit}>
              Chọn bộ khác
            </Button>
          )}
        </Stack>
      </Card>
    );
  }
  const selected = session.answers[current.id] ?? [];
  const revealed = checked.includes(current.id);
  const flagged = session.flagged.includes(current.id);
  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        flexWrap="wrap"
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Chip
            size="small"
            label={timed ? "THI THỬ" : "LUYỆN TẬP"}
            color="primary"
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary">
            Câu {session.index + 1} / {items.length}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          {timed && (
            <Chip
              icon={<TimerOutlined />}
              label={`${String(Math.floor(remaining / 3600)).padStart(2, "0")}:${String(Math.floor((remaining % 3600) / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`}
              color={remaining < 600 ? "warning" : "default"}
              variant="outlined"
            />
          )}
          <LocaleSwitch />
        </Stack>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={(answered / items.length) * 100}
        sx={{ my: 2.5, height: 4, borderRadius: 2 }}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          MỤC TIÊU THI {current.taskId} ·{" "}
          {current.type === "multiple"
            ? `CHỌN ${current.correct.length} ĐÁP ÁN`
            : "CHỌN 1 ĐÁP ÁN"}
        </Typography>
        <Button
          size="small"
          aria-pressed={flagged}
          startIcon={flagged ? <FlagRounded /> : <FlagOutlined />}
          color={flagged ? "secondary" : "inherit"}
          onClick={() =>
            change({
              ...session,
              flagged: flagged
                ? session.flagged.filter((id) => id !== current.id)
                : [...session.flagged, current.id],
            })
          }
        >
          {flagged ? "Đã đánh dấu" : "Đánh dấu"}
        </Button>
      </Stack>
      <Typography
        sx={{
          fontSize: { xs: 15, md: 17 },
          lineHeight: 1.9,
          my: 2.5,
          fontWeight: 500,
          whiteSpace: "pre-line",
        }}
      >
        {current.prompt[locale]}
      </Typography>
      <Stack
        spacing={1.3}
        role={current.type === "single" ? "radiogroup" : "group"}
        aria-label="Các lựa chọn trả lời"
      >
        {current.options.map((o) => {
          const chosen = selected.includes(o.id);
          const correct = revealed && current.correct.includes(o.id);
          const wrong = revealed && chosen && !correct;
          return (
            <Box
              key={o.id}
              className="answer-option"
              sx={{
                border: "1px solid",
                borderColor: correct
                  ? "success.main"
                  : wrong
                    ? "warning.main"
                    : chosen
                      ? "primary.main"
                      : "divider",
                bgcolor: correct ? "success.main" : "",
                borderRadius: 2,
                ...(correct ? { bgcolor: "action.hover" } : {}),
              }}
            >
              <FormControlLabel
                sx={{
                  m: 0,
                  p: 1.5,
                  width: "100%",
                  alignItems: "flex-start",
                  "& .MuiFormControlLabel-label": { flex: 1 },
                }}
                disabled={revealed}
                control={
                  current.type === "single" ? (
                    <Radio
                      name={`question-${current.id}`}
                      checked={chosen}
                      sx={{ p: 0.5, mr: 1, mt: 0.3 }}
                      onChange={() =>
                        change({
                          ...session,
                          answers: { ...session.answers, [current.id]: [o.id] },
                        })
                      }
                    />
                  ) : (
                    <Checkbox
                      checked={chosen}
                      sx={{ p: 0.5, mr: 1, mt: 0.3 }}
                      onChange={() =>
                        change({
                          ...session,
                          answers: {
                            ...session.answers,
                            [current.id]: chosen
                              ? selected.filter((id) => id !== o.id)
                              : [...selected, o.id],
                          },
                        })
                      }
                    />
                  )
                }
                label={
                  <Typography
                    sx={{
                      fontSize: 13.5,
                      lineHeight: 1.9,
                      color: "text.primary",
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 750, mr: 1 }}>
                      {o.id}.
                    </Box>
                    {o[locale]}
                  </Typography>
                }
              />
            </Box>
          );
        })}
      </Stack>
      {revealed && (
        <Explanation question={current} selected={selected} locale={locale} />
      )}
      <Stack
        direction="row"
        gap={1.5}
        flexWrap="wrap"
        justifyContent="space-between"
        sx={{ mt: 3 }}
      >
        <Button
          disabled={session.index === 0}
          startIcon={<ArrowBackRounded />}
          onClick={() => change({ ...session, index: session.index - 1 })}
        >
          Câu trước
        </Button>
        <Stack direction="row" gap={1}>
          {!timed && !revealed && (
            <Button
              variant="outlined"
              disabled={!selected.length}
              onClick={() => setChecked([...checked, current.id])}
            >
              Kiểm tra đáp án
            </Button>
          )}
          {session.index < items.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              onClick={() => change({ ...session, index: session.index + 1 })}
            >
              Câu tiếp
            </Button>
          ) : (
            <Button variant="contained" onClick={() => setConfirm(true)}>
              Nộp bài và xem kết quả
            </Button>
          )}
        </Stack>
      </Stack>
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={0.5}
        sx={{ mt: 3, pt: 2.5, borderTop: "1px solid", borderColor: "divider" }}
      >
        {items.map((item, i) => (
          <Button
            key={item.id}
            size="small"
            aria-label={`Đến câu ${i + 1}${session.flagged.includes(item.id) ? ", đã đánh dấu" : ""}`}
            onClick={() => change({ ...session, index: i })}
            variant={
              session.index === i
                ? "contained"
                : session.answers[item.id]?.length
                  ? "outlined"
                  : "text"
            }
            color={session.flagged.includes(item.id) ? "secondary" : "primary"}
            sx={{ minWidth: 30, fontSize: 11, p: 0.5 }}
          >
            {i + 1}
            {session.flagged.includes(item.id) && "•"}
          </Button>
        ))}
      </Stack>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}
      >
        {answered}/{items.length} đã trả lời · {session.flagged.length} đánh dấu
        {persist ? " · Tự lưu để tiếp tục sau khi tải lại trang" : ""}
      </Typography>
      <Dialog open={confirm} onClose={() => setConfirm(false)}>
        <DialogTitle>Nộp bài luyện tập?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn đã trả lời {answered}/{items.length} câu. Câu bỏ trống sẽ được
            tính sai.{" "}
            {session.flagged.length > 0 &&
              `Còn ${session.flagged.length} câu được đánh dấu.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(false)}>Quay lại kiểm tra</Button>
          <Button onClick={finish} variant="contained">
            Nộp bài
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
function LocaleSwitch() {
  const { state, update } = useStudy();
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={state.settings.questionLocale}
      onChange={(_, value) => {
        if (value)
          update((s) => ({
            ...s,
            settings: { ...s.settings, questionLocale: value },
          }));
      }}
      aria-label="Ngôn ngữ câu hỏi"
    >
      <ToggleButton
        value="en"
        sx={{ fontSize: 10, px: 1.3, py: 0.6 }}
        aria-label="Câu hỏi tiếng Anh"
      >
        EN
      </ToggleButton>
      <ToggleButton
        value="vi"
        sx={{ fontSize: 10, px: 1.3, py: 0.6 }}
        aria-label="Câu hỏi tiếng Việt"
      >
        VI
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
