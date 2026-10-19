# Domain 2 and 3 authoring progress

Scope: 13 Domain 2 lessons (17–29) and 11 Domain 3 lessons (30–40), 20 original bilingual questions per lesson. No AWS actions were run.

Completed: d2-l01, d2-l02 and d3-l01 (20 questions each; multiple-response counts respectively 5, 4, 5). Targeted TypeScript compilation passed. Section word counts respectively 1152, 1158, 1229; all review-section links resolve. Official task outline and CloudFormation lifecycle, drift, protection, composition, parameters, conditions, ImportValue and current GetStackOutput documentation were browsed on 2026-10-19. Domain 3 sources also include Well-Architected availability, DR objectives, static stability, bulkheads and resilience testing.

Also completed: d2-l03 (20 authored questions, four multiple response questions). Sources reviewed: CDK constructs/bootstrap, SAM, Service Catalog concepts/launch constraints, CloudFormation Hooks and Guard. Offline Guard lab has not been executed and its rule must be verified before claiming it passes.

Next Domain 2: d2-l04 StackSets; l05 drift/import/rollback; l06 AppConfig/configuration strategy; l07 Organizations and account provisioning; l08 Control Tower/Account Factory; l09 cross-account IAM and guardrails; l10 Systems Manager fleet inventory/run command; l11 State Manager and patching; l12 Automation runbooks; l13 Lambda/Step Functions at scale.

Breadth-first addition completed: d2-l07 (Task 2.2, lesson 23), 20 original questions, four multiple-response. Browsed Organizations account creation, SCP scope/evaluation, cross-account access role, and multi-account guidance. Next requested breadth unit: d2-l10, then d3-l05 and d3-l09.

Also completed: d2-l10 (Task 2.3, lesson 26), 20 original bilingual questions, four multiple-response. Current SSM Agent/network, default host management, Run Command rate/status and Inventory sync docs reviewed. Next requested breadth unit is d3-l05 (Task 3.2, number 34), followed by d3-l09 (Task 3.3, number 38). Earlier question distractors still require a professional-plausibility polish; do that before final handoff.

Also completed: d3-l05 (Task 3.2, number 34), 20 original bilingual questions, four multiple-response. Reviewed official Auto Scaling target tracking, metric selection, warmup, grace period, lifecycle hooks, scheduled/predictive and SQS scaling guidance. Next requested breadth unit: d3-l09.

Also completed: d3-l09 (Task 3.3, number 38), 20 original bilingual questions, four multiple-response. Reviewed official DR strategy, objectives, business continuity and testing guidance. Both domains now represent every task, with only fully authored lessons exported.

Remaining Domain 2 IDs: l04, l05, l06, l08, l09, l11, l12, l13. Remaining Domain 3 IDs: l02, l03, l04, l06, l07, l08, l10, l11. Next authoring unit after quality pass: d2-l04.

Next Domain 3: l02 load balancing/multi-AZ compute; l03 stateful high availability; l04 multi-Region routing/replication; l05 EC2 Auto Scaling; l06 queues/backpressure/caching; l07 ECS/EKS scaling; l08 serverless scaling; l09 RTO/RPO and DR strategies; l10 AWS Backup/cross-Region recovery; l11 recovery orchestration and game days.

Chapter IDs use the exact official task strings, such as 2.1 and 3.3.

Verification remaining: TypeScript/content validation under the parent application's scripts; a complete language and technical review of all questions; manual lab execution has deliberately not been performed.
