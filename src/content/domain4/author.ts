import type { Lesson, Question } from '../types';

/** Tuples are authored content, not generated question variants. */
export type Choice = [en: string, vi: string, rationale: string];
export type QuestionDraft = {
  en: string; vi: string; choices: Choice[]; answers: number[];
  section: string; explanation: string; refresh?: boolean;
};
export function questions(lessonId: string, domainId: number, taskId: string, drafts: QuestionDraft[]): Question[] {
  return drafts.map((draft, index) => ({
    id: `${lessonId}-q${String(index + 1).padStart(2, '0')}`,
    lessonId, domainId, taskId,
    type: draft.answers.length > 1 ? 'multiple' : 'single',
    prompt: { en: draft.en, vi: draft.vi },
    options: draft.choices.map(([en, vi, explanation], option) => ({ id: String.fromCharCode(65 + option), en, vi, explanation })),
    correct: draft.answers.map(option => String.fromCharCode(65 + option)),
    explanation: draft.explanation, reviewSection: `${lessonId}-${draft.section}`,
    difficulty: draft.refresh ? 'associate-refresh' : 'professional', tags: [taskId],
  }));
}
export function lesson(draft: Omit<Lesson, 'questions'>, drafts: QuestionDraft[]): Lesson {
  return { ...draft, questions: questions(draft.id, draft.domainId, draft.chapterId, drafts) };
}
