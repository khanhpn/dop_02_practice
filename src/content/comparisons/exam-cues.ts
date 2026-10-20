import { governanceExamCues } from "./exam-cues-governance";
import { infrastructureExamCues } from "./exam-cues-infrastructure";
import type { ExamCue } from "./types";

export const examCuesByArticle: Record<string, ExamCue[]> = {
  ...governanceExamCues,
  ...infrastructureExamCues,
};
