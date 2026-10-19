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

## Vietnamese educational content

For Vietnamese lesson writing, translation, supplementation, editorial review, or learner-facing copy changes, read and follow [.agents/skills/vietnamese-editorial/SKILL.md](.agents/skills/vietnamese-editorial/SKILL.md).

A Vietnamese-language specialist agent must translate and edit the text, and a different agent must independently review it before completion. Preserve AWS DOP-C02 meaning and technical fields. Read the full Vietnamese text in scope; terminology replacements or structural checks alone do not satisfy the editorial review.
