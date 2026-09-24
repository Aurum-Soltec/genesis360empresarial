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

**Estado canônico, fonte `6dff3c9` enviada ao staging (2026-09-24 UTC): NO-GO.** Os PRs #30/#31/#32 foram integrados e CI passou. Uploads CLI da fonte local limpa deram SUCCESS em web `2e2690bd` e worker `56740353`, com digests; Railway `meta.commitHash=null` limita a atestação nativa do SHA. FULL fictício no predecessor `5b992d3` concluiu 52 respostas, score 51, confiança 78%, três fontes contextuais não verificadas e cockpit 7/7. SQL-only de 0024 passou por workflows privados fail-closed `36031065644` e `36035020570` pinado à nova fonte, sem leitura independente dos JSONs privados; HTTP Auth membro/gestor/outro tenant continua pendente. Source→target sintético passou sem dados reais; backup automático, restore real, RPO/RTO, retenção e alerta de backup com ACK não receberam PASS. O último soak 100×60 falhou p95 ≤750 ms; dois GETs Home no novo web deram 200 em 2.287/14 ms, sem evento `home_latency` filtrado ou medição causal. NOTICE e decisão OSS seguem BLOCKED, sem inspeção de bytes equivalente das novas imagens. `V1-ST-110`, `V1-ST-111` e `V1-ST-122` permanecem abertas; `V1-ST-123` não iniciou. Evidência: `docs/audit-2026-09-24/HSP4_CURRENT_REVIEW_6DFF3C9_2026-09-24.md`.

**Registro histórico após promoção de `31df6086` (2026-09-24 UTC): NO-GO.** O PR #25 integrou `31df6086cb612886dc5db4a45b946ea80dde2cf1`; CI final e deployments web/worker no mesmo SHA passaram. O smoke hospedado limitou-se a negativas anônimas, Tenant A autenticado, administração/Passport/demo/relatório existentes e quatro destinos de navegação. A demo mostrou 6/7 etapas, com zero fontes vinculadas/verificadas. O login convidado passou. O FULL corrigido, 0024 SQL/HTTP multi-role e 100 empresas/60 min **não foram repetidos nesse SHA**. A carga integral anterior falhou p95 ≤750 ms. Backup de serviço/RPO/RTO/automação e NOTICE/disposição jurídica seguem BLOCKED. A inspeção read-only dos serviços do SHA promovido comparou 30/30 pacotes em revisão com o CI Linux do mesmo SHA, sem divergência de hash agregado; não representa aceite das licenças. A correção contextual da demo e instrumentação adicional da Home eram **somente locais nessa revisão histórica**. O runner sintético anterior não selecionou tenant, mas a UI posterior mostrou Tenant A para uma das mesmas contas; causa não estabelecida. Evidência: `docs/audit-2026-09-24/HSP4_CORRECTIVE_GO_NO_GO_2026-09-24.md`.

**Revisão corretiva anterior de 2026-09-24 UTC (histórica):** o novo login convidado passou; backup v2 capturou 129 entradas ACL e restore lógico 102 tenants/16 Auth/24 migrations em 77,450 s. PRs #6/#7 foram integradas como preparação, sem restore de serviço/RPO/RTO/schedule/retenção/chave independente. O run 100×60 anterior falhou p95. O CI Linux do `40b9b82` classificou 9/30 itens de licença na árvore de produção, sem bytes do contêiner ou decisão LGPL/CC-BY.

**Registro anterior HSP-4 em 2026-09-24 UTC (histórico):** os estados completed abaixo que
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
serviço. O export v1 omitiu ACL por `--no-privileges`, e o restore v1 pulou owners/ACLs; `pg_dump --no-owner` não remove owner do arquivo customizado. Faltam equivalência de permissões,
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
- **Revisão após promoção:** o predecessor público `40b9b82` passou CI e reportou 503 Vitest/34 testes nativos no check local. O último commit com código `6d4d569` no PR #25 incorpora instrumentação/runner; seu run local histórico relatou 506 Vitest/34 nativos, lint, tipos, segurança e build; quality/database/CodeQL/Analyze finais passaram nos runs `36009033246` e `36009024373`. A configuração Vitest da contagem histórica não excluía `tmp`, portanto a contagem não é comparável à suíte local limpa atual de 49 arquivos/181 testes PASS. O merge `31df6086` está em web e worker do staging. O crédito runtime do novo SHA limita-se ao smoke; testes integrais afetados ainda pendem.
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
- **Estado atual:** FULL fictício em UI hospedada no `5b992d3` passou 52 respostas, score 51, cobertura 100%, confiança 78% e cockpit 7/7 com três fontes contextuais, zero referências por resposta e zero fontes verificadas. É prova do fluxo demonstrativo naquele SHA, não de análise documental real nem de novo FULL na fonte `6dff3c9` enviada ao staging. A flag de upload real continua OFF. Evidência: `docs/audit-2026-09-24/HSP4_HOSTED_FULL_DEMO_5B992D3_2026-09-24.md`.
- **Rechecagem anterior no `bb290bc` (histórica):** novo FULL na UI hospedada desse SHA:
  55 respostas, score 48, cobertura 100% e confiança 78%. O relatório novo
  não tem fonte vinculada ou verificada; isso comprova questionário→relatório
  naquele SHA, não conclusão sustentada por documento. O fluxo afetado foi
  repetido no artefato hospedado, mas a prova documental real segue pendente.
  O roteiro sintético corrigido teve reteste hospedado tentado com duas contas:
  Auth PASS, zero opções de tenant, nenhuma escrita e nenhum relatório novo;
  a proveniência corrigida permanece PENDING em runtime. Após a promoção,
  a UI autenticada encontrou Tenant A para uma dessas contas; a divergência
  com o runner não tem causa demonstrada. O relatório existente mostrou
  55 respostas e zero referências/fontes vinculadas/verificadas; não é um
  novo FULL no SHA `31df6086`.
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
- **Estado atual:** SQL-only de 0024 passou nos workflows privados `36031065644` (`ff864213`) e `36035020570` (pinado à fonte `6dff3c9`), com validador que exige 12 casos nomeados, contagens e rollback `[0,0,1,0]`; execução e upload concluíram SUCCESS. Os JSONs privados não foram inspecionados independentemente pelo agente devido à revisão automática. PR privada #19 integrou runner HTTP manual; ensaio local isolado passou três logins reais GoTrue e zero resíduos em 11 categorias, **sem run hospedado**. O proprietário deve configurar `STAGING_SUPABASE_ANON_KEY` diretamente na Actions privada; este subgate SQL recebe PASS limitado, HTTP membro/gestor/outro tenant segue PENDING no novo deployment, cuja metadata Railway tem `commitHash=null`.
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
- **Status:** `partial-private-v2-manual-logical-pass-service-rpo-rto-pending`
- **Estado atual:** PR privada #15/run `36030761200` concluiu SUCCESS o ensaio source→target **sintético**, sem credenciais/backup real de staging. A PR privada #18 integrou apenas preflight de release imutável controlada pelo operador (identidade/idade de owner, tmpfs sem swap, release privada, cifra/ACL/Storage e loopback), com 8 testes focados e suíte 70 PASS/1 symlink SKIP no Windows, **sem chave ou backup real**. A PR privada #20 integrou guarda de retenção no SHA `c3adbe3c` após 77 testes sintéticos: release imutável desta execução baixada/hash verificado/mais recente antes de poda, com listagem malformada falhando fechado. Isso prepara o drill, não comprova restore real de Auth/API/worker/Storage, ACL/owner equivalentes, RPO/RTO, cron ativo/retenção observada de 30 dias ou custódia independente. A PR privada #21 integrou monitor com 88 testes sintéticos e dry-run 36039829373 SUCCESS, mas cron OFF, sem leitura de release real, sem issue e no mesmo domínio de falha GitHub Actions do backup; isso não fecha alerta independente nem RPO/RTO. A issue privada #17 de alerta ainda aguarda ACK. Evidência sanitizada: `docs/audit-2026-09-24/HSP4_PRIVATE_SYNTHETIC_AND_SQL_METADATA_2026-09-24.md`.
- **Revisão corretiva:** run privado v2 `36002104320` com release cifrada imutável e 129 entradas ACL no TOC; restore lógico isolado 102 tenants, 16 Auth, zero Storage, 24 migrations em 77,450 s após download. PR #7 de cron guardado integrada no SHA privado `051a76d`, mas variáveis de ativação/atestação ausentes mantêm schedule OFF; PR #6 de scaffold de serviço integrada no SHA `10214da`, com 34 testes locais PASS e um symlink SKIP no Windows, sem restore de serviço executado. Aplicação/equivalência de owners/ACL, serviço HTTP/Auth/Storage/worker, backup agendado, 30 dias, RPO/RTO e custódia independente ainda BLOCKED. GitHub Actions US$0/Stop usage foi confirmado, mas a cota compartilhada pode impedir backup futuro.
- **Boot isolado posterior:** PR privada #11 integrada no SHA `987964fc`; run manual `36020411581` em Ubuntu passou stack vazia, saúde/identidade dos serviços, portas somente no loopback, recursos disponíveis e cleanup. Boot/saúde 120 s **não é RTO**; nenhum backup, plaintext ou credencial do staging foi usado. A viabilidade do bootstrap isolado passou, mas a história segue aberta para restore com dados, ACL/RLS, serviço fim a fim, RPO/RTO, schedule/retenção e chave independente. Evidência: `docs/audit-2026-09-24/HSP4_PRIVATE_SYNTHETIC_STACK_BOOT_2026-09-24.md`.
- **Rechecagem anterior (histórica):** o restore lógico histórico de dataset pequeno foi superado
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
- **Status:** `partial-deployed-package-bytes-pass-notice-legal-blocked`
- **Estado atual:** a inspeção dos 30 pacotes foi repetida no deployment `25c022d8`, com hashes de pacote iguais ao CI daquele SHA. O pacote técnico `docs/audit-2026-09-24/HSP4_OSS_NOTICE_REVIEW_31df6086/NOTICE_INDEX.md` ajuda a revisão, mas não constitui NOTICE final nem decisão LGPL/CC-BY/MPL. Os bytes das novas imagens web/worker enviadas da fonte `6dff3c9` ainda requerem vínculo ao artefato exato; gate jurídico permanece BLOCKED.
- **Revisão corretiva:** commit público `40b9b82` no PR #25 classifica 9/30 declarações fora da preferência ADR-015 na árvore `pnpm --prod` e 21 fora dela. O CI Linux do SHA promovido `31df6086` (run `36009447882`) e a inspeção read-only dos dois contêineres Railway confirmaram presença e hashes agregados iguais dos 30/30 pacotes em revisão; os 21 fora da árvore `pnpm --prod` também estão fisicamente instalados. `@img/sharp-libvips-linux-x64` LGPL está presente em ambos. Isso não é hash da imagem inteira nem aceite jurídico. Três pacotes não trazem LICENSE/NOTICE local; NOTICE completo, condições/fontes aplicáveis, decisão LGPL/CC-BY/MPL e exceções aprovadas com bloqueio no CI seguem pendentes. Gate BLOCKED. Evidência: `docs/audit-2026-09-24/HSP4_DEPLOYED_LICENSE_BYTES_31df6086.md`.
- **Rechecagem anterior (histórica):** o SBOM Linux do CI anterior lista 455 entradas, incluindo
  `@img/sharp-libvips-linux-x64` sob `LGPL-3.0-or-later`. O scanner de licenças
  passou no candidato `0c6dc1a`, mas gerou 30 itens para revisão. Inventário
  e scanner não são aceite jurídico, NOTICE completo ou inspeção byte a byte
  do bundle Railway; a inspeção posterior dos 30 pacotes no SHA `31df6086` supera somente essa lacuna técnica.
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
- **Estado atual:** a issue pública #27 comprovou falha/recuperação, aviso por e-mail e ACK humano. O drill de alerta **específico do backup privado**, run `36031382116`, abriu a issue privada #17, mas ainda aguarda notificação externa, ACK humano e recuperação comprovados; a prova geral da issue não substitui esse subgate. O PR público #32 passou CI e seu código foi enviado por CLI ao staging a partir de fonte local limpa `6dff3c9`; dois GETs Home autenticados retornaram 200 em 2.287/14 ms, sem eventos `home_latency` nos logs filtrados. A revisão automática impediu filtro mais amplo de logs por possível conteúdo sensível. Não há série hospedada de fases, causa identificada nem correção de p95.
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
  `SUCCESS` no mesmo SHA histórico `bb290bc7bc35f77b4ca01aecdbf19b748c386270`.
  O PR #25 foi integrado em `31df6086cb612886dc5db4a45b946ea80dde2cf1`;
  quality/database/CodeQL/Analyze e ambos os deployments novos passaram
  nesse mesmo SHA.
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
- **Revisão vigente da fonte `6dff3c9`:** [relatório A–T](../../../audit-2026-09-24/HSP4_CURRENT_REVIEW_6DFF3C9_2026-09-24.md) mantém **NO-GO**. Web/worker CLI SUCCESS com digests, mas `meta.commitHash=null` limita atestação nativa. Demo fictícia 7/7 passou no predecessor; SQL-only 0024 passou no workflow pinado à fonte atual, sem inspeção independente do JSON; HTTP multi-role, backup/restore/RPO-RTO, alerta de backup, licença final e 100×60 p95 ≤750 ms seguem abertos. Nenhum crédito de piloto/produção aberta ou Wave posterior à HSP-4. As evidências históricas abaixo pertencem ao `31df6086`.
- **Revisão após promoção:** relatório A–T de 24/09 permanece NO-GO. PR #25 integrado em `31df6086` e web/worker SUCCESS no mesmo SHA; smoke autenticado limitado e negativas anônimas passaram. Novo FULL, matriz multi-role e run 100×60 não foram repetidos; p95 do último run segue FAIL, backup/restore de serviço e NOTICE/disposição jurídica BLOCKED. A comparação dos 30 pacotes implantados com CI do mesmo SHA passou tecnicamente. A correção local de vínculo contextual da demo e a instrumentação adicional da Home ainda não receberam crédito runtime. O runner anterior parou após Auth sem seleção de tenant, enquanto a UI posterior encontrou Tenant A para uma conta; divergência indeterminada. PRs privadas #6/#7 prepararam o restore e cron; PR #11/run `36020411581` passou apenas boot isolado da stack vazia, sem restore/RTO. Não há GO para piloto ou produção aberta.
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
