# Production Acceptance Matrix

| Gate | Evidence | Blocking? |
|---|---|---:|
| Repository | main + CI + remote + protected workflow | Yes |
| Migrations | bootstrap 0001→0012 PASS | Yes |
| RLS | tenant A/B SELECT/INSERT/UPDATE/DELETE negative tests | Yes |
| RBAC | role matrix pgTAP | Yes |
| Contracts | OpenAPI/static contracts PASS | Yes |
| Type safety | TypeScript 6 typecheck PASS | Yes |
| Unit | Vitest PASS | Yes |
| Build | Next production build PASS | Yes |
| E2E | onboarding→diagnostic→decision→mission→outcome | Yes |
| Security | secret/dependency/SBOM/security scan | Yes |
| Recovery | backup/restore drill | Yes |
| UX | desktop/tablet/mobile + WCAG runtime | Yes |
| Privacy | purpose/consent/attestation reviewed | Yes |
| Upload | scan/storage/retention before enablement | Conditional |
| Qualification | threshold/methodology/plan decisions | Conditional |
| Agentic | spike/evals/budget/kill switch | Conditional |
| Observability | traces/logs/metrics/alerts | Yes |
| FinOps | budget + cost drivers + alert threshold | Yes |
| Pilot | rollback + cohort + success criteria | Yes |

Conditional = only blocks if the feature will be enabled in that release.
