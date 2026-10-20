import { Box, Typography } from "@mui/material";
import type { ExamCue } from "../content/comparisons/types";

export function ExamCues({ cues }: { cues: ExamCue[] }) {
  return <Box component="section" id="exam-cues" tabIndex={-1} aria-labelledby="exam-cues-title" sx={{ mt: 5, pt: 3, borderTop: "1px solid", borderColor: "divider", scrollMarginTop: 24 }}>
    <Typography id="exam-cues-title" component="h2" variant="h3" sx={{ mb: 1.5, lineHeight: 1.5 }}>Keyword và tình huống DOP-C02 cần nhớ</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>Dùng dấu hiệu để khoanh vùng phương án, rồi kiểm tra điều kiện đi kèm để loại đáp án dễ nhầm.</Typography>
    <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "1.1fr .85fr 1.4fr", gap: 2, pb: 1.5, borderBottom: "2px solid", borderColor: "divider" }}>
      {["Thấy dữ kiện này", "Nghĩ tới", "Kiểm tra trước khi chọn"].map((label) => <Typography key={label} fontWeight={700}>{label}</Typography>)}
    </Box>
    <Box component="dl" sx={{ m: 0 }}>{cues.map((cue) => <Box key={cue.signal} component="div" sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "1.1fr 2.25fr" }, columnGap: 2, rowGap: 1, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
      <Typography component="dt" fontWeight={650} sx={{ lineHeight: 1.75, overflowWrap: "anywhere" }}>{cue.signal}</Typography>
      <Box component="dd" sx={{ m: 0, minWidth: 0, display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: ".85fr 1.4fr" }, gap: { xs: .75, md: 2 } }}>
        <Typography color="primary" fontWeight={650} sx={{ lineHeight: 1.75 }}>{cue.thinkOf}</Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}><Box component="span" sx={{ display: { md: "none" }, fontWeight: 650 }}>Cần kiểm tra: </Box>{cue.check}</Typography>
      </Box>
    </Box>)}</Box>
  </Box>;
}
