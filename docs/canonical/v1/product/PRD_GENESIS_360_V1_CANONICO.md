 > **ADENDO V1.2.1, 2026-09-10:** preço Pro R$297 aprovado pelo proprietário; Free0 e Start99 mantidos.
> A referência executável está em `data/commercial-plans.json`.
> Hipóteses anteriores de preço do Pro estão superadas; outras pendências não foram aprovadas por inferência.
> Ver `docs/canonical/v1/product/PRD_HARDENING_V1_2_1.md` e `PROJECT-STATE.md`.

# GENESIS 360º --- PRD V1 CANÔNICO

**Status:** APPROVED BASELINE\
**Versão:** 1.0.0\
**Data-base:** 2026-08-18\
**Gate:** GZ-C --- evolução estrutural\
**Objetivo de release:** versão de produção pronta para validação real,
não MVP descartável.\
**Slogan institucional:** **Inteligência para pequenas e médias empresas
crescerem com maturidade.**\
**Assinatura de produto:** **Entenda seu negócio. Decida melhor. Evolua
continuamente.**

------------------------------------------------------------------------

## 1. Autoridade deste documento

Este PRD substitui, para a V1, decisões conflitantes de planos, escopo,
nomenclatura e roadmap presentes na baseline V3 anterior. O material V3
continua válido como fonte histórica e para requisitos não superados.

Fontes de origem: -
`GENESIS_360_DOSSIE_EXECUTIVO_COMPLETO_ATUALIZADO_QUADRO_DIRETIVO.pdf`; -
`GENESIS_360_HANDOFF_TECNICO_COMPLETO_ATUALIZACAO_DOSSIE(2).md`; -
`docs/01_PRD_MASTER_V3_HARMONIZADO.md`; -
`docs/05_ARQUITETURA_SEGURANCA_LGPD_E_ADRS_V3.md`; -
`docs/03_BACKLOG_SPRINT_READY_V3.md`; -
`docs/06_HANDOFF_V3_IMPLEMENTACAO.md`; - decisões aprovadas na evolução
V1 de 2026-08-15 a 2026-08-18.

Em caso de conflito para a V1: **PRD V1 → ADRs V1 → contratos/schemas →
backlog V1 → documentos V3**.

------------------------------------------------------------------------

## 2. Visão

O Genesis 360º é uma plataforma SaaS B2B de inteligência empresarial
contínua para pequenas e médias empresas, distribuível diretamente e por
ecossistemas empresariais.

A plataforma deve transformar:

**contexto → diagnóstico → dor → causa → decisão → missão → solução
necessária → empresa qualificada → execução externa → outcome →
aprendizado.**

O Genesis não é uma consultoria embutida em software. Seu objetivo é
escalar inteligência, automação, contexto e aprendizado proprietário.

### OBJ-001 --- Clareza

Permitir que uma PME compreenda sua maturidade, principais dores, causas
prováveis e prioridades.

### OBJ-002 --- Execução

Converter recomendações em missões estruturadas, mensuráveis e
acompanháveis.

### OBJ-003 --- Inteligência contínua

Manter memória empresarial temporal para que recomendações evoluam com a
empresa.

### OBJ-004 --- Rede qualificada

Conectar necessidades detectadas a empresas elegíveis e qualificadas
para entregar a categoria de solução necessária.

### OBJ-005 --- Big Data empresarial

Construir, com governança, consentimento, proveniência e qualidade, uma
base longitudinal que relacione perfil, problema, decisão, ação,
solução, fornecedor e resultado.

### OBJ-006 --- Escala

Operar os planos sem acompanhamento humano incluído, preservando margem
e capacidade de atender milhares de PMEs.

------------------------------------------------------------------------

## 3. Decisões canônicas

### DEC-001 --- Nenhum plano inclui acompanhamento humano

Free, Start e Pro são produtos digitais. Consultoria, implantação, BPO,
tecnologia, jurídico, tributário, mentoria, reunião executiva ou
qualquer intervenção humana são serviços separados.

**Regra:** upgrade compra mais inteligência, automação, contexto e
capacidade analítica; nunca horas humanas embutidas.

### DEC-002 --- Execução é separada da inteligência

O Genesis identifica necessidade, orienta, estrutura missão e pode
apresentar empresas qualificadas. A execução profissional ocorre fora do
SaaS e pode ser prestada por PGTI, BPO Finance ou terceiros elegíveis.

### DEC-003 --- Neutralidade do diagnóstico

O diagnóstico não pode favorecer PGTI, BPO Finance, patrocinador,
parceiro ou empresa do grupo. Interesse comercial nunca altera dor,
score, causa ou solução necessária.

### DEC-004 --- Plano habilita elegibilidade, não compra ranking

Uma empresa precisa estar em plano elegível para aparecer na área de
soluções qualificadas. O plano não deve ser o principal fator de
ordenação.

### DEC-005 --- V1 é production-ready

A V1 será validada com usuários reais e deverá atender gates de
segurança, privacidade, multi-tenancy, observabilidade, backup/restore,
testes, CI/CD, rollback, custos e operação.

### DEC-006 --- Dados antes de "Big Data"

Nenhuma inferência agregada será tratada como verdade sem qualidade,
proveniência, volume e metodologia suficientes.

------------------------------------------------------------------------

## 4. Personas e atores

### ACT-001 --- Empresário PME

Busca clareza, prioridade, orientação prática, evolução e acesso a
soluções adequadas.

### ACT-002 --- Empresa prestadora

Pode ser simultaneamente usuária do Genesis e fornecedora de capacidades
qualificadas.

### ACT-003 --- Ecossistema

AECG, BNI, NTW, associações, grupos e redes empresariais que distribuem
o Genesis e recebem inteligência agregada autorizada.

### ACT-004 --- Operação Genesis

Administra produto, regras, qualificações, planos, conteúdo, incidentes,
auditoria e qualidade.

### ACT-005 --- Especialista externo

Executa serviço humano contratado separadamente. Não faz parte da
assinatura SaaS.

------------------------------------------------------------------------

## 5. Proposta de valor

### Para a PME

**Entenda onde está, o que resolver primeiro, como evoluir e quem está
qualificado para ajudar.**

### Para o prestador

Receber oportunidades contextualizadas por necessidade real,
condicionado à qualificação e elegibilidade.

### Para o ecossistema

Compreender, de forma agregada e governada, as necessidades e a evolução
da base empresarial.

### Para o Genesis

Receita SaaS, distribuição, dados estruturados, outcomes, efeitos de
rede e inteligência proprietária.

------------------------------------------------------------------------

## 6. Planos V1

  ------------------------------------------------------------------------
  Capacidade        Free              Start             Pro
  ----------------- ----------------- ----------------- ------------------
  Preço             R\$ 0             R\$ 99/mês        R\$ 297/mês

  Contrato          sem compromisso   12 meses,         12 meses, cobrança
                    pago              cobrança mensal   mensal

  Diagnóstico       essencial         completo          completo +
                                                        reavaliação
                                                        contínua

  Growth Score      sim               sim               sim + histórico

  Dores             Top 3             mapa priorizado   mapa +
                                                        monitoramento

  Causa-raiz        síntese inicial   estruturada       multidimensional

  Missões           primeira missão   biblioteca +      adaptativas e
                                      plano             sequenciadas

  Conselheiro IA    degustação        limites mensais   orçamento ampliado
                    limitada                            

  Conselho Digital  não               roteamento        multiagente
                                      simples           conforme
                                                        necessidade

  Business Passport básico            evolutivo         completo

  Timeline          limitada          sim               avançada

  Matching          visualização      sim               sim
                    básica                              

  Benchmark         não               quando elegível   avançado quando
                                                        elegível

  Relatórios        diagnóstico       evolução          executivo
                                                        automatizado

  Humano incluído   **não**           **não**           **não**
  ------------------------------------------------------------------------

**Preço Pro:** baseline comercial inicial; deve ser validado por
experimento de disposição a pagar, conversão, margem e custo de IA antes
de ser tratado como preço ótimo.

### RNF-COST-001

Nenhum plano será comercializado como "IA ilimitada". Cada plano terá
budgets internos de tokens, modelos, tool calls, contexto, frequência e
custo.

------------------------------------------------------------------------

## 7. Genesis Ecosystem

Genesis Ecosystem não é um quarto plano PME; é uma camada institucional.

### RF-ECO-001

Permitir associação de empresas a um ou mais ecossistemas autorizados.

### RF-ECO-002

Permitir branding/configuração institucional sem fork do core.

### RF-ECO-003

Dashboard institucional somente com dados agregados/anonimizados ou
outra base jurídica explicitamente aprovada.

### RF-ECO-004

Exibir distribuição de dores, maturidade, evolução, categorias de
demanda, adoção e outcomes sem revelar dados individuais indevidos.

### RF-ECO-005

Permitir priorização de empresas qualificadas do próprio ecossistema
apenas como filtro/contexto legítimo, nunca falsificando fit ou score.

------------------------------------------------------------------------

## 8. Genesis Business Passport

O Passport é a representação compreensível ao usuário da memória
empresarial estruturada. O conceito técnico pode evoluir para Genesis
Business Digital Twin sem exigir um "digital twin" complexo na V1.

### Camadas

1.  **Business DNA:** estado atual.
2.  **Business Timeline:** evolução temporal.
3.  **Business Passport:** visão consumível, progressiva e
    compartilhável conforme consentimento.
4.  **Outcome/Intelligence layer:** relações agregadas entre contexto,
    problema, ação e resultado.

### RF-PASS-001

Armazenar identidade, setor, porte, região, modelo de negócio,
maturidade, indicadores, processos, tecnologia, riscos, objetivos e
capabilities.

### RF-PASS-002

Cada fato relevante deve suportar: valor, fonte, data, confiança,
sensibilidade e escopo de uso.

### RF-PASS-003

Distinguir no mínimo: `declared`, `inferred`, `verified`, `imported`.

### RF-PASS-004

Exibir completude e freshness do Passport.

### RF-PASS-005

Não apagar silenciosamente estados anteriores; mudanças relevantes
alimentam Timeline.

### RF-PASS-006

Permitir que o Passport seja fonte para diagnóstico, agentes, missões,
matching, qualificação e benchmark.

------------------------------------------------------------------------

## 9. Diagnóstico 360

### RF-DIAG-001

Diagnóstico versionado, adaptativo e progressivo.

### RF-DIAG-002

Cobrir no mínimo: estratégia/modelo, comercial/marketing, financeiro,
operações/processos, pessoas, tecnologia/dados/IA e governança/riscos.

### RF-DIAG-003

Não exigir todas as perguntas para todos os perfis; aplicar branching
por porte, setor, estágio e respostas anteriores.

### RF-DIAG-004

Score principal determinístico e versionado.

### RF-DIAG-005

IA pode interpretar texto, sintetizar evidências e levantar hipóteses,
mas não substituir cálculo determinístico nem autorização.

### RF-DIAG-006

Resultado deve apresentar score, cobertura, confiança, Top dores,
evidências, gaps, causas prováveis e prioridades.

### RF-DIAG-007

Toda conclusão deve indicar proveniência suficiente para auditoria
interna.

------------------------------------------------------------------------

## 10. Decision Engine / GDS

### RF-GDS-001

Recomendação relevante deve seguir estrutura: problema → evidências →
lacunas → causa → hipóteses → alternativas → recomendação → impacto →
riscos → confiança → validação → missão → métrica.

### RF-GDS-002

Distinguir fato, inferência, hipótese e recomendação.

### RF-GDS-003

A recomendação de solução não seleciona automaticamente um fornecedor.

------------------------------------------------------------------------

## 11. Mission Engine

Missão é unidade de execução; gamificação é o mecanismo de feedback em
torno da evolução.

### Estados

`SUGGESTED → ACCEPTED → IN_PROGRESS → EVIDENCE_PENDING → COMPLETED → OUTCOME_PENDING → OUTCOME_RECORDED`

Estados alternativos: `PAUSED`, `BLOCKED`, `CANCELLED`, `EXPIRED`.

### RF-MIS-001

Missões derivam prioritariamente de uma biblioteca versionada, não de
geração livre do LLM.

### RF-MIS-002

Template de missão contém trigger, pré-requisitos, objetivo, passos,
critério de conclusão, evidência, KPI esperado, risco, esforço e
aplicabilidade.

### RF-MIS-003

IA pode personalizar texto e sequência dentro dos limites do template.

### RF-MIS-004

Conclusão pode exigir evidência proporcional ao risco.

### RF-MIS-005

Após janela apropriada, solicitar outcome e, quando possível, indicador
antes/depois.

### RF-MIS-006

Gamificação não premia clique ou consumo de IA; premia completude,
execução, evidência, melhoria e outcomes.

### Níveis V1

1.  Diagnosticada
2.  Estruturando
3.  Em Evolução
4.  Qualificada
5.  Referência
6.  Alta Maturidade

`Capital Ready` torna-se trilha/certificação separada.

------------------------------------------------------------------------

## 12. Qualification Engine e Solution Network

### Linguagem oficial

**Título:** `Soluções qualificadas para esta necessidade`

**Mensagem:**\
"Com base nas necessidades identificadas no seu diagnóstico, encontramos
empresas qualificadas na Rede Genesis que oferecem soluções compatíveis
com este desafio. A elegibilidade considera critérios de qualificação,
aderência ao serviço necessário, maturidade empresarial e requisitos da
plataforma."

**Callout por empresa:** `Qualificada para atender esta necessidade.`

Evitar: "Genesis recomenda contratar X".

### RF-QUAL-001

Modelar taxonomia versionada de
`pain → required_capability → service/product capability`.

### RF-QUAL-002

Empresa só pode aparecer se: - qualificação ativa; - score mínimo da
categoria atendido; - plano elegível ativo; - capability compatível; -
compliance obrigatório válido; - capacidade/status de atendimento
compatível.

### RF-QUAL-003

Ranking deve priorizar fit, qualificação, maturidade/segurança,
capacidade, reputação/outcomes e contexto.

### RF-QUAL-004

Plano pode habilitar participação, mas não comprar posição artificial.

### RF-QUAL-005

Registrar explicação do match e versão da regra.

### RF-QUAL-006

Registrar impression → interesse → contato consentido → oportunidade →
contratação declarada → outcome, respeitando privacidade.

### RF-QUAL-007

PGTI e BPO Finance obedecem exatamente às mesmas regras de elegibilidade
e ranking.

------------------------------------------------------------------------

## 13. Agentic Runtime

### Princípio

Agentes são componentes probabilísticos. Verdade transacional, score,
plano, elegibilidade e autorização permanecem determinísticos.

### UX

Usuário interage preferencialmente com **Conselho Genesis**, não com
sete chatbots independentes.

### RF-AI-001

Orquestrador seleciona especialistas conforme domínio e risco.

### RF-AI-002

Context assembly usa apenas dados autorizados e necessários.

### RF-AI-003

Toda tool possui schema, allowlist, autorização, timeout e audit trail.

### RF-AI-004

Ações de escrita relevantes exigem validação determinística e, quando
irreversíveis, confirmação explícita do usuário.

### RF-AI-005

Budget por plano e por run: tokens, custo, tempo e tool calls.

### RF-AI-006

Golden set e evals normal/edge/adversarial bloqueiam regressões
críticas.

### RF-AI-007

Fallback para resposta determinística/abstenção quando confiança ou
dados forem insuficientes.

### RF-AI-008

CTO-Tax, jurídico, capital e outros domínios regulados não executam atos
profissionais autonomamente.

------------------------------------------------------------------------

## 14. Big Data e Genesis Intelligence

### RF-DATA-001

Coletar dados por progressive profiling; não transformar diagnóstico em
formulário excessivo.

### RF-DATA-002

Preservar proveniência, temporalidade, sensibilidade, consentimento e
confiança.

### RF-DATA-003

Separar dados individuais, agregados, anonimizados/pseudonimizados e
derivados.

### RF-DATA-004

Outcome Graph V1 pode ser relacional em PostgreSQL. Graph DB não é
requisito.

### RF-DATA-005

Não declarar causalidade a partir de mera correlação observacional.

### RF-DATA-006

Benchmark só é exibido quando houver amostra, qualidade e regras de
privacidade suficientes.

------------------------------------------------------------------------

## 15. Open Source Policy

### RF-OSS-001

Dependência estrutural exige due diligence antes de adoção.

### RF-OSS-002

Preferência: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause e equivalentes
aprovadas.

### RF-OSS-003

GPL/AGPL e copyleft forte: rejeitados por padrão para incorporação no
core, salvo exceção formal jurídica + ADR.

### RF-OSS-004

Verificar licença do componente e dependências transitivas relevantes,
NOTICE/attribution, saúde, CVEs, releases, manutenção e exit strategy.

### RF-OSS-005

Gerar inventário/SBOM e executar scan de licenças no CI.

### RF-OSS-006

Nenhum README substitui o arquivo LICENSE e a due diligence.

------------------------------------------------------------------------

## 16. Segurança, privacidade e multi-tenancy

### RNF-SEC-001

Deny-by-default e least privilege.

### RNF-SEC-002

`tenant_id` em todo recurso tenant-owned e isolamento comprovado por
testes cross-tenant.

### RNF-SEC-003

Tenant ativo deve ser explícito; não inferir silenciosamente "primeira
membership".

### RNF-SEC-004

RLS em PostgreSQL para dados tenant-owned.

### RNF-SEC-005

Admin/break-glass temporário, justificado e auditado.

### RNF-SEC-006

Secrets fora de código/prompts; secret scan no CI.

### RNF-SEC-007

Consentimento versionado por finalidade e revogável.

### RNF-SEC-008

Dados usados para ecossistema, matching, benchmark ou IA respeitam
finalidade e autorização.

### RNF-SEC-009

Logs não devem expor PII/secrets; aplicar redaction e limites de
cardinalidade.

### RNF-SEC-010

Threat model inclui cross-tenant leakage, privilege escalation, prompt
injection, data poisoning, fraude de qualificação, manipulação de
ranking e tool misuse.

------------------------------------------------------------------------

## 17. Reliability e produção

### RNF-REL-001

Build, lint, typecheck, unit/integration/contract/security tests no CI.

### RNF-REL-002

Backups automáticos e restore testado antes de produção.

### RNF-REL-003

Observabilidade com logs estruturados, métricas, traces/correlation IDs
e eventos de produto.

### RNF-REL-004

Rate limits, timeouts, retry policy e circuit/fallback para provedores
externos/IA.

### RNF-REL-005

Feature flags e kill switch para agentic, matching e integrações de
maior risco.

### RNF-REL-006

Runbooks, rollback e owner por fluxo crítico.

### RNF-REL-007

SLOs iniciais serão definidos após workload model; não inventar "nines"
antes de medir.

------------------------------------------------------------------------

## 18. UX

### RF-UX-001

Mobile-first para diagnóstico e acompanhamento.

### RF-UX-002

Estados loading, empty, validation, permission, failure, recovery e
success em jornadas críticas.

### RF-UX-003

Baseline web: WCAG 2.2 AA.

### RF-UX-004

Explicar por que uma dor, missão ou empresa qualificada apareceu.

### RF-UX-005

Distinguir sugestão de IA de ação executada.

### RF-UX-006

Passport deve mostrar completude, freshness e evolução sem criar falsa
precisão.

------------------------------------------------------------------------

## 19. Métricas

### NSM-001 --- North Star

**Empresas que completaram um ciclo de valor no período:** diagnóstico
atualizado + prioridade/decisão registrada + missão concluída + outcome
registrado.

### Produto

ativação, time-to-first-value, conclusão do diagnóstico, retorno,
missões aceitas/concluídas, outcomes.

### Dados

completude, freshness, verified/declarado, cobertura, confiança, taxa de
conflito.

### Matching

necessidades elegíveis, matches, CTR qualificado, contatos consentidos,
oportunidades, outcomes por capability.

### IA

task success, groundedness, unsupported claim rate, tool correctness,
policy violation, latency e custo/run.

### Comercial

Free→Start, Start→Pro, churn, expansão, ARR, ARPA, margem e custo de
IA/empresa.

### Ecossistema

adoção, empresas ativas, dores agregadas, conexões e outcomes.

------------------------------------------------------------------------

## 20. Fora do escopo V1

-   microserviços sem gatilho;
-   graph database obrigatório;
-   modelo próprio de linguagem;
-   marketplace aberto sem qualificação;
-   compra de ranking;
-   compensação tributária automática;
-   execução jurídica/tributária/financeira profissional pelo agente;
-   dezenas de integrações antes de demanda comprovada;
-   Capital Ready como nível universal;
-   acompanhamento humano embutido nos planos;
-   promessa de causalidade/benchmark sem evidência;
-   fork por ecossistema.

------------------------------------------------------------------------

## 21. Gates de release

### GATE-V1-01 --- Produto

Fluxo real: onboarding → diagnóstico → score → dor → GDS → missão →
solução necessária → empresa elegível → outcome.

### GATE-V1-02 --- Dados

Passport/Timeline persistentes, versionados, com proveniência e regras
de acesso.

### GATE-V1-03 --- Tenant

Testes cross-tenant negativos aprovados.

### GATE-V1-04 --- Segurança

Sem P0/P1 crítico aberto; auth, RLS, secrets, dependency/license scan e
threat model aprovados.

### GATE-V1-05 --- IA

Golden set + evals adversariais; tool authorization; budgets; kill
switch; fallback.

### GATE-V1-06 --- Operação

Observabilidade, backup/restore testado, rollback, runbooks e owners.

### GATE-V1-07 --- Legal/privacidade

Termos, política, consentimentos/finalidades, DPA quando aplicável e
fluxos de titular aprovados.

### GATE-V1-08 --- FinOps

Custo/run, custo/empresa, budgets e alertas definidos.

### GATE-V1-09 --- Evidência

CI verde + smoke/E2E dos fluxos críticos + evidência de deploy.

------------------------------------------------------------------------

## 22. Critério de sucesso da V1

A V1 não é "pronta" por quantidade de telas. É pronta quando empresas
reais conseguem completar com segurança o loop:

**Entender → Priorizar → Decidir → Executar missão → Encontrar solução
qualificada quando necessário → Registrar resultado → Evoluir.**

------------------------------------------------------------------------

## 23. Decisões pendentes antes do backlog final

-   PEND-001: preço Pro R\$297 --- validar comercialmente; baseline
    inicial aprovada para teste.
-   PEND-002: limites exatos de IA por plano.
-   PEND-003: thresholds de score por capability/categoria.
-   PEND-004: quais planos tornam prestadores elegíveis para aparecer na
    rede.
-   PEND-005: metodologia formal de qualificação e recertificação.
-   PEND-006: taxonomia inicial de dores/capabilities.
-   PEND-007: framework agentic final após spike e security review.
-   PEND-008: política de amostra mínima para benchmark.
-   PEND-009: modelo comercial institucional Genesis Ecosystem.

---

# Amendment V1.1 — Diagnóstico Adaptativo e Governança de Dados
**Aprovado em:** 2026-08-28

## RF-DGN-101 — Biblioteca, não formulário inflado
O banco canônico de 144 perguntas é uma biblioteca metodológica. A experiência não deve obrigar o usuário a responder todas as perguntas.

## RF-DGN-102 — Núcleo comparável
O Growth Score V1.1 usa um conjunto estável de 24 perguntas-âncora para preservar comparabilidade entre empresas.

## RF-DGN-103 — Caminho inicial de alto rendimento
A experiência Essential inicia com 31 interações de alto rendimento informacional. Perguntas adicionais só entram por gatilho determinístico.

## RF-DGN-104 — Aprofundamento adaptativo
O sistema pode aprofundar uma dimensão quando score, cobertura, confiança, contexto ou respostas `Não sei/Responder depois` indicarem necessidade.

## RF-DGN-105 — Setor e aplicabilidade
Cada pergunta possui finalidade, estágio, função no score, applicability e afinidade setorial. Setor prioriza; hard exclusion deve preferir operating traits confirmados.

## RF-DGN-106 — Semântica de respostas
`UNKNOWN` não equivale a maturidade zero. `NOT_APPLICABLE` sai do denominador aplicável onde permitido. `DEFERRED` não finge informação existente.

## RF-DGN-107 — Progresso
O diagnóstico exibe percentual de progresso, etapa atual, interações percorridas e faixa estimada de tamanho. O progresso não deve retroceder por simples surgimento de follow-ups adaptativos.

## RF-DGN-108 — Termômetro de confiabilidade
A interface exibe uma métrica independente de confiabilidade da análise, atualizada durante o preenchimento.

Baseline V1.1:
- cobertura crítica: 35%;
- completude informacional: 25%;
- evidência/provenance: 20%;
- consistência: 10%;
- freshness: 10%.

Os pesos são versionados e exigem calibração empírica.

## RF-DGN-109 — Qualidade sem premiar verbosidade
Texto maior não aumenta confiança por si só. Perguntas textuais podem definir `information slots`; completude é medida pelo sinal esperado.

## RF-DGN-110 — Recomendações de confiança
Quando a confiança for baixa/moderada, o sistema deve explicar como melhorar a análise, sem julgar o usuário.

## RF-GOV-111 — Data Submission Attestation
Antes de sessão governada de upload, o usuário autenticado deve aceitar uma declaração versionada de que possui os direitos, poderes, autorizações ou outra legitimidade necessária para disponibilizar o conteúdo para a finalidade apresentada.

## RF-GOV-112 — Aviso explícito de conteúdo não autorizado
A UI deve alertar para não enviar conteúdo cuja divulgação/processamento seja proibido por copyright, confidencialidade, contrato, propriedade intelectual, sigilo ou direitos de terceiros.

## RF-GOV-113 — Auditoria da declaração
Registrar de forma auditável:
- usuário;
- tenant;
- empresa;
- versão;
- content hash;
- finalidade;
- escopo;
- timestamp.

## RF-GOV-114 — Responsabilidade independente da GENESIS
A declaração do usuário não substitui, reduz nem transfere as obrigações próprias da GENESIS relativas a segurança, privacidade, LGPD, contratos, propriedade intelectual ou demais leis aplicáveis.

## RF-GOV-115 — Upload fail-closed
Sem versão ativa e confirmação válida da declaração, nenhuma sessão de upload pode ser criada.

## RNF-DGN-116 — Determinismo
Seleção adaptativa, score, applicability hard rules e cálculo de confiança devem ser versionados e testáveis; LLM não controla esses mecanismos.

## RNF-GOV-117 — Minimização
Não coletar IP/device fingerprint por padrão apenas para fortalecer a prova da declaração, salvo necessidade futura demonstrada e documentada.

---

# Amendment V1.2 — Genesis Precision Light
**Aprovado em:** 2026-08-28

## RF-UX-118 — Executive-first Home
A Home deve responder primeiro: estado atual, principal atenção e próxima ação.

## RF-UX-119 — Macro + context navigation
Topbar contém módulos principais; sidebar contém somente navegação contextual do módulo ativo.

## RF-UX-120 — Active location
A rota atual deve ser perceptível visualmente e exposta semanticamente por `aria-current`.

## RF-UX-121 — Functional mobile navigation
Nenhuma funcionalidade pode desaparecer em mobile por ocultação de topbar/sidebar. Deve existir drawer funcional.

## RF-UX-122 — Focused diagnostic
Durante perguntas do diagnóstico, navegação global completa não compete com a tarefa.

## RF-UX-123 — Interpretation-first Result
O resultado prioriza interpretação, prioridade e próxima ação antes de detalhes técnicos.

## RF-UX-124 — Surface restraint
Card não é container padrão. Layout deve preferir whitespace, tipografia e divisores quando suficientes.

## RF-UX-125 — Visual language
Tema global claro, alto contraste, Genesis Green restrito e Genesis Lime como assinatura, sem gradients decorativos ou glassmorphism global.

## RNF-UX-126 — WCAG
Baseline web: WCAG 2.2 AA, targets interativos de aproximadamente 44px e reduced-motion.

## RNF-UX-127 — No unnecessary dependency
Componente externo só entra quando reduzir complexidade total ou risco de acessibilidade/manutenção.
