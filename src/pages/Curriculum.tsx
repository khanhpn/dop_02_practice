import { useMemo } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { chapters, domains, lessons } from "../content";
import { useStudy } from "../core/StudyContext";
import { PageHeading } from "../components/PageHeading";
import { LessonCard } from "../components/LessonCard";
export function Curriculum() {
  const [params, setParams] = useSearchParams();
  const { state } = useStudy();
  const selected = Number(params.get("domain") ?? 0);
  const query = params.get("q") ?? "";
  const filter = params.get("filter") ?? "all";
  const normalized = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const filtered = useMemo(
    () =>
      lessons.filter((l) => {
        if (selected && l.domainId !== selected) return false;
        if (filter === "saved" && !state.bookmarks.includes(l.id)) return false;
        if (filter === "incomplete" && state.completed.includes(l.id))
          return false;
        if (
          filter === "weak" &&
          !l.questions.some(
            (q) => state.history[q.id] && !state.history[q.id].correct,
          )
        )
          return false;
        return (
          !normalized ||
          [
            l.title,
            l.summary,
            ...l.objectives,
            ...l.sections.flatMap((s) => [s.title, ...s.paragraphs]),
          ]
            .join(" ")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(normalized)
        );
      }),
    [
      selected,
      filter,
      state.bookmarks,
      state.completed,
      state.history,
      normalized,
    ],
  );
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const domain = domains.find((d) => d.id === selected);
  return (
    <>
      <PageHeading
        action={
          <Button
            component={RouterLink}
            to="/lab/observability"
            variant="outlined"
          >
            Mở lab tích hợp
          </Button>
        }
        eyebrow="TỪ NỀN TẢNG ĐẾN PROFESSIONAL"
        title={domain ? domain.subtitle : "Bản đồ kiến thức của bạn"}
        description={
          domain
            ? domain.description
            : "6 domain → 19 chương → 72 bài chuyên sâu. Bắt đầu từ chỗ bạn cần, học theo cách bạn hiểu."
        }
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiến thức, dịch vụ, khái niệm…"
          value={query}
          onChange={(e) => change("q", e.target.value)}
          inputProps={{ "aria-label": "Tìm bài học" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          value={filter}
          onChange={(e) => change("filter", e.target.value)}
          sx={{ minWidth: 180 }}
          aria-label="Lọc bài học"
        >
          <MenuItem value="all">Tất cả bài học</MenuItem>
          <MenuItem value="incomplete">Chưa hoàn thành</MenuItem>
          <MenuItem value="saved">Đã bookmark</MenuItem>
          <MenuItem value="weak">Kiến thức còn yếu</MenuItem>
        </TextField>
      </Stack>
      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 4 }}>
        <Chip
          label="Tất cả domains"
          onClick={() => change("domain", "")}
          color={!selected ? "primary" : "default"}
          variant={!selected ? "filled" : "outlined"}
        />
        {domains.map((d) => (
          <Chip
            key={d.id}
            label={`D${d.id} · ${d.title}`}
            onClick={() => change("domain", String(d.id))}
            color={selected === d.id ? "primary" : "default"}
            variant={selected === d.id ? "filled" : "outlined"}
          />
        ))}
      </Stack>
      {filtered.length === 0 ? (
        <Card sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="h3">Chưa tìm thấy bài phù hợp</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Thử từ khoá khác hoặc bỏ bộ lọc đã chọn.
          </Typography>
          <Button onClick={() => setParams({})} sx={{ mt: 2 }}>
            Xem tất cả
          </Button>
        </Card>
      ) : (
        chapters
          .filter((c) => filtered.some((l) => l.chapterId === c.id))
          .map((c) => (
            <Box key={c.id} sx={{ mb: 4 }}>
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: `${domains[c.domainId - 1].color}15`,
                    color: domains[c.domainId - 1].color,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {c.id}
                </Box>
                <Box>
                  <Typography variant="h3">{c.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {c.examTask}
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={1.5}>
                {filtered
                  .filter((l) => l.chapterId === c.id)
                  .map((l) => (
                    <LessonCard key={l.id} lesson={l} />
                  ))}
              </Stack>
            </Box>
          ))
      )}
    </>
  );
}
