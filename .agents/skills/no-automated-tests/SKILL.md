---
name: no-automated-tests
description: Skip Vitest/Playwright in this repo; tests were removed. Use when implementing, authoring lessons, verifying, finishing work, or following Superpowers TDD/verification-before-completion in dop_02_web.
---

# No automated tests

This project does not have a test runner. Do not run or recreate tests.

## Rules

- Do not run `pnpm test`, `pnpm test:watch`, `pnpm test:e2e`, `vitest`, or `playwright`.
- Do not add `tests/`, Vitest, or Playwright back unless the user explicitly asks.
- Superpowers `test-driven-development` and `verification-before-completion` still apply as “prove the work”, but the proof here is **not** a test suite.

## Proof to use instead

1. `pnpm check` after TypeScript or source changes.
2. `pnpm audit:content` after lesson/question edits, if counts or structure matter.
3. `pnpm build` only when routing, Vite config, or production output could break.

Do not stall a content-authoring task on missing tests. Finish the content, then run the checks above if they apply.
