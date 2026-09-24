# Revisão corretiva HSP-4 — 2026-09-24

**Decisão após promoção: NO-GO COM CORREÇÕES OBJETIVAS.** O PR #25 foi integrado e o mesmo SHA chegou a web e worker no staging; [o smoke hospedado](HSP4_PROMOTED_STAGING_SMOKE_2026-09-24.md) provou apenas rotas anônimas, navegação e leitura autenticada limitadas. O subgate de novo login do convidado passou e a cópia cifrada v2 corrigiu a captura futura de ACL. A carga de 100 empresas por 60 minutos no SHA anterior continua acima do p95 aprovado e não foi repetida no novo; backup automático/retido com recuperação completa e licença do artefato continuam sem prova. Esta revisão substitui o estado operacional da [rechecagem anterior](../audit-2026-09-23/HSP4_FINAL_RECHECK_2026-09-23.md); resultados históricos permanecem rastreáveis. Nenhuma Wave após HSP-4 foi iniciada.

## A. Executive Summary

O runtime **atual** é o merge commit `31df6086cb612886dc5db4a45b946ea80dde2cf1` (Railway web `09f91585-1ec8-47d9-9b2c-5c40950527f0`, worker `86828bcf-dd39-44a7-a94d-ef5819da766f`, ambos SUCCESS). A prova integral anterior pertence ao SHA `bb290bc7bc35f77b4ca01aecdbf19b748c386270`: migration 0024, isolamento SQL 12/12, HTTP multi-role 12/12, FULL de 55 respostas, outbox e carga de 100 empresas. O run `662855c2dbd5` completou 3.604 s, 100/100 empresas, 24.512 requests, 5.806 escritas, 584 negativas cross-tenant esperadas e zero erro inesperado, mas falhou no p95 ≤750 ms. O novo SHA passou um smoke limitado; não herdou automaticamente os PASS da prova integral. A investigação curta adicional confirma lentidão de streaming SSR e picos Auth no SHA anterior, sem correção pequena comprovada.

O proprietário entrou novamente por senha usando o endereço exato do último convite e confirmou somente Tenant A. O Auth registrou `last_sign_in_at` posterior ao reteste nessa conta, e ela possui um único vínculo `member`. O primeiro login falhara porque havia usado o endereço principal, uma conta distinta da convidada mais recente. Nenhuma senha foi vista ou registrada.

No repositório privado, a PR #9 foi integrada e o run manual `36002104320` criou release cifrada imutável com 129 entradas ACL no TOC. O restore lógico v2 isolado verificou 102 tenants, 16 usuários Auth, 24 migrations e zero objetos Storage em 77,450 s após download. A PR #7 do cron guardado foi integrada no SHA privado `051a76d3565f79eac2c9674720d263f969b4803b`, mas as variáveis de ativação/atestação estão ausentes e o schedule continua OFF. A PR #6 do scaffold de recuperação de serviço também foi integrada, SHA privado `10214da0746ac4824fffe34cee512576ce875898`; 34 testes locais PASS e um caso de symlink SKIP no Windows são preparação de código, sem restore executado. Isso ainda não demonstra owners/ACL efetivamente restaurados, RPO, RTO de serviço, backup agendado ou 30 dias de retenção. O orçamento GitHub Actions da organização foi conferido em US$0 com interrupção de uso ativada, mas a franquia de minutos é compartilhada e pode esgotar.

O último commit com alterações de código do [PR #25](https://github.com/Aurum-Soltec/genesis360empresarial/pull/25) é `6d4d569be50acc03999eebb23faa1dfc10fc7725`. Ele inclui orientação de login, correção de proveniência no roteiro fictício, classificação de licenças, instrumentação numérica de latência e correção da corrida de espera no runner. `pnpm quality` passou localmente com 506 testes Vitest, 34 testes nativos, lint, tipos, segurança e build; quality, database, CodeQL e Analyze passaram nos runs finais [36009033246](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/36009033246) e [36009024373](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/36009024373). O predecessor `40b9b82` passara CI com 503 Vitest; o commit intermediário `a903` falhara somente por hashes CRLF/LF, corrigidos em `6d4d569`. O PR foi integrado à `main` em `31df6086` e esse **mesmo artefato** foi promovido ao staging. O crédito runtime do novo SHA limita-se ao smoke documentado; o roteiro FULL corrigido, as negativas multi-role e a carga não foram repetidos.

## B. Estado das Waves

| Wave | Estado nesta revisão | Limite |
| --- | --- | --- |
| HSP-0 | PASS histórico; CI corretivo PASS; promoção identificada | PR #25 integrado em `31df6086`; quality, database, CodeQL e Analyze PASS. Web e worker no mesmo SHA SUCCESS. |
| HSP-1 | Staging isolado e smoke autenticado PASS limitado; FULL corrigido e isolamento multi-role no novo SHA pendentes | Login novo do convidado e Tenant A corroborados. No SHA promovido, acesso anônimo negado, UI autenticada Tenant A, Passport, administração e relatório existentes lidos. Roteiro corrigido: duas contas sintéticas passaram Auth antes da promoção, porém runner sem escolha de tenant e sem escrita; a UI posterior mostrou membership de uma delas, logo a causa é indeterminada. Documento real continua sob flag OFF. |
| HSP-2 | BLOCKED | Drill de alerta #27 PASS; backup v2 manual/restore lógico PASS, porém automação, serviço, RPO/RTO e licença não passaram. |
| HSP-3 | FAIL no SLO histórico; novo SHA não retestado | Duração, isolamento e outbox PASS no run integral `bb290bc`; p95 login/Home/escrita/leitura acima de 750 ms. Nenhum run 100×60 no `31df6086`. |
| HSP-4 | **NO-GO COM CORREÇÕES OBJETIVAS** | Não iniciar PILOT-1, produção aberta nem Waves posteriores. |

## C. Gates PASS / FAIL / BLOCKED

| Gate | Estado | Evidência objetiva |
| --- | --- | --- |
| CI e web/worker no mesmo SHA hospedado | **PASS** para `31df6086` | Checks finais quality/database/CodeQL/Analyze PASS; web e worker SUCCESS no mesmo merge commit. |
| 0024 e isolamento entre membro, gestor e outro tenant | PASS histórico; repetição no novo SHA **PENDING** | 12/12 SQL e 12/12 HTTP no `bb290bc`, fixture removido. No `31df6086`, somente negativas anônimas e sessão Tenant A foram observadas; não equivalem a matriz multi-role. |
| Diagnóstico FULL e relatório sintético | PASS histórico para fluxo; readback novo limitado; reteste do roteiro corrigido **PENDING**; fundamentação documental real pending | Run anterior: 55 respostas, score 48, cobertura 100%, confiança 78%, zero fontes vinculadas/verificadas. No `31df6086`, o relatório existente mostrou 55 respostas/zero referências/zero fontes vinculadas ou verificadas e a demo 6/7. Nenhum novo FULL concluiu no novo SHA; runner autenticou duas contas antes da promoção, mas não selecionou tenant nem escreveu. A UI posterior encontrou Tenant A para uma das contas, sem explicar a divergência. |
| Convite, e-mail, callback, novo login e tenant correto | **PASS no escopo observado** | Convite anterior HTTP 201/e-mail/callback; novo login humano e `last_sign_in_at` posterior; somente Tenant A confirmado. |
| Alerta externo e ACK | PASS | Issue pública #27: falha controlada, e-mail, ACK humano e recuperação. |
| Backup automático, retenção, ACL equivalente e recuperação de serviço | **BLOCKED** | v2 manual com 129 entradas ACL e restore lógico. PRs privadas #6/#7 integradas como preparação; nenhum restore de serviço executado, schedule OFF, sem comparação de ACL/owners restaurados, RPO/RTO de serviço ou chave independente. |
| Inventário/NOTICE/disposição de licenças do artefato | **BLOCKED** | CI Linux do `40b9b82` classifica 9/30 dependências na árvore de produção e arquiva hashes/textos instalados; bytes Railway, NOTICE completo e decisão LGPL/CC-BY pendentes. |
| 100 empresas por 60 minutos com p95 ≤750 ms | **FAIL** | Run integral passou função/outbox/isolamento; p95 login 1.964,5, Home 1.055,48, escrita 1.024,5 e leitura 793,8 ms. |
| Cinco flags sensíveis OFF | PASS da configuração observada no novo SHA | Agentic, Data Upload real, Qualification Network, Real Contact e Ecosystem desligadas na administração autenticada. |

## D. Evidências novas e E. Mudanças

- [Promoção e smoke do mesmo SHA](HSP4_PROMOTED_STAGING_SMOKE_2026-09-24.md): PR #25 integrado em `31df6086`, CI final verde, web/worker SUCCESS no mesmo commit, negativas anônimas, Tenant A autenticado, quatro destinos superiores, administração/Passport/demo/relatório existentes. A demo mostrou 6/7 etapas porque fontes fictícias não estavam vinculadas/verificadas; nenhuma conclusão documental real foi promovida.
- [Novo login convidado](HSP4_INVITED_ACCOUNT_RETEST_2026-09-24.md): confirmação humana e leitura Auth redigida, sem credencial. Correção local da tela de entrada passou 9 testes focados.
- [Prova causal de latência](HSP4_PERFORMANCE_CAUSAL_PROBE_2026-09-24.md): 28 GETs Home e 28 API, bytes gzip/tempos de streaming, Auth paralelo e seriado no SHA anterior. Instrumentação numérica em tenant-context/API de fatos passou 27 testes focados e está implantada em `31df6086`, mas ainda não produziu medição hospedada nem correção de p95.
- [Backup v2 privado](https://github.com/Aurum-Soltec/genesis360-staging-backups/blob/main/HSP4_V2_MANUAL_PROOF_2026-09-24.md): PR #9 integrada, run `36002104320` no SHA privado `e82a09c103c96a693f2669f660a863248a3daa50`, release cifrada, TOC ACL 129 e restore lógico isolado. PR #7 do cron guardado integrada no SHA `051a76d`; variáveis de ativação ausentes e schedule OFF. PR #6 do scaffold de recuperação integrada no SHA `10214da`, 34 testes PASS e um SKIP Windows; nenhum restore de serviço. PR #10 registra a prova.
- [Classificação técnica de licenças](HSP4_LICENSE_ENGINEERING_CANDIDATE.md): 30 declarações fora da preferência do ADR-015; 9 na árvore `pnpm --prod`, 21 fora dela. O [CI Linux do commit `40b9b82`](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/36004585089) arquivou hashes dos 30 pacotes instalados e 28 arquivos LICENSE/NOTICE copiados; três pacotes não trouxeram arquivo LICENSE/NOTICE local. Isso ainda não inspeciona o contêiner Railway.
- O roteiro de demonstração promovido deixa de distribuir três fontes fictícias genericamente entre respostas; exige zero referências por pergunta sem pertinência revisada e três fontes somente no diagnóstico. Uma corrida de espera do runner foi corrigida. O reteste automatizado anterior à promoção foi tentado com duas contas sintéticas protegidas; ambas passaram Auth, mas o runner retornou zero opções de tenant, sem escrita. Uma sessão UI posterior para uma dessas contas mostrou Tenant A, de modo que a causa da divergência permanece indeterminada. O roteiro corrigido ainda não concluiu no staging.
- Um ajuste posterior do runner passou a aguardar o título renderizado da seleção de empresa; é **local e posterior ao deployment `31df6086`**, sem crédito de runtime ou diagnóstico da causa até novo reteste.
- `tmp/` foi excluído da publicação Git e do lint local para impedir que worktrees, scripts operacionais e evidência privada entrem no candidato público. Nenhum dado privado foi incorporado.

## F. Problemas e correções

1. O login inicialmente falhou ao usar a conta Gmail principal, distinta do alias do convite mais recente. O reteste no endereço convidado passou; a UI local agora explica o uso do endereço completo e trata falha de rede sem travar.
2. O backup v1 omitia GRANT/REVOKE por `pg_dump --no-privileges`; o restore lógico v1 também suprimia owner/ACL. Em arquivo customizado, `pg_dump --no-owner` é ignorado, portanto a afirmação anterior de que esse flag remove owners do *arquivo* era imprecisa. A v2 não suprime ACL e recusa TOC sem entradas ACL, mas ainda não prova equivalência após restore.
3. O roteiro fictício atribuía fontes genéricas a respostas. O commit corretivo público `40b9b82`, agora promovido via `31df6086`, elimina vínculos não revisados; qualquer resultado histórico com essas referências deve ser tratado como contaminado e refeito. O reteste do roteiro corrigido parou após Auth por zero opções de tenant, sem escrever ou produzir novo relatório. A UI posterior encontrou Tenant A para uma das contas; a causa da divergência permanece em investigação.
4. A amostra de desempenho descartou peso do HTML/parse como principal causa, mas não isolou SQL, pool, geografia e Auth o suficiente para mudar arquitetura ou garantir p95. A instrumentação numérica implantada passou 27 testes focados, ainda sem medição hospedada.

## G. Segurança e isolamento multi-tenant

A prova de 0024 em SQL e HTTP permanece 12/12 + 12/12 **no SHA histórico `bb290bc`**; 584 negativas cross-tenant ocorreram conforme esperado na carga integral anterior, sem vazamento observado. No `31df6086`, negativas anônimas e sessão Tenant A foram observadas, mas **a matriz SQL/HTTP multi-role não foi repetida**. O novo login mostra apenas Tenant A para o convidado; não repetiu, por si só, todas as negativas cross-tenant. Nenhuma flag sensível foi habilitada e nenhuma credencial entrou em documentação, CI ou commit. Qualquer evidência de vazamento, corrupção/perda de dados ou segredo exposto reprovaria imediatamente a Wave.

## H. Auth e onboarding hospedados

O convite anterior comprovou HTTP 201, e-mail recebido, callback, sessão e membership Tenant A `member`. O proprietário saiu, tentou a conta principal e recebeu falha; após usar o alias exato do convite, entrou e viu somente Tenant A. Auth registra novo sign-in posterior nessa conta. **Subgate de novo login: PASS**, sem inferir que o formulário local ainda não implantado participou da prova.

## I. Worker, J. Observabilidade e alertas

No run integral **do SHA anterior**, 5.806 fatos/eventos outbox foram pareados e processados, zero pending/dead/retries, worker p95 3.476,20 ms. O novo deployment worker `86828bcf` terminou SUCCESS, mas não recebeu novo ensaio outbox fim a fim nesta revisão. A issue #27 comprovou falha controlada, alerta por e-mail, ACK humano e recuperação. O alerta de backup privado teve apenas ensaio sintético anterior sem entrega/ACK humano; cron continua OFF.

## K. Backup, restore, RPO e RTO

O run manual v2 produziu release cifrada imutável e checksum verificado, TOC com 129 entradas ACL e restore lógico em banco isolado de 102 tenants/16 Auth/24 migrations/zero Storage em 77,450 s após download. O resultado é de **leitura/restore lógico**, não de retorno de web, Auth, Storage e worker. O scaffold de restore de serviço da PR #6 está integrado e seus 34 testes locais passaram (um symlink SKIP no Windows), mas nenhuma restauração funcional foi executada. O ensaio local de stack separado falhou duas vezes na saúde do Storage, sem tocar staging; não há RTO de serviço. Falta comparar ACL, owners e RLS após restore, executar a cadeia HTTP→Auth→Tenant Context→API→PostgreSQL→Outbox→Worker, registrar marcador para RPO real ≤24 h, medir RTO de serviço ≤30 min, comprovar schedule/retenção de 30 dias e validar chave fora deste computador. O orçamento Actions US$0 com Stop usage evita cobrança, mas dois runs por dia podem consumir até cerca de 1.800 minutos/mês num pool de 2.000 compartilhado; esgotamento pode interromper o controle.

## L. Carga de 100 tenants e M. Latência/saturação

O run `662855c2dbd5` no **SHA anterior** continua a última carga completa: 3.604 s, 100/100 tenants, 24.512 requests, zero erro inesperado, 5.806 escritas, 584 negativas esperadas. Métricas p50/p95/p99 e CPU/memória/custo do mesmo run estão na [revisão anterior](../audit-2026-09-23/HSP4_FINAL_RECHECK_2026-09-23.md). Os quatro p95 do gate seguem FAIL. Na investigação curta adicional, Home p95 1.281 ms, primeiro byte 151 ms, streaming posterior 1.130 ms, HTML gzip 5.681 bytes; API GET p95 1.092 ms, contexto tenant 566 ms e dados 402 ms. Auth token teve picos de até 7.622 ms mesmo em logins seriados. A instrumentação numérica foi promovida, mas ainda não gerou spans hospedados nem demonstra melhoria. São amostras pequenas e não substituem 60 minutos. Pool, conexões, slow queries e custo marginal ainda precisam de observação pareada ao próximo ensaio no `31df6086` ou sucessor.

## N. FinOps

Foi visto no GitHub orçamento Actions da organização **US$0, Stop usage YES**, 244/2.000 minutos incluídos usados e cobrança líquida US$0 na leitura de 24/09. Isso é controle de gasto, não garantia de continuidade do backup após esgotamento da franquia. A Railway mantém o custo acumulado histórico US$0,4789304 do relatório anterior; não há custo marginal confiável por empresa ou por operação, nem previsão completa de Supabase.

## O. Débitos técnicos e P. Riscos para piloto

Principal risco operacional: p95 acima do SLO em login, Home, escrita e leitura na última carga integral; o SHA promovido ainda não recebeu novo ensaio 100×60. Segundo: backup ainda manual, sem restauração funcional do serviço, RPO/RTO e chave fora da máquina. Terceiro: licença exata do contêiner e disposição LGPL/CC-BY em aberto. A análise documental real e atribuição por pergunta seguem futuras sob flag Data Upload real OFF; o roteiro sintético corrigido evita falsificar proveniência, mas não cria uma prova documental real. O `31df6086` recebeu crédito de CI e smoke hospedado limitado, porém as alterações de interface/roteiro não foram reexecutadas até um novo FULL; duas tentativas automatizadas anteriores passaram Auth e pararam sem selecionar tenant ou escrever, enquanto a UI posterior encontrou Tenant A para uma dessas contas. A causa não foi demonstrada. Após qualquer correção, repetir os testes afetados.

## Q. Acessos, decisões e intervenção humana

- **Proprietário:** guardar uma cópia recuperável da chave privada de backup fora deste computador e participar de uma verificação de decifragem com amostra sintética; nenhum segredo deve entrar no chat ou GitHub.
- **Proprietário:** aceitar ou rejeitar formalmente, após o drill completo, o backup autogerido em GitHub privado como controle equivalente ao requisito de backup gerenciado. O consentimento anterior cobriu avaliar e implementar, não deu PASS automático.
- **Proprietário/assessoria jurídica:** decidir a incorporação/obrigações dos componentes efetivamente distribuídos sob LGPL e CC-BY após inspeção do contêiner e notices completos. ISC/0BSD permissivas fora da allowlist preferencial também exigem registro técnico de equivalência, não aprovação implícita.
- **Engenharia:** corrigir a saúde do stack isolado e executar restore completo, schedule, monitor externo de backup atrasado com entrega/ACK, RPO/RTO e comparação de ACL/RLS; repetir 0024 e matriz HTTP multi-role no SHA promovido; medir SQL/pool/Auth e testar alternativa curta de performance antes de gastar outro run de 60 minutos. Investigar a divergência entre o runner sem opções de tenant e a UI que mostrou Tenant A para uma das mesmas contas; não presumir fixture sem membership.
- **Fronteira de credenciais:** a revisão automática rejeitou a execução de um wrapper privilegiado e leitura indireta de senha porque injetariam service role no agente. Não houve bypass nem uso desse caminho. O reteste precisa de execução protegida que mantenha a service role fora do agente; nenhum segredo deve ser enviado ao chat ou ao repositório.

## R. Percentuais

**Fundação 92%, MVP 82%, V1 64%**, estimativas históricas mantidas. O login convidado e backup lógico v2 melhoram evidências de subgates, mas não fecham recuperação, SLO ou licença, nem autorizam elevar percentuais por conveniência.

## S. Declaração objetiva

- **100 TENANTS READY: NÃO.**
- **PILOTO CONTROLADO: NO-GO.**
- **PRODUÇÃO ABERTA: NO-GO.**

## T. Próxima ação recomendada e checklist de fechamento

1. **Desempenho (FAIL):** obter spans de Auth/SQL/pool no mesmo intervalo; comparar uma hipótese curta de correção, sem mudar região/contrato antes de ADR e prova. Só se o candidato mostrar margem robusta abaixo de 750 ms, repetir 100 empresas/60 min no SHA exato com p50/p95/p99, erros, conexões, slow queries, worker, quotas, CPU/memória e custo.
2. **Recuperação (BLOCKED):** concluir restauração isolada de serviço e owner/ACL/RLS, chave independente, ativação guardada do cron com 30 dias de retenção e monitor externo/ACK; medir RPO ≤24 h e RTO ≤30 min. PRs #6/#7 foram integradas como preparação de código; não houve restore de serviço e o cron permanece inativo. Nenhuma delas concede PASS.
3. **Licenças (BLOCKED):** conferir os bytes reais do contêiner Railway com o inventário Linux já produzido pelo CI; completar NOTICE e registrar decisão técnica/jurídica sobre os componentes efetivamente presentes.
4. **Artefato promovido:** o PR #25 integrou `31df6086`; web e worker no staging estão no mesmo SHA e o smoke limitado passou. Repetir nesse SHA a matriz de isolamento SQL/HTTP multi-role após 0024 e um novo fluxo FULL até relatório, pois os PASS completos pertencem ao `bb290bc` histórico. Verificar a orientação visual de login em um fluxo hospedado apropriado sem expor senha.
5. **Proveniência sintética (PENDING):** diagnosticar a divergência do runner sem opções de tenant com a UI que encontrou Tenant A, usando execução protegida sem service role no agente; repetir o roteiro corrigido até o relatório e verificar zero fontes atribuídas a respostas sem pertinência. Isso não substitui o gate futuro de documentação real sob flag OFF.

Após essas provas, repetir HSP-4; se qualquer gate permanecer FAIL/BLOCKED, preservar **NO-GO**. A autorização termina em HSP-4, sem iniciar PILOT-1 automaticamente.
