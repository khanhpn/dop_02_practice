export interface PlanDay {
  date: string;
  lessonIds: string[];
  kind: "learn" | "revision";
}
export function makePlan(
  lessonIds: string[],
  startDate: string,
  examDate: string,
): PlanDay[] {
  const start = Date.parse(startDate + "T00:00:00Z"),
    end = Date.parse(examDate + "T00:00:00Z");
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
    return [];
  const total = Math.min(365, Math.ceil((end - start) / 86400000));
  const learnDays = Math.max(1, total - Math.min(14, Math.floor(total / 4)));
  const days: PlanDay[] = [];
  for (let day = 0; day < total; day++) {
    const from = Math.floor((day * lessonIds.length) / learnDays),
      to = Math.floor(((day + 1) * lessonIds.length) / learnDays);
    days.push({
      date: new Date(start + day * 86400000).toISOString().slice(0, 10),
      lessonIds: day < learnDays ? lessonIds.slice(from, to) : [],
      kind: day < learnDays ? "learn" : "revision",
    });
  }
  return days;
}
