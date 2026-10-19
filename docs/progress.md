# DOP-C02 implementation ledger

User authorization: implement now, entire syllabus; React/TS/MUI, GitHub Pages master + v0.N tags. Latest correction: detailed VI lessons, EN/VI questions, VI-only explanations with knowledge deep links and diagrams.

Workspace: initially empty, no Git repository or AGENTS.md. Build in the requested directory; no existing changes to isolate. GitHub remote not yet supplied. Skip worktree machinery that requires an existing repository.

Pre-flight: content types are the shared interface between independently researched domain packages and UI/core. Exact types live in src/content/types.ts. All consumers use IDs rather than array positions.

Decisions: target date defaults to editable 2026-12-15; snapshot date 2026-10-19; labels distinguish practice score from AWS scaled score. User's repeated “làm luôn” authorizes immediate implementation without additional design approval gates.

App/core implementation: React19 + TS + MUI7 + Vite7; lesson notes/bookmarks/lab checklist; CF/Terraform code tabs; EN/VI quiz with per-option VI rationale and exact section links; study/mock/review, persisted active session/flags/deadline; planner, validated backups and settings. Dashboard has real browser-derived metrics, no seeded fake progress.

Verification evidence so far: TypeScript passed; 15 core/version/release tests passed (including real temporary local Git remote); 8 desktop/mobile browser flow tests passed, plus 2 mock weighting/expiry tests passed. A discovered bug (inline quiz clearing an unrelated mock session) was reproduced with a failing test then fixed; recordAnswers now preserves sessions and QuizRunner only clears its own persisted session.

CI implemented master verify → v0.N tag → Pages artifact deployment, PR verify only, numeric increment and same-SHA rerun reuse, latest-master guard prevents stale deployment. No remote exists in this workspace; no GitHub deployment claimed. Full content coverage gate remains failing until 72 complete lessons and all 19 tasks exist.

Content work continues in three disjoint authored packages: D1+D5, D2+D3, D4+D6. No blank lessons or generated scenario variants. Each current lesson has >=800 words in sections, >=20 bilingual questions with per-option rationale, >=4 multiple-response questions, >=2 scenarios, diagram and multi-step lab/cleanup. Some initial implausible distractors were identified for editorial correction before completion.

Additional integrated capstone: src/labs/observability/cloudformation.yaml and main.tf, displayed at /#/lab/observability with eight verification steps and synthetic JSON event download. Templates are authored but not deployed to AWS. Root author added this to strengthen the CloudFormation-first practical experience; CloudFormation/SNS/EventBridge/SQS resource relationships were checked against AWS documentation.

## Current priority — Vietnamese editorial revision

User reviewed d1-l01 in the live site and found Vietnamese stiff, rough and translation-like. New authoring is paused while revising the 28 existing lessons/560 questions. A fresh Vietnamese-language editor owns D1/D5 and the editorial guide; the D2/D3 and D4/D6 authors are revising their packages to that standard. The original 72-lesson goal remains outstanding.

Editorial goals: explain ideas as a Vietnamese instructor would, use clear subjects and cause/effect, define technical terms on first use and then use consistent Vietnamese wording, replace vague metaphors and untranslated jargon. Cover all visible VI fields, especially question translations, every option rationale, lab instructions and diagrams. Preserve exam meaning and depth. Do not pad to satisfy word counts.

Technical baseline of all 28 lessons is captured at `.superpowers/editorial/technical-baseline.json` (ignored scratch). Run `node scripts/editorial-invariants.mjs --baseline .superpowers/editorial/technical-baseline.json` to verify IDs, official mappings, section anchors, source URLs, code/commands, EN questions/options, correct answers and review links have not changed during editing. Prose quality requires actual editorial review, not just passing structural tests.

Permissions respected: user declined local Git initialization and Terraform provider download in the earlier restricted session. Do not retry those actions merely because sandbox permissions changed. A read-only check now shows an unborn local `main` branch; no commit/push/deploy has been performed. Terraform formatting passed; provider validation and all real AWS operations remain unperformed.

Editorial checkpoint: d6-l01 has a complete Vietnamese rewrite, including all 20 question translations and every choice rationale; a second language-editor sample review confirmed the instructor voice is suitable. d1-l01, d2-l01 and d4-l01 are also reported fully revised by their owners. Other lessons remain in progress and must not be counted complete after a terminology-only pass. Root also revised capstone instructions, domain summaries and explanatory copy in practice/planner/settings.

Verification at this checkpoint: TypeScript, production Vite build, all 15 core/version/release tests and all 12 desktop/mobile browser tests passed. The technical baseline comparison found no changes across the 28 lessons. Content integrity still reports an overly short existing option rationale at d2-l07-q19; its owner has been notified. The separate 72-lesson coverage gate remains unmet.

Later editorial checkpoint: root completed d6-l09 and d5-l01 (including all 20 questions and per-choice Vietnamese explanations in each). The language editor had already rewritten d5-l01's ten teaching paragraphs; root retained them except a small clarification of the AWS Health paragraph. All five D2 lessons, d3-l01/l05, all six D4 lessons and d1-l01 through l04 are reported complete by their owners. Remaining editorial work is still active; do not count a lesson complete merely because its main paragraphs are rewritten. Content integrity now passes for all 28 existing lessons, including the corrected d2-l07-q19. Technical invariants still pass.
