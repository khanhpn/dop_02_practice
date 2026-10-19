import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
import TimerOutlined from "@mui/icons-material/TimerOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import HubOutlined from "@mui/icons-material/HubOutlined";
import { Link as RouterLink } from "react-router-dom";
import {
  chapters,
  domains,
  lessonById,
  lessonPath,
  lessons,
  questions,
} from "../content";
import { useStudy } from "../core/StudyContext";
import { LessonCard } from "../components/LessonCard";
import { dateOnly } from "../core/storage";
export function Dashboard() {
  const { state } = useStudy();
  const next =
    lessonById.get(state.lastLesson ?? "") ??
    lessons.find((l) => !state.completed.includes(l.id)) ??
    lessons[0];
  const days = Math.max(
    0,
    Math.ceil(
      (Date.parse(state.settings.examDate + "T00:00:00") -
        Date.parse(dateOnly() + "T00:00:00")) /
        86400000,
    ),
  );
  const history = Object.entries(state.history);
  const accuracy = history.length
    ? Math.round(
        (history.filter(([, h]) => h.correct).length / history.length) * 100,
      )
    : null;
  const wrong = history.filter(([, h]) => !h.correct).length;
  const due = history.filter(([, h]) => h.nextReview <= Date.now()).length;
  const stats = [
    {
      label: "Bài học đã hoàn thành",
      value: `${state.completed.length}`,
      sub: `trong 72 bài chuyên sâu`,
      icon: MenuBookOutlined,
      color: "#4b8067",
    },
    {
      label: "Tỷ lệ trả lời đúng",
      value: accuracy === null ? "—" : `${accuracy}%`,
      sub: history.length
        ? `${history.length} câu đã luyện`
        : "Làm câu hỏi ôn tập để biết phần cần củng cố",
      icon: FactCheckOutlined,
      color: "#a17844",
    },
    {
      label: "Thời gian tập trung",
      value:
        state.studyMinutes < 60
          ? `${state.studyMinutes}p`
          : `${Math.floor(state.studyMinutes / 60)}h ${state.studyMinutes % 60}p`,
      sub: `Mục tiêu ${state.settings.dailyHours} giờ mỗi ngày`,
      icon: TimerOutlined,
      color: "#8c73a8",
    },
    {
      label: "Cần ôn lại hôm nay",
      value: String(due),
      sub: wrong
        ? `${wrong} câu sai đang chờ bạn`
        : "Kiến thức nhớ lâu nhờ ôn đúng lúc",
      icon: CalendarMonthOutlined,
      color: "#5c8695",
    },
  ];
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          alignItems: "center",
          mb: 3.5,
        }}
      >
        <Box>
          <Typography
            className="eyebrow"
            color="text.secondary"
            sx={{ mb: 0.8 }}
          >
            KHÔNG GIAN HỌC CÁ NHÂN
          </Typography>
          <Typography variant="h2">
            Mỗi ngày, vững hơn một chút
            <span style={{ color: "#be7335" }}>.</span>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>
            Tiếp nối hành trình chinh phục AWS DevOps Engineer – Professional.
          </Typography>
        </Box>
        <Chip
          icon={
            <span
              style={{
                width: 6,
                height: 6,
                background: "#549375",
                borderRadius: 10,
                marginLeft: 10,
              }}
            />
          }
          label="Tiến độ tự lưu trên máy"
          size="small"
          variant="outlined"
          sx={{
            display: { xs: "none", md: "flex" },
            bgcolor: "background.paper",
          }}
        />
      </Box>
      <Box
        className="hero-grid"
        sx={{
          borderRadius: 4,
          bgcolor: "#183c36",
          color: "#f2f7ec",
          p: { xs: 3, md: 4 },
          position: "relative",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 260px" },
          gap: 3,
          mb: 3,
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 2.5 }}
          >
            <Chip
              label="MỤC TIÊU ÔN THI"
              size="small"
              sx={{
                bgcolor: "#ffffff10",
                color: "#c8ddc7",
                fontSize: 9,
                letterSpacing: 1.2,
                border: "1px solid #ffffff15",
              }}
            />
            <Typography sx={{ fontSize: 10, color: "#9fbea8" }}>
              DOP-C02 / 2026
            </Typography>
          </Stack>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.1rem", md: "2.6rem" },
              lineHeight: 1.3,
              maxWidth: 550,
            }}
          >
            Hiểu bản chất.
            <br />
            Tự tin{" "}
            <Box component="span" sx={{ color: "#efbe7e" }}>
              bước vào phòng thi.
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: 12.5,
              color: "#b1c6b6",
              mt: 2,
              maxWidth: 450,
              lineHeight: 1.9,
            }}
          >
            6 nhóm kiến thức, 19 chương. Học cơ chế, phân tích tình huống và thực
            hành để chuẩn bị cho kỳ thi AWS DevOps Engineer – Professional.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              component={RouterLink}
              to={next ? lessonPath(next.id) : "/curriculum"}
              endIcon={<ArrowForwardRounded />}
              sx={{
                bgcolor: "#f1bd79",
                color: "#284237",
                "&:hover": { bgcolor: "#ffd197" },
              }}
            >
              {state.lastLesson ? "Tiếp tục học" : "Bắt đầu học ngay"}
            </Button>
            <Button
              component={RouterLink}
              to="/plan"
              sx={{ color: "#d1e0ce", fontSize: 12 }}
            >
              Xem kế hoạch
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderLeft: { md: "1px solid #ffffff13" },
            pl: { md: 3 },
            py: 1,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 168,
              height: 168,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress
              variant="determinate"
              value={100}
              size={168}
              thickness={1.7}
              sx={{ color: "#ffffff13", position: "absolute" }}
            />
            <CircularProgress
              variant="determinate"
              value={Math.max(
                2,
                Math.min(100, (state.completed.length / 72) * 100),
              )}
              size={168}
              thickness={2}
              sx={{ color: "#efbd7f", position: "absolute", rotate: "-35deg" }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: 48,
                  fontWeight: 650,
                  lineHeight: 1,
                  letterSpacing: -2,
                }}
              >
                {days}
              </Typography>
              <Typography
                sx={{
                  fontSize: 9,
                  letterSpacing: 1.9,
                  color: "#b3c9b3",
                  mt: 1.2,
                }}
              >
                NGÀY CÒN LẠI ĐẾN KỲ THI
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 12, color: "#d2ddc5", mt: 2.5 }}>
            {new Date(state.settings.examDate + "T12:00:00").toLocaleDateString(
              "vi-VN",
              { day: "2-digit", month: "long", year: "numeric" },
            )}
          </Typography>
          <Typography sx={{ fontSize: 10, color: "#92b09b", mt: 0.5 }}>
            Ngày mục tiêu · có thể điều chỉnh
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4,1fr)" },
          gap: 2,
          mb: 4,
        }}
      >
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                {label}
              </Typography>
              <Box
                sx={{
                  p: 0.8,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 1.5,
                  bgcolor: `${color}10`,
                  color,
                }}
              >
                <Icon sx={{ fontSize: 17 }} />
              </Box>
            </Stack>
            <Typography
              sx={{ fontSize: 28, fontWeight: 700, letterSpacing: -1, mt: 1 }}
            >
              {value}
            </Typography>
            <Typography sx={{ fontSize: 10, color: "text.secondary", mt: 0.5 }}>
              {sub}
            </Typography>
          </Card>
        ))}
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) 272px" },
          gap: 3,
        }}
      >
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2.2 }}
          >
            <Box>
              <Typography variant="h3">Bản đồ kiến thức</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: 11, mt: 0.4 }}
              >
                Học theo 6 nhóm kiến thức và trọng số tương ứng trong đề thi.
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to="/curriculum"
              endIcon={<ArrowForwardRounded />}
              size="small"
              sx={{ fontSize: 11 }}
            >
              Tất cả bài học
            </Button>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            {domains.map((d) => {
              const count = lessons.filter((l) => l.domainId === d.id);
              const complete = count.filter((l) =>
                state.completed.includes(l.id),
              ).length;
              const target = [16, 13, 11, 11, 10, 11][d.id - 1];
              return (
                <Card
                  component={RouterLink}
                  to={`/curriculum?domain=${d.id}`}
                  key={d.id}
                  className="plain-link lesson-card"
                  sx={{ p: 2.5, minHeight: 184 }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 35,
                        height: 35,
                        bgcolor: `${d.color}12`,
                        color: d.color,
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <HubOutlined sx={{ fontSize: 20 }} />
                    </Box>
                    <Chip
                      size="small"
                      label={`${d.weight}% đề thi`}
                      sx={{
                        bgcolor: `${d.color}10`,
                        color: d.color,
                        height: 22,
                        fontSize: 9,
                      }}
                    />
                  </Stack>
                  <Typography
                    className="eyebrow"
                    color="text.secondary"
                    sx={{ fontSize: "8px!important", mt: 2 }}
                  >
                    NHÓM 0{d.id} ·{" "}
                    {chapters.filter((c) => c.domainId === d.id).length} CHƯƠNG
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.5, fontSize: 13 }}>
                    {d.shortLabel}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 10.5, color: "text.secondary", mt: 0.5 }}
                  >
                    {d.title}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    sx={{ mt: 2 }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={(complete / target) * 100}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 10,
                        bgcolor: "action.hover",
                        "& .MuiLinearProgress-bar": { bgcolor: d.color },
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 9,
                        color: "text.secondary",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {complete}/{target} bài
                    </Typography>
                  </Stack>
                </Card>
              );
            })}
          </Box>
          {next && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Điểm bắt đầu của bạn
              </Typography>
              <LessonCard lesson={next} />
            </Box>
          )}
        </Box>
        <Box>
          <Card
            sx={{
              p: 2.5,
              mb: 2.5,
              bgcolor:
                state.settings.theme === "light"
                  ? "#fbfaf5"
                  : "background.paper",
            }}
          >
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "#ebe9d8",
                  color: "#7b8152",
                  borderRadius: 1.5,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <CalendarMonthOutlined sx={{ fontSize: 17 }} />
              </Box>
              <Typography variant="h4" sx={{ fontSize: 13 }}>
                Nhịp học hôm nay
              </Typography>
            </Stack>
            {[
              {
                time: "60p",
                title: "Khơi lại kiến thức",
                text: "Đọc bài và làm rõ những phần chưa nắm chắc.",
              },
              {
                time: "120p",
                title: "Thực hành để hiểu sâu",
                text: "Thực hành với CloudFormation, rồi đối chiếu với Terraform.",
              },
              {
                time: "60p",
                title: "Kiểm tra & ôn lại",
                text: "Làm câu hỏi ôn tập và đọc lời giải cho từng lựa chọn.",
              },
            ].map((item, i) => (
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ mb: 2.5 }}
                key={item.title}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "1px solid",
                    borderColor: "divider",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 10,
                    color: "text.secondary",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography sx={{ fontSize: 11.5, fontWeight: 650 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: 9, color: "text.secondary" }}>
                      {item.time}
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: 10.5,
                      color: "text.secondary",
                      mt: 0.4,
                      lineHeight: 1.7,
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </Stack>
            ))}
            <Button
              fullWidth
              variant="outlined"
              component={RouterLink}
              to="/plan"
              size="small"
              sx={{ fontSize: 11 }}
            >
              Mở kế hoạch cá nhân
            </Button>
          </Card>
          <Card sx={{ p: 2.5, mb: 2.5 }}>
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
              <FactCheckOutlined
                sx={{ color: "secondary.main", fontSize: 20 }}
              />
              <Typography variant="h4" sx={{ fontSize: 13 }}>
                Sẵn sàng thử sức?
              </Typography>
            </Stack>
            <Typography
              sx={{ fontSize: 11, color: "text.secondary", lineHeight: 1.9 }}
            >
              75 câu hỏi · 180 phút
              <br />
              Luyện đọc tình huống tiếng Anh và quản lý thời gian.
            </Typography>
            <Button
              fullWidth
              component={RouterLink}
              to="/practice"
              endIcon={<PlayArrowRounded />}
              sx={{ mt: 1.5, fontSize: 11, justifyContent: "space-between" }}
            >
              Đến khu luyện tập
            </Button>
          </Card>
          <Box sx={{ px: 0.8 }}>
            <Stack direction="row" alignItems="center" gap={0.8} sx={{ mb: 1 }}>
              <CheckCircleOutlineRounded
                sx={{ color: "#73977e", fontSize: 15 }}
              />
              <Typography sx={{ fontSize: 10.5, fontWeight: 650 }}>
                Hiểu cơ chế để vận dụng
              </Typography>
            </Stack>
            <Typography
              sx={{ fontSize: 10.5, color: "text.secondary", lineHeight: 1.9 }}
            >
              Bài học bằng tiếng Việt, có giải nghĩa thuật ngữ. Câu hỏi có cả
              tiếng Anh và tiếng Việt, kèm lời giải từng lựa chọn và liên kết
              đến phần kiến thức cần ôn lại.
            </Typography>
            <Typography
              sx={{ fontSize: 9.5, color: "text.secondary", mt: 1.5 }}
            >
              {questions.length.toLocaleString("vi-VN")} câu hỏi đã biên soạn ·
              Nguồn AWS chính thức
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
