 > **ADENDO V1.2.1, 2026-09-10:** preço Pro R$297 aprovado pelo proprietário; Free0 e Start99 mantidos.
> A referência executável está em `data/commercial-plans.json`.
> Hipóteses anteriores de preço do Pro estão superadas; outras pendências não foram aprovadas por inferência.
> Ver `docs/canonical/v1/product/PRD_HARDENING_V1_2_1.md` e `PROJECT-STATE.md`.

# DECISÕES CANÔNICAS V1

- **DEC-001:** Nenhum plano SaaS inclui humano.
- **DEC-002:** Execução profissional é separada da inteligência Genesis.
- **DEC-003:** Diagnóstico é comercialmente neutro.
- **DEC-004:** Plano habilita elegibilidade, não compra ranking.
- **DEC-005:** V1 é release de produção condicionada a gates, não demo descartável.
- **DEC-006:** Big Data requer provenance, consentimento e qualidade.
- **DEC-007:** Business Passport é a experiência V1; Digital Twin permanece evolução conceitual.
- **DEC-008:** Missões derivam prioritariamente de biblioteca versionada.
- **DEC-009:** Gamificação recompensa evolução, evidência e outcome; não clique/login/tokens.
- **DEC-010:** PostgreSQL permanece source of truth e storage principal da V1.
- **DEC-011:** Agentic runtime é uma fronteira separada; Agno é candidato a spike, não dependência automática.
- **DEC-012:** Tema V1 é claro; antigo Genesis Glass dark está superado.
- **DEC-013:** Topbar contém módulos principais; sidebar contém contexto/submenus.
- **DEC-014:** UX principal é manager-first: próxima decisão antes de exploração de funcionalidades.
- **DEC-015:** Open source estrutural segue allowlist permissiva e due diligence.

- **DEC-016:** Adotar padrões OSS seletivamente; não incorporar plataformas que dupliquem o Genesis.
- **DEC-017:** `pydantic-ai-slim` é o candidato preferencial de spike; Agno SDK é fallback.
- **DEC-018:** Agente nunca recebe `DATABASE_URL` nem Supabase service role.
- **DEC-019:** Registros derivados/controlados são read-only pela Data API autenticada; mutações passam pela trusted server boundary.
- **DEC-020:** Evidence precede Fact/Decision; output de agente começa como não verificado.
- **DEC-021:** Outbox Postgres é a primitive V1 para side effects duráveis; Temporal permanece deferred até trigger concreto.
- **DEC-022:** OPA permanece deferred enquanto autorização puder ficar coerente em RLS + application policy.

- **DEC-023:** Qualified Solution matching é cross-tenant somente via trusted server service.
- **DEC-024:** Policy/threshold ausente faz matching falhar fechado.
- **DEC-025:** FREE/START/PRO não recebem provider eligibility automaticamente enquanto PEND-004 estiver aberta.
- **DEC-026:** Missing provider outcome é unknown, não zero; ranking renormaliza componentes disponíveis.
- **DEC-027:** Contact request recalcula elegibilidade e exige consentimento efetivo `QUALIFIED_MATCHING`.
- **DEC-028:** Outcome sempre fecha Timeline; Passport só é projetado por template versionado explícito.
- **DEC-029:** Minimal Genesis orchestrator é baseline obrigatória contra a qual qualquer framework agentic deve justificar sua complexidade.

- **DEC-030:** Retirar `current_tenant_id()` legado; active tenant não é resolvido pela “primeira membership”.
- **DEC-031:** Company mutation direta exige owner/admin/manager.
- **DEC-032:** Business Facts/Evidence `personal|financial|restricted` ficam owner/admin/manager na V1.
- **DEC-033:** Audit log é owner/admin/auditor; não é dado geral de todos os membros.

- **DEC-034:** Question count is not a product KPI; information yield is.
- **DEC-035:** Growth Score V1.1 uses 24 stable score anchors.
- **DEC-036:** Initial adaptive path starts with 31 interactions; Essential normally stays within 31–42.
- **DEC-037:** 144-question bank is a library, not a forced questionnaire.
- **DEC-038:** Progress and Confidence are separate metrics.
- **DEC-039:** Unknown is not maturity 0; N.A. exits the applicable denominator where permitted.
- **DEC-040:** Text verbosity never raises confidence by itself; information slots do.
- **DEC-041:** Data Submission Attestation is separate from privacy notice/legal basis and does not waive GENESIS obligations.
- **DEC-042:** No active attestation version means document-upload session creation fails closed.

- **DEC-043:** Genesis Precision Light V2 é a linguagem visual canônica.
- **DEC-044:** Topbar = macro navegação; sidebar = contexto do módulo ativo.
- **DEC-045:** Mobile possui drawer funcional, não badge/placeholder de menu.
- **DEC-046:** Executive Home usa `What → Why → Next` e elimina KPI-card grid como padrão.
- **DEC-047:** Diagnóstico usa shell focado sem sidebar completa.
- **DEC-048:** Resultado é interpretation-first e usa progressive disclosure.
- **DEC-049:** Wave 8 não adiciona shadcn/Radix/chart/font runtime dependency.
- **DEC-050:** Backend Wave 7 permanece congelado durante Wave 8.

- **DEC-051:** O repositório oficial alvo é `Aurum-Soltec/genesis360empresarial`.
- **DEC-052:** A primeira fase no novo repositório é Production Foundation Verification, não expansão de escopo.
- **DEC-053:** Branch model inicial permanece `main` protegida + branches curtas + PR; não criar `develop` sem necessidade real.
- **DEC-054:** O Production Foundation Master V1.2 é o handoff canônico para Work.
- **DEC-055:** Stories ST-104→ST-123 formam o backlog de transição da fundação para release candidate/piloto.
