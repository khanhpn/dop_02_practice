export interface ComparisonBlock {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  code?: string;
}

export interface ComparisonArticle {
  reading: ComparisonBlock[];
}
