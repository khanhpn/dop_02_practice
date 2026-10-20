import { useEffect, useState } from "react";
import { Box, Button, Card, Chip, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import CompareArrowsRounded from "@mui/icons-material/CompareArrowsRounded";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import { PageHeading } from "../components/PageHeading";
import { comparisons, comparisonSections } from "../content/comparisons";
import { comparisonArticles } from "../content/comparisons/articles";
import { ComparisonContent } from "../components/ComparisonContent";
import { lessonById, lessonPath } from "../content";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();

export function Comparisons() {
  const [search, setSearch] = useState("");
  const filtered = comparisons.filter((item) => normalize(`${item.title} ${item.group} ${item.description}`).includes(normalize(search.trim())));
  return <>
    <PageHeading eyebrow="ĐỐI CHIẾU ĐỂ HIỂU RÕ" title="So sánh AWS" description="Đối chiếu các dịch vụ và cơ chế dễ nhầm để hiểu cách hoạt động và điều kiện lựa chọn." />
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} alignItems={{ sm: "center" }} sx={{ mb: 3 }}>
      <Typography color="text.secondary">{filtered.length} / {comparisons.length} bài so sánh</Typography>
      <TextField size="small" placeholder="Tìm dịch vụ hoặc chủ đề…" value={search} onChange={(event) => setSearch(event.target.value)} sx={{ width: { xs: "100%", sm: 340 } }} slotProps={{ htmlInput: { "aria-label": "Tìm bài so sánh" }, input: { startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> } }} />
    </Stack>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" }, gap: 3 }}>
      {filtered.map((item) => <Card key={item.id} sx={{ p: { xs: 2.5, sm: 3.5 }, display: "flex", flexDirection: "column", borderTop: `3px solid ${item.color}` }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}><Typography className="eyebrow" color="text.secondary">{item.number} · {item.group}</Typography><CompareArrowsRounded sx={{ color: item.color }} /></Stack>
        <Typography variant="h3" sx={{ lineHeight: 1.5, mb: 1 }}>{item.title}</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>{item.description}</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>{item.services.map((service) => <Chip key={service} label={service} size="small" variant="outlined" />)}</Stack>
        <Box sx={{ bgcolor: "action.hover", borderRadius: 2, p: 2, mb: 3, flex: 1 }}><Typography variant="body2">{item.question}</Typography></Box>
        <Button component={RouterLink} to={`/comparisons/${item.id}`} endIcon={<ArrowForwardRounded />} sx={{ alignSelf: "flex-start" }}>Đọc bài so sánh</Button>
      </Card>)}
    </Box>
    {filtered.length === 0 && <Box sx={{ textAlign: "center", py: 7 }}><Typography variant="h3">Không tìm thấy bài so sánh</Typography><Button onClick={() => setSearch("")} sx={{ mt: 2 }}>Xóa từ khóa</Button></Box>}
  </>;
}

export function ComparisonPage() {
  const { id } = useParams();
  const location = useLocation();
  const index = comparisons.findIndex((item) => item.id === id);
  const item = comparisons[index];
  const article = id ? comparisonArticles[id] : undefined;
  useEffect(() => {
    const section = location.hash.slice(1);
    if (comparisonSections.some((entry) => entry.id === section)) document.getElementById(section)?.scrollIntoView();
  }, [id, location.hash]);
  if (!item || !article) return <Box sx={{ py: 6 }}><Typography variant="h2">Không tìm thấy bài so sánh</Typography><Button component={RouterLink} to="/comparisons" sx={{ mt: 2 }}>Về danh sách bài so sánh</Button></Box>;
  return <Box sx={{ maxWidth: 820, mx: "auto" }}>
    <Button component={RouterLink} to="/comparisons" startIcon={<ArrowBackRounded />} sx={{ mb: 2 }}>Tất cả bài so sánh</Button>
    <PageHeading eyebrow={`${item.number} · ${item.group}`} title={item.title} description={item.description} />
    <Box>
      <Box component="details" sx={{ mb: 4, borderBottom: "1px solid", borderColor: "divider", pb: 2 }}>
        <Box component="summary" sx={{ cursor: "pointer", color: "text.secondary" }}>Đi nhanh đến phần bạn cần</Box>
        <Box component="nav" aria-label="Mục lục bài so sánh" sx={{ mt: 1 }}>{comparisonSections.map((section) => <Box key={section.id} component={RouterLink} to={{ pathname: `/comparisons/${item.id}`, hash: `#${section.id}` }} className="section-link" aria-current={location.hash === `#${section.id}` ? "location" : undefined} onClick={() => {
          const target = document.getElementById(section.id);
          const panel = target?.querySelector<HTMLDetailsElement>("details[data-section-panel]");
          if (panel) panel.open = true;
          target?.scrollIntoView();
        }}>{section.title}</Box>)}</Box>
      </Box>
      <Box component="article" sx={{ minWidth: 0 }}>
        <ComparisonContent article={article} activeSection={location.hash.slice(1)} />
        <Box sx={{ pt: 3, mb: 4, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography component="h2" variant="h3" sx={{ mb: 2 }}>Bài học liên quan</Typography>
          <Stack alignItems="flex-start" spacing={1}>{item.relatedLessonIds.map((lessonId) => {
            const lesson = lessonById.get(lessonId);
            return lesson ? <Button key={lessonId} component={RouterLink} to={lessonPath(lessonId)} sx={{ textAlign: "left" }}>{lesson.title}</Button> : null;
          })}</Stack>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
          {index > 0 && <Button component={RouterLink} to={`/comparisons/${comparisons[index - 1].id}`} startIcon={<ArrowBackRounded />}>{comparisons[index - 1].title}</Button>}
          {index < comparisons.length - 1 && <Button component={RouterLink} to={`/comparisons/${comparisons[index + 1].id}`} endIcon={<ArrowForwardRounded />} sx={{ ml: { sm: "auto" } }}>{comparisons[index + 1].title}</Button>}
        </Stack>
      </Box>
    </Box>
  </Box>;
}
