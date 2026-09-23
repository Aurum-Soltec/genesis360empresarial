# PROJECT-STATE — Genesis 360 Empresarial

Atualização: **2026-09-23**. Candidato hospedado: **V1.2.1 RC2 + Production & Scale Foundation**; as correções locais abaixo ainda não foram promovidas.

## Candidato local consolidado — correções funcionais e de segurança de 2026-09-23

A branch `codex/navigation-pages-fix` recebeu uma nova leva **local, não
publicada**. Ela separa e torna operacionais as telas de Passport e Histórico,
incluindo edição governada dos sete campos essenciais, versões declaradas e
Timeline legível. Home, Indicadores, Prioridades, Missões, Documentos,
Diagnóstico, Conselho e cockpit da demo deixam de escolher a primeira empresa
arbitrariamente: no tenant demonstrativo usam somente a única empresa fictícia;
em contexto ambíguo falham fechado. Relatório e prévia de soluções fictícias
ficam vinculados ao diagnóstico dessa empresa. Nenhum dado real ganha rótulo
ou pacote fictício automaticamente.

A API reserva as referências `DEMO:` para o pacote controlado e confere seu
conteúdo, finalidade e estado antes de reutilizar ou contar fontes. O relatório
deixa de apresentar proveniência completa quando referências não foram
carregadas. Falhas de Auth, membership e consultas de missão/decisão deixam de
ser confundidas com ausência de registro. O convite administrado ganhou etapas
de log sanitizadas, ainda sem identificação da causa do 502 hospedado. A
Timeline recebeu a migration append-only `0024`: eventos de fatos pessoais,
financeiros ou restritos agora exigem a mesma fronteira de leitura do fato;
eventos comuns continuam acessíveis ao membro do tenant. A análise estrutural
e o rollback estão em
`docs/audit-2026-09-23/BUSINESS_FACT_TIMELINE_READ_BOUNDARY_2026-09-23.md`.

Evidência local do candidato: `pnpm quality` **PASS**, incluindo **127/127
Vitest**, **34/34 testes nativos**, TypeScript, ESLint, lock, contratos,
integridade, 24 migrations, checagens estáticas de segurança e build Next.js.
`supabase test db` passou **106/106 pgTAP** em 14 arquivos após aplicação local
de `0024`. Nenhum resultado local concede
PASS ao staging ou ao HSP-4. O relatório operacional vigente é
`docs/audit-2026-09-23/HSP4_OPERATIONAL_RECHECK_2026-09-23.md`:
**NO-GO** para piloto e produção aberta. As cinco flags sensíveis seguem
desligadas. `PILOT-1` e Waves posteriores não foram iniciadas.

Permanecem pendentes: promoção e regressão hospedada do artefato exato;
convite fim a fim; backup gerenciado/RPO e drill de alerta com reconhecimento;
SLO p95 de 100 tenants; aceite do inventário de licenças; seletor explícito de
empresa para tenants com várias empresas reais; análise de arquivos reais;
causalidade documental por conclusão; aplicação de benefícios por plano; e
as Waves funcionais posteriores previstas no roadmap. A demo continua um
cenário **sintético**, sem promessa de precisão documental certificada.

## Auditoria do dossiê comercial e correções locais — 2026-09-23

O dossiê comercial de 03/09 foi reconciliado com as 26 promessas, o código e a
sequência aprovada em `docs/audit-2026-09-23/RECONCILIACAO_DOSSIE_COMERCIAL_2026-09-23.md`.
A visão é compatível com a fundação modular, mas benchmark, inteligência para
ecossistemas, progressão dos seis níveis, backoffice global, benefícios por plano
e análise de documentos reais não têm entrega operacional integral comprovada.
Agentic e memória empresarial estão após V1-GA; as cinco flags sensíveis seguem
desligadas. HSP-4 continua **NO-GO**.

Uma primeira correção **somente local** remove cinco superfícies legadas com
conteúdo fixo ou exposição fora de flag; condiciona o CTA da administração ao
papel correto; mostra falha de leitura em vez de ausência de dados; deixa de
atribuir as três fontes fictícias automaticamente a cada resposta; esclarece no
relatório a diferença entre referência declarada e fonte verificada; e ajusta
contraste, foco, escala móvel e semântica de confiança ausente. O gate de
baseline agora inventaria as 23 rotas API e faz parte de `pnpm quality`.

Evidência local deste candidato: `pnpm quality` passou com 34/34 testes nativos,
82/82 Vitest, TypeScript, lint, contratos, integridade, baseline e build.
Após a inclusão de quatro testes para as rotas legadas, a suíte Vitest completa
passou com **86/86**, além de TypeScript, lint e `pnpm work:check` novamente.
Falta publicar o artefato exato mediante autorização e repetir os gates de
runtime hospedado. A execução histórica de 50 respostas
permanece no staging com referências antigas e não foi reescrita.

## Candidato local de UX e leitura — 2026-09-23, ainda não promovido

A branch `codex/navigation-pages-fix` separa a Home executiva das páginas de
Prioridades, Indicadores e Histórico e preserva o destino escolhido após login
e seleção explícita do tenant. O PR #25 contém o primeiro commit, mas a
verificação de qualidade remota falhou por um hash de quebra de linha no
manifesto de integridade; a correção está apenas no commit local seguinte.

Uma leva local adicional acrescenta estado imediato de carregamento e
recuperação de erro. Leituras críticas do relatório, Conselho, demo
administrativa, soluções fictícias, prioridades, indicadores, histórico,
missões, Passport, Documentos, Privacidade e capacidades agora distinguem
falha de consulta de ausência real de dados. Na tela de Documentos, o botão
do pacote fictício não é exibido quando o ledger está indisponível.
O Business Passport passa a usar o shell canônico e mostra os sete campos
essenciais com status de verificação; sua completude indica presença cadastral,
não qualidade ou validação independente.

Evidência local: build Next.js de produção, TypeScript, lint dos arquivos
alterados, 81/81 testes Vitest, 34/34 testes nativos e contratos de desenho,
segurança, trust boundary e integridade passaram. Nenhum crédito de runtime
hospedado é atribuído a essa leva. As cinco flags sensíveis seguem desligadas;
tenancy, RLS, scoring, outbox e arquitetura permanecem inalterados.

## Demo Readiness — 2026-09-22

### Presentation Complete — hosted FULL PASS

The current candidate adds an allowlisted `/demonstracao` workspace that exposes
the real state of seven presentation steps: company, fictional documents, Full
diagnostic, executive report, simulated compatible solutions, Conselho Genesis
and a tenant-scoped administrative cockpit. The Documents surface can
register a fixed, idempotent package of three synthetic sources. It accepts no
user-supplied file or content and does not enable binary upload.

The diagnostic UI offers Essential and Full profiles. Synthetic evidence is
linked through ordinary answer contracts. The report adds an evidence-quality
disclosure and a deterministic 30/60/90-day plan derived from the weakest known
dimensions. The same three dimensions drive an explicitly fictitious service and
provider preview with open matching rationale. The Conselho surface provides
three interactive, deterministic, read-only syntheses with visible source tables;
`FEATURE_AGENTIC` remains false.

`/demonstracao/administracao` is available only to owner/admin in the allowlisted
demo tenant. It distinguishes the three canonical demo sources from historical
ledger records and makes all five sensitive flags visible as disabled. It is not
a global platform backoffice and does not use service-role access.

Access is fail-closed through both `FEATURE_DEMO_WORKSPACE=true` and an explicit
`DEMO_TENANT_IDS` allowlist. Local validation passed 66/66 Vitest tests,
34/34 native hardening tests, TypeScript, ESLint and the Next.js production
build. PRs `#18` and `#19` passed quality, database and CodeQL gates. Railway
deployed merge commit `cfdf876e5539f02e6b40d2b491adc80973fbb775` as deployment
`90b1fe43-9ba7-436f-8b0d-1f5a17f9a846`.

The final authenticated hosted run completed 50 Full interactions, exactly three
canonical fictional sources, scoring, report, seven-step cockpit, solution
simulation, administration and Conselho. It preserved Growth Score 55, coverage
100% and confidence 78%. The four-page A4 PDF was visually reviewed without
clipping or overlap; SHA-256 is
`EF739F6379FED74EAB6584B075E143C37A8339B8C832DAEDAE01AAD0BF1F9891`.

O candidato local recebeu a identidade visual oficial Genesis 360 Empresarial e
um primeiro corte do fluxo demonstrável `diagnóstico -> evidências -> resultado
rastreável -> relatório executivo`. O resultado passa a apresentar cobertura de
proveniência, fontes vinculadas, estado de verificação, versões metodológicas e
uma composição A4 imprimível/salvável em PDF sem dependência externa.

A proveniência reconcilia referências anexadas às respostas e evidências ligadas
diretamente ao diagnóstico. `pnpm demo:prepare` prepara um cenário Essential
fictício usando somente autenticação e APIs normais, e gera capturas, PDF e um
registro de execução sem credenciais ou cookies.

A área Documentos lista o pacote canônico de três evidências no tenant de demo,
preservando registros históricos sem exibi-los no roteiro de apresentação. O upload binário para
usuários reais continua desligado; scanner de conteúdo, retenção e gate jurídico
permanecem pendentes. Esta tranche não altera tenancy, RLS, scoring, Trusted Data
Access Boundary, outbox ou worker.

### Demo Readiness hospedada — FULL PASS em 2026-09-22

O corte completo foi integrado pelos PRs `#12`, `#13` e `#14` e implantado no
Railway pelo commit `c4f264163280b60fb47024d907632fc819c63de8`. Um usuário
sintético percorreu `Auth -> Tenant Context -> diagnóstico Full -> 50 respostas
adaptativas -> 3 evidências -> scoring -> resultado -> PDF -> Conselho`, com PASS.

O relatório final apresentou Growth Score 55, cobertura 100% e confiança 78%.
As três fontes são dados fictícios de demonstração e permanecem corretamente
marcadas como `unverified`; esta execução não lhes concede valor de documento
verificado. O PDF A4 foi renderizado em três páginas e revisado visualmente sem
cortes ou sobreposições. O cockpit apresentou 5/5 etapas prontas, Full concluído
e 3/3 fontes canônicas. Upload binário para usuários reais,
Agentic, Qualification Network, Real Contact e Ecosystem continuam desligados.

Esta execução de cinco etapas permanece como histórico. A evidência vigente para
a apresentação é a execução de sete etapas descrita em `Presentation Complete`
acima, no commit `cfdf876e5539f02e6b40d2b491adc80973fbb775`.

### Auditoria runtime de rotas e links — PASS em 2026-09-22

O staging foi revalidado no commit funcional
`cfdf876e5539f02e6b40d2b491adc80973fbb775`, incluindo as novas áreas de
soluções simuladas e administração. A varredura autenticada cobriu 3 rotas
públicas, 22 rotas autenticadas, 20 destinos de links internos e 8 superfícies
críticas em viewport de 320 px, com zero falhas de página, resposta, link,
JavaScript, console, tela vazia ou overflow horizontal. Nenhuma correção ou novo
deploy foi necessário.

A execução histórica no commit `8812ccc5fc6b2143e494a3baad68ca80615072bc`
encontrou o único 404 em `/favicon.ico`; o PR `#16` o corrigiu. As evidências e
os limites de ambas as execuções estão em
`docs/canonical/v1/delivery/RUNTIME_ROUTE_AUDIT_2026-09-22.md`.

### Auditoria negativa dos limites da demonstração — PASS

O mesmo artefato funcional passou por 15/15 verificações fail-closed. Acesso
anônimo às três rotas demonstrativas foi redirecionado ao login; Qualification
Network, Real Contact e upload para usuários reais retornaram
`FEATURE_DISABLED`; nenhum seletor de arquivo real foi renderizado; as cinco
flags sensíveis apareceram desligadas; a administração permaneceu restrita ao
tenant; e o Conselho permaneceu sem tools externas ou escrita autônoma. Headers
de correlação, anti-sniffing e anti-framing também foram observados no runtime.

Evidência e limites:
`docs/canonical/v1/delivery/DEMO_BOUNDARY_AUDIT_2026-09-22.md`.

### Ensaio operacional da reunião — PASS

O fluxo foi ensaiado pelos sete CTAs reais do cockpit, sem navegação direta para
substituir cliques. Todos chegaram ao destino esperado; as três perguntas do
Conselho produziram respostas distintas e citadas; as três explicações de
aderência foram abertas; e a ação de PDF estava disponível. A maior navegação
observada foi 3,347 s no staging gratuito. O roteiro executável de 12–15 minutos,
disclosures e recuperação segura estão em
`docs/canonical/v1/delivery/DEMO_MEETING_RUNBOOK_2026-09-22.md`.

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
