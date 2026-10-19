import {
  Box,
  Button,
  Card,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import { Link as RouterLink } from "react-router-dom";
import { useStudy } from "../core/StudyContext";
import { makePlan } from "../core/planner";
import { dateOnly } from "../core/storage";
import { lessons, lessonById, lessonPath } from "../content";
import { PageHeading } from "../components/PageHeading";
export function Plan() {
  const { state } = useStudy();
  const plan = makePlan(
    lessons.map((l) => l.id),
    state.settings.startDate,
    state.settings.examDate,
  );
  const today = dateOnly();
  const weeks = Array.from({ length: Math.ceil(plan.length / 7) }, (_, i) =>
    plan.slice(i * 7, i * 7 + 7),
  );
  return (
    <>
      <PageHeading
        eyebrow="HỌC ĐỀU MỖI NGÀY, THEO SÁT MỤC TIÊU"
        title="Học đều. Ôn đúng. Thi tự tin."
        description={`Lộ trình từ ${new Date(state.settings.startDate + "T12:00:00").toLocaleDateString("vi-VN")} đến ${new Date(state.settings.examDate + "T12:00:00").toLocaleDateString("vi-VN")}. Các ngày cuối dành cho ôn tập và thi thử.`}
        action={
          <Button component={RouterLink} to="/settings" variant="outlined">
            Điều chỉnh lịch học
          </Button>
        }
      />
      <Card sx={{ p: 3, mb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={3}
          alignItems={{ sm: "center" }}
        >
          <Box sx={{ minWidth: 150 }}>
            <Typography className="eyebrow" color="secondary">
              TIẾN ĐỘ HIỆN TẠI
            </Typography>
            <Typography variant="h2" sx={{ mt: 1 }}>
              {state.completed.length}
              <Box
                component="span"
                sx={{ fontSize: 17, color: "text.secondary", fontWeight: 400 }}
              >
                {" "}
                / 72 bài
              </Box>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (state.completed.length / 72) * 100)}
              sx={{ height: 7, borderRadius: 4, mb: 1.5 }}
            />
            <Typography variant="body2" color="text.secondary">
              Nếu học bốn giờ mỗi ngày, bạn có thể dành một giờ đọc hiểu, hai
              giờ thực hành và một giờ làm câu hỏi ôn tập. Hãy điều chỉnh tỷ lệ
              này theo quỹ thời gian của bạn. Với bài khó, nên làm rõ cơ chế
              trước khi chuyển sang bài tiếp theo.
            </Typography>
          </Box>
        </Stack>
      </Card>
      {!plan.length ? (
        <Card sx={{ p: 4 }}>
          <Typography variant="h3">
            Ngày thi mục tiêu phải sau ngày bắt đầu học
          </Typography>
          <Typography color="text.secondary" sx={{ my: 2 }}>
            Đổi ngày trong cài đặt để tạo lại lộ trình của bạn.
          </Typography>
          <Button component={RouterLink} to="/settings">
            Mở cài đặt
          </Button>
        </Card>
      ) : (
        weeks.map((week, i) => {
          const weekIds = week.flatMap((d) => d.lessonIds);
          const done = weekIds.filter((id) =>
            state.completed.includes(id),
          ).length;
          return (
            <Box key={i} sx={{ mb: 4 }}>
              <Stack
                direction="row"
                gap={1.5}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "action.hover",
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </Box>
                <Typography variant="h3">
                  Tuần {i + 1} ·{" "}
                  {week[0].kind === "revision"
                    ? "Tổng ôn & thi thử"
                    : "Kiến thức & thực hành"}
                </Typography>
                <Chip
                  size="small"
                  label={
                    weekIds.length ? `${done}/${weekIds.length} bài` : "Ôn tập"
                  }
                  variant="outlined"
                />
              </Stack>
              <Stack spacing={1}>
                {week.map((day) => (
                  <Card
                    key={day.date}
                    sx={{
                      p: 2,
                      display: "flex",
                      gap: 2,
                      borderColor:
                        day.date === today ? "secondary.main" : "divider",
                      alignItems: "flex-start",
                      opacity:
                        day.date < today &&
                        day.lessonIds.every((id) =>
                          state.completed.includes(id),
                        )
                          ? 0.7
                          : 1,
                    }}
                  >
                    <Box sx={{ minWidth: 72 }}>
                      <Typography
                        variant="caption"
                        color={
                          day.date === today ? "secondary" : "text.secondary"
                        }
                      >
                        {day.date === today
                          ? "HÔM NAY"
                          : new Date(day.date + "T12:00:00").toLocaleDateString(
                              "vi-VN",
                              { weekday: "short" },
                            )}
                      </Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 650 }}>
                        {new Date(day.date + "T12:00:00").toLocaleDateString(
                          "vi-VN",
                          { day: "2-digit", month: "2-digit" },
                        )}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {day.lessonIds.map((id) => {
                        const l = lessonById.get(id);
                        return (
                          <Stack
                            key={id}
                            direction="row"
                            alignItems="center"
                            gap={1}
                            sx={{ mb: 0.6 }}
                          >
                            {state.completed.includes(id) && (
                              <CheckCircleRounded
                                color="success"
                                sx={{ fontSize: 14 }}
                              />
                            )}
                            <Typography
                              component={RouterLink}
                              to={lessonPath(id)}
                              className="plain-link"
                              sx={{
                                fontSize: 12.5,
                                "&:hover": { color: "primary.main" },
                              }}
                            >
                              {l?.number}. {l?.title}
                            </Typography>
                          </Stack>
                        );
                      })}
                      {!day.lessonIds.length && (
                        <Typography variant="body2" sx={{ fontSize: 12.5 }}>
                          {day.kind === "revision"
                            ? "Làm đề thi thử, phân tích những câu trả lời sai và đọc lại phần kiến thức chưa nắm chắc."
                            : "Đọc lại ghi chú, hoàn thành bài thực hành còn dang dở hoặc nghỉ để lấy lại sức."}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: { xs: "none", sm: "block" } }}
                    >
                      {state.settings.dailyHours} giờ học
                    </Typography>
                  </Card>
                ))}
              </Stack>
            </Box>
          );
        })
      )}
    </>
  );
}
