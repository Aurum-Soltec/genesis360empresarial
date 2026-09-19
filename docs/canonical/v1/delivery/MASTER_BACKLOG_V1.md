# MASTER BACKLOG V1 - GENESIS 360 EMPRESARIAL

## EPIC-01 Foundation & Canonical
- V1-ST-001 Canonical docs
- V1-ST-002 Feature flags
- V1-ST-003 Auth/tenant active
- V1-ST-004 Cross-tenant RLS
- V1-ST-005 Consent purposes

## EPIC-02 Business Passport
- V1-ST-006 Business facts/provenance
- V1-ST-007 Timeline
- V1-ST-008 Passport UI
- V1-ST-009 Progressive profiling

## EPIC-03 Diagnostic
- V1-ST-010 Question bank/versioning
- V1-ST-011 Applicability/branching
- V1-ST-012 Session/autosave/resume
- V1-ST-013 Rules Engine
- V1-ST-014 Result/pain/evidence

## EPIC-04 Decision/GDS
- V1-ST-015 Pain Finding
- V1-ST-016 Cause hypotheses
- V1-ST-017 Decision Record/GDS

## EPIC-05 Mission
- V1-ST-018 Mission Library
- V1-ST-019 State machine
- V1-ST-020 Evidence
- V1-ST-021 Outcomes
- V1-ST-022 Gamification

## EPIC-06 Qualification
- V1-ST-023 Pain->capability taxonomy
- V1-ST-024 Provider capabilities
- V1-ST-025 Qualification/recertification
- V1-ST-026 Entitlements
- V1-ST-027 Eligibility
- V1-ST-028 Neutral ranking
- V1-ST-029 Qualified solution UI
- V1-ST-030 Consented contact/attribution

## EPIC-07 Agentic
- V1-ST-031 Runtime spike
- V1-ST-032 Context assembly
- V1-ST-033 Council routing
- V1-ST-034 Tool contracts
- V1-ST-035 Budgets/fallback/kill switch
- V1-ST-036 Golden set/evals

## EPIC-08 Ecosystem
- V1-ST-037 Ecosystem membership
- V1-ST-038 Institutional branding
- V1-ST-039 Aggregated dashboard

## EPIC-09 Trust/Data/Admin
- V1-ST-040 Admin/rules/qualification
- V1-ST-041 Audit/correlation
- V1-ST-042 LGPD lifecycle
- V1-ST-043 Data quality/provenance
- V1-ST-044 Benchmark guardrails

## EPIC-10 Production
- V1-ST-045 Observability
- V1-ST-046 Backup/restore/rollback
- V1-ST-047 Security/supply-chain
- V1-ST-048 CI/CD/environments
- V1-ST-049 Performance/a11y
- V1-ST-050 FinOps
- V1-ST-051 E2E
- V1-ST-052 Production Readiness Review

## EPIC-11 UX Light / Taste
### V1-ST-053 Light theme migration - P0
Aceite:
- sem dark global background;
- tokens Genesis Light;
- contraste AA;
- antigo Glass marcado superseded.

### V1-ST-054 Topbar + Context Sidebar - P0
Aceite:
- módulos principais em uma linha desktop;
- submenus laterais;
- mobile collapse explícito.

### V1-ST-055 Manager Dashboard - P0
Aceite:
- sem números fictícios;
- próxima decisão no primeiro viewport;
- Top 3 prioridades;
- Passport/missão/score com empty states.

### V1-ST-056 Product empty/error/loading states - P0
Aceite:
- diagnóstico;
- Passport;
- missões;
- soluções;
- conselho.

### V1-ST-057 Accessibility visual gate - P0
Aceite:
- WCAG 2.2 AA proporcional;
- keyboard/focus;
- touch;
- reduced motion.

### V1-ST-058 Motion system - P1
Aceite:
- CSS motion baseline;
- Motion lib apenas se necessário;
- sem animação decorativa infinita.

### V1-ST-059 Visual regression - P1
Aceite:
- screenshots desktop/tablet/mobile em CI quando toolchain estiver disponível.

## EPIC-12 Product Flow Completion
### V1-ST-060 GDS -> Mission creation - P0
### V1-ST-061 Mission -> Capability recommendation - P0
### V1-ST-062 Qualified provider search API - P0
### V1-ST-063 Contact consent workflow - P0
### V1-ST-064 Outcome closes Passport/Timeline loop - P0

## Definition of Done
Código + testes + contratos + telemetry + docs + rollback/evidence conforme risco.

## EPIC-13 — Foundation Acceleration / Selective OSS

### V1-ST-065 Private RLS helper + explicit grants — P0
Aceite:
- helper fora de exposed schema;
- `search_path=''`;
- user-leading membership index;
- tabela derivada não aceita client write.

### V1-ST-066 Cross-tenant pgTAP harness — P0 BLOCKER
Aceite:
- A lê A;
- A lê zero B;
- A não cria/edita/remove B;
- company/tenant mismatch falha;
- saída `supabase test db` anexada como EVID.

### V1-ST-067 Evidence Ledger — P0
Aceite:
- evidence type/source/confidence/verification/sensitivity/purpose;
- evidence pode suportar/contradizer/contextualizar/verificar;
- agent output nunca nasce verified.

### V1-ST-068 Durable event outbox — P1
Aceite:
- nenhum HTTP em DB trigger;
- atomic event insert;
- lease com `FOR UPDATE SKIP LOCKED`;
- retry/dead-state;
- payload sem documento sensível.

### V1-ST-069 Trusted server write boundary — P0
Aceite:
- service role server-only;
- static check impede segredo fora do módulo;
- derived tables sem write grant autenticado;
- tenant validado antes de admin mutation.

### V1-ST-070 Pydantic AI Slim spike — P1
Aceite:
- exatamente 3 read tools no primeiro spike;
- sem DB credentials;
- 10 golden cases;
- scorecard contra implementação mínima;
- framework não vira source of truth.

### V1-ST-071 Curated DevSecOps skill gates — P1
Aceite:
- RLS, agent abuse, supply chain, privacy e incident readiness;
- zero runtime dependency;
- ofensivo não entra em agente cliente.

## Wave 6 status

- **V1-ST-060 GDS → Mission creation:** IMPLEMENTED BY CONTRACT.
- **V1-ST-061 Mission → Capability:** IMPLEMENTED BY CONTRACT; depende da taxonomia PEND-006.
- **V1-ST-062 Qualified Provider Search API:** IMPLEMENTED, fail-closed.
- **V1-ST-063 Contact Consent Workflow:** IMPLEMENTED, legal copy/version ainda pendente.
- **V1-ST-064 Outcome → Passport/Timeline:** Timeline IMPLEMENTED; Passport somente mapping explícito.
- **V1-ST-072 Provider Network Policy:** IMPLEMENTED; threshold permanece PEND-003.
- **V1-ST-073 Subscription/Plan Gate:** IMPLEMENTED; provider plans permanecem PEND-004.
- **V1-ST-074 Cross-Tenant Sanitized Matching:** IMPLEMENTED.
- **V1-ST-075 Outbox Completion/Retry:** IMPLEMENTED.
- **V1-ST-076 Minimal Agentic Baseline:** IMPLEMENTED for comparison.

## EPIC-14 — Diagnostic Intelligence V1.1
- **V1-ST-077 Question metadata/purpose/applicability:** IMPLEMENTED BY CONTRACT.
- **V1-ST-078 Stable 24-anchor score:** IMPLEMENTED BY CONTRACT.
- **V1-ST-079 31-question high-yield starter path:** IMPLEMENTED BY CONTRACT.
- **V1-ST-080 Adaptive follow-up selector:** IMPLEMENTED BY CONTRACT.
- **V1-ST-081 Progress Engine:** IMPLEMENTED BY CONTRACT.
- **V1-ST-082 Confidence Thermometer:** IMPLEMENTED BY CONTRACT.
- **V1-ST-083 Structured information slots:** IMPLEMENTED FOUNDATION.
- **V1-ST-084 Unknown/N.A./Deferred semantics:** IMPLEMENTED BY CONTRACT.
- **V1-ST-085 Diagnostic resume/idempotent draft:** IMPLEMENTED BY CONTRACT.
- **V1-ST-086 Sector/trait applicability calibration:** IMPLEMENTED FOUNDATION / CALIBRATION PENDING.

## EPIC-15 — Data Submission Governance
- **V1-ST-087 Versioned attestation model:** IMPLEMENTED BY CONTRACT.
- **V1-ST-088 Auditable acceptance event:** IMPLEMENTED BY CONTRACT.
- **V1-ST-089 Governed upload session:** IMPLEMENTED FOUNDATION.
- **V1-ST-090 Copyright/confidentiality/IP warning:** IMPLEMENTED DRAFT COPY.
- **V1-ST-091 GENESIS responsibility disclaimer:** IMPLEMENTED DRAFT COPY.
- **V1-ST-092 Legal/privacy review:** P0 BLOCKER BEFORE ACTIVATION.
- **V1-ST-093 Binary upload security pipeline:** P0 BLOCKER BEFORE ACTIVATION.

## EPIC-16 — Genesis Precision Light
- **V1-ST-094 Portable Design System package:** IMPLEMENTED.
- **V1-ST-095 Route-aware contextual navigation:** IMPLEMENTED.
- **V1-ST-096 Functional mobile drawer:** IMPLEMENTED.
- **V1-ST-097 Executive Home redesign:** IMPLEMENTED.
- **V1-ST-098 Focused Diagnostic redesign:** IMPLEMENTED.
- **V1-ST-099 Interpretation-first Result redesign:** IMPLEMENTED.
- **V1-ST-100 Accessibility/contrast static gate:** IMPLEMENTED.
- **V1-ST-101 Browser visual/accessibility validation:** P0 RUNTIME PENDING.
- **V1-ST-102 Visual regression baseline:** P1 AFTER UX APPROVAL.
- **V1-ST-103 Migrate remaining product surfaces to V2 grammar:** P1 AFTER CANONICAL SCREEN APPROVAL.
