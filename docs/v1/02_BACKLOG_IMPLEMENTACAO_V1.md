# GENESIS 360 V1 --- BACKLOG DE IMPLEMENTAÇÃO RASTREÁVEL

**Status:** PROPOSED FOR EXECUTION\
**Baseline:** 2026-08-18

## Ordem de execução

A ordem abaixo reduz retrabalho: fundação/segurança → Passport →
diagnóstico → decisão → missões → qualificação → agentes → ecossistemas
→ produção.

# EPIC V1-01 --- Canonicalização e fundação

**Objetivo:** transformar V3 em baseline V1 sem rewrite.

### V1-ST-001 --- Importar PRD/ADRs V1 e atualizar controle documental --- P0

Aceite: - PRD V1 e ADR-011..016 versionados em `docs/v1/`; - documentos
V3 marcados como históricos/superados onde houver conflito; - README
deixa de declarar M0/M1 como roadmap atual; - changelog registra
baseline V1. Testes/evidência: links válidos, lint documental/manual.
Dependência: nenhuma.

### V1-ST-002 --- Criar feature flags V1 e remover hardcoding estrutural Unique --- P0

Aceite: - `ecosystem`, `qualification_network`, `agentic`, `tax`,
`real_contact` configuráveis; - Unique não é condição de domínio; -
defaults seguros. Teste: unit/config + smoke. Dependência: ST-001.

# EPIC V1-02 --- Identity, tenancy e consent

### V1-ST-003 --- Implementar autenticação e tenant ativo explícito --- P0

Aceite: - sessão real; - tenant selecionado explicitamente; - usuário
multi-tenant suportado; - nenhuma "primeira membership" como contexto
implícito. Teste: integration.

### V1-ST-004 --- Endurecer RLS e provar isolamento cross-tenant --- P0 BLOCKER

Aceite: - policies por recurso; - testes negativos A→B para
leitura/escrita; - service role fora do cliente; - audit de tentativa
negada quando aplicável. Gate: GATE-V1-03.

### V1-ST-005 --- Consentimento versionado por finalidade --- P0

Finalidades iniciais: operação, IA, matching/contato, ecossistema,
benchmark/analytics quando aplicável. Teste: grant/revoke/deny.

# EPIC V1-03 --- Business Passport

### V1-ST-006 --- Modelar Business DNA facts e provenance --- P0

Schema mínimo: fact key/value, source, captured_at, confidence,
sensitivity, verification_status, version.

### V1-ST-007 --- Implementar Business Timeline --- P0

Aceite: mudanças relevantes geram evento/snapshot consultável; não
sobrescrever história.

### V1-ST-008 --- Criar UI Business Passport --- P0

Aceite: completude, freshness, estado declarado/inferido/verificado e
principais dimensões.

### V1-ST-009 --- Progressive profiling --- P1

Aceite: pedir próximo dado de maior valor sem bloquear jornada
desnecessariamente.

# EPIC V1-04 --- Diagnóstico 360 production

### V1-ST-010 --- Versionar question bank e perfis de diagnóstico --- P0

Reusar 144 perguntas; definir perfil Essential e Full;
hash/version/status.

### V1-ST-011 --- Implementar branching/applicability engine --- P0

Aceite: perguntas condicionais determinísticas, auditáveis e testadas.

### V1-ST-012 --- Implementar sessão, autosave e retomada --- P0

Aceite: refresh/dispositivo não perde respostas persistidas.

### V1-ST-013 --- Evoluir scoring para Rules Engine versionado --- P0

Reusar `lib/scoring.ts`; score, coverage, confidence e explanation
persistidos.

### V1-ST-014 --- Resultado real: score + Top dores + evidências/gaps --- P0

Remover valores hardcoded; explicabilidade obrigatória.

# EPIC V1-05 --- Pain, Cause e GDS

### V1-ST-015 --- Modelar Pain Finding e evidências --- P0

Campos: domain, severity, impact, confidence, evidence_refs, rule/model
version.

### V1-ST-016 --- Implementar Root Cause hypotheses --- P0

Distinguir fato/inferência/hipótese; não promover hipótese a fato.

### V1-ST-017 --- Implementar Decision Record / GDS --- P0

Contrato: problema, evidências, lacunas, causa, hipóteses, alternativas,
recomendação, impacto, riscos, confiança, validação, missão, métrica.

# EPIC V1-06 --- Mission Engine

### V1-ST-018 --- Criar Mission Library versionada --- P0

Seed inicial por financeiro, comercial, operações, pessoas,
tecnologia/IA e governança.

### V1-ST-019 --- Implementar state machine de missão --- P0

Estados conforme ADR-013; transições inválidas rejeitadas.

### V1-ST-020 --- Evidência e conclusão --- P0

Upload/registro proporcional ao risco; provenance e audit.

### V1-ST-021 --- Outcome follow-up --- P0

Registrar janela, before/after quando disponível e resultado
declarado/verificado.

### V1-ST-022 --- Gamificação por evolução --- P1

Níveis V1; nenhuma recompensa por clique/login/token.

# EPIC V1-07 --- Qualification & Solution Network

### V1-ST-023 --- Taxonomia pain → capability --- P0

Taxonomia versionada e administrável.

### V1-ST-024 --- Cadastro de capabilities do fornecedor --- P0

Escopo, segmento, região, capacidade, evidências.

### V1-ST-025 --- Qualification profile e recertificação --- P0

Status, score threshold, validade, evidências, compliance.

### V1-ST-026 --- Entitlements Free/Start/Pro --- P0

Start R\$99 e Pro R\$297 como baseline configurável; contrato
anual/cobrança mensal; humano sempre excluído.

### V1-ST-027 --- Eligibility Engine determinístico --- P0

`qualified && score>=threshold && eligible_plan && capability_fit && compliance && capacity`.

### V1-ST-028 --- Ranking explicável e neutralidade --- P0

Plano não compra posição; PGTI/BPO seguem mesma regra; persistir rule
version/fatores.

### V1-ST-029 --- UI "Soluções qualificadas para esta necessidade" --- P0

Linguagem oficial; não usar "Genesis recomenda contratar".

### V1-ST-030 --- Contato consentido e attribution --- P1

Impression → interesse → consent → contato → oportunidade → contratação
declarada → outcome.

# EPIC V1-08 --- Agentic Runtime

### V1-ST-031 --- Spike Agno + alternativa mínima --- P0

Comparar Agno vs runtime próprio simples: licença, segurança, custo,
latência, observabilidade, exit path. Gate: ADR de adoção final.

### V1-ST-032 --- Context Assembly com ACL --- P0

Somente Passport/diagnóstico/missões autorizados e necessários.

### V1-ST-033 --- Conselho Genesis + specialist routing --- P1

UX única; roteamento interno por domínio/risco.

### V1-ST-034 --- Tool contracts e authorization --- P0

Schemas, allowlist, timeout, read/write separation, confirmação.

### V1-ST-035 --- Budgets, fallback e kill switch --- P0

Por plano/run; limites de tokens/custo/tempo/tools.

### V1-ST-036 --- Golden set e evals --- P0

Normal, edge, adversarial; groundedness, unsupported claims, tool
correctness e policy violations.

# EPIC V1-09 --- Ecosystem

### V1-ST-037 --- Modelar ecossistemas e memberships --- P1

Empresa pode pertencer a ecossistemas autorizados sem confundir tenant
ownership.

### V1-ST-038 --- Branding/config institucional --- P1

Sem fork de código.

### V1-ST-039 --- Dashboard agregado de ecossistema --- P1

Somente agregados autorizados; suppression/minimum cohort configurável.

# EPIC V1-10 --- Trust, Data e Admin

### V1-ST-040 --- Admin de taxonomias/regras/qualificação --- P0

RBAC e audit obrigatório.

### V1-ST-041 --- Audit append-only e correlation IDs --- P0

Cobrir auth, diagnóstico, score, GDS, missão, qualificação, matching,
agentes e admin.

### V1-ST-042 --- LGPD lifecycle --- P0

Exportação, correção, revogação, retenção/expiração e deleção conforme
política.

### V1-ST-043 --- Big Data provenance/quality metrics --- P1

Completude, freshness, source, verification, conflict rate.

### V1-ST-044 --- Benchmark guardrails --- P2

Não liberar sem amostra mínima, privacidade e metodologia aprovadas.

# EPIC V1-11 --- Production Readiness

### V1-ST-045 --- Observabilidade --- P0

Logs estruturados, métricas, traces/correlation, eventos de produto,
redaction.

### V1-ST-046 --- Backup/restore/rollback comprovados --- P0 BLOCKER

Restore drill e evidência.

### V1-ST-047 --- Security & supply-chain gate --- P0 BLOCKER

Threat model, dependency/license scan, secret scan, SBOM, abuse cases.

### V1-ST-048 --- CI/CD e ambientes --- P0

Preview/staging/prod, migrations controladas, rollout e rollback.

### V1-ST-049 --- Performance/accessibility --- P0

WCAG 2.2 AA aplicável; budgets de performance e testes de capacidade do
fluxo crítico.

### V1-ST-050 --- FinOps IA/infra --- P0

Custo/run, custo/empresa, budgets, alertas e unit economics por plano.

### V1-ST-051 --- E2E vertical slice --- P0 BLOCKER

`onboarding → consent → Passport → diagnóstico → score → dor → GDS → missão → capability → qualified provider → consented contact → outcome`.

### V1-ST-052 --- Production Readiness Review / Go-NoGo --- P0 BLOCKER

Todos GATE-V1-01..09 com evidência e owner.

## Sequenciamento recomendado

**Wave 0:** ST-001..005\
**Wave 1:** ST-006..017\
**Wave 2:** ST-018..030\
**Wave 3:** ST-031..043\
**Wave 4:** ST-044..052

## Caminho crítico

ST-003 → ST-004 → ST-006 → ST-010 → ST-012 → ST-013 → ST-014 → ST-015 →
ST-017 → ST-018 → ST-019 → ST-023 → ST-025 → ST-027 → ST-029 → ST-051 →
ST-052.

## Reuso explícito das stories V3

-   ST-016/017 → V1-ST-003/004/040.
-   ST-018/019/020 → V1-ST-006/010/013.
-   ST-021 → V1-ST-017.
-   ST-022/023/024 → V1-ST-018..021.
-   ST-030/033/034/035/036 → V1-ST-041/045/042/046/047.
-   ST-039 → V1-ST-031..036.
-   ST-041 → V1-ST-026.
-   ST-043/045 → V1-ST-024..029.
-   ST-052 → V1-ST-035.
-   ST-053/054/055 → V1-ST-042/048/052. Stories tributárias específicas
    permanecem encapsuladas e não bloqueiam o core V1.
