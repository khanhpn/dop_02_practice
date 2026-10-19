export type PracticeMode = "lesson" | "domain" | "mock" | "review";
export interface QuestionHistory {
  attempts: number;
  correct: boolean;
  selected: string[];
  lastAnswered: number;
  nextReview: number;
  streak: number;
}
export interface Attempt {
  id: string;
  at: number;
  mode: PracticeMode;
  questionIds: string[];
  answers: Record<string, string[]>;
  score: number;
  domainScores: Record<string, { correct: number; total: number }>;
}
export interface ActiveSession {
  id: string;
  mode: PracticeMode;
  questionIds: string[];
  answers: Record<string, string[]>;
  flagged: string[];
  index: number;
  startedAt: number;
  expiresAt: number | null;
}
export interface StudyState {
  version: 1;
  settings: {
    examDate: string;
    startDate: string;
    dailyHours: number;
    theme: "light" | "dark";
    questionLocale: "en" | "vi";
  };
  completed: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  labSteps: Record<string, number[]>;
  history: Record<string, QuestionHistory>;
  attempts: Attempt[];
  lastLesson: string | null;
  activeSession: ActiveSession | null;
  studyMinutes: number;
}
