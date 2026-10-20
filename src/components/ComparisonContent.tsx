import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { ComparisonArticle, ComparisonBlock } from "../content/comparisons/types";
import { comparisonSections } from "../content/comparisons";

function Blocks({ blocks, topLevel = false }: { blocks: ComparisonBlock[]; topLevel?: boolean }) {
  return <Stack spacing={3}>{blocks.map((block) => <Box key={block.title}>
    <Typography component={topLevel ? "h2" : "h3"} variant="h4" sx={{ mb: 1.5, lineHeight: 1.6, fontSize: topLevel ? "1.25rem" : "1.05rem" }}>{block.title}</Typography>
    {block.paragraphs.map((paragraph, index) => <Typography key={index} sx={{ mb: 1.5, lineHeight: 1.9, overflowWrap: "anywhere" }}>{paragraph}</Typography>)}
    {block.bullets && <Box component="ul" sx={{ pl: 2.5, "& li": { mb: 1 } }}>{block.bullets.map((bullet) => <li key={bullet}><Typography sx={{ lineHeight: 1.85 }}>{bullet}</Typography></li>)}</Box>}
    {block.code && <Box component="pre" sx={{ overflowX: "auto", p: 2, borderRadius: 2, bgcolor: "action.hover", fontSize: 13, lineHeight: 1.7 }}><code>{block.code}</code></Box>}
  </Box>)}</Stack>;
}

export function ComparisonContent({ article, activeSection }: { article: ComparisonArticle; activeSection: string }) {
  return <>{comparisonSections.map((section) => <Box key={section.id} component="section" id={section.id} sx={{ mb: 5, scrollMarginTop: 24 }}>
    {section.id !== "overview" && section.id !== "comparison" && section.id !== "sources" && <Typography component="h2" variant="h3" sx={{ mb: 2.5, fontSize: "1.4rem" }}>{section.title}</Typography>}
    {section.id === "overview" && <Blocks blocks={article.overview} topLevel />}
    {section.id === "comparison" && <Box component="details" data-section-panel="comparison" open={activeSection === "comparison" || undefined}><Box component="summary" sx={{ cursor: "pointer", fontWeight: 650, py: 1 }}>Xem bảng so sánh nhanh</Box><TableContainer tabIndex={0} role="region" aria-label="Bảng so sánh, cuộn ngang để xem đủ cột" sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
      <Table sx={{ minWidth: 720 }}><caption style={{ captionSide: "top", textAlign: "left", padding: 16 }}>Dùng bảng này để xem lại những điểm đã giải thích trong bài.</caption><TableHead><TableRow><TableCell sx={{ minWidth: 150, fontWeight: 700 }}>Tiêu chí</TableCell>{article.table.columns.map((column) => <TableCell key={column} sx={{ minWidth: 190, fontWeight: 700 }}>{column}</TableCell>)}</TableRow></TableHead>
        <TableBody>{article.table.rows.map((row) => <TableRow key={row.label}><TableCell component="th" scope="row" sx={{ verticalAlign: "top", fontWeight: 650 }}>{row.label}</TableCell>{row.cells.map((cell, index) => <TableCell key={index} sx={{ verticalAlign: "top", lineHeight: 1.8 }}>{cell}</TableCell>)}</TableRow>)}</TableBody>
      </Table>
    </TableContainer></Box>}
    {section.id === "conditions" && <Blocks blocks={article.conditions} />}
    {section.id === "scenarios" && <Blocks blocks={article.scenarios} />}
    {section.id === "pitfalls" && <Blocks blocks={article.pitfalls} />}
    {section.id === "sources" && <>
      <Box component="details" sx={{ mb: 2 }}><Box component="summary" sx={{ cursor: "pointer", fontWeight: 650, py: 1 }}>Tóm tắt cách lựa chọn</Box>
        <Box component="ol" sx={{ pl: 2.5 }}>{article.flow.steps.map((step) => <li key={step}><Typography sx={{ mb: 1.5, lineHeight: 1.85 }}>{step}</Typography></li>)}</Box>
        <Typography variant="body2" color="text.secondary">{article.flow.caption}</Typography>
      </Box>
      <Box component="details" data-section-panel="sources" open={activeSection === "sources" || undefined}><Box component="summary" sx={{ cursor: "pointer", fontWeight: 650, py: 1 }}>Nguồn tài liệu AWS</Box>
        <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>Đối chiếu ngày {article.reviewedAt.split("-").reverse().join("/")}.</Typography>
        <Box component="ul" sx={{ pl: 2.5 }}>{article.sources.map((source) => <li key={source.url}><Link href={source.url} target="_blank" rel="noopener noreferrer" sx={{ display: "inline-block", py: .75, overflowWrap: "anywhere" }}>{source.title}</Link></li>)}</Box>
      </Box>
    </>}
  </Box>)}</>;
}
