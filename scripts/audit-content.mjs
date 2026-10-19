import { createServer } from "vite";
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
});
try {
  const { lessons, chapters, questions } = await server.ssrLoadModule(
    "/src/content/index.ts",
  );
  const missing = chapters
    .filter(
      (chapter) => !lessons.some((lesson) => lesson.chapterId === chapter.id),
    )
    .map((c) => c.id);
  const report = {
    lessons: lessons.length,
    targetLessons: 72,
    questions: questions.length,
    targetQuestions: 1440,
    coveredTasks: chapters.length - missing.length,
    totalTasks: 19,
    missingTasks: missing,
    domains: [1, 2, 3, 4, 5, 6].map((id) => ({
      id,
      lessons: lessons.filter((l) => l.domainId === id).length,
      questions: questions.filter((q) => q.domainId === id).length,
    })),
    lessonDetails: lessons.map((l) => ({
      id: l.id,
      title: l.title,
      task: l.chapterId,
      questions: l.questions.length,
      words: l.sections
        .flatMap((s) => s.paragraphs)
        .join(" ")
        .split(/\s+/).length,
    })),
  };
  if (process.argv.includes("--summary")) delete report.lessonDetails;
  console.log(JSON.stringify(report, null, 2));
} finally {
  await server.close();
}
