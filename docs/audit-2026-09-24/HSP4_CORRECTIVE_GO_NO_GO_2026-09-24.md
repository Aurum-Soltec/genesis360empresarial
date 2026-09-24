# Revisão corretiva HSP-4 — 2026-09-24

**Decisão: NO-GO COM CORREÇÕES OBJETIVAS.** O subgate de novo login do convidado passou e a cópia cifrada v2 corrigiu a captura futura de ACL. A carga de 100 empresas por 60 minutos continua acima do p95 aprovado; backup automático/retido com recuperação completa e licença do artefato continuam sem prova. Esta revisão substitui o estado operacional da [rechecagem anterior](../audit-2026-09-23/HSP4_FINAL_RECHECK_2026-09-23.md); resultados históricos permanecem rastreáveis. Nenhuma Wave após HSP-4 foi iniciada.

## A. Executive Summary

O runtime hospedado sob a prova integral permanece `bb290bc7bc35f77b4ca01aecdbf19b748c386270` (Railway web `ab3f2a2d-9507-4e24-8749-bc313c7691fa`, worker `96c1e771-c895-4f15-a8f5-157b4f97f892`). Nele, migration 0024, isolamento SQL 12/12, isolamento HTTP multi-role 12/12, FULL de 55 respostas e outbox foram comprovados. O run `662855c2dbd5` completou 3.604 s, 100/100 empresas, 24.512 requests, 5.806 escritas, 584 negativas cross-tenant esperadas e zero erro inesperado, mas falhou no p95 ≤750 ms. A investigação curta adicional confirma lentidão de streaming SSR e picos Auth, sem correção pequena comprovada.

O proprietário entrou novamente por senha usando o endereço exato do último convite e confirmou somente Tenant A. O Auth registrou `last_sign_in_at` posterior ao reteste nessa conta, e ela possui um único vínculo `member`. O primeiro login falhara porque havia usado o endereço principal, uma conta distinta da convidada mais recente. Nenhuma senha foi vista ou registrada.

No repositório privado, a PR #9 foi integrada e o run manual `36002104320` criou release cifrada imutável com 129 entradas ACL no TOC. O restore lógico v2 isolado verificou 102 tenants, 16 usuários Auth, 24 migrations e zero objetos Storage em 77,450 s após download. Isso ainda não demonstra owners/ACL efetivamente restaurados, RPO, RTO de serviço, agendamento ou 30 dias de retenção. O orçamento GitHub Actions da organização foi conferido em US$0 com interrupção de uso ativada, mas a franquia de minutos é compartilhada e pode esgotar.

Um candidato público local melhora a orientação de login, impede falsas referências documentais por resposta no roteiro fictício e classifica licenças de dependências de produção. `pnpm quality` passou localmente com 503 testes Vitest, 34 testes nativos, lint, tipos, verificações de integridade/segurança e build. **Esse candidato não foi promovido ao staging nem recebe crédito runtime** nesta revisão.

## B. Estado das Waves

| Wave | Estado nesta revisão | Limite |
| --- | --- | --- |
| HSP-0 | PASS histórico | PR #25 e checks anteriores do SHA hospedado; candidato local novo aguarda CI remoto. |
| HSP-1 | PASS para staging isolado, Auth convidado e FULL declarado; evidência documental real pending | Login novo do convidado e Tenant A corroborados; documento real continua sob flag OFF. |
| HSP-2 | BLOCKED | Drill de alerta #27 PASS; backup v2 manual/restore lógico PASS, porém automação, serviço, RPO/RTO e licença não passaram. |
| HSP-3 | FAIL no SLO | Duração, isolamento e outbox PASS no run integral; p95 login/Home/escrita/leitura acima de 750 ms. |
| HSP-4 | **NO-GO COM CORREÇÕES OBJETIVAS** | Não iniciar PILOT-1, produção aberta nem Waves posteriores. |

## C. Gates PASS / FAIL / BLOCKED

| Gate | Estado | Evidência objetiva |
| --- | --- | --- |
| CI e web/worker no mesmo SHA hospedado | PASS para `bb290bc`; novo candidato local pending | Checks quality/database/CodeQL e deployments SUCCESS no SHA funcional. |
| 0024 e isolamento entre membro, gestor e outro tenant | PASS | 12/12 SQL e 12/12 HTTP no `bb290bc`, fixture removido. |
| Diagnóstico FULL e relatório sintético | PASS para fluxo; fundamentação documental real pending | 55 respostas, score 48, cobertura 100%, confiança 78%; zero fontes vinculadas/verificadas no run independente. |
| Convite, e-mail, callback, novo login e tenant correto | **PASS no escopo observado** | Convite anterior HTTP 201/e-mail/callback; novo login humano e `last_sign_in_at` posterior; somente Tenant A confirmado. |
| Alerta externo e ACK | PASS | Issue pública #27: falha controlada, e-mail, ACK humano e recuperação. |
| Backup automático, retenção, ACL equivalente e recuperação de serviço | **BLOCKED** | v2 manual com 129 entradas ACL e restore lógico; sem agendamento, comparação de ACL/owners restaurados, RPO/RTO de serviço ou chave independente. |
| Inventário/NOTICE/disposição de licenças do artefato | **BLOCKED** | Candidato local classifica 9/30 dependências na árvore de produção; bytes Railway e decisão LGPL/CC-BY pendentes. |
| 100 empresas por 60 minutos com p95 ≤750 ms | **FAIL** | Run integral passou função/outbox/isolamento; p95 login 1.964,5, Home 1.055,48, escrita 1.024,5 e leitura 793,8 ms. |
| Cinco flags sensíveis OFF | PASS da configuração já observada | Agentic, Data Upload real, Qualification Network, Real Contact e Ecosystem desligadas. |

## D. Evidências novas e E. Mudanças

- [Novo login convidado](HSP4_INVITED_ACCOUNT_RETEST_2026-09-24.md): confirmação humana e leitura Auth redigida, sem credencial. Correção local da tela de entrada passou 9 testes focados.
- [Prova causal de latência](HSP4_PERFORMANCE_CAUSAL_PROBE_2026-09-24.md): 28 GETs Home e 28 API, bytes gzip/tempos de streaming, Auth paralelo e seriado; nenhuma mudança no runtime.
- [Backup v2 privado](https://github.com/Aurum-Soltec/genesis360-staging-backups/blob/main/HSP4_V2_MANUAL_PROOF_2026-09-24.md): PR #9 integrada, run `36002104320` no SHA privado `e82a09c103c96a693f2669f660a863248a3daa50`, release cifrada, TOC ACL 129 e restore lógico isolado. PRs #6/#7 continuam abertas; schedule OFF. PR #10 registra a prova.
- [Classificação técnica de licenças](HSP4_LICENSE_ENGINEERING_CANDIDATE.md): 30 declarações fora da preferência do ADR-015; 9 na árvore `pnpm --prod`, 21 fora dela. O candidato arquiva textos LICENSE/NOTICE e hashes no CI, mas ainda não inspecionou contêiner Railway.
- O roteiro local de demonstração deixa de distribuir três fontes fictícias genericamente entre respostas; exige zero referências por pergunta sem pertinência revisada e três fontes somente no diagnóstico. O relatório permanece explícito sobre zero fontes verificadas. Essa correção ainda não foi executada no staging.
- `tmp/` foi excluído da publicação Git e do lint local para impedir que worktrees, scripts operacionais e evidência privada entrem no candidato público. Nenhum dado privado foi incorporado.

## F. Problemas e correções

1. O login inicialmente falhou ao usar a conta Gmail principal, distinta do alias do convite mais recente. O reteste no endereço convidado passou; a UI local agora explica o uso do endereço completo e trata falha de rede sem travar.
2. O backup v1 omitia GRANT/REVOKE por `pg_dump --no-privileges`; o restore lógico v1 também suprimia owner/ACL. Em arquivo customizado, `pg_dump --no-owner` é ignorado, portanto a afirmação anterior de que esse flag remove owners do *arquivo* era imprecisa. A v2 não suprime ACL e recusa TOC sem entradas ACL, mas ainda não prova equivalência após restore.
3. O roteiro fictício atribuía fontes genéricas a respostas. O candidato local elimina vínculos não revisados; qualquer resultado histórico com essas referências deve ser tratado como contaminado e refeito.
4. A amostra de desempenho descartou peso do HTML/parse como principal causa, mas não isolou SQL, pool, geografia e Auth o suficiente para mudar arquitetura ou garantir p95.

## G. Segurança e isolamento multi-tenant

A prova de 0024 em SQL e HTTP permanece 12/12 + 12/12 no `bb290bc`; 584 negativas cross-tenant ocorreram conforme esperado na carga integral, sem vazamento observado. O novo login mostra apenas Tenant A para o convidado; não repetiu, por si só, todas as negativas cross-tenant. Nenhuma flag sensível foi habilitada e nenhuma credencial entrou em documentação, CI ou commit. Qualquer evidência de vazamento, corrupção/perda de dados ou segredo exposto reprovaria imediatamente a Wave.

## H. Auth e onboarding hospedados

O convite anterior comprovou HTTP 201, e-mail recebido, callback, sessão e membership Tenant A `member`. O proprietário saiu, tentou a conta principal e recebeu falha; após usar o alias exato do convite, entrou e viu somente Tenant A. Auth registra novo sign-in posterior nessa conta. **Subgate de novo login: PASS**, sem inferir que o formulário local ainda não implantado participou da prova.

## I. Worker, J. Observabilidade e alertas

No run integral, 5.806 fatos/eventos outbox foram pareados e processados, zero pending/dead/retries, worker p95 3.476,20 ms. A issue #27 comprovou falha controlada, alerta por e-mail, ACK humano e recuperação. O alerta de backup privado teve apenas ensaio sintético anterior sem entrega/ACK humano; cron continua OFF.

## K. Backup, restore, RPO e RTO

O run manual v2 produziu release cifrada imutável e checksum verificado, TOC com 129 entradas ACL e restore lógico em banco isolado de 102 tenants/16 Auth/24 migrations/zero Storage em 77,450 s após download. O resultado é de **leitura/restore lógico**, não de retorno de web, Auth, Storage e worker. O ensaio local de stack separado falhou duas vezes na saúde do Storage, sem tocar staging; não há RTO de serviço. Falta comparar ACL, owners e RLS após restore, executar a cadeia HTTP→Auth→Tenant Context→API→PostgreSQL→Outbox→Worker, registrar marcador para RPO real ≤24 h, medir RTO de serviço ≤30 min, comprovar schedule/retenção de 30 dias e validar chave fora deste computador. O orçamento Actions US$0 com Stop usage evita cobrança, mas dois runs por dia podem consumir até cerca de 1.800 minutos/mês num pool de 2.000 compartilhado; esgotamento pode interromper o controle.

## L. Carga de 100 tenants e M. Latência/saturação

O run `662855c2dbd5` continua a última carga completa: 3.604 s, 100/100 tenants, 24.512 requests, zero erro inesperado, 5.806 escritas, 584 negativas esperadas. Métricas p50/p95/p99 e CPU/memória/custo do mesmo run estão na [revisão anterior](../audit-2026-09-23/HSP4_FINAL_RECHECK_2026-09-23.md). Os quatro p95 do gate seguem FAIL. Na investigação curta adicional, Home p95 1.281 ms, primeiro byte 151 ms, streaming posterior 1.130 ms, HTML gzip 5.681 bytes; API GET p95 1.092 ms, contexto tenant 566 ms e dados 402 ms. Auth token teve picos de até 7.622 ms mesmo em logins seriados. São amostras pequenas e não substituem 60 minutos. Pool, conexões, slow queries e custo marginal ainda precisam de observação pareada ao próximo ensaio.

## N. FinOps

Foi visto no GitHub orçamento Actions da organização **US$0, Stop usage YES**, 244/2.000 minutos incluídos usados e cobrança líquida US$0 na leitura de 24/09. Isso é controle de gasto, não garantia de continuidade do backup após esgotamento da franquia. A Railway mantém o custo acumulado histórico US$0,4789304 do relatório anterior; não há custo marginal confiável por empresa ou por operação, nem previsão completa de Supabase.

## O. Débitos técnicos e P. Riscos para piloto

Principal risco operacional: p95 acima do SLO em login, Home, escrita e leitura. Segundo: backup ainda manual, sem restauração funcional do serviço, RPO/RTO e chave fora da máquina. Terceiro: licença exata do contêiner e disposição LGPL/CC-BY em aberto. A análise documental real e atribuição por pergunta seguem futuras sob flag Data Upload real OFF; o roteiro sintético corrigido evita falsificar proveniência, mas não cria uma prova documental real. A nova correção local e o inventário de CI precisam de execução remota no próprio commit antes de receber crédito de CI/runtime.

## Q. Acessos, decisões e intervenção humana

- **Proprietário:** guardar uma cópia recuperável da chave privada de backup fora deste computador e participar de uma verificação de decifragem com amostra sintética; nenhum segredo deve entrar no chat ou GitHub.
- **Proprietário:** aceitar ou rejeitar formalmente, após o drill completo, o backup autogerido em GitHub privado como controle equivalente ao requisito de backup gerenciado. O consentimento anterior cobriu avaliar e implementar, não deu PASS automático.
- **Proprietário/assessoria jurídica:** decidir a incorporação/obrigações dos componentes efetivamente distribuídos sob LGPL e CC-BY após inspeção do contêiner e notices completos. ISC/0BSD permissivas fora da allowlist preferencial também exigem registro técnico de equivalência, não aprovação implícita.
- **Engenharia:** corrigir a saúde do stack isolado e executar restore completo, schedule, monitor externo de backup atrasado com entrega/ACK, RPO/RTO e comparação de ACL/RLS; medir SQL/pool/Auth e testar alternativa curta de performance antes de gastar outro run de 60 minutos.

## R. Percentuais

**Fundação 92%, MVP 82%, V1 64%**, estimativas históricas mantidas. O login convidado e backup lógico v2 melhoram evidências de subgates, mas não fecham recuperação, SLO ou licença, nem autorizam elevar percentuais por conveniência.

## S. Declaração objetiva

- **100 TENANTS READY: NÃO.**
- **PILOTO CONTROLADO: NO-GO.**
- **PRODUÇÃO ABERTA: NO-GO.**

## T. Próxima ação recomendada e checklist de fechamento

1. **Desempenho (FAIL):** obter spans de Auth/SQL/pool no mesmo intervalo; comparar uma hipótese curta de correção, sem mudar região/contrato antes de ADR e prova. Só se o candidato mostrar margem robusta abaixo de 750 ms, repetir 100 empresas/60 min no SHA exato com p50/p95/p99, erros, conexões, slow queries, worker, quotas, CPU/memória e custo.
2. **Recuperação (BLOCKED):** concluir restauração isolada de serviço e owner/ACL/RLS, chave independente, cron com 30 dias de retenção e monitor externo/ACK; medir RPO ≤24 h e RTO ≤30 min. PR #6/#7 permanecem preparatórias, não PASS.
3. **Licenças (BLOCKED):** executar o inventário no CI Linux e conferir bytes reais do contêiner Railway; completar NOTICE e registrar decisão técnica/jurídica sobre os componentes efetivamente presentes.
4. **Candidato público:** publicar apenas após revisão do diff e CI verde; distinguir SHA de CI do SHA funcional hospedado. Repetir testes afetados por qualquer promoção. O login convidado já passou no runtime existente, mas a orientação visual local ainda carece de smoke hospedado se promovida.

Após essas provas, repetir HSP-4; se qualquer gate permanecer FAIL/BLOCKED, preservar **NO-GO**. A autorização termina em HSP-4, sem iniciar PILOT-1 automaticamente.
