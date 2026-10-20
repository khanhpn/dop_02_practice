import { useState } from "react";
import { Box, Button, Card, Chip, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import CompareArrowsRounded from "@mui/icons-material/CompareArrowsRounded";
import { Link as RouterLink, useParams } from "react-router-dom";
import { PageHeading } from "../components/PageHeading";
import { comparisons } from "../content/comparisons";
import { comparisonArticles } from "../content/comparisons/articles";
import { ComparisonContent } from "../components/ComparisonContent";
import { ExamCues } from "../components/ExamCues";
import { examCuesByArticle } from "../content/comparisons/exam-cues";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();

export function Comparisons() {
  const [search, setSearch] = useState("");
  const filtered = comparisons.filter((item) => normalize([item.title, item.group, item.description, ...item.services, ...item.focus].join(" ")).includes(normalize(search.trim())));
  return <>
    <PageHeading eyebrow="HIỂU QUA VÍ DỤ THỰC TẾ" title="Chuyên đề AWS" description="Giải thích từng dịch vụ, cách dùng và những lựa chọn dễ nhầm, từ câu hỏi đơn giản đến tình huống thực tế." />
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} alignItems={{ sm: "center" }} sx={{ mb: 3 }}>
      <Typography color="text.secondary">{filtered.length} / {comparisons.length} bài chuyên đề</Typography>
      <TextField size="small" placeholder="Tìm dịch vụ hoặc chủ đề…" value={search} onChange={(event) => setSearch(event.target.value)} sx={{ width: { xs: "100%", sm: 340 } }} slotProps={{ htmlInput: { "aria-label": "Tìm bài chuyên đề" }, input: { startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> } }} />
    </Stack>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" }, gap: 3 }}>
      {filtered.map((item) => <Card key={item.id} sx={{ p: { xs: 2.5, sm: 3.5 }, display: "flex", flexDirection: "column", borderTop: `3px solid ${item.color}` }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}><Typography className="eyebrow" color="text.secondary">{item.number} · {item.group}</Typography><CompareArrowsRounded sx={{ color: item.color }} /></Stack>
        <Typography variant="h3" sx={{ lineHeight: 1.5, mb: 1 }}>{item.title}</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>{item.description}</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>{item.services.map((service) => <Chip key={service} label={service} size="small" variant="outlined" />)}</Stack>
        <Box sx={{ bgcolor: "action.hover", borderRadius: 2, p: 2, mb: 3, flex: 1 }}><Typography variant="body2">{item.question}</Typography></Box>
        <Button component={RouterLink} to={`/comparisons/${item.id}`} endIcon={<ArrowForwardRounded />} sx={{ alignSelf: "flex-start" }}>Đọc bài</Button>
      </Card>)}
    </Box>
    {filtered.length === 0 && <Box sx={{ textAlign: "center", py: 7 }}><Typography variant="h3">Không tìm thấy chuyên đề</Typography><Button onClick={() => setSearch("")} sx={{ mt: 2 }}>Xóa từ khóa</Button></Box>}
  </>;
}

export function ComparisonPage() {
  const { id } = useParams();
  const index = comparisons.findIndex((item) => item.id === id);
  const item = comparisons[index];
  const article = id ? comparisonArticles[id] : undefined;
  const examCues = id ? examCuesByArticle[id] : undefined;
  if (!item || !article) return <Box sx={{ py: 6 }}><Typography variant="h2">Không tìm thấy chuyên đề</Typography><Button component={RouterLink} to="/comparisons" sx={{ mt: 2 }}>Về danh sách chuyên đề</Button></Box>;
  return <Box sx={{ maxWidth: 820, mx: "auto" }}>
    <Button component={RouterLink} to="/comparisons" startIcon={<ArrowBackRounded />} sx={{ mb: 2 }}>Tất cả chuyên đề</Button>
    <PageHeading eyebrow={`${item.number} · ${item.group}`} title={item.title} description={item.description} />
    {examCues?.length ? <Button variant="outlined" size="small" sx={{ mb: 3 }} onClick={() => {
      const target = document.getElementById("exam-cues");
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ behavior: "smooth" });
    }}>Ôn nhanh keyword và tình huống DOP-C02 ↓</Button> : null}
    <Box>
      <Box component="article" sx={{ minWidth: 0 }}>
        <ComparisonContent article={article} />
        {examCues?.length ? <ExamCues cues={examCues} /> : null}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} sx={{ mt: 5 }}>
          {index > 0 && <Button component={RouterLink} to={`/comparisons/${comparisons[index - 1].id}`} startIcon={<ArrowBackRounded />}>{comparisons[index - 1].title}</Button>}
          {index < comparisons.length - 1 && <Button component={RouterLink} to={`/comparisons/${comparisons[index + 1].id}`} endIcon={<ArrowForwardRounded />} sx={{ ml: { sm: "auto" } }}>{comparisons[index + 1].title}</Button>}
        </Stack>
      </Box>
    </Box>
  </Box>;
}
