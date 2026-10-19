export interface Source {
  title: string;
  url: string;
}
export interface Domain {
  id: number;
  title: string;
  shortLabel: string;
  subtitle: string;
  weight: number;
  color: string;
  description: string;
}
export interface Chapter {
  id: string;
  domainId: number;
  title: string;
  examTask: string;
}
export interface Section {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}
export interface Diagram {
  title: string;
  steps: { label: string; detail: string }[];
  caption: string;
}
export interface Scenario {
  title: string;
  context: string;
  solution: string;
  tradeoff: string;
}
export interface CodeExample {
  title: string;
  cloudformation: string;
  terraform: string;
  explanation: string;
  deployable: boolean;
}
export interface LabStep {
  title: string;
  detail: string;
  command?: string;
  expected: string;
}
export interface Lab {
  title: string;
  duration: number;
  prerequisites: string[];
  cost: string;
  steps: LabStep[];
  cleanup: string[];
  challenge: string;
}
export interface Option {
  id: string;
  en: string;
  vi: string;
  explanation: string;
}
export interface Question {
  id: string;
  lessonId: string;
  domainId: number;
  taskId: string;
  type: "single" | "multiple";
  prompt: { en: string; vi: string };
  options: Option[];
  correct: string[];
  explanation: string;
  reviewSection: string;
  difficulty: "associate-refresh" | "professional";
  tags: string[];
}
export interface Lesson {
  id: string;
  number: number;
  domainId: number;
  chapterId: string;
  title: string;
  summary: string;
  duration: number;
  objectives: string[];
  prerequisites: string[];
  sections: Section[];
  diagram: Diagram;
  scenarios: Scenario[];
  keyTakeaways: string[];
  examTraps: string[];
  code: CodeExample;
  lab: Lab;
  sources: Source[];
  reviewedAt: string;
  questions: Question[];
}
