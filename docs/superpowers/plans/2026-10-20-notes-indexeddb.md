# IndexedDB Markdown Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a separate, attractive note workspace with categories, Markdown editing, IndexedDB autosave, legacy-note migration, and reliable JSON export/import.

**Architecture:** Keep study progress in the existing `StudyState`/`localStorage` path, but move high-volume notes into a versioned IndexedDB with category and note stores. One notes service owns persistence and validation; a Notes page and a compact lesson entry point share it. Notes-only JSON and the full study backup both use the same validated note snapshot.

**Tech Stack:** React 19, TypeScript 5.9, MUI 7, HashRouter, browser IndexedDB, a maintained Markdown renderer with raw HTML disabled.

**Spec:** `docs/superpowers/specs/2026-10-20-notes-indexeddb-design.md`

## Global Constraints

- Static local/GitHub Pages site, no server or account sync; `localhost` and GitHub Pages data are separate.
- Preserve existing lesson notes and accept old v1 study backups.
- No raw HTML rendering from Markdown; block unsafe URL schemes.
- Do not run/add Vitest, Playwright, or `tests/` per `AGENTS.md`. Verification is `pnpm check`, `pnpm build` for routing/dependency changes, and manual flows only when permitted.
- New Vietnamese UI copy must pass specialist editing and independent reading per `.agents/skills/vietnamese-editorial/SKILL.md`.
- The user has not approved rewriting Chapter 01 as part of this feature.

## Review Focus

1. **Rapid edits then immediate navigation/tab hide:** the latest text must persist or remain visibly marked unsaved; Task 2 manually checks this.
2. **IndexedDB unavailable/quota exceeded:** never display “Đã lưu”; preserve a session draft and allow export; Task 2 manually checks this.
3. **Malformed or duplicate-ID JSON:** reject before transaction and leave current notes unchanged; Task 3 manually checks this.
4. **Legacy lesson note plus repeated migration:** produce exactly one linked note per old lesson ID, with no data loss; Task 4 manually checks this.
5. **Full backup restore fails after note replacement:** restore the pre-import note snapshot and report partial failure; Task 5 manually checks this.

---

### Task 1: IndexedDB model and operations

**Files:**
- Create: `src/notes/types.ts` — `NoteCategory`, `StudyNote`, `NotesSnapshot` (`version: 1`), and save-status types.
- Create: `src/notes/db.ts` — database opening, schema upgrade, category/note CRUD, atomic notes-snapshot replacement.
- Create: `src/notes/validation.ts` — parse and validate notes-only JSON; reject malformed IDs, duplicate IDs, dangling category IDs, invalid dates/fields, and unreasonable file size.

**Interfaces:** `openNotesDb(): Promise<IDBDatabase>`; `listCategories(): Promise<NoteCategory[]>`; `listNotes(): Promise<StudyNote[]>`; `putCategory(category): Promise<void>`; `putNote(note): Promise<void>`; `deleteNote(id): Promise<void>`; `deleteCategoryAndUncategorize(id): Promise<void>`; `readNotesSnapshot(): Promise<NotesSnapshot>`; `replaceNotesSnapshot(snapshot): Promise<void>`; `parseNotesJson(text): NotesSnapshot`.

- [ ] Read the spec's storage/import sections and current `StudyState.notes` shape; record the exact IndexedDB schema and store indexes in `src/notes/db.ts`.
- [ ] Implement typed CRUD and atomic category+note replacement; do not co-store notes in `StudyState`.
- [ ] Implement notes JSON validation before opening a write transaction; limit input size and ensure every `categoryId` resolves.
- [ ] Run `pnpm check`; manually inspect that a replacement transaction either commits all stores or aborts all stores.
- [ ] Commit only this task's files after verification; preserve unrelated dirty workspace changes.

### Task 2: Notes workspace and Markdown editor

**Files:**
- Create: `src/notes/useNotes.ts` — async loading, mutations, debounced save, flush-on-blur/visibility, save status and session draft on error.
- Create: `src/components/MarkdownEditor.tsx` — title/body editor, formatting toolbar, Write/Preview/split modes.
- Create: `src/components/MarkdownPreview.tsx` — safe Markdown rendering and styling.
- Create: `src/pages/Notes.tsx` — categories, list/search/filter, editor, empty states, delete confirmations.
- Modify: `src/App.tsx` — `/notes` route and navigation item.
- Modify: `src/styles.css` — responsive three-pane workspace, readable Markdown, mobile drill-in layout and focus states.
- Modify: `package.json`, `pnpm-lock.yaml` — renderer dependency only after checking a maintained version; no raw-HTML plugin.

**Interfaces:** `useNotes()` exposes `{categories, notes, status, error, createCategory, renameCategory, removeCategory, createNote, updateNote, removeNote, flush, reload}`; `MarkdownEditor` accepts a `StudyNote`, update callback and save status; `MarkdownPreview` accepts Markdown text. Search filters loaded notes by title/body without persisting a second index in v1.

- [ ] Build the data hook on Task 1 interfaces; signal “Đã lưu” only after IndexedDB transaction completes and retain the latest draft in memory on failure.
- [ ] Build a plain-text Markdown editor with basic toolbar and safe preview; forbid raw HTML and unsafe link/image schemes.
- [ ] Build desktop three-pane and mobile drill-in Notes page with create/rename/delete category, create/edit/delete note, search/filter and lesson-link metadata.
- [ ] Check rapid typing + immediate navigation, tab hide, reload, quota/storage failure, keyboard focus and mobile-sized layout manually when browser access is permitted. If browser access is denied, record the limitation instead of using another browser path.
- [ ] Run `pnpm check` and `pnpm build`; commit only this task's files after verification.

### Task 3: Notes-only JSON export/import

**Files:**
- Modify: `src/pages/Notes.tsx` — export button, file picker, preview/confirmation dialog and current-data export option.
- Create: `src/notes/files.ts` — JSON file download and bounded file reading.

**Interfaces:** `downloadNotesJson(snapshot: NotesSnapshot): void`; `readNotesFile(file: File): Promise<NotesSnapshot>` uses `parseNotesJson`; confirmed import calls `replaceNotesSnapshot()` then `reload()`.

- [ ] Add explicit JSON export with dated filename and full Markdown/category/lesson metadata.
- [ ] Add import preview with category/note counts and a clear “replace current notes” confirmation; provide export-current button before replacement.
- [ ] Manually check valid round-trip, corrupted JSON, duplicate IDs, unsupported version and declined confirmation leave current data untouched; check failure messaging for transaction errors.
- [ ] Run `pnpm check`; commit only this task's files after verification.

### Task 4: Legacy lesson notes and unified lesson entry point

**Files:**
- Create: `src/notes/migrate.ts` — idempotent conversion from `StudyState.notes` to `StudyNote` records.
- Modify: `src/pages/LessonPage.tsx` — replace old textarea with linked-notes preview/create/open actions.
- Modify: `src/App.tsx` or a small provider mounted there — run migration after study state and IndexedDB are available; show errors without clearing legacy values.

**Interfaces:** `migrateLegacyNotes(legacy: Record<string,string>): Promise<{migrated:number}>`; deterministic ID `legacy:<lessonId>`; it must not overwrite a note already migrated. Lesson link is `/notes?lesson=<lessonId>` and the Notes page consumes that query.

- [ ] Convert only nonempty legacy entries in one transaction; mark complete only after commit and keep the old `StudyState.notes` values as recoverable fallback.
- [ ] Show the linked note(s) from IndexedDB in each lesson; avoid showing a duplicate legacy note after successful migration.
- [ ] Manually check one note, many notes, interrupted/repeated migration, and navigation between lesson and Notes; then run `pnpm check`.
- [ ] Commit only this task's files after verification.

### Task 5: Unified study backup/reset and final editorial QA

**Files:**
- Modify: `src/core/storage.ts` — parse old v1 and new versioned full-backup envelope without breaking ordinary `StudyState` persistence.
- Modify: `src/core/StudyContext.tsx` — expose a restore operation that persists the new study state synchronously before reporting success, while retaining the existing autosave behavior for ordinary updates.
- Modify: `src/pages/Settings.tsx` — async full export/import/reset including IndexedDB notes, preview counts and rollback on partial restore.
- Modify: `src/notes/validation.ts` if full-backup parsing needs a shared snapshot validator.
- Modify: learner-facing copy in Notes/Lesson/Settings after specialist feedback.

**Interfaces:** `serializeFullBackup(state: StudyState, notes: NotesSnapshot): string`; `parseFullBackup(text): {state: StudyState; notes: NotesSnapshot | null}` where `null` means old v1 file requiring legacy migration; `replacePersisted(state: StudyState): void` writes `localStorage` before updating React state and throws on failure. Full restore snapshots current state and notes, replaces notes, calls `replacePersisted()`, and restores old notes if study-state persistence fails.

- [ ] Keep study-state `localStorage` parse/serialize compatible while adding a distinct full-backup file format; do not load large notes into every progress autosave.
- [ ] Update full backup export/import preview and reset; wait for both storage systems to confirm before success, and surface partial failures.
- [ ] Manually check v1 backup import, new backup round-trip, failed second-stage restore/rollback, reset, and notes-only import isolation.
- [ ] Have a Vietnamese-language specialist edit every new learner-facing string; have a different agent independently read all resulting Vietnamese UI text and verify corrections.
- [ ] Run `pnpm check` and `pnpm build`; do not run automated tests. Review the changed-file diff and commit only task files.

### Task 5a: Professional exam-note workspace upgrade

**Files:** `src/notes/types.ts`, `src/notes/validation.ts`, `src/notes/useNotes.ts`, `src/pages/Notes.tsx`, `src/components/MarkdownEditor.tsx`, `src/components/MarkdownPreview.tsx`, `src/styles.css`.

- [ ] Extend note metadata with tags, pinned and review-needed flags; import v1 JSON with safe defaults and retain backward compatibility.
- [ ] Add quick filters (pinned, review-needed, uncategorized), tag/category/lesson filtering and sort controls; improve note cards and summary counters.
- [ ] Add four exam-oriented Markdown templates, editor keyboard shortcuts, and a heading outline for long notes.
- [ ] Polish desktop/mobile layouts, empty/loading/error states, spacing, contrast and focus treatment without copying another app's exact visual identity.
- [ ] Verify `pnpm check` and `pnpm build`; independently review Vietnamese UI copy and storage behavior.

### Task 6: Whole-feature review

**Files:** all files changed in Tasks 1–5 plus the approved spec.

- [ ] Read each completed task's diff against the spec, checking storage durability, migration, import safety, XSS-safe Markdown, responsive usability, and backup compatibility.
- [ ] Run final `pnpm check` and `pnpm build`; perform permitted browser review or report why it was unavailable.
- [ ] State accurately what is implemented, how JSON backup works, and that browser data can be lost if site data is cleared. Do not claim Chapter 01 was rewritten.
