import type { Question } from '../types'

// Data serializer only: prompts, translations, answers and every rationale are
// authored literally in each lesson. This does not generate practice content.
export type AuthoredQuestion = {
  section: string
  en: string
  vi: string
  options: [string, string, string][]
  correct: string[]
  explanation: string
  tags: string[]
  difficulty?: Question['difficulty']
}

export function questions(lessonId: string, taskId: string, authored: AuthoredQuestion[], domainId = 1): Question[] {
  return authored.map((q, index) => ({
    id: `${lessonId}-q${String(index + 1).padStart(2, '0')}`,
    lessonId, domainId, taskId,
    type: q.correct.length > 1 ? 'multiple' : 'single',
    prompt: { en: q.en, vi: q.vi },
    options: q.options.map(([en, vi, explanation], i) => ({ id: String.fromCharCode(65 + i), en, vi, explanation })),
    correct: q.correct, explanation: q.explanation,
    reviewSection: `${lessonId}-${q.section}`,
    difficulty: q.difficulty ?? 'professional', tags: q.tags,
  }))
}
