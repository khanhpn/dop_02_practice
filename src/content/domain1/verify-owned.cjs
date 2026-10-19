// Read-only structural verification for the two independently authored domains.
const ts = require('typescript')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const cache = new Map()
function readModule(filename) {
  if (cache.has(filename)) return cache.get(filename)
  const exported = {}
  cache.set(filename, exported)
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  })
  if (output.diagnostics?.length) throw new Error(`${filename}: transpilation diagnostics`)
  vm.runInNewContext(output.outputText, {
    exports: exported,
    require: (specifier) => readModule(path.resolve(path.dirname(filename), `${specifier}.ts`)),
  }, { filename })
  return exported
}
const ids = new Set()
const prompts = new Set()
let questionCount = 0
function check(condition, message) { if (!condition) throw new Error(message) }
for (const name of ['domain1', 'domain5']) {
  const lessons = readModule(path.resolve(__dirname, `../${name}.ts`))[`${name}Lessons`]
  for (const lesson of lessons) {
    check(!ids.has(lesson.id), `duplicate ${lesson.id}`); ids.add(lesson.id)
    const words = lesson.sections.flatMap(s => s.paragraphs).join(' ').split(/\s+/).length
    check(words >= 900, `${lesson.id}: ${words} prose words`)
    check(lesson.sections.length >= 5 && lesson.sections.every(s => s.paragraphs.length >= 2), `${lesson.id}: sections`)
    check(lesson.scenarios.length >= 2 && lesson.diagram.steps.length >= 4, `${lesson.id}: scenarios/diagram`)
    check(lesson.lab.steps.length >= 5 && lesson.lab.cleanup.length > 0, `${lesson.id}: lab`)
    check(lesson.sources.length >= 2 && lesson.sources.every(s => /^https:\/\/docs\.aws\.amazon\.com\//.test(s.url)), `${lesson.id}: sources`)
    check(lesson.reviewedAt === '2026-10-19', `${lesson.id}: review date`)
    check(lesson.questions.length >= 20, `${lesson.id}: questions`)
    check(lesson.questions.filter(q => q.type === 'multiple').length >= 4, `${lesson.id}: multiple count`)
    for (const q of lesson.questions) {
      check(!ids.has(q.id), `duplicate ${q.id}`); ids.add(q.id)
      check(!prompts.has(q.prompt.en), `${q.id}: duplicate prompt`); prompts.add(q.prompt.en)
      check(q.lessonId === lesson.id && q.domainId === lesson.domainId && q.taskId === lesson.chapterId, `${q.id}: mapping`)
      check(lesson.sections.some(s => s.id === q.reviewSection), `${q.id}: anchor`)
      check(q.prompt.en.length > 60 && q.prompt.vi.length > 50 && q.explanation.length > 50, `${q.id}: prompt/rationale length`)
      check(q.type === 'single' ? q.options.length === 4 && q.correct.length === 1 : q.options.length >= 5 && q.correct.length >= 2, `${q.id}: answer cardinality`)
      check(q.correct.every(correct => q.options.some(o => o.id === correct)), `${q.id}: correct option ID`)
      check(new Set(q.options.map(o => o.id)).size === q.options.length, `${q.id}: option uniqueness`)
      check(q.options.every(o => o.en && o.vi && o.explanation.length > 25), `${q.id}: option translation/rationale`)
      questionCount++
    }
    console.log(`${lesson.id}: ${words} prose words; ${lesson.questions.length} questions; verified structural invariants`)
  }
}
console.log(`Verified ${questionCount} authored questions. This does not execute AWS labs, validate live prices, or certify semantic correctness.`)
