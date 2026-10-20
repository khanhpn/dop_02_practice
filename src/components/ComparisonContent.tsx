import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import type { ComparisonArticle } from "../content/comparisons/types";

function Text({ children, compact = false }: { children: string; compact?: boolean }) {
  return <Typography component="div" sx={{ mb: compact ? 0 : 1.5, lineHeight: 1.85, overflowWrap: "anywhere", "& p": { m: 0 }, "& code": { bgcolor: "action.hover", px: .5, borderRadius: .5, fontSize: ".9em" } }}>
    <ReactMarkdown allowedElements={["p", "strong", "em", "code", "br"]} unwrapDisallowed skipHtml>{children}</ReactMarkdown>
  </Typography>;
}

export function ComparisonContent({ article }: { article: ComparisonArticle }) {
  return <Stack spacing={4}>{article.reading.map((block) => <Box component="section" key={block.title}>
    <Typography component="h2" variant="h3" sx={{ mb: 1.5, lineHeight: 1.5, fontSize: "1.35rem" }}>{block.title}</Typography>
    {block.paragraphs.map((paragraph, index) => <Text key={index}>{paragraph}</Text>)}
    {block.quote && <Box component="blockquote" sx={{ mx: 0, my: 2, pl: 2, borderLeft: "3px solid", borderColor: "primary.main" }}><Text compact>{block.quote}</Text></Box>}
    {block.bullets && <Box component="ul" sx={{ pl: 2.5, my: 2, "& li": { mb: 1 } }}>{block.bullets.map((bullet) => <li key={bullet}><Text compact>{bullet}</Text></li>)}</Box>}
    {block.steps && <Box component="ol" sx={{ pl: 2.5, my: 2, "& li": { mb: 1 } }}>{block.steps.map((step) => <li key={step}><Text compact>{step}</Text></li>)}</Box>}
    {block.diagram && <Box component="pre" tabIndex={0} aria-label={`Sơ đồ: ${block.title}`} sx={{ overflowX: "auto", my: 2, p: 2, bgcolor: "action.hover", borderRadius: 1, fontSize: 13, lineHeight: 1.8, fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace" }}>{block.diagram}</Box>}
    {block.code && <Box component="pre" sx={{ overflowX: "auto", my: 2, p: 2, borderRadius: 1, bgcolor: "action.hover", fontSize: 13, lineHeight: 1.7 }}><code>{block.code}</code></Box>}
    {block.codeExplanation && <Box component="ul" sx={{ pl: 2.5, my: 2, "& li": { mb: 1 } }}>{block.codeExplanation.map((line) => <li key={line}><Text compact>{line}</Text></li>)}</Box>}
    {block.table && <TableContainer tabIndex={0} role="region" aria-label={`Bảng: ${block.title}. Có thể cuộn ngang.`} sx={{ my: 2 }}>
      <Table size="small" sx={{ minWidth: block.table.columns.length > 3 ? 700 : 520 }}>
        <TableHead><TableRow>{block.table.columns.map((column) => <TableCell key={column} scope="col" sx={{ fontWeight: 700, verticalAlign: "top", py: 1.5 }}>{column}</TableCell>)}</TableRow></TableHead>
        <TableBody>{block.table.rows.map((row, index) => <TableRow key={index}>{row.map((cell, cellIndex) => <TableCell key={cellIndex} component={cellIndex === 0 ? "th" : "td"} scope={cellIndex === 0 ? "row" : undefined} sx={{ verticalAlign: "top", py: 1.5, minWidth: 120 }}><Text compact>{cell}</Text></TableCell>)}</TableRow>)}</TableBody>
      </Table>
    </TableContainer>}
    {block.after?.map((paragraph, index) => <Text key={index}>{paragraph}</Text>)}
  </Box>)}</Stack>;
}
