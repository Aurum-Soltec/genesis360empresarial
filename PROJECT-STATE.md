# PROJECT-STATE — Genesis 360 Empresarial

Atualização: **2026-09-21**. Candidato: **V1.2.1 RC2 + Production & Scale Foundation em staging hospedado**.

## Demo Readiness local — 2026-09-21

### Complete presentation flow — local PASS, hosted runtime pending

The current candidate adds an allowlisted `/demonstracao` workspace that exposes
the real state of five presentation steps: company, fictional documents, Full
diagnostic, executive report and Conselho Genesis. The Documents surface can
register a fixed, idempotent package of three synthetic sources. It accepts no
user-supplied file or content and does not enable binary upload.

The diagnostic UI now offers Essential and Full profiles. Synthetic evidence is
linked through ordinary answer contracts. The report adds an evidence-quality
disclosure and a deterministic 30/60/90-day plan derived from the weakest known
dimensions. The Conselho surface provides three interactive, deterministic,
read-only syntheses with visible source tables; `FEATURE_AGENTIC` remains false.

Access is fail-closed through both `FEATURE_DEMO_WORKSPACE=true` and an explicit
`DEMO_TENANT_IDS` allowlist. Local validation passed 61/61 Vitest tests,
TypeScript, ESLint and the Next.js production build. Runtime credit remains
pending until the same artifact is deployed and the Full hosted flow is rerun.

O candidato local recebeu a identidade visual oficial Genesis 360 Empresarial e
um primeiro corte do fluxo demonstrável `diagnóstico -> evidências -> resultado
rastreável -> relatório executivo`. O resultado passa a apresentar cobertura de
proveniência, fontes vinculadas, estado de verificação, versões metodológicas e
uma composição A4 imprimível/salvável em PDF sem dependência externa.

A proveniência reconcilia referências anexadas às respostas e evidências ligadas
diretamente ao diagnóstico. `pnpm demo:prepare` prepara um cenário Essential
fictício usando somente autenticação e APIs normais, e gera capturas, PDF e um
registro de execução sem credenciais ou cookies.

A área Documentos lista o ledger de evidências do tenant. O upload binário para
usuários reais continua desligado; scanner de conteúdo, retenção e gate jurídico
permanecem pendentes. Esta tranche não altera tenancy, RLS, scoring, Trusted Data
Access Boundary, outbox ou worker. A implementação local precisa ser promovida e
revalidada no ambiente hospedado com uma conta dedicada de demonstração antes de
receber crédito de runtime em staging.

### Demo Readiness hospedada — PASS em 2026-09-21

O corte foi integrado pelos PRs `#9` e `#10` e implantado no Railway pelo commit
`572b584b8c0fc9b096ed1cd5470fc8fd51e37bec`. Um usuário sintético percorreu o
fluxo hospedado completo `Auth -> Tenant Context -> diagnóstico Essential -> 42
respostas -> 3 evidências -> scoring -> resultado -> PDF`, com resultado PASS.

O relatório final apresentou Growth Score 55, cobertura 100% e confiança 78%.
As três fontes são dados fictícios de demonstração e permanecem corretamente
marcadas como `unverified`; esta execução não lhes concede valor de documento
verificado. O PDF A4 foi renderizado em duas páginas e revisado visualmente sem
cortes, controles interativos ou quebra órfã. Upload binário para usuários reais,
Agentic, Qualification Network, Real Contact e Ecosystem continuam desligados.

## Hosted Staging & Pilot Readiness — HSP-0 a HSP-4

O candidato foi publicado no GitHub público da organização Aurum-Soltec, protegido
por pull request e CI obrigatório, e implantado em staging isolado no Railway com
Supabase hospedado em `sa-east-1`. O artefato funcional ensaiado é identificável
pelo commit `5e91ce37d5b931eafeb1a598bdfeb62235cb11dc`.

HSP-0 passou. HSP-1 comprovou 23 migrations, 95/95 pgTAP, Auth/tenant switch,
negação cross-tenant, browser E2E 10/10 e worker contínuo. HSP-2 comprovou headers,
flags sensíveis desligadas, telemetria do provedor, restore lógico isolado e
proteções gratuitas do GitHub. O teste HSP-3 de 100 tenants percorreu por 60 minutos
`HTTP -> Auth -> Tenant Context -> API -> Application Services -> PostgreSQL ->
Outbox -> Worker -> Observabilidade`, com zero falhas e FAIL do SLO de latência;
o resultado final está no relatório HSP.
HSP-1 permanece BLOCKED apenas no subgate de convite real; HSP-2 permanece BLOCKED
em recovery gerenciado e paging externo.

A decisão HSP-4 é **NO-GO para piloto controlado** enquanto os gates objetivos
descritos em `docs/canonical/v1/delivery/GENESIS_360_HSP_0_4_FINAL_REPORT_2026-09-20.md`
não forem corrigidos. `PILOT-1` e todas as ondas posteriores permanecem não iniciadas.

## Production & Scale Foundation

A baseline reconciliada está em
`docs/canonical/v1/delivery/GENESIS_360_PRODUCTION_SCALE_BASELINE_RC2.md`.
As Waves PS-0–PS-14 foram executadas no escopo local e estão consolidadas em
`docs/canonical/v1/delivery/GENESIS_360_PRODUCTION_READINESS_REPORT.md`.
Naquela avaliação histórica, o resultado era GO para staging e NO-GO para produção
aberta. A decisão operacional vigente é a HSP-4: NO-GO para piloto controlado.

## Atualização RC2 — 2026-09-19

O escopo está congelado em `docs/canonical/v1/delivery/RC2_SCOPE_FREEZE_2026-09-19.md`.
O núcleo individual está incluído; ecossistema, rede qualificada, contato real,
upload binário e agentic permanecem desabilitados.

Os dez achados P0 da auditoria de 18/09 foram corrigidos por contrato e teste:
parser de missão, leitura de política/evidência, concorrência de transição,
vínculo consentimento-finalidade, capacidade desconhecida, números não finitos,
score global ausente, build/TypeScript, dependências e runtime SQL.

Evidência executada no candidato atual:

- instalação congelada com Node 24.21.0 e pnpm 10.32.1;
- audit npm: zero vulnerabilidades conhecidas em 558 entradas;
- TypeScript e lint: aprovados;
- testes nativos: 34/34;
- Vitest: 53/53;
- adversariais em processo: 31/31;
- E2E Chrome autenticado: 10/10;
- build Next.js: aprovado;
- banco isolado: reset limpo com 23 migrations;
- pgTAP: 95/95 em 13 arquivos, com harness local sem dbdev;
- backup/restore local: PASS com integridade, restore em 2,062 s;
- carga DB: 2.000 tenants, p99 5,711 ms, zero erros no workload medido.

Esta evidência promove o candidato de `runtime-pending` para
`P0-remediated/runtime-verified` no escopo testado. O gate de produção continua
bloqueado até staging/CI remoto, observabilidade externa, restore gerenciado e carga
fim a fim hospedada. A decisão PS-14 atual é NO-GO para produção aberta.

## Estado real
O repositório público, CI remoto, branch protection, staging Supabase e serviços web/worker
Railway estão operacionais. O pacote público continua excluindo fontes restritas,
caches, dumps, dados de autenticação e credenciais. Gate de produção: **BLOQUEADO**.
Percentuais reconciliados por evidência: Fundação **92%**; MVP **82%**; V1 **64%**.

## Decisões do proprietário
Free, Start R$99 e Pro R$297 aprovados. Preço do Pro não é mais hipótese.
Periodicidade mensal e prazo de contrato herdados da V1.2 foram preservados; não houve nova aprovação jurídica de termos.
Não acrescentar cobrança, cotas ilimitadas, consultoria humana ou prioridade paga na rede por inferência.

## Implementação deste candidato
Pontuação centralizada; dimensão insuficiente recebe NULL; índice global exige dimensões aplicáveis suficientes.
Confiabilidade centralizada; referências declaradas não elevam confiança. Sem respostas, confiança0.
Entrada pública não promove fatos nem resultados a verificados e não atribui confiança1.
Mutações recebem validação de origem e papel; JSON lido é limitado a64KiB.
Respostas usam revisão otimista. Migrações propõem snapshot imutável e submissão repetível sem reinserção.
Contexto de aplicabilidade é capturado no início; data de referência acompanha a revisão da resposta e fica estável até nova resposta.
Preços centralizados no catálogo; rede e checkout não foram ativados.

## Evidência e limitações
Consultar `docs/audit-2026-09-18/RC2_P0_REMEDIATION_EVIDENCE.md` e
`RC2_VALIDATION_RESULTS.json`. Os recibos anteriores em
`docs/hardening-v1.2.1/` permanecem como histórico do RC1.
O RC2 possui typecheck, build, testes de domínio, Vitest, adversariais e pgTAP
executados. A etapa HSP acrescentou navegador/HTTP autenticado E2E, operação
contínua, restore lógico e carga fim a fim. O gate de produção permanece bloqueado
pelos gaps objetivos registrados no relatório HSP-4.

## Dependências
Alvo: Node24.21.0, pnpm10.32.1, Next16.3.3 e React/ReactDOM19.2.8.
A consulta oficial de segurança motivou a atualização do Next.
O lock RC2 foi resolvido de forma real e instalado de forma congelada.
PostCSS foi elevado para 8.5.23, Vitest para 4.1.11 e tipos Node para 24.13.6.
A árvore auditada não contém advisory conhecido no momento da execução.

## O que NÃO está encerrado
Coletor/paging externo, backup gerenciado e retenção automática, e-mail real de convite,
SBOM/licenças completos, scanner antimalware, cobrança/entitlements completos,
metodologia de fornecedores, revisão legal/LGPD, ecossistema, contato real e agentes
ativos. A latência hospedada da HSP-3 excedeu o SLO e exige correção baseada em medida.

## Próximo gate
Corrigir os itens NO-GO da HSP-4 e repetir somente os gates afetados. Não iniciar
`PILOT-1` sem nova autorização do proprietário e sem uma decisão HSP-4 `GO`.
