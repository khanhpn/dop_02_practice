import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import BookmarkBorderRounded from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRounded from "@mui/icons-material/BookmarkRounded";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import {
  Link as RouterLink,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { domains, lessonById, lessons, lessonPath } from "../content";
import { useStudy } from "../core/StudyContext";
import { FlowDiagram } from "../components/FlowDiagram";
import { CodeTabs } from "../components/CodeTabs";
import { QuizRunner } from "../components/QuizRunner";
import { LessonNotesSummary } from "../components/LessonNotesSummary";
export function LessonPage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const { state, update } = useStudy();
  const lesson = lessonById.get(id ?? "");
  const [selectedSection, setSelectedSection] = useState("overview");
  useEffect(() => {
    if (id && lessonById.has(id))
      update((s) => (s.lastLesson === id ? s : { ...s, lastLesson: id }));
  }, [id, update]);
  useEffect(() => {
    const target = params.get("section");
    setSelectedSection(target ?? "overview");
    const timer = setTimeout(() => {
      if (target) {
        const section = document.getElementById(target);
        if (section) {
          section.scrollIntoView({ behavior: "instant", block: "start" });
          section.classList.add("focus-highlight");
          setTimeout(() => section.classList.remove("focus-highlight"), 2500);
        }
      } else window.scrollTo({ top: 0, behavior: "instant" });
    }, 100);
    return () => clearTimeout(timer);
  }, [id, params]);
  if (!lesson)
    return (
      <Alert severity="info">
        Bài học này chưa có trong dữ liệu.{" "}
        <Link component={RouterLink} to="/curriculum">
          Về bản đồ kiến thức
        </Link>
      </Alert>
    );
  const domain = domains[lesson.domainId - 1],
    done = state.completed.includes(lesson.id),
    saved = state.bookmarks.includes(lesson.id);
  const position = lessons.findIndex((l) => l.id === lesson.id);
  const prev = lessons[position - 1],
    next = lessons[position + 1];
  const steps = state.labSteps[lesson.id] ?? [];
  const sections = [
    { id: "overview", title: "Tổng quan" },
    ...lesson.sections.map((s) => ({ id: s.id, title: s.title })),
    { id: "real-world", title: "Ứng dụng thực tế" },
    { id: "iac", title: "CloudFormation / Terraform" },
    { id: "lab", title: "Bài thực hành" },
    { id: "takeaways", title: "Ghi nhớ và những điểm dễ nhầm" },
    { id: "quiz", title: `Luyện tập · ${lesson.questions.length} câu` },
    { id: "notes", title: "Ghi chú của tôi" },
  ];
  function jump(section: string) {
    setParams({ section }, { replace: true });
  }
  return (
    <>
      <Breadcrumbs sx={{ fontSize: 11, mb: 2.5 }}>
        <Link component={RouterLink} to="/curriculum" underline="hover">
          Kiến thức
        </Link>
        <Link
          component={RouterLink}
          to={`/curriculum?domain=${domain.id}`}
          underline="hover"
        >
          Nhóm kiến thức {domain.id}
        </Link>
        <Typography variant="caption">Mục tiêu thi {lesson.chapterId}</Typography>
      </Breadcrumbs>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) 230px" },
          gap: 4,
          alignItems: "start",
        }}
      >
        <Box className="reading-content" sx={{ minWidth: 0 }}>
          <Box component="section" id="overview">
            <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Chip
                size="small"
                label={`BÀI ${String(lesson.number).padStart(2, "0")}`}
                sx={{ bgcolor: `${domain.color}15`, color: domain.color }}
              />
              <Chip
                size="small"
                label={`NHÓM KIẾN THỨC ${domain.id} · ${domain.weight}%`}
                variant="outlined"
              />
              <Chip
                size="small"
                label={`${lesson.duration} phút đọc · ${lesson.lab.duration} phút thực hành`}
                variant="outlined"
              />
            </Stack>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
                lineHeight: 1.4,
                mb: 2,
              }}
            >
              {lesson.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2.5 }}>
              {lesson.summary}
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 3 }}>
              <Button
                variant={done ? "outlined" : "contained"}
                startIcon={<CheckCircleOutlined />}
                onClick={() =>
                  update((s) => ({
                    ...s,
                    completed: done
                      ? s.completed.filter((x) => x !== lesson.id)
                      : [...s.completed, lesson.id],
                  }))
                }
              >
                {done ? "Đã hoàn thành" : "Đánh dấu đã học"}
              </Button>
              <Button
                variant="outlined"
                startIcon={
                  saved ? <BookmarkRounded /> : <BookmarkBorderRounded />
                }
                onClick={() =>
                  update((s) => ({
                    ...s,
                    bookmarks: saved
                      ? s.bookmarks.filter((x) => x !== lesson.id)
                      : [...s.bookmarks, lesson.id],
                  }))
                }
              >
                {saved ? "Đã lưu" : "Lưu bài"}
              </Button>
              <Button onClick={() => jump("quiz")}>Đến phần câu hỏi</Button>
            </Stack>
            <Card sx={{ p: 3, my: 3 }}>
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                Sau bài này, bạn làm được gì?
              </Typography>
              <Box component="ul" sx={{ pl: 2.2, m: 0 }}>
                {lesson.objectives.map((o) => (
                  <li key={o}>
                    <Typography variant="body2">{o}</Typography>
                  </li>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                KIẾN THỨC CẦN NẮM TRƯỚC
              </Typography>
              <Box component="ul" sx={{ pl: 2.2, mt: 1, mb: 0 }}>
                {lesson.prerequisites.map((item) => (
                  <Typography component="li" variant="body2" key={item}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </Card>
            <Box sx={{ display: { lg: "none" }, mb: 3 }}>
              <TextField
                fullWidth
                select
                label="Mục lục bài học"
                value={selectedSection}
                onChange={(e) => jump(e.target.value)}
                slotProps={{ select: { native: true } }}
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </TextField>
            </Box>
          </Box>
          {lesson.sections.map((s, i) => (
            <Box
              component="section"
              id={s.id}
              key={s.id}
              sx={{ mt: 5, p: 1, mx: -1, borderRadius: 2 }}
            >
              <Typography className="eyebrow" color="secondary" sx={{ mb: 1 }}>
                KIẾN THỨC {String(i + 1).padStart(2, "0")}
              </Typography>
              <Typography variant="h2" sx={{ fontSize: "1.65rem", mb: 2.5 }}>
                {s.title}
              </Typography>
              {s.paragraphs.map((p, j) => (
                <Typography component="p" key={j}>
                  {p}
                </Typography>
              ))}
              {s.bullets && (
                <Box component="ul" sx={{ pl: 2.5 }}>
                  {s.bullets.map((b, j) => (
                    <Typography component="li" key={j} variant="body2">
                      {b}
                    </Typography>
                  ))}
                </Box>
              )}
              {i === 1 && <FlowDiagram diagram={lesson.diagram} />}
            </Box>
          ))}
          <Box component="section" id="real-world" sx={{ mt: 5 }}>
            <Typography className="eyebrow" color="secondary">
              TỪ KIẾN THỨC ĐẾN BÀI TOÁN
            </Typography>
            <Typography variant="h2" sx={{ fontSize: "1.65rem", my: 2 }}>
              Áp dụng vào thực tế
            </Typography>
            <Stack spacing={2.5}>
              {lesson.scenarios.map((scenario, i) => (
                <Card key={i} sx={{ p: 3 }}>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {String(i + 1).padStart(2, "0")} / {scenario.title}
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    BÀI TOÁN
                  </Typography>
                  <Typography sx={{ mt: 0.5, mb: 2 }}>
                    {scenario.context}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    CÁCH GIẢI QUYẾT
                  </Typography>
                  <Typography sx={{ mt: 0.5, mb: 2 }}>
                    {scenario.solution}
                  </Typography>
                  <Alert severity="info" icon={false}>
                    <strong>Đánh đổi cần cân nhắc: </strong>
                    {scenario.tradeoff}
                  </Alert>
                </Card>
              ))}
            </Stack>
          </Box>
          <Box component="section" id="iac" sx={{ mt: 5 }}>
            <Typography className="eyebrow" color="secondary">
              ĐỌC MÃ ĐỂ HIỂU CƠ CHẾ
            </Typography>
            <Typography variant="h2" sx={{ fontSize: "1.65rem", my: 2 }}>
              Khai báo hạ tầng bằng mã như thế nào?
            </Typography>
            <Typography color="text.secondary">
              Đọc mẫu CloudFormation trước để hiểu các tài nguyên và quan hệ
              giữa chúng, sau đó mở thẻ Terraform để đối chiếu cách khai báo.
            </Typography>
            <CodeTabs example={lesson.code} />
          </Box>
          <Box component="section" id="lab" sx={{ mt: 5 }}>
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
              <Typography className="eyebrow" color="secondary">
                HIỂU QUA THỰC HÀNH
              </Typography>
              <Chip
                size="small"
                label={`${steps.length}/${lesson.lab.steps.length} bước`}
                variant="outlined"
              />
            </Stack>
            <Typography variant="h2" sx={{ fontSize: "1.65rem", mb: 2 }}>
              {lesson.lab.title}
            </Typography>
            <Alert severity="warning" sx={{ mb: 3 }}>
              {lesson.lab.cost}
            </Alert>
            <Card sx={{ p: 2.5, mb: 3 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Chuẩn bị trước khi thực hành
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.2 }}>
                {lesson.lab.prerequisites.map((p, i) => (
                  <Typography component="li" variant="body2" key={i}>
                    {p}
                  </Typography>
                ))}
              </Box>
            </Card>
            <Stack spacing={2}>
              {lesson.lab.steps.map((step, i) => (
                <Card key={i} sx={{ p: 2.5 }}>
                  <FormControlLabel
                    sx={{ m: 0, alignItems: "flex-start" }}
                    control={
                      <Checkbox
                        checked={steps.includes(i)}
                        sx={{ p: 0, mr: 1.5 }}
                        onChange={() =>
                          update((s) => ({
                            ...s,
                            labSteps: {
                              ...s.labSteps,
                              [lesson.id]: steps.includes(i)
                                ? steps.filter((x) => x !== i)
                                : [...steps, i],
                            },
                          }))
                        }
                      />
                    }
                    label={
                      <Typography variant="h3" sx={{ fontSize: 15 }}>
                        Bước {i + 1}. {step.title}
                      </Typography>
                    }
                  />
                  <Typography sx={{ mt: 1.5, fontSize: 14 }}>
                    {step.detail}
                  </Typography>
                  {step.command && (
                    <Box
                      component="pre"
                      className="code-block"
                      tabIndex={0}
                      sx={{ borderRadius: 2, my: 2 }}
                    >
                      <code>{step.command}</code>
                    </Box>
                  )}
                  <Box
                    sx={{
                      p: 1.5,
                      mt: 2,
                      bgcolor: "action.hover",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    >
                      KẾT QUẢ CẦN QUAN SÁT
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {step.expected}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
            <Alert severity="success" icon={false} sx={{ mt: 3 }}>
              <strong>Tự kiểm tra thêm: </strong>
              {lesson.lab.challenge}
            </Alert>
            <Card sx={{ p: 2.5, mt: 2, borderColor: "warning.main" }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Dọn tài nguyên sau bài thực hành
              </Typography>
              <Box component="ol" sx={{ pl: 2.2, mb: 0 }}>
                {lesson.lab.cleanup.map((p, i) => (
                  <Typography component="li" variant="body2" key={i}>
                    {p}
                  </Typography>
                ))}
              </Box>
            </Card>
          </Box>
          <Box component="section" id="takeaways" sx={{ mt: 5 }}>
            <Typography variant="h2" sx={{ fontSize: "1.65rem", mb: 2 }}>
              Những điểm cần ghi nhớ khi làm bài thi
            </Typography>
            <Box component="ul" sx={{ pl: 2.5 }}>
              {lesson.keyTakeaways.map((p, i) => (
                <Typography component="li" key={i}>
                  {p}
                </Typography>
              ))}
            </Box>
            <Alert severity="warning" icon={false}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Những điểm dễ nhầm trong đề thi
              </Typography>
              {lesson.examTraps.map((p, i) => (
                <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                  • {p}
                </Typography>
              ))}
            </Alert>
          </Box>
          <Box component="section" id="quiz" sx={{ mt: 5 }}>
            <Typography className="eyebrow" color="secondary">
              KIỂM TRA MỨC ĐỘ HIỂU
            </Typography>
            <Typography variant="h2" sx={{ fontSize: "1.65rem", my: 2 }}>
              Luyện tập · {lesson.questions.length} câu hỏi
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Câu hỏi được biên soạn theo tình huống trong phạm vi DOP-C02.
              Chọn tiếng Anh để luyện thi, hoặc tiếng Việt khi cần làm rõ tình
              huống. Sau mỗi câu, đọc lời giải và ôn lại phần kiến thức liên quan.
            </Typography>
            {state.activeSession?.mode === "mock" && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Bạn có bài thi thử đang làm dở. Đồng hồ của bài thi vẫn tiếp tục
                tính giờ trong lúc bạn làm câu hỏi ở bài học này.{" "}
                <Link component={RouterLink} to="/practice">
                  Tiếp tục thi thử
                </Link>
              </Alert>
            )}
            <QuizRunner key={lesson.id} items={lesson.questions} />
          </Box>
          <Box component="section" id="notes" sx={{ mt: 5 }}>
            <Typography variant="h2" sx={{ fontSize: "1.65rem", mb: 2 }}>
              Ghi lại bằng cách hiểu của bạn
            </Typography>
            <LessonNotesSummary lessonId={lesson.id} legacy={state.notes} />
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 1.5 }}>
              Đọc thêm từ AWS
            </Typography>
            {lesson.sources.map((s, i) => (
              <Link
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                sx={{
                  display: "flex",
                  gap: 0.7,
                  alignItems: "center",
                  fontSize: 12,
                  mb: 1,
                }}
              >
                {s.title}
                <OpenInNewRounded sx={{ fontSize: 12 }} />
              </Link>
            ))}
            <Typography variant="caption" color="text.secondary">
              Ngày rà soát nội dung: {lesson.reviewedAt}. Terraform là phần đối
              chiếu thực hành.
            </Typography>
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            gap={2}
            sx={{
              mt: 4,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            {prev ? (
              <Button
                component={RouterLink}
                to={lessonPath(prev.id)}
                startIcon={<ArrowBackRounded />}
              >
                Bài trước
              </Button>
            ) : (
              <Box />
            )}
            {next && (
              <Button
                component={RouterLink}
                to={lessonPath(next.id)}
                endIcon={<ArrowForwardRounded />}
              >
                Bài tiếp theo
              </Button>
            )}
          </Stack>
        </Box>
        <Box
          className="no-print"
          sx={{
            position: "sticky",
            top: 24,
            display: { xs: "none", lg: "block" },
            maxHeight: "calc(100vh - 48px)",
            overflowY: "auto",
          }}
        >
          <Typography
            className="eyebrow"
            color="text.secondary"
            sx={{ px: 1.5, mb: 1.5 }}
          >
            TRONG BÀI HỌC NÀY
          </Typography>
          {sections.map((s) => (
            <Link
              key={s.id}
              component="button"
              underline="none"
              textAlign="left"
              width="100%"
              className={`section-link ${selectedSection === s.id ? "active" : ""}`}
              onClick={() => jump(s.id)}
            >
              {s.title}
            </Link>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", px: 1.5 }}
          >
            Đừng chỉ nhớ đáp án. Hãy thử giải thích vì sao những phương án khác
            chưa đáp ứng bài toán.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
