import type { Question } from "../content/types";
export const DOMAIN_WEIGHTS = [22, 17, 15, 15, 14, 17];
export function gradeQuestion(correct: string[], selected: string[]): boolean {
  return (
    correct.length > 0 &&
    correct.length === selected.length &&
    new Set(selected).size === selected.length &&
    correct.every((a) => selected.includes(a))
  );
}
export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function weightedCounts(total: number): number[] {
  const raw = DOMAIN_WEIGHTS.map((w) => (total * w) / 100);
  const counts = raw.map(Math.floor);
  const order = raw
    .map((v, i) => ({ i, fraction: v - counts[i] }))
    .sort((a, b) => b.fraction - a.fraction || a.i - b.i);
  const remainder = total - counts.reduce((a, b) => a + b, 0);
  for (let i = 0; i < remainder; i++) counts[order[i].i]++;
  return counts;
}
export function selectMock(pool: Question[], random = Math.random): Question[] {
  const unique = [...new Map(pool.map((q) => [q.id, q])).values()];
  const counts = weightedCounts(75);
  const selected: Question[] = [];
  counts.forEach((count, i) => {
    const domain = unique.filter((q) => q.domainId === i + 1);
    if (domain.length < count)
      throw new Error(
        `Domain ${i + 1} cần ít nhất ${count} câu để tạo đề 75 câu.`,
      );
    selected.push(...shuffle(domain, random).slice(0, count));
  });
  return shuffle(selected, random);
}
