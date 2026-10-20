export interface ComparisonBlock {
  title: string;
  paragraphs: string[];
  quote?: string;
  bullets?: string[];
  steps?: string[];
  diagram?: string;
  code?: string;
  codeExplanation?: string[];
  table?: { columns: string[]; rows: string[][] };
  after?: string[];
}

export interface ComparisonArticle {
  reading: ComparisonBlock[];
}
