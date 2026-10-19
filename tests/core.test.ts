import { describe, expect, it } from "vitest";
import {
  gradeQuestion,
  selectMock,
  weightedCounts,
  shuffle,
} from "../src/core/quiz";
import {
  emptyState,
  parseBackup,
  recordAnswers,
  serializeBackup,
} from "../src/core/storage";
import { makePlan } from "../src/core/planner";
import type { Question } from "../src/content/types";

const question = (id: string, domainId = 1): Question => ({
  id,
  lessonId: "d1-l01",
  domainId,
  taskId: "1.1",
  type: "multiple",
  prompt: { en: "Choose TWO", vi: "Chọn HAI" },
  correct: ["A", "C"],
  options: ["A", "B", "C", "D", "E"].map((id) => ({
    id,
    en: id,
    vi: id,
    explanation: "Giải thích",
  })),
  explanation: "Giải thích",
  reviewSection: "core",
  difficulty: "professional",
  tags: [],
});

describe("grading and sampling", () => {
  it("requires the entire exact set regardless of order", () => {
    expect(gradeQuestion(["A", "C"], ["C", "A"])).toBe(true);
    expect(gradeQuestion(["A", "C"], ["A"])).toBe(false);
    expect(gradeQuestion(["A", "C"], ["A", "B", "C"])).toBe(false);
    expect(gradeQuestion(["A"], [])).toBe(false);
    expect(gradeQuestion([], [])).toBe(false);
    expect(gradeQuestion(["A"], ["A", "A"])).toBe(false);
  });
  it("allocates exactly 75 questions by official weights", () => {
    expect(weightedCounts(75)).toEqual([17, 13, 11, 11, 10, 13]);
  });
  it("samples unique questions without mutating the source", () => {
    const pool = [1, 2, 3, 4, 5, 6].flatMap((d) =>
      Array.from({ length: 30 }, (_, i) => question(`${d}-${i}`, d)),
    );
    const selected = selectMock(pool, () => 0.5);
    expect(selected).toHaveLength(75);
    expect(new Set(selected.map((q) => q.id)).size).toBe(75);
    expect(
      [1, 2, 3, 4, 5, 6].map(
        (d) => selected.filter((q) => q.domainId === d).length,
      ),
    ).toEqual([17, 13, 11, 11, 10, 13]);
    expect(pool[0].id).toBe("1-0");
  });
  it("rejects insufficient pools rather than duplicating questions", () => {
    expect(() => selectMock([question("one")])).toThrow(/domain/i);
  });
  it("shuffles a copy", () => {
    const original = [1, 2, 3];
    expect(shuffle(original, () => 0)).toEqual([2, 3, 1]);
    expect(original).toEqual([1, 2, 3]);
  });
});

describe("backups and learning history", () => {
  it("does not discard an unrelated timed exam when an inline lesson quiz is recorded", () => {
    const state = emptyState();
    state.activeSession = {
      id: "running-mock",
      mode: "mock",
      questionIds: ["q1"],
      answers: {},
      flagged: [],
      index: 0,
      startedAt: 1000,
      expiresAt: 10801000,
    };
    const updated = recordAnswers(
      state,
      [question("q2")],
      { q2: ["A", "C"] },
      "lesson",
      5000,
    );
    expect(updated.activeSession?.id).toBe("running-mock");
    expect(updated.activeSession?.expiresAt).toBe(10801000);
  });
  it("round trips notes/bookmarks and rejects corrupted backups", () => {
    const state = emptyState();
    state.notes["d1-l01"] = "KMS grant và key policy";
    state.bookmarks = ["d1-l01"];
    expect(parseBackup(serializeBackup(state))).toEqual(state);
    for (const bad of [
      "null",
      "[]",
      '{"version":99}',
      '{"version":1,"notes":42}',
      "not json",
    ])
      expect(() => parseBackup(bad)).toThrow();
  });
  it("rejects invalid attempt records rather than replacing a good state", () => {
    const state = emptyState();
    expect(() =>
      parseBackup(
        JSON.stringify({
          ...state,
          history: { q: { attempts: -1, correct: "yes" } },
        }),
      ),
    ).toThrow();
    expect(() =>
      parseBackup(
        JSON.stringify({
          ...state,
          settings: { ...state.settings, dailyHours: 0 },
        }),
      ),
    ).toThrow();
  });
  it("records unanswered as wrong and increases review interval only after correct answers", () => {
    const now = Date.parse("2026-10-19T05:00:00Z");
    const state = recordAnswers(
      emptyState(),
      [question("q1"), question("q2")],
      { q1: ["A", "C"] },
      "lesson",
      now,
    );
    expect(state.history.q1.correct).toBe(true);
    expect(state.history.q1.streak).toBe(1);
    expect(state.history.q2.correct).toBe(false);
    expect(state.history.q2.selected).toEqual([]);
    expect(state.attempts[0].score).toBe(50);
    const next = recordAnswers(
      state,
      [question("q1")],
      { q1: ["C", "A"] },
      "review",
      now + 86400000,
    );
    expect(next.history.q1.nextReview).toBeGreaterThan(
      state.history.q1.nextReview + 86400000,
    );
    expect(parseBackup(serializeBackup(next))).toEqual(next);
  });
  it("round trips an unfinished timed exam for browser reload", () => {
    const state = emptyState();
    state.activeSession = {
      id: "mock-1",
      mode: "mock",
      questionIds: ["q1"],
      answers: { q1: ["A"] },
      flagged: ["q1"],
      index: 0,
      startedAt: 1000,
      expiresAt: 10801000,
    };
    expect(parseBackup(serializeBackup(state)).activeSession?.expiresAt).toBe(
      10801000,
    );
  });
});

describe("planner", () => {
  it("schedules every lesson once with space for revision", () => {
    const plan = makePlan(
      Array.from({ length: 72 }, (_, i) => `l${i}`),
      "2026-10-19",
      "2026-12-15",
    );
    const assigned = plan.flatMap((d) => d.lessonIds);
    expect(assigned).toHaveLength(72);
    expect(new Set(assigned).size).toBe(72);
    expect(plan.at(-1)?.kind).toBe("revision");
  });
  it("handles past and very close exam dates without losing lessons", () => {
    expect(makePlan(["a", "b"], "2026-10-19", "2026-10-18")).toEqual([]);
    expect(
      makePlan(["a", "b"], "2026-10-19", "2026-10-20").flatMap(
        (d) => d.lessonIds,
      ),
    ).toEqual(["a", "b"]);
  });
});
