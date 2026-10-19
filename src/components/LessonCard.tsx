import { Box, Card, Chip, IconButton, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import BookmarkBorderRounded from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRounded from "@mui/icons-material/BookmarkRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import type { Lesson } from "../content/types";
import { useStudy } from "../core/StudyContext";
import { domains, lessonPath } from "../content";
export function LessonCard({ lesson }: { lesson: Lesson }) {
  const { state, update } = useStudy();
  const saved = state.bookmarks.includes(lesson.id),
    done = state.completed.includes(lesson.id);
  const domain = domains[lesson.domainId - 1];
  return (
    <Card
      className="lesson-card"
      sx={{ p: 2.5, display: "flex", gap: 2, alignItems: "center" }}
    >
      <Box
        sx={{
          width: 42,
          height: 48,
          bgcolor: `${domain.color}12`,
          color: domain.color,
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          fontWeight: 750,
          flexShrink: 0,
        }}
      >
        {String(lesson.number).padStart(2, "0")}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 0.4 }}>
          <Typography variant="caption" color="text.secondary">
            TASK {lesson.chapterId}
          </Typography>
          {done && (
            <Chip
              size="small"
              color="success"
              icon={<CheckCircleRounded />}
              label="Đã học"
              sx={{ height: 20 }}
            />
          )}
        </Stack>
        <Typography
          component={RouterLink}
          to={lessonPath(lesson.id)}
          className="plain-link"
          variant="h4"
          sx={{ "&:hover": { color: "primary.main" } }}
        >
          {lesson.title}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.7 }}
        >
          {lesson.duration} phút đọc · {lesson.lab.duration} phút lab ·{" "}
          {lesson.questions.length} câu hỏi
        </Typography>
      </Box>
      <IconButton
        size="small"
        aria-label={saved ? "Bỏ lưu bài" : "Lưu bài"}
        onClick={() =>
          update((s) => ({
            ...s,
            bookmarks: saved
              ? s.bookmarks.filter((id) => id !== lesson.id)
              : [...s.bookmarks, lesson.id],
          }))
        }
      >
        {saved ? (
          <BookmarkRounded color="secondary" />
        ) : (
          <BookmarkBorderRounded fontSize="small" />
        )}
      </IconButton>
      <Box
        component={RouterLink}
        to={lessonPath(lesson.id)}
        aria-label={`Học ${lesson.title}`}
        sx={{ display: { xs: "none", sm: "block" }, color: "text.secondary" }}
      >
        <ArrowForwardRounded fontSize="small" />
      </Box>
    </Card>
  );
}
