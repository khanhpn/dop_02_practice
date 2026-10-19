import { expect, it } from "vitest";
import type { Lesson } from "../src/content/types";
const modules = import.meta.glob("../src/content/domain[1-6].ts", {
  eager: true,
});
const lessons = Object.values(modules).flatMap((mod) =>
  Object.values(mod as Record<string, unknown>).flatMap((v) =>
    Array.isArray(v) ? (v as Lesson[]) : [],
  ),
);
it("covers all six domains and all nineteen official tasks with 72 complete lessons", () => {
  expect(lessons.length).toBe(72);
  expect(new Set(lessons.map((l) => l.chapterId)).size).toBe(19);
  expect(
    [1, 2, 3, 4, 5, 6].map(
      (d) => lessons.filter((l) => l.domainId === d).length,
    ),
  ).toEqual([16, 13, 11, 11, 10, 11]);
});
it("has valid bilingual questions, unique decisions, explanations and working review anchors", () => {
  const ids = new Set<string>();
  const prompts = new Set<string>();
  for (const l of lessons) {
    expect(ids.has(l.id), l.id).toBe(false);
    ids.add(l.id);
    expect(l.sections.length, l.id).toBeGreaterThanOrEqual(5);
    expect(new Set(l.sections.map((s) => s.id)).size, l.id).toBe(
      l.sections.length,
    );
    expect(
      l.sections
        .flatMap((s) => s.paragraphs)
        .join(" ")
        .split(/\s+/).length,
      l.id,
    ).toBeGreaterThanOrEqual(800);
    expect(l.scenarios.length, l.id).toBeGreaterThanOrEqual(2);
    expect(l.lab.steps.length, l.id).toBeGreaterThanOrEqual(5);
    expect(l.lab.cleanup.length, l.id).toBeGreaterThan(0);
    expect(l.code.cloudformation.trim().length, l.id).toBeGreaterThan(30);
    expect(l.code.terraform.trim().length, l.id).toBeGreaterThan(30);
    expect(l.questions.length, l.id).toBeGreaterThanOrEqual(20);
    expect(
      l.questions.filter((q) => q.type === "multiple").length,
      l.id,
    ).toBeGreaterThanOrEqual(4);
    expect(l.sources.length, l.id).toBeGreaterThanOrEqual(2);
    for (const s of l.sections) {
      expect(s.paragraphs.length, `${l.id}/${s.id}`).toBeGreaterThanOrEqual(2);
    }
    for (const source of l.sources)
      expect(new URL(source.url).hostname, source.url).toMatch(
        /(^|\.)aws\.amazon\.com$|(^|\.)amazonaws\.com$/,
      );
    for (const q of l.questions) {
      expect(ids.has(q.id), q.id).toBe(false);
      ids.add(q.id);
      expect(prompts.has(q.prompt.en.trim()), q.id).toBe(false);
      prompts.add(q.prompt.en.trim());
      expect(q.lessonId, q.id).toBe(l.id);
      expect(q.domainId, q.id).toBe(l.domainId);
      expect(q.taskId, q.id).toBe(l.chapterId);
      expect(
        l.sections.some((s) => s.id === q.reviewSection),
        `${q.id} -> ${q.reviewSection}`,
      ).toBe(true);
      expect(q.prompt.en.length, q.id).toBeGreaterThan(60);
      expect(q.prompt.vi.length, q.id).toBeGreaterThan(50);
      expect(q.explanation.length, q.id).toBeGreaterThan(50);
      expect(new Set(q.options.map((o) => o.id)).size, q.id).toBe(
        q.options.length,
      );
      if (q.type === "single") {
        expect(q.options.length, q.id).toBe(4);
        expect(q.correct.length, q.id).toBe(1);
      } else {
        expect(q.options.length, q.id).toBeGreaterThanOrEqual(5);
        expect(q.correct.length, q.id).toBeGreaterThanOrEqual(2);
        expect(q.correct.length, q.id).toBeLessThan(q.options.length);
      }
      expect(new Set(q.correct).size, q.id).toBe(q.correct.length);
      for (const a of q.correct)
        expect(
          q.options.some((o) => o.id === a),
          q.id,
        ).toBe(true);
      for (const o of q.options) {
        expect(o.en.length, q.id).toBeGreaterThan(4);
        expect(o.vi.length, q.id).toBeGreaterThan(4);
        expect(o.explanation.length, q.id).toBeGreaterThan(25);
      }
    }
  }
});
