import { monitoringIamArticles } from "./monitoring-iam";
import { databaseEventArticles } from "./database-events";
import { eventBridgeArticles } from "./eventbridge";
import { organizationDeploymentArticles } from "./organizations-deployment";
import { networkingArticles } from "./networking";
import type { ComparisonArticle } from "./types";

export const comparisonArticles: Record<string, ComparisonArticle> = {
  ...monitoringIamArticles,
  ...databaseEventArticles,
  ...eventBridgeArticles,
  ...organizationDeploymentArticles,
  ...networkingArticles,
};
