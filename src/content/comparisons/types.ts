export interface ComparisonBlock {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  code?: string;
}

export interface ComparisonArticle {
  reviewedAt: string;
  overview: ComparisonBlock[];
  table: { columns: string[]; rows: { label: string; cells: string[] }[] };
  conditions: ComparisonBlock[];
  scenarios: ComparisonBlock[];
  pitfalls: ComparisonBlock[];
  flow: { title: string; steps: string[]; caption: string };
  sources: { title: string; url: string }[];
}
