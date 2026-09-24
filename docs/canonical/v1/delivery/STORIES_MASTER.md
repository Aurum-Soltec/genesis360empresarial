# STORIES MASTER — Genesis 360 Empresarial V1.2

Este documento consolida as stories existentes e adiciona stories de produção necessárias para transformar a fundação em release candidate.

Estados `implemented*` indicam implementação existente; não significam prova runtime de produção.

## EPIC-01 Foundation & Canonical

### V1-ST-001 — Canonical docs
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-002 — Feature flags
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-003 — Auth/tenant active
- **Status:** `implemented-runtime-partial-browser-e2e-pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Teste negativo A→B comprova negação de acesso.
  - Least privilege e server boundary permanecem explícitos.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-004 — Cross-tenant RLS
- **Status:** `implemented-runtime-verified`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Teste negativo A→B comprova negação de acesso.
  - Least privilege e server boundary permanecem explícitos.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-005 — Consent purposes
- **Status:** `implemented-legal-ux-pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-02 Business Passport

### V1-ST-006 — Business facts/provenance
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-007 — Timeline
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-008 — Passport UI
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-009 — Progressive profiling
- **Status:** `partial`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-03 Diagnostic

### V1-ST-010 — Question bank/versioning
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-011 — Applicability/branching
- **Status:** `partial-methodology-pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-012 — Session/autosave/resume
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-013 — Rules Engine
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-014 — Result/pain/evidence
- **Status:** `implemented-foundation`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-04 Decision/GDS

### V1-ST-015 — Pain Finding
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-016 — Cause hypotheses
- **Status:** `implemented-schema`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-017 — Decision Record/GDS
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-05 Mission

### V1-ST-018 — Mission Library
- **Status:** `partial-library`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - State machine inválida falha fechado.
  - Evidência/outcome respeitam idempotência e auditabilidade.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-019 — State machine
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - State machine inválida falha fechado.
  - Evidência/outcome respeitam idempotência e auditabilidade.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-020 — Evidence
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - State machine inválida falha fechado.
  - Evidência/outcome respeitam idempotência e auditabilidade.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-021 — Outcomes
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - State machine inválida falha fechado.
  - Evidência/outcome respeitam idempotência e auditabilidade.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-022 — Gamification
- **Status:** `partial`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - State machine inválida falha fechado.
  - Evidência/outcome respeitam idempotência e auditabilidade.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-06 Qualification

### V1-ST-023 — Pain->capability taxonomy
- **Status:** `pending-methodology`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-024 — Provider capabilities
- **Status:** `implemented-schema`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-025 — Qualification/recertification
- **Status:** `pending-methodology`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-026 — Entitlements
- **Status:** `implemented-policy-pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-027 — Eligibility
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-028 — Neutral ranking
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-029 — Qualified solution UI
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-030 — Consented contact/attribution
- **Status:** `partial-contact-implemented-attribution-pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-07 Agentic

### V1-ST-031 — Runtime spike
- **Status:** `spike-scaffolded-not-run`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem credencial de banco no agente.
  - Tool allowlist, budget, timeout e evals estão evidenciados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-032 — Context assembly
- **Status:** `partial`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem credencial de banco no agente.
  - Tool allowlist, budget, timeout e evals estão evidenciados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-033 — Council routing
- **Status:** `pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem credencial de banco no agente.
  - Tool allowlist, budget, timeout e evals estão evidenciados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-034 — Tool contracts
- **Status:** `partial-read-tools`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem credencial de banco no agente.
  - Tool allowlist, budget, timeout e evals estão evidenciados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-035 — Budgets/fallback/kill switch
- **Status:** `pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem credencial de banco no agente.
  - Tool allowlist, budget, timeout e evals estão evidenciados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-036 — Golden set/evals
- **Status:** `seeded-not-run`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem credencial de banco no agente.
  - Tool allowlist, budget, timeout e evals estão evidenciados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-08 Ecosystem

### V1-ST-037 — Ecosystem membership
- **Status:** `pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-038 — Institutional branding
- **Status:** `pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-039 — Aggregated dashboard
- **Status:** `pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-09 Trust/Data/Admin

### V1-ST-040 — Admin/rules/qualification
- **Status:** `pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-041 — Audit/correlation
- **Status:** `partial`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-042 — LGPD lifecycle
- **Status:** `partial`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-043 — Data quality/provenance
- **Status:** `implemented-foundation`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-044 — Benchmark guardrails
- **Status:** `pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-10 Production

### V1-ST-045 — Observability
- **Status:** `pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-046 — Backup/restore/rollback
- **Status:** `pending-blocker`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - RTO/RPO alvo registrado.
  - Restore executado e evidência anexada.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-047 — Security/supply-chain
- **Status:** `partial`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Scan gera artefato rastreável.
  - Achados críticos/altos são resolvidos ou aceitos formalmente.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-048 — CI/CD/environments
- **Status:** `baseline-existing`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-049 — Performance/a11y
- **Status:** `partial`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-050 — FinOps
- **Status:** `docs-only`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-051 — E2E
- **Status:** `partial-db-e2e-browser-pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-052 — Production Readiness Review
- **Status:** `pending-blocker`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-11 UX Light / Taste

### V1-ST-053 — Light theme migration
- **Status:** `implemented`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-054 — Topbar + Context Sidebar
- **Status:** `implemented`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-055 — Manager Dashboard
- **Status:** `implemented`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-056 — Product empty/error/loading states
- **Status:** `partial`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-057 — Accessibility visual gate
- **Status:** `runtime-pending`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-058 — Motion system
- **Status:** `partial`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-059 — Visual regression
- **Status:** `pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-12 Product Flow Completion

### V1-ST-060 — GDS -> Mission creation
- **Status:** `implemented`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - State machine inválida falha fechado.
  - Evidência/outcome respeitam idempotência e auditabilidade.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-061 — Mission -> Capability recommendation
- **Status:** `implemented-taxonomy-pending`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - State machine inválida falha fechado.
  - Evidência/outcome respeitam idempotência e auditabilidade.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-062 — Qualified provider search API
- **Status:** `implemented-fail-closed`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-063 — Contact consent workflow
- **Status:** `implemented-legal-copy-pending`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-064 — Outcome closes Passport/Timeline loop
- **Status:** `implemented-timeline-passport-explicit-only`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-13 — Foundation Acceleration / Selective OSS

### V1-ST-065 — Private RLS helper + explicit grants
- **Status:** `implemented`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Teste negativo A→B comprova negação de acesso.
  - Least privilege e server boundary permanecem explícitos.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-066 — Cross-tenant pgTAP harness
- **Status:** `implemented-runtime-verified`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Teste negativo A→B comprova negação de acesso.
  - Least privilege e server boundary permanecem explícitos.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-067 — Evidence Ledger
- **Status:** `implemented`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-068 — Durable event outbox
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-069 — Trusted server write boundary
- **Status:** `implemented`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-070 — Pydantic AI Slim spike
- **Status:** `spike-scaffolded-not-run`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem credencial de banco no agente.
  - Tool allowlist, budget, timeout e evals estão evidenciados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-071 — Curated DevSecOps skill gates
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-072 — Provider Network Policy:** IMPLEMENTED; threshold permanece PEND-003.
- **Status:** `implemented-threshold-pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-073 — Subscription/Plan Gate:** IMPLEMENTED; provider plans permanecem PEND-004.
- **Status:** `implemented-plan-decision-pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-074 — Cross-Tenant Sanitized Matching:** IMPLEMENTED.
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Teste negativo A→B comprova negação de acesso.
  - Least privilege e server boundary permanecem explícitos.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-075 — Outbox Completion/Retry:** IMPLEMENTED.
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-076 — Minimal Agentic Baseline:** IMPLEMENTED for comparison.
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem credencial de banco no agente.
  - Tool allowlist, budget, timeout e evals estão evidenciados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-14/15 Wave 7

### V1-ST-077 — Question metadata/purpose/applicability
- **Status:** `implemented-by-contract`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-078 — Stable 24-anchor score
- **Status:** `implemented-by-contract`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Score, coverage e confidence não são misturados.
  - Unknown/N.A. preservam semântica canônica.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-079 — 31-question high-yield starter path
- **Status:** `implemented-by-contract`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-080 — Adaptive follow-up selector
- **Status:** `implemented-by-contract`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-081 — Progress Engine
- **Status:** `implemented-by-contract`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-082 — Confidence Thermometer
- **Status:** `implemented-by-contract`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-083 — Structured information slots
- **Status:** `implemented-foundation`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-084 — Unknown/N.A./Deferred semantics
- **Status:** `implemented-by-contract`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-085 — Diagnostic resume/idempotent draft
- **Status:** `implemented-by-contract`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Score, coverage e confidence não são misturados.
  - Unknown/N.A. preservam semântica canônica.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-086 — Sector/trait applicability calibration
- **Status:** `calibration-pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-087 — Versioned attestation model
- **Status:** `implemented-by-contract`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem attestation ativa/válida o fluxo falha fechado.
  - Retenção, scan e acesso seguem governança aprovada.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-088 — Auditable acceptance event
- **Status:** `implemented-by-contract`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-089 — Governed upload session
- **Status:** `implemented-foundation`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem attestation ativa/válida o fluxo falha fechado.
  - Retenção, scan e acesso seguem governança aprovada.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-090 — Copyright/confidentiality/IP warning
- **Status:** `draft-copy`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-091 — GENESIS responsibility disclaimer
- **Status:** `draft-copy`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-092 — Legal/privacy review
- **Status:** `p0-blocker`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-093 — Binary upload security pipeline
- **Status:** `p0-blocker`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem attestation ativa/válida o fluxo falha fechado.
  - Retenção, scan e acesso seguem governança aprovada.
  - Scan gera artefato rastreável.
  - Achados críticos/altos são resolvidos ou aceitos formalmente.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-16 Genesis Precision Light

### V1-ST-094 — Portable Design System package
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-095 — Route-aware contextual navigation
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-096 — Functional mobile drawer
- **Status:** `implemented-static-verified`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-097 — Executive Home redesign
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-098 — Focused Diagnostic redesign
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Score, coverage e confidence não são misturados.
  - Unknown/N.A. preservam semântica canônica.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-099 — Interpretation-first Result redesign
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-100 — Accessibility/contrast static gate
- **Status:** `implemented`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-101 — Browser visual/accessibility validation
- **Status:** `completed-local-critical-flows`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-102 — Visual regression baseline
- **Status:** `partial-local-baseline-full-suite-pending`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-103 — Remaining surface migration
- **Status:** `p1-after-canonical-approval`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-17 Production Readiness & Repository

**Rechecagem HSP-4 em 2026-09-24 UTC:** os estados completed abaixo que
descrevem a revisão de 20/09 são históricos. O artefato funcional
bb290bc7bc35f77b4ca01aecdbf19b748c386270 passou CI e web/worker no
staging. O convite passou e-mail, callback, sessão e vínculo member apenas no
Tenant A; o proprietário confirmou definição de senha e acesso, mas **não**
logout seguido de novo login. A migration 0024 passou 12/12 SQL e 12/12 HTTP
multi-role com limpeza. O FULL de 55 respostas, score 48 e relatório foi
repetido no mesmo SHA, com zero documentos vinculados/verificados. A issue
#27 passou falha sintética, aviso por e-mail, ACK e recuperação. Backup privado
run 35945384891 criou release cifrada imutável e restore lógico isolado de
102 tenants/16 Auth/24 migrations em 37,476 s de drill local, **não** RTO de
serviço. O export/restore omite owners/ACLs; faltam equivalência de permissões,
agendamento, retenção, RPO/RTO de serviço, custódia independente e aceite do
controle autogerido. Scanner de licença CI no candidato posterior 0c6dc1a,
não no runtime bb290bc, deixou 30 itens para revisão, incluindo LGPL. O
primeiro run de carga terminou aos 998 s com dez erros; o retry no mesmo
runtime, run 662855c2dbd5, **concluiu 3.604 s**, 100/100 tenants, 24.512
requests, 5.806 escritas, 584 negações esperadas e zero erros inesperados.
Outbox 5.806/5.806 processados, zero pending/dead/retries, worker p95
3.476,20 ms. Duração, isolamento sintético e outbox passaram; p95 login
1.964,5 ms, Home 1.055,48 ms, escrita 1.024,5 ms e leitura 793,8 ms
**falharam** contra 750 ms. Railway Virgínia/Supabase São Paulo foi provado,
sem parcela de latência isolada. HSP-4 permanece **NO-GO**; PILOT-1 não começou.
### V1-ST-104 — Bootstrap do novo repositório GitHub
- **Status:** `completed-remote-repository`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Remote correto configurado.
  - Branch principal protegida e CI obrigatória documentada.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-105 — Bootstrap limpo das migrations 0001→0023
- **Status:** `completed-hosted-runtime-limited`
- **Limite da rechecagem:** o bootstrap limpo `0001`–`0023` é histórico; `0024`
  foi aplicada append-only no banco hospedado, sem novo bootstrap destrutivo.
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-106 — Executar pgTAP tenancy/RBAC/governance completo
- **Status:** `completed-hosted-runtime-limited`
- **Limite da rechecagem:** os 95/95 pgTAP hospedados precedem `0024`. A nova
  política foi testada no staging com 12/12 assertions SQL sob papéis
  `authenticated` de membro, gestor, proprietário e outro tenant, em transação
  revertida. Não chamar essa execução de pgTAP hospedado.
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Teste negativo A→B comprova negação de acesso.
  - Least privilege e server boundary permanecem explícitos.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-107 — Full lint + TypeScript 6 + Vitest + Next build
- **Status:** `completed-remote-ci`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-108 — E2E browser do happy path empresarial
- **Status:** `completed-hosted-runtime-limited`
- **Rechecagem:** novo FULL na UI hospedada do SHA `bb290bc`:
  55 respostas, score 48, cobertura 100% e confiança 78%. O relatório novo
  não tem fonte vinculada ou verificada; isso comprova questionário→relatório
  naquele SHA, não conclusão sustentada por documento. O fluxo afetado foi
  repetido no artefato hospedado, mas a prova documental real segue pendente.
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-109 — E2E adversarial cross-tenant e permissions
- **Status:** `completed-hosted-runtime-limited`
- **Rechecagem:** 12/12 assertions de RLS no banco hospedado após `0024`
  preservaram a separação de membro, gestor e outro tenant; no SHA `bb290bc`,
  três sessões Auth HTTP distintas desses papéis passaram 12/12 assertions
  pelas APIs de fatos, Timeline e tenant ativo, com limpeza do fixture.
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Teste negativo A→B comprova negação de acesso.
  - Least privilege e server boundary permanecem explícitos.
  - State machine inválida falha fechado.
  - Evidência/outcome respeitam idempotência e auditabilidade.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-110 — Backup/restore/rollback drill
- **Status:** `partial-hosted-logical-pass-managed-backup-rpo-pending`
- **Rechecagem:** o restore lógico histórico de dataset pequeno foi superado
  por uma subprova manual real: workflow privado `7e6a54e`, run `35945384891`
  PASS, release cifrada imutável e restore isolado de 102 tenants, 16 Auth,
  zero objetos Storage e 24 migrations. Banco e verificações levaram 32,241 s;
  drill local após download levou 37,476 s, **não** RTO de serviço. Faltam
  agendamento, 30 dias de retenção, RPO/RTO de serviço, chave fora do mesmo
  computador e aceite formal do controle equivalente. Gate BLOCKED.
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - RTO/RPO alvo registrado.
  - Restore executado e evidência anexada.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-111 — SBOM + license + dependency + secret/security scans
- **Status:** `partial-ci-sbom-pass-lgpl-disposition-blocked`
- **Rechecagem:** o SBOM Linux do CI anterior lista 455 entradas, incluindo
  `@img/sharp-libvips-linux-x64` sob `LGPL-3.0-or-later`. O scanner de licenças
  passou no candidato `0c6dc1a`, mas gerou 30 itens para revisão. Inventário
  e scanner não são aceite jurídico, NOTICE completo ou inspeção byte a byte
  do bundle Railway.
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Scan gera artefato rastreável.
  - Achados críticos/altos são resolvidos ou aceitos formalmente.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-112 — Observabilidade e correlation IDs ponta a ponta
- **Status:** `partial-monitor-drill-alert-delivery-ack-pass-continuous-observation-pending`
- **Rechecagem:** issue #27 registrou falha sintética e recuperação;
  o operador recebeu e-mail, comentou ACK humano e a issue foi fechada.
  O comentário público foi sanitizado após trazer notificação citada; cache
  externo residual não pode ser descartado. Drill de alerta PASS; observação
  contínua e recuperação de backup permanecem em gates separados. No segundo
  run bb290bc de 3.604 s, 5.806 eventos sintéticos do outbox foram
  processados; zero pending/dead/retries, worker latency p95 3.476,20 ms.
  O SLO HTTP de 750 ms ainda falhou; pool/slow-query e custo marginal seguem
  sem série completa.
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-113 — Configurar dev/staging/prod e promoção controlada
- **Status:** `completed-hosted-staging-and-remote-ci`
- **Rechecagem:** CI quality/database/CodeQL PASS e web/worker Railway
  `SUCCESS` no mesmo SHA `bb290bc7bc35f77b4ca01aecdbf19b748c386270`.
  O ambiente Railway chamado `production` é o projeto dedicado de staging;
  isso não é promoção à produção aberta.
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-18 Activation Decisions

### V1-ST-114 — Aprovar e ativar versão jurídica de Data Submission Attestation
- **Status:** `planned-production`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - State machine inválida falha fechado.
  - Evidência/outcome respeitam idempotência e auditabilidade.
  - Sem attestation ativa/válida o fluxo falha fechado.
  - Retenção, scan e acesso seguem governança aprovada.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-115 — Implementar pipeline seguro de upload binário
- **Status:** `foundation-implemented-scanner-and-activation-pending`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem attestation ativa/válida o fluxo falha fechado.
  - Retenção, scan e acesso seguem governança aprovada.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-116 — Fechar metodologia de qualification e thresholds
- **Status:** `planned-production`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-117 — Fechar provider-plan eligibility
- **Status:** `planned-production`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Plan tier não altera ranking.
  - Policy/threshold ausente não exibe provider.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-118 — Calibrar confidence engine com empresas piloto
- **Status:** `planned-production`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-119 — Calibrar applicability setorial/operating traits
- **Status:** `planned-production`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-120 — Executar spike Minimal vs Pydantic AI Slim
- **Status:** `planned-production`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Sem credencial de banco no agente.
  - Tool allowlist, budget, timeout e evals estão evidenciados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-121 — Migrar superfícies restantes para Precision Light V2
- **Status:** `planned-production`
- **Prioridade:** `P1`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - Desktop/tablet/mobile verificados.
  - Keyboard/focus/WCAG 2.2 AA validados.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

## EPIC-17 Production Readiness & Repository

### V1-ST-122 — Production Readiness Review e release candidate
- **Status:** `hsp4-prr-closed-no-go-objective-fixes`
- **Histórico:** a revisão de 20/09 concluiu NO-GO. A revisão nova ainda
  aguarda os gates operacionais e relatório A–T; não há GO para piloto.
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.

### V1-ST-123 — Piloto controlado com rollout/rollback
- **Status:** `planned-not-started`
- **Prioridade:** `P0`
- **Source:** `docs/canonical/v1/delivery/STORIES_MASTER.md`
- **Critérios de aceite:**
  - Contrato/decisão canônica permanece consistente.
  - Testes proporcionais ao risco são definidos e executados quando o ambiente permitir.
  - Nenhum dado fake é introduzido em superfície de produção.
  - Documentação/traceabilidade são atualizadas.
  - RTO/RPO alvo registrado.
  - Restore executado e evidência anexada.
- **Evidência esperada:** PR/commit + testes/logs/screenshots/SQL output conforme risco.
- **Rollback:** obrigatório quando houver migration, configuração, segurança ou mudança de fluxo crítico.
