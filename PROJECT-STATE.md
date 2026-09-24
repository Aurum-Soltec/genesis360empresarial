# PROJECT-STATE — Genesis 360 Empresarial

Atualização: **2026-09-24 UTC, revisão corretiva HSP-4: NO-GO COM CORREÇÕES OBJETIVAS**. **100 TENANTS READY: NÃO; PILOTO CONTROLADO: NO-GO; PRODUÇÃO ABERTA: NO-GO.** Nenhuma Wave posterior foi iniciada. A decisão e a lista atual de gates estão em `docs/audit-2026-09-24/HSP4_CORRECTIVE_GO_NO_GO_2026-09-24.md`; a revisão anterior abaixo é histórica.

## Estado canônico da revisão corretiva HSP-4 — 2026-09-24 UTC

O SHA funcional hospedado continua `bb290bc7bc35f77b4ca01aecdbf19b748c386270`. A migration 0024 e o isolamento entre membro, gestor e outro tenant passaram 12/12 SQL e 12/12 HTTP no staging. O proprietário entrou novamente com a conta exata convidada, observou somente Tenant A e a leitura Auth registrou `last_sign_in_at` posterior ao reteste: o subgate de novo login passou. O endereço principal tentado antes pertence a outra conta de teste. O relatório FULL hospedado teve 55 respostas e zero fontes vinculadas/verificadas; análise de documento real permanece pendente sob a flag OFF. O roteiro sintético corrigido foi tentado no staging com duas contas de teste protegidas: ambas passaram Auth, porém retornaram zero opções de tenant e não houve escrita. A prova hospedada da nova proveniência continua BLOCKED; a causa da seleção de tenant ainda não foi estabelecida.

No backup privado, a PR #9 foi integrada e o run manual `36002104320` no SHA `e82a09c103c96a693f2669f660a863248a3daa50` publicou uma release cifrada imutável com 129 entradas ACL no TOC. O restore lógico isolado verificou 102 tenants, 16 usuários Auth, 24 migrations e zero objetos Storage em 77,450 s após download. A PR #7 do cron guardado foi integrada no SHA privado `051a76d3565f79eac2c9674720d263f969b4803b`, mas as variáveis de ativação/atestação estão ausentes: **schedule continua OFF**, sem crédito de backup automático. A PR #6 do scaffold de recuperação de serviço também foi integrada, SHA privado `10214da0746ac4824fffe34cee512576ce875898`, com 34 testes locais PASS e um caso de symlink SKIP no Windows; isso é preparação de código, não execução de restore. Nada disso comprova aplicação/equivalência de owner/ACL, RPO, RTO de serviço ou retenção de 30 dias. O orçamento GitHub Actions da organização está em US$0 com Stop usage ativo, mas a cota pode esgotar. A chave ainda requer custódia independente e o controle autogerido, aceite formal. Em arquivo customizado, `pg_dump --no-owner` é ignorado; a cópia v1 omitiu ACL por `--no-privileges` e o restore v1 pulou owner/ACL. A v2 preserva entradas ACL no arquivo, não a restauração final.

A carga integral de 100 empresas por 3.604 s passou duração, 584 negativas cross-tenant esperadas e 5.806/5.806 eventos outbox processados, mas **falhou p95 ≤750 ms** em login (1.964,5), Home (1.055,48), escrita (1.024,5) e leitura (793,8 ms). A amostra causal adicional mediu Home gzip 5.681 bytes, primeiro byte rápido, streaming SSR lento e picos Auth; não há correção pequena segura demonstrada. Instrumentação numérica das subfases de tenant-context e da API de fatos passou 27 testes focados, porém ainda não foi executada no runtime hospedado e não é correção de latência. O último commit com alterações de código do PR #25 é `6d4d569be50acc03999eebb23faa1dfc10fc7725`: `pnpm quality` local passou com 506 Vitest/34 testes nativos, e quality, database, CodeQL e Analyze passaram nos runs remotos `36007816845` e `36007811013`. A falha anterior no commit intermediário `a903` era de hashes CRLF/LF e foi corrigida no `6d4d569`. O CI Linux do predecessor `40b9b82` arquivou classificação 9/30 itens na árvore de produção, 21 fora dela, hashes e textos LICENSE/NOTICE instalados; isso não comprova os bytes do contêiner Railway nem resolve LGPL/CC-BY. **O SHA `6d4d569` não foi promovido ao staging**, portanto não recebe crédito runtime. Cinco flags sensíveis permanecem OFF. Fundação 92%, MVP 82% e V1 64% permanecem estimativas históricas, sem crédito de prontidão operacional.

## Registro histórico da revisão anterior HSP-4 — 2026-09-24 UTC

Os parágrafos abaixo descrevem a evidência disponível **antes** do reteste de login, do backup v2 e da investigação adicional de desempenho. Onde há diferença, prevalece o estado canônico acima e a revisão corretiva vinculada. A afirmação anterior de que `pg_dump --no-owner` retirou owners do arquivo customizado foi corrigida acima; o restore v1 continuava sem equivalência de owner/ACL.

O artefato funcional hospedado **bb290bc7bc35f77b4ca01aecdbf19b748c386270** passou CI quality/database/CodeQL; Railway web **ab3f2a2d-9507-4e24-8749-bc313c7691fa** e worker **96c1e771-c895-4f15-a8f5-157b4f97f892** chegaram a SUCCESS no mesmo SHA do projeto isolado de staging. O nome production no ambiente Railway não autoriza produção aberta. A correção posterior do harness em `dc9c124` passou quality/database/CodeQL no PR #25; ela não muda o SHA funcional do ensaio hospedado. A HSP-4 foi encerrada nesta revisão com decisão **NO-GO**, não PASS.

A migration 0024 está aplicada append-only, somando 24 migrations. A prova hospedada de RLS no banco passou **12/12 asserts**, ROLLBACK e zero dados de ensaio residuais. No SHA `bb290bc`, **três sessões Auth HTTP independentes** de membro A, gestor A e membro B passaram **12/12 assertions** nas APIs de fatos, Timeline e tenant ativo: o membro não viu fatos/eventos sensíveis, o gestor viu os seus e outro tenant não leu nem ativou o tenant A. Fixture e usuários temporários foram removidos. Um diagnóstico FULL novo nesse SHA concluiu **55 respostas**, score **48**, cobertura **100%**, confiança **78%**, 12 dimensões, plano de 90 dias e três soluções explicitamente fictícias. O relatório mostrou **zero fontes vinculadas ou verificadas**; logo, fluxo e isolamento receberam prova runtime, mas conclusão fundamentada em documentação real continua pendente. Evidência: `docs/audit-2026-09-23/HSP4_HOSTED_FULL_HTTP_BB290BC_2026-09-24.md`.

O convite controlado em 6737406 retornou HTTP 201, criou usuário Auth, vínculo member somente em Tenant A, evento membership.invited e e-mail recebido. O callback com fragmento implícito passou a estabelecer sessão do aplicativo, abrir /nova-senha e mostrar somente Tenant A; a área administrativa negou o membro. O proprietário confirmou definição de senha e acesso, mas o dado disponível de Auth não prova novo login por senha **após logout**. O SHA atual corrigiu a possibilidade de submissão do formulário Auth antes da hidratação; dez usuários sintéticos fizeram login no smoke. O último subgate humano do convite permanece PENDING.

A issue #27 registrou falha sintética do monitor, recuperação, aviso por e-mail recebido pelo operador, ACK humano e fechamento posterior. O ACK inicialmente trouxe conteúdo citado da notificação para a issue pública; o comentário foi sanitizado e verificado sem links de notificação. Cópias/cache anteriores não podem ser descartados. O subgate do drill de alerta passou; backup e licença não. O repositório separado genesis360-staging-backups é privado, com immutable releases habilitado. O workflow privado SHA **7e6a54e**, run **35945384891**, produziu **primeira release cifrada imutável** de 3.613.039 bytes, restaurada em banco local isolado com 102 tenants, 16 usuários Auth, zero objetos Storage e 24 migrations. O restore lógico do banco e verificações levaram **32,241 s**; drill local após download, **37,476 s**. Esse resultado não é RTO de serviço. Seguem sem prova o agendamento, 30 dias de retenção, RPO/RTO de serviço, custódia independente da chave e aceite do controle autogerido; HSP-2 permanece BLOCKED. Evidência: `docs/audit-2026-09-23/HSP4_PRIVATE_BACKUP_MANUAL_PROOF_2026-09-24.md`. O scanner de licenças entrou no CI e passou no candidato posterior `0c6dc1a` (não no runtime bb290bc), mas deixou **30 itens para revisão**, incluindo libvips LGPL-3.0-or-later. Composição final/NOTICE/disposição jurídica seguem BLOCKED.

A fixture privada de HSP-3 confirmou 10 contas e 100 empresas sintéticas. O primeiro ensaio no SHA `bb290bc` terminou após 998 s com dez falhas de navegador/rede e p95 acima de 750 ms. O **retry completo no mesmo runtime**, run **662855c2dbd5**, durou **3.604 s**: visitou **100/100 tenants**, autenticou dez usuários, fez **24.512 requests**, **5.806 escritas** e **584 negativas cross-tenant esperadas**, com **zero erro inesperado** e 70 páginas de navegador recicladas. A consulta hospedada pareou **5.806 fatos e eventos outbox**, todos processados, zero pending/dead/retries; worker p95 **3.476,20 ms** e tentativa p95 **163 ms**. Duração, fluxo e isolamento sintético passaram; **HSP-3 falhou no SLO**: p95 login **1.964,5 ms**, Home **1.055,48 ms**, escrita **1.024,5 ms** e leitura **793,8 ms** contra **≤750 ms**. Home teve p95 de primeiro byte **165,3 ms** e restante da resposta **803,1 ms**; a API de fatos mediu contexto tenant p95 **368,89/378,11 ms** (escrita/leitura) e acesso a dados **355,35/168,82 ms**. Percentis de fases não são aditivos. Evidência sanitizada e versionada: `docs/audit-2026-09-23/HSP3_100_TENANTS_60M_BB290BC_2026-09-24.json`.

Railway web/worker estavam na Virgínia (`us-east4-eqdc16a`) e Supabase em São Paulo (`sa-east-1`), mas a parcela de latência atribuível à distância não foi isolada. Na janela final do provedor, p95 geral/web foi **563 ms**, Home **656 ms** e escrita **685 ms**, escopo diferente dos percentis de navegador fim a fim. Houve **zero 5xx** no provedor. CPU web média/máxima **0,181/0,265 de 2** e memória **306/325,4 de 1.024 MB**; worker CPU **0,0052/0,0073 de 2** e memória **100,3/120,1 de 1.024 MB**. Esses agregados não provam ausência de gargalo em pool/SQL. Custo Railway **acumulado** US$ **0,4789304**, sem inferir custo marginal ou por tenant. Evidência regional: `docs/audit-2026-09-23/HSP3_REGION_BB290BC_2026-09-24.json`. Não mudar arquitetura ou região antes de comparação técnica.

O backup manual v1 usou `--no-privileges` no dump e `--no-owner --no-privileges` no restore; portanto a restauração por contagens **não prova proprietários ou ACLs equivalentes** aos da origem nem retorno seguro de Auth/API/worker. Isso é risco estrutural de recuperação, documentado antes da correção v2 no exportador. O PR privado #6 (`03ac87f`) preparou scaffold de restore de serviço e foi integrado depois no SHA `10214da0746ac4824fffe34cee512576ce875898`; 34 testes locais passaram e um caso de symlink foi pulado no Windows, sem restore de serviço executado. O PR #7 HEAD `da0a101` preparou cron 02:23/14:23 UTC condicionado a variáveis de ativação ausentes e alerta em issue privada, com 25 testes sintéticos PASS, sendo integrado depois no SHA `051a76d3565f79eac2c9674720d263f969b4803b`. Um ensaio sintético no SHA temporário `ec5f61de8a61f343906a1849cd292ceb6a0242a8`, run **35948991857**, pulou o snapshot, não acessou banco/secrets, abriu a issue privada #8 com referência sanitizada à execução e a fechou; entrega a humano/ACK não foram provados. Um primeiro ensaio **35948819869** falhou fechado pelo pin da branch. **Cron integrado, mas não ativado; schedule OFF**, sem crédito de RTO, agendamento efetivo, retenção ou RPO. O novo ensaio isolado precisa comparar grants, RLS e owners, autenticar papéis distintos por HTTP e executar o worker antes de atribuir RTO ao serviço. O intervalo após primeiro byte da Home pode incluir streaming SSR e não mede isoladamente largura de banda. Ainda não há correção pequena e segura do p95 comprovada sem alterar verificações de Auth, membership, quota ou trusted boundary. A próxima medição deve separar subfases, bytes e `Content-Encoding`; qualquer consolidação estrutural ou mudança de região requer evidência comparativa e ADR.

As cinco flags sensíveis continuam OFF: Agentic, Data Upload para usuários reais, Qualification Network, Real Contact e Ecosystem. Não iniciar PILOT-1 ou qualquer Wave posterior sem fechar os gates objetivos e receber nova autorização do proprietário. A decisão HSP-4 A–T **NO-GO** está em docs/audit-2026-09-23/HSP4_FINAL_RECHECK_2026-09-23.md. Percentuais históricos de escopo permanecem Fundação 92%, MVP 82%, V1 64%, sem transformá-los em aprovação operacional.

## Registro histórico do candidato local anterior — 2026-09-23

## Candidato local consolidado — correções funcionais e de segurança de 2026-09-23

A branch `codex/navigation-pages-fix` recebeu naquela etapa uma nova leva
**local, ainda não publicada naquele momento**. Ela separou e tornou operacionais as telas de Passport e Histórico,
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

Evidência local daquele candidato: `pnpm quality` **PASS**, incluindo **127/127
Vitest**, **34/34 testes nativos**, TypeScript, ESLint, lock, contratos,
integridade, 24 migrations, checagens estáticas de segurança e build Next.js.
`supabase test db` passou **106/106 pgTAP** em 14 arquivos após aplicação local
de `0024`. Nenhum resultado local concede
PASS ao staging ou ao HSP-4. O relatório operacional vigente é
`docs/audit-2026-09-23/HSP4_OPERATIONAL_RECHECK_2026-09-23.md`:
**NO-GO** para piloto e produção aberta. As cinco flags sensíveis seguem
desligadas. `PILOT-1` e Waves posteriores não foram iniciadas.

Naquela etapa, permaneciam pendentes: promoção e regressão hospedada do artefato exato;
convite fim a fim; backup gerenciado/RPO e drill de alerta com reconhecimento;
SLO p95 de 100 tenants; aceite do inventário de licenças; seletor explícito de
empresa para tenants com várias empresas reais; análise de arquivos reais;
causalidade documental por conclusão; aplicação de benefícios por plano; e
as Waves funcionais posteriores previstas no roadmap. A demo continua um
cenário **sintético**, sem promessa de precisão documental certificada.

## Auditoria do dossiê comercial e correções locais — registro histórico de 2026-09-23

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
Naquela etapa, faltava publicar o artefato exato mediante autorização e repetir os gates de
runtime hospedado. A execução histórica de 50 respostas
permanece no staging com referências antigas e não foi reescrita.

## Candidato local de UX e leitura — registro histórico pré-promoção de 2026-09-23

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

## Revisão histórica Hosted Staging & Pilot Readiness — 2026-09-20

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
