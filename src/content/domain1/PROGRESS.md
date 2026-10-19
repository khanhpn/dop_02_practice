# Domain 1 + Domain 5 authoring checkpoint

Reviewed source snapshot: 2026-10-19. This is an incomplete authoring checkpoint,
not a claim that the requested 26 lessons or 520 questions are complete.

## Completed

- Domain 1: d1-l01, l02, l03, l04 (task 1.1), l05 (task 1.2), l09 (task 1.3), l12 (task 1.4).
- Domain 5: d5-l01 (number 52/task 5.1), l05 (number 56/task 5.2), l08 (number 59/task 5.3).
- 10 complete lessons, 200 literally authored bilingual questions, 4–5 multiple questions each.
- Every completed lesson has 5 sections/10 substantive paragraphs, 1,120–1,218 prose words,
  2 scenarios, 5-step diagram, 6-step lab, cleanup, CloudFormation then Terraform snippets,
  explicit deployable=false, primary AWS sources and reviewedAt date.
- Indexes export only complete lessons in numeric order.
- questions() in domain1/shared.ts serializes literal question content; it does not generate
  prompts/options/rationales. Optional fourth argument domainId defaults to 1; Domain 5 passes 5.

## Next work (exact continuation)

Next lesson: **d1-l06**, number 6, task/chapterId `1.2`: integration/contract testing with
ephemeral environments, private dependency access, deterministic data and guaranteed cleanup.

Then author complete literal lesson packages in this order:

1. d1-l07 (7/1.2): load/stress/performance testing, baseline, realistic load, pass/fail policy.
2. d1-l08 (8/1.2): security/acceptance/UI testing and trustworthy gates at correct stages.
3. d1-l10 (10/1.3): reproducible container build, image scanning/signing/provenance and promotion.
4. d1-l11 (11/1.3): EC2 Image Builder AMI pipeline, components/testing/distribution/cleanup.
5. d1-l13 (13/1.4): ECS CodeDeploy blue/green, task sets, listeners, hooks and rollback.
6. d1-l14 (14/1.4): EKS rollout strategies, readiness/probes/PDB, GitOps and rollback boundaries.
7. d1-l15 (15/1.4): Lambda versions/aliases, SAM deployment preferences, canary/linear/hooks.
8. d1-l16 (16/1.4): stateful deployment tradeoffs, migration expand/contract, storage/access patterns.
9. d5-l02 (53/5.1): SQS/SNS/Lambda processing, failure boundaries, fan-out, partial batch and dedup.
10. d5-l03 (54/5.1): AWS Health/CloudTrail cross-account notification, impact and event normalization.
11. d5-l04 (55/5.1): Step Functions incident workflow, retry/catch/approval/escalation and audit.
12. d5-l06 (57/5.2): SSM fleet configuration, State Manager, rate control and controlled recovery.
13. d5-l07 (58/5.2): event-driven infrastructure changes, quarantine/Auto Scaling, guardrails/idempotency.
14. d5-l09 (60/5.3): deep CI/CD/CloudFormation failure investigation and safe recovery.
15. d5-l10 (61/5.3): ECS/EKS/runtime dependency RCA, Health/OpsCenter and post-incident validation.

Remaining authoring: **16 lessons/320 questions**. Do not generate filler or export placeholders.

## Editorial review still required

- d1-l01 originally had overly easy/unrelated distractors. Its clearest unrelated alternatives
  have been rewritten as plausible same-workflow alternatives, but correct choices are still
  mostly A/AB; improve static answer-position distribution before final delivery.
- Review l02–l05/l09/l12 for any remaining weak unrelated distractors. Later Domain 5 question
  sets use more workflow-specific alternatives, but all sets need a semantic editorial pass.
- Avoid absurd distractors (UI color, resource-name length, unrelated services) even if tests pass.
- Avoid overlapping lessons by building on prior content, not renaming the same scenario.

## Verification

Bundled Node executable:
`/Users/khanh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`

Own content-only TypeScript validation passed:
`node node_modules/typescript/bin/tsc --noEmit --skipLibCheck --target es2022 --moduleResolution bundler --module esnext src/content/domain1.ts src/content/domain5.ts`

Run `node src/content/domain1/verify-owned.cjs` for read-only structural verification of
word counts, 20 questions, >=4 multiple, bilingual/rationale lengths, IDs, mappings, anchors,
source URLs and lab/section counts. Latest result: all 10 lessons/200 questions pass.
It does not semantically prove every answer, compile IaC, execute AWS or verify live prices.

Global focused content test last failed in somebody else's file at d2-l07-q19 rationale
length25, after passing current Domain1 content. Do not alter other domains without assignment.

## Important checked current details

- ECR docs now describe mutability exclusions; do not repeat the old absolute assertion
  that no tag exclusions exist (introductory sentence is inconsistent with newer detail).
- CodeDeploy agent docs have 2.x Rust rollout details as of snapshot. Do not claim every
  current agent requires Ruby. Check Region/OS-supported installation rather than hardcoding.
- Correct runbook for S3 versioning: `AWS-ConfigureS3BucketVersioning`, parameters
  `BucketName`, `VersioningState`, `AutomationAssumeRole`; NOT the invented Enable variant.
- Config auto remediation can target currently compliant resources due to stale snapshots.
- EventBridge target DLQ is SQS Standard in same Region; async Lambda handler failures
  after accepted delivery belong to Lambda's error handling, not EventBridge delivery DLQ.

No AWS operations have been executed. Only docs browsing and local file/type/content checks.
Do not touch app/core/package/other domains/git for this bounded assignment.
