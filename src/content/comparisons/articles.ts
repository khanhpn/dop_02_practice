import { monitoringIamArticles } from "./monitoring-iam";
import { databaseEventArticles } from "./database-events";
import type { ComparisonArticle } from "./types";

export const comparisonArticles: Record<string, ComparisonArticle> = {
  ...monitoringIamArticles,
  ...databaseEventArticles,
};
