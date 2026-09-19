 > **ATUALIZAÇÃO V1.2.1 RC1 — 2026-09-10:** para executar ou continuar o projeto, prevalecem
> `PROJECT-STATE.md`, `START_HERE_V1_2_1.md` e o adendo `docs/canonical/v1/product/PRD_HARDENING_V1_2_1.md`.
> O texto abaixo é a baseline histórica; seus “passes” não comprovam este candidato.

# PROJECT STATE - GENESIS 360 EMPRESARIAL

**Data:** 2026-08-18  
**Versão de produto:** V1  
**Gate atual:** `GATE-FOUNDATION = conditional-pass`  
**Próximo gate:** `GATE-FOUNDATION-VERIFIED`

## Estado executivo

A V1 possui contratos e fundações implementados para:

- identidade, tenant ativo e consentimento por finalidade;
- Business Passport, Business DNA e Business Timeline;
- banco canônico de diagnóstico com 144 perguntas;
- diagnóstico persistente, autosave, score determinístico, coverage/confidence;
- pain findings, cause hypotheses e Genesis Decision Standard;
- Mission Engine, evidência e outcomes;
- capabilities, provider qualification, eligibility e ranking neutro;
- feature flags e política OSS.

## Ainda não é production-ready

Faltam evidências runtime para:

- migrations 0001 -> 0006 do zero e incrementalmente;
- cross-tenant A -> B em Supabase real;
- lint/typecheck/test/build;
- backup/restore/rollback;
- security/supply-chain gate;
- observabilidade completa;
- E2E do ciclo de valor;
- agentic runtime após spike e evals.

## Decisão de produto vigente

A próxima entrega não é MVP descartável. É a primeira versão real do **Genesis 360 Empresarial**, preparada para validação em produção quando os gates forem comprovados.

## Arquitetura visual vigente

O antigo tema dark `Genesis Glass` foi superado. A V1 usa:

- fundo claro ultra clean;
- superfícies brancas/neutras;
- tipografia escura de alto contraste;
- verde Genesis como acento, não como fundo dominante;
- barra superior para módulos principais;
- sidebar para contexto, submenus e operações;
- dashboard orientado à próxima decisão do gestor;
- motion discreto e funcional.

## Atualização 2026-08-28 — Foundation Acceleration

**[DECISÃO APROVADA]** Adoção OSS será seletiva: padrões que reduzem complexidade, não plataformas completas.

Implementado nesta Wave:
- RLS helper em schema privado;
- índice de membership orientado a `auth.uid()`;
- pgTAP cross-tenant executável;
- grants explícitos para bloquear escrita direta em registros derivados;
- server-only trusted write boundary;
- Evidence Ledger;
- durable Postgres event outbox;
- leasing atômico `FOR UPDATE SKIP LOCKED`;
- Mission state machine também no banco;
- escrita atômica de Business Facts;
- persistência atômica do resultado determinístico do diagnóstico;
- segurança curada sem dependência runtime;
- spike isolado Pydantic AI Slim.

**Gate:** continua `conditional-pass` até `supabase test db`, migrations e CI rodarem em ambiente real.

## Atualização 2026-08-28 — Wave 6 End-to-End Core

**[IMPLEMENTADO]**
- Prioridade → GDS → missão;
- missão → evidência → outcome → Timeline;
- pain → capability;
- provider policy e plan eligibility fail-closed;
- cross-tenant qualified-solution service;
- consented contact request;
- outbox complete/fail;
- novas superfícies reais de produto;
- minimal agentic comparator sem nova dependência.

**[GAP]**
- thresholds/metodologia/plan provider eligibility ainda precisam decisão;
- consent legal copy ainda precisa versão aprovada;
- runtime CI/Supabase/E2E ainda precisam evidência.

## Security hardening update

- legacy `current_tenant_id()` removed;
- management-only company mutation;
- Business Fact/Evidence sensitivity enforced by role;
- audit logs restricted to owner/admin/auditor;
- tax reads restricted to owner/admin/manager/specialist;
- referral reads restricted to management roles.

This is a conservative V1 least-privilege baseline. More granular specialist assignment remains future work.

## Wave 7 — Diagnostic Intelligence & Governance

**[DECISÃO APROVADA]**
- 144 questions remain a library, not a mandatory form.
- Stable Growth Score uses 24 anchors.
- Starting diagnostic path now contains 31 high-yield interactions.
- Essential can adapt up to 42 interactions when evidence/signals justify it.
- Progress and analysis Confidence are separate live indicators.
- Unknown is not maturity zero; N.A. has explicit semantics.
- Data Submission Attestation is versioned/auditable and does not transfer GENESIS obligations.

**[GAP]**
- Confidence weights require empirical calibration.
- Sector affinity/applicability requires validation with real cohorts.
- Legal attestation text remains draft until legal/privacy approval.
- Binary upload itself remains disabled until security controls pass.

## Wave 8 — Genesis Precision Light

**[DECISÃO APROVADA]** Genesis Precision Light V2 é a linguagem visual canônica.

**[IMPLEMENTADO]**
- design-system package canônico;
- topbar route-aware;
- sidebar contextual;
- mobile drawer funcional;
- Home executiva premium;
- Diagnóstico focado;
- Resultado interpretation-first;
- V2 tokens/responsive/accessibility;
- static design/contrast checks;
- backend-preservation hash gate.

**[GAP]**
- browser/runtime visual validation;
- WCAG 2.2 AA manual/automated browser evidence;
- visual regression screenshots;
- migration das superfícies restantes depois de aprovar as 3 canônicas.

## Production Foundation Master V1.2 — 2026-08-28

**[DECISÃO APROVADA]**
O repositório alvo do Genesis 360 Empresarial é:
`https://github.com/Aurum-Soltec/genesis360empresarial`

**[ESTADO]**
- documentação V1.0→V1.2 consolidada;
- Genesis Precision Light V2 canônico;
- Diagnóstico V1.1 canônico;
- backend Wave 7 preservado na Wave 8;
- 12 migrations;
- 10 suites SQL;
- 19 API routes;
- 132 requisitos canônicos;
- 123 stories após inclusão do backlog de production-readiness.

**[GATE]**
Production Foundation documental/contratual: READY FOR RUNTIME VERIFICATION.

**[BLOCKER]**
Production-ready ainda depende de PW-0/PW-1/PW-2:
migrations, pgTAP, full quality/build, E2E, security, restore e browser UX.
