# dop.study agent rules

This repo has **no automated test suite**. Vitest, Playwright, `tests/`, `pnpm test`, `pnpm test:watch`, and `pnpm test:e2e` were removed on purpose.

## Do not

- Run, restore, or add unit/e2e tests.
- Invoke `vitest`, `playwright`, `pnpm test`, or look for `tests/*.test.ts`.
- Treat Superpowers TDD / verification-before-completion as requiring a test command here.

User instructions in this file override those skills for this repository.

## Verify with

- `pnpm check` — TypeScript (`tsc -b`)
- `pnpm audit:content` — lesson/question/task counts (read-only)
- `pnpm build` — only when the change can break the production bundle

If typecheck is enough for the change, stop there.
