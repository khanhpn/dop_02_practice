import type { Question } from "../content/types";
import type {
  ActiveSession,
  Attempt,
  PracticeMode,
  QuestionHistory,
  StudyState,
} from "./types";
import { gradeQuestion } from "./quiz";
import type { NotesSnapshot } from "../notes/types";
import { validateNotesSnapshot } from "../notes/validation";
export const STORAGE_KEY = "dop-study-lab:v1";
export const dateOnly = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export function emptyState(): StudyState {
  return {
    version: 1,
    settings: {
      examDate: "2026-12-15",
      startDate: dateOnly(),
      dailyHours: 4,
      theme: "light",
      questionLocale: "en",
    },
    completed: [],
    bookmarks: [],
    notes: {},
    labSteps: {},
    history: {},
    attempts: [],
    lastLesson: null,
    activeSession: null,
    studyMinutes: 0,
  };
}
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const strings = (v: unknown): v is string[] =>
  Array.isArray(v) &&
  v.every((a) => typeof a === "string") &&
  new Set(v).size === v.length;
const finite = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
const integer = (v: unknown) => finite(v) && Number.isInteger(v);
function validDate(v: unknown): v is string {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const time = Date.parse(v + "T00:00:00Z");
  return (
    Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === v
  );
}
function answers(v: unknown): v is Record<string, string[]> {
  return object(v) && Object.values(v).every(strings);
}
function mode(v: unknown): v is PracticeMode {
  return ["lesson", "domain", "mock", "review"].includes(String(v));
}
function session(v: unknown): v is ActiveSession {
  if (!object(v) || !strings(v.questionIds) || v.questionIds.length === 0)
    return false;
  const ids = v.questionIds;
  return (
    typeof v.id === "string" &&
    mode(v.mode) &&
    answers(v.answers) &&
    Object.keys(v.answers).every((id) => ids.includes(id)) &&
    strings(v.flagged) &&
    v.flagged.every((id) => ids.includes(id)) &&
    integer(v.index) &&
    Number(v.index) < ids.length &&
    finite(v.startedAt) &&
    (v.expiresAt === null ||
      (finite(v.expiresAt) && Number(v.expiresAt) > Number(v.startedAt)))
  );
}
export function parseBackup(text: string): StudyState {
  const fail = () => {
    throw new Error(
      "Bản sao lưu không hợp lệ hoặc có phiên bản không được hỗ trợ. Dữ liệu hiện tại chưa bị thay đổi.",
    );
  };
  if (text.length > 10_000_000) fail();
  let v: unknown;
  try {
    v = JSON.parse(text);
  } catch {
    fail();
  }
  if (!object(v) || v.version !== 1) return fail();
  const s = v.settings;
  if (
    !object(s) ||
    !validDate(s.examDate) ||
    !validDate(s.startDate) ||
    typeof s.dailyHours !== "number" ||
    s.dailyHours < 1 ||
    s.dailyHours > 12 ||
    !["light", "dark"].includes(String(s.theme)) ||
    !["en", "vi"].includes(String(s.questionLocale))
  )
    return fail();
  if (
    !strings(v.completed) ||
    !strings(v.bookmarks) ||
    !object(v.notes) ||
    !Object.values(v.notes).every((n) => typeof n === "string") ||
    !object(v.labSteps) ||
    !Object.values(v.labSteps).every(
      (steps) => Array.isArray(steps) && steps.every(integer),
    ) ||
    !object(v.history) ||
    !Array.isArray(v.attempts) ||
    !finite(v.studyMinutes) ||
    (v.lastLesson !== null && typeof v.lastLesson !== "string")
  )
    return fail();
  for (const h of Object.values(v.history))
    if (
      !object(h) ||
      !integer(h.attempts) ||
      Number(h.attempts) < 1 ||
      typeof h.correct !== "boolean" ||
      !strings(h.selected) ||
      !finite(h.lastAnswered) ||
      !finite(h.nextReview) ||
      !integer(h.streak)
    )
      return fail();
  for (const a of v.attempts) {
    if (
      !object(a) ||
      typeof a.id !== "string" ||
      !finite(a.at) ||
      !mode(a.mode) ||
      !strings(a.questionIds) ||
      a.questionIds.length === 0 ||
      !answers(a.answers) ||
      !finite(a.score) ||
      Number(a.score) > 100 ||
      !object(a.domainScores)
    )
      return fail();
    const ids = a.questionIds;
    if (Object.keys(a.answers).some((id) => !ids.includes(id))) return fail();
    for (const d of Object.values(a.domainScores))
      if (
        !object(d) ||
        !integer(d.correct) ||
        !integer(d.total) ||
        Number(d.correct) > Number(d.total)
      )
        return fail();
  }
  if (v.activeSession !== null && !session(v.activeSession)) return fail();
  // Reconstruct only recognized fields. Unknown keys never enter application state.
  return {
    version: 1,
    settings: s as StudyState["settings"],
    completed: v.completed,
    bookmarks: v.bookmarks,
    notes: v.notes as Record<string, string>,
    labSteps: v.labSteps as Record<string, number[]>,
    history: v.history as Record<string, QuestionHistory>,
    attempts: v.attempts as Attempt[],
    lastLesson: v.lastLesson as string | null,
    activeSession: v.activeSession as ActiveSession | null,
    studyMinutes: v.studyMinutes as number,
  };
}
export const serializeBackup = (state: StudyState) =>
  JSON.stringify(state, null, 2);
export function serializeFullBackup(state: StudyState, notes: NotesSnapshot): string {
  return JSON.stringify({ kind: "dop-study-full", version: 2, study: state, notes }, null, 2);
}
export function parseFullBackup(text: string): { state: StudyState; notes: NotesSnapshot | null } {
  if (new Blob([text]).size > 60_000_000) throw new Error("Tệp sao lưu vượt quá 60 MB. Dữ liệu hiện tại chưa bị thay đổi.");
  let value: unknown;
  try { value = JSON.parse(text); }
  catch { throw new Error("Không đọc được nội dung JSON trong tệp. Dữ liệu hiện tại chưa bị thay đổi."); }
  if (value && typeof value === "object" && "kind" in value && value.kind === "dop-study-full") {
    const envelope = value as Record<string, unknown>;
    if (envelope.version !== 2) throw new Error("Phiên bản của bản sao lưu chưa được hỗ trợ. Dữ liệu hiện tại chưa bị thay đổi.");
    return { state: parseBackup(JSON.stringify(envelope.study)), notes: validateNotesSnapshot(envelope.notes) };
  }
  return { state: parseBackup(text), notes: null };
}
export function recordAnswers(
  state: StudyState,
  questions: Question[],
  selected: Record<string, string[]>,
  practiceMode: PracticeMode,
  now = Date.now(),
): StudyState {
  if (questions.length === 0) return state;
  const history = { ...state.history };
  const domainScores: Attempt["domainScores"] = {};
  let correctCount = 0;
  const answerCopy: Record<string, string[]> = {};
  for (const q of questions) {
    const chosen = selected[q.id] ?? [];
    answerCopy[q.id] = [...chosen];
    const correct = gradeQuestion(q.correct, chosen);
    const streak = correct ? (history[q.id]?.streak ?? 0) + 1 : 0;
    const days = correct ? Math.min(21, Math.pow(2, streak - 1)) : 0.25;
    history[q.id] = {
      attempts: (history[q.id]?.attempts ?? 0) + 1,
      correct,
      selected: [...chosen],
      lastAnswered: now,
      nextReview: now + days * 86400000,
      streak,
    };
    const d = domainScores[q.domainId] ?? { correct: 0, total: 0 };
    d.total++;
    if (correct) {
      correctCount++;
      d.correct++;
    }
    domainScores[q.domainId] = d;
  }
  const attempt: Attempt = {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    at: now,
    mode: practiceMode,
    questionIds: questions.map((q) => q.id),
    answers: answerCopy,
    score: Math.round((correctCount / questions.length) * 100),
    domainScores,
  };
  return {
    ...state,
    history,
    attempts: [attempt, ...state.attempts].slice(0, 200),
  };
}
