# OSS Due Diligence — 2026-08-28

## Decision principle
A repository enters the core only when it removes more Genesis complexity than it adds.

| Repository | Decision | Genesis use |
|---|---|---|
| Paperclip | DEFER / dev-only candidate | agent-team control plane only if internal development later proves need |
| Hermes Agent | DEFER / R&D | not product runtime |
| Agno SDK | FALLBACK | agentic spike fallback |
| Agno AgentOS | REJECT V1 | duplicates auth/API/DB/runtime/control-plane concerns |
| trycompai/crm | ADOPT PATTERN | evidence ledger + no-DB-agent boundary |
| DeskcommCRM | ADOPT PATTERN | RLS invariants + durable event/worker pattern |
| Aureus ERP | INTEGRATION ONLY | external qualified solution/connector |
| ScrapeGraphAI | DEFER | governed enrichment adapter only if need appears |
| Cybersecurity Skills | ADOPT CURATED | internal DevSecOps checklists, zero runtime |
| Semantica | DEFER | possible future Outcome Graph read model |
| Forms.md | CONCEPT ONLY | branching DSL inspiration; no second form engine |
| Pydantic AI Slim | SPIKE PREFERRED | isolated agentic SDK candidate |
| Temporal | DEFER | only after durable-workflow complexity trigger |
| OPA | DEFER | only after policy logic becomes distributed |

## Current implementation
This Wave implements only low-complexity gains:
1. Supabase pgTAP cross-tenant harness.
2. private RLS helper + explicit grants.
3. Evidence Ledger.
4. durable Postgres outbox + atomic leasing.
5. DB mission state invariant.
6. trusted server/service-role boundary.
7. curated security review pack.
8. isolated `pydantic-ai-slim` spike.

No CRM, ERP, Temporal, OPA, Graph DB, Paperclip, Hermes, AgentOS, scraping platform or second form engine is added to production runtime.

## External source baseline
- Supabase RLS/testing docs: official Supabase documentation, checked 2026-08-28.
- Pydantic AI install/docs: official Pydantic docs; `pydantic-ai-slim 2.33.0`, release 2026-08-21, MIT.
- DeskcommCRM: official GitHub repository.
- trycompai/crm: official GitHub repository.
- Anthropic-Cybersecurity-Skills: community repository `mukul975`, Apache-2.0.

Exact commit/tag + SBOM remains required before vendoring any external code. This Wave vendors no external runtime code.
