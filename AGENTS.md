 > **ATUALIZAÇÃO V1.2.1 RC2 — 2026-09-19:** para executar ou continuar o projeto, prevalecem
> `PROJECT-STATE.md`, `START_HERE_V1_2_1.md`, `docs/canonical/v1/delivery/RC2_SCOPE_FREEZE_2026-09-19.md`
> e o adendo `docs/canonical/v1/product/PRD_HARDENING_V1_2_1.md`.
> O texto abaixo é a baseline histórica; seus “passes” não comprovam este candidato.

# AGENTS.md — Genesis 360 Empresarial V1

## Missão
Implementar o Genesis 360 Empresarial de forma incremental, segura, auditável e fiel à baseline canônica.

## Fonte de verdade
1. `00_WORK_START_HERE.md`
2. `docs/canonical/v1/00_PROJECT_STATE.md`
3. `docs/canonical/v1/product/PRD_GENESIS_360_V1_CANONICO.md`
4. ADRs aceitos em `docs/canonical/v1/architecture/`
5. contratos/schemas/migrations implementados
6. `docs/API/openapi.yaml`
7. `docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md`
8. `docs/canonical/v1/gates/GATES.json`
9. documentos V3 apenas como histórico quando não conflitarem com V1

## Regras não negociáveis
- Não fazer rewrite sem blocker comprovado.
- Não alterar arquitetura sem ADR.
- Não misturar dados entre tenants.
- Tenant ativo é explícito e RLS continua obrigatória.
- Registros derivados/controlados não são client-writable.
- Service role é server-only.
- Nenhum agente recebe `DATABASE_URL` ou Supabase service role.
- Nenhum plano Free/Start/Pro inclui intervenção humana.
- Diagnóstico, score, qualification e ranking são comercialmente neutros.
- Plano pode habilitar elegibilidade; plano não compra ranking.
- Matching real falha fechado sem policy/threshold/capability aprovados.
- Nenhum contato real sem `QUALIFIED_MATCHING` efetivo e feature flag.
- LLM não substitui score, autorização, consentimento ou verdade transacional.
- Evidence precede promoção de hipótese a fato.
- Mission state transitions seguem contrato e banco.
- Migration aplicada é append-only.
- Toda ação crítica precisa de audit/trace/event conforme risco.
- Dados de demo nunca viram fatos de produção.
- Open source estrutural passa pela política OSS e SBOM.
- Tema do produto é Genesis Light; não restaurar dark global.

## Antes de editar
1. Leia PROJECT_STATE, PRD, ADR e story afetada.
2. Liste contratos/migrations/API/UI afetados.
3. Confirme se há decisão pendente.
4. Preserve fail-closed quando metodologia/comercial/legal não estiver aprovado.
5. Defina teste e rollback antes da alteração.

## Comandos de verificação
```bash
pnpm work:check
pnpm contract:check
pnpm security:check
pnpm db:check
supabase test db
pnpm quality
```

## Agentic
Comparar primeiro:
1. `lib/intelligence/minimal-gds-orchestrator.ts`
2. `/intelligence` Pydantic AI Slim spike

Agno é fallback. Paperclip/Hermes/AgentOS/Temporal/OPA/Semantica/ScrapeGraph/CRM/ERP não entram no core sem trigger e ADR.

## Critério de concluído
“Concluído” exige:
- código/contrato;
- testes executados;
- evidência;
- documentação sincronizada;
- riscos/gaps registrados;
- rollback/recovery proporcional ao risco.

Sem execução runtime, usar `implemented-by-contract` ou `runtime-pending`, nunca `production-ready`.

## Diagnostic V1.1
- 144 questions = library, not mandatory form.
- Growth Score uses stable 24 anchors.
- Initial path = 31 high-yield interactions.
- Adaptive follow-ups require deterministic triggers.
- Progress and Confidence are separate.
- Do not reward verbosity; use structured information slots.
- Unknown != score zero.
- Upload requires active versioned Data Submission Attestation.
- User attestation never waives GENESIS privacy/security/legal obligations.

## Genesis Precision Light V2
- canonical package: `/design-system/genesis-precision-light`;
- topbar = macro; sidebar = contextual;
- active location is mandatory;
- mobile navigation must remain functional;
- Home follows What → Why → Next;
- focused diagnostic has no full app sidebar;
- Result is interpretation-first;
- no decorative gradients/card soup/global glassmorphism;
- one dominant primary CTA per context;
- do not add UI dependency without measurable complexity/accessibility gain;
- Wave 8 backend is frozen.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
