import { Box, Stack, Typography } from "@mui/material";
import type { ComparisonArticle } from "../content/comparisons/types";

export function ComparisonContent({ article }: { article: ComparisonArticle }) {
  return <Stack spacing={4}>{article.reading.map((block) => <Box component="section" key={block.title}>
    <Typography component="h2" variant="h3" sx={{ mb: 1.5, lineHeight: 1.6, fontSize: "1.25rem" }}>{block.title}</Typography>
    {block.paragraphs.map((paragraph, index) => <Typography key={index} sx={{ mb: 1.5, lineHeight: 1.9, overflowWrap: "anywhere" }}>{paragraph}</Typography>)}
    {block.bullets && <Box component="ul" sx={{ pl: 2.5, "& li": { mb: 1 } }}>{block.bullets.map((bullet) => <li key={bullet}><Typography sx={{ lineHeight: 1.85 }}>{bullet}</Typography></li>)}</Box>}
    {block.code && <Box component="pre" sx={{ overflowX: "auto", p: 2, borderRadius: 2, bgcolor: "action.hover", fontSize: 13, lineHeight: 1.7 }}><code>{block.code}</code></Box>}
  </Box>)}</Stack>;
}
