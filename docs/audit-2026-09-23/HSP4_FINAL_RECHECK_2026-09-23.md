# HSP-4 — rechecagem hospedada A–T, estado provisório

**Data:** 2026-09-23. **Estado:** RECHECAGEM EM ANDAMENTO; **NO-GO vigente**. Este relatório ainda não encerra a HSP-4. A prova fim a fim de 100 empresas por 60 minutos, backup recuperável e disposição de licenças continuam abertos. Nenhuma Wave após HSP-4 foi iniciada. Somente execução no artefato identificado recebe crédito de runtime; a revisão de 20/09 permanece histórica.

## A. Executive Summary

O candidato hospedado identificado por SHA completo **8df90d955479ffee98a62b7334faf1a172ec78a5** passou quality, database e CodeQL; Railway web **45c64cf2-bd03-468c-80e4-8086c6489b15** e worker **2d8d5fe3** reportaram SUCCESS nesse SHA no projeto isolado de staging. A migration 0024 passou 12/12 assertions RLS hospedadas no banco. O convite controlado chegou por e-mail, criou sessão e mostrou somente Tenant A; o proprietário confirmou definição de senha e acesso, mas ainda não comprovou sair e entrar novamente por senha. O alerta simulado foi recebido por e-mail, reconhecido pelo operador e recuperado. A carga curta de 30 segundos preservou as negativas entre tenants na amostra, mas p95 de login, Home, escrita e leitura excedeu 750 ms. O ensaio atual de 60 minutos ainda não terminou. Backup completo com retenção, RPO/RTO reais e licença LGPL permanecem sem PASS.

## B. Estado de cada Wave HSP-0 a HSP-4

| Wave | Estado | Evidência e limite |
| --- | --- | --- |
| HSP-0 — Baseline e repositório | PASS histórico; CI do candidato PASS | Repositório organizacional protegido, PR e CI; checks quality, database e CodeQL do SHA 8df90d9 aprovados. |
| HSP-1 — Staging isolado | PASS parcial; gate de onboarding ainda aberto | Web/worker no mesmo SHA, migrations 0001–0024, 0024 RLS 12/12; convite/e-mail/callback/sessão/Tenant A comprovados no 6737406. Falta novo login humano por senha após logout e repetição do FULL afetado no artefato mais recente. |
| HSP-2 — Segurança, observabilidade e recuperação | BLOCKED | Alerta externo e ACK humano passaram em #27; cinco flags OFF. Backup retido/restore/RPO/RTO e licença do artefato ainda bloqueiam a Wave. |
| HSP-3 — Prova de 100 tenants | FAIL de p95; 60 minutos PENDING | Smoke de 30 s no 8df90d9: 10 logins, 50 tenants, 340 requests, 50 escritas, 10 negações cross-tenant esperadas e zero erro. p95 de quatro operações acima de 750 ms. |
| HSP-4 — PRR hospedada | RECHECAGEM EM ANDAMENTO; NO-GO vigente | Não liberar piloto nem produção aberta antes de todos os gates objetivos. |

## C. PASS / FAIL / BLOCKED por Gate

| Gate | Estado | Critério observado ou pendência |
| --- | --- | --- |
| CI e web/worker no mesmo SHA | PASS limitado | quality/database/CodeQL PASS e ambos os deployments SUCCESS em 8df90d955479ffee98a62b7334faf1a172ec78a5. Deployment SUCCESS não comprova operação contínua. |
| Migration 0024 e RLS hospedada | PASS no banco | 12/12 assertions com papéis autenticados sintéticos, ROLLBACK e zero resíduos. Sessões HTTP distintas de membro/gestor/outro tenant não foram repetidas. |
| Diagnóstico FULL e relatório | PASS limitado no SHA anterior | 55 respostas, score 48, cobertura 100%, confiança 78% em 5e6e836; zero documentos vinculados ou verificados. Repetir fluxo/tela afetados no SHA atual. |
| Convite e onboarding | PASS parcial | HTTP 201, usuário Auth, membership somente Tenant A, audit, e-mail, callback, sessão app e negação da área administrativa ao membro comprovados em 6737406. Senha definida e acesso confirmados pelo proprietário; login novo após logout ainda PENDING. |
| Alerta, entrega e ACK | PASS do drill controlado | Issue #27 registrou falha sintética, recuperação, recebimento por e-mail e ACK do operador; foi fechada após reconhecimento. O comentário público do ACK precisou ser sanitizado por conter conteúdo citado da notificação; cache externo residual não é verificável. |
| Backup automático/retido e recuperação | BLOCKED | Repo privado e blueprint manual criados; zero backups reais, zero agendamento, zero prova de retenção, restore, RPO ou RTO representativos. |
| Licenças do artefato | BLOCKED | SBOM Linux anterior de 455 entradas contém libvips LGPL-3.0-or-later; composição final, notices, scan com decisão e disposição técnica/jurídica faltam. |
| 100 tenants/60 min e p95 ≤750 ms | FAIL de latência; duração PENDING | Smoke de 30 s visita 50/100 tenants; p95 login 2164,45 ms, Home 1326,37 ms, escrita 1512,60 ms e leitura 1174,80 ms. Sem prova de 60 min no 8df90d9. |
| Cinco flags sensíveis | PASS de configuração observada | Agentic, Data Upload para usuários reais, Qualification Network, Real Contact e Ecosystem continuam desligadas; nenhuma ativação é autorizada nesta Wave. |

## D. Evidências produzidas

- Prova de 0024: hosted-diagnostic-rls-2026-09-23.md, .sql e .json, com 12/12 asserts e ROLLBACK.
- Fluxo de convite: hosted-invite-recheck-2026-09-23.md, com separação entre prova runtime e confirmação humana; não publica endereço, senha ou tokens.
- Drill externo: [issue pública #27](https://github.com/Aurum-Soltec/genesis360empresarial/issues/27), com falha simulada, recuperação, ACK e fechamento; o texto do ACK foi editado para remover a notificação citada.
- Smoke de carga: test-results/hsp3-smoke-8df90d9.json, run af3269d3df91, ligado a web deployment 45c64cf2-bd03-468c-80e4-8086c6489b15. O arquivo local precisa de cópia sanitizada/versionada se for exigida reprodutibilidade externa.
- Backup: HSP2_PRIVATE_GITHUB_BACKUP_ADR_PROPOSAL_2026-09-23.md e repositório privado separado genesis360-staging-backups, PR #1 incorporado no SHA fd593c1; blueprint manual-only e 15 testes sintéticos, sem snapshot.
- Licenças: HSP4_LICENSE_DISPOSITION_2026-09-23.md e SBOM de CI Linux. Esta nota ainda exige vínculo byte a byte ao artefato final.

## E. Mudanças realizadas

O candidato preserva a baseline V1.2.1 RC2 + Production & Scale Foundation, a arquitetura PostgreSQL/Supabase, tenancy, RLS, Trusted Data Access Boundary, outbox/worker e quotas. Foram corrigidos callback de convite com fragmento implícito, formulário de autenticação antes da hidratação, classificação de sessão ausente como 401, menção do operador pelo bot do monitor e distinção entre fontes fictícias registradas e fontes efetivamente vinculadas. A melhoria de autenticação da Proxy foi medida como candidata, sem crédito de SLO. O repositório privado de backup contém somente blueprint manual, sem credenciais ou dados. Cada correção requer repetição dos gates afetados.

## F. Problemas encontrados e correções

1. O link de convite redirecionou à raiz com fragmento implícito; o fluxo corrigido removeu o fragmento da URL, validou sessão e abriu /nova-senha. Reteste hospedado confirmou sessão e Tenant A, mas não novo login após logout.
2. Formulários Auth podiam tentar submissão GET antes da hidratação. O SHA 8df90d9 introduziu guarda e testes; o smoke posterior autenticou 10 contas sintéticas. Isso não substitui uma rechecagem completa de recuperação de acesso e convite humano nesse SHA.
3. O monitor anterior criava issue sem notificação útil. O bot mencionou o operador; o e-mail chegou e recebeu ACK. O ACK por resposta ao e-mail trouxe conteúdo citado para uma issue pública; o comentário foi sanitizado e rechecado. Cópias externas/cache do texto anterior não podem ser descartadas por observação do GitHub.
4. A carga histórica e o smoke atual excederam p95 ≤750 ms. Medidas separadas apontam latência hospedada no caminho de aplicação/DB; não aplicar otimização adicional nem crédito de escala sem gargalo medido e novo ensaio comparável.
5. O pacote da demo tinha três fontes fictícias cadastradas, mas zero vinculadas ao novo relatório. A UI corrigida distingue esses estados. Nenhum documento real ou referência por pergunta foi verificado.
6. O SBOM de CI revelou libvips LGPL fora da preferência do ADR-015; inventário e disposição final continuam pendentes.

## G. Segurança e isolamento multi-tenant

A migration 0024 foi aplicada append-only. Em transação hospedada com SET LOCAL ROLE authenticated e sujeitos JWT distintos, membro não leu fatos sensíveis, gestor viu somente seus fatos permitidos e outro tenant não leu dados do primeiro: 12/12 PASS, ROLLBACK e nenhum fixture residual. No smoke atual, 10 negativas cross-tenant esperadas ocorreram e não houve falha funcional, mas apenas 50 tenants foram visitados. Isso não equivale a três sessões HTTP de papéis diferentes nem ao ensaio integral de 100 empresas.

## H. Auth e onboarding hospedados

O convite do tenant fictício obteve HTTP 201, usuário Auth, vínculo member apenas no Tenant A e audit membership.invited. E-mail recebido, callback com remoção do fragmento, sessão app, seleção exclusiva de Tenant A e Home foram observados; acesso à administração retornou 404 para esse membro. O proprietário confirmou definição de senha e acesso, apoiado por consulta Auth apenas booleana; last_sign_in_at disponível não prova novo login por senha depois do callback. O SHA 8df90d9 corrigiu o formulário pré-hidratação e autenticou 10 contas sintéticas no smoke. O subgate de login novo do usuário convidado segue PENDING; não reutilizar o link de convite para simular essa prova.

## I. Worker contínuo

O worker 2d8d5fe3 chegou a SUCCESS no mesmo SHA do web. O evento passport.fact.created processado em 1,247 s é evidência de artefato anterior. Ainda não há, neste ciclo, série contínua no 8df90d9 com latência do worker, backlog, retries e dead jobs durante 60 minutos. Deployment SUCCESS e 50 escritas do smoke não comprovam por si sós processamento de outbox.

## J. Observabilidade e alertas

O monitor registrou falha sintética manual_alert_drill na issue #27, comentou recuperação após probes saudáveis e manteve a issue aberta até ACK. O operador confirmou notificação recebida por e-mail e comentou ACK às 23:42:06 UTC; a issue foi fechada às 23:49:58 UTC. O comentário inicialmente continha parte do e-mail de notificação; foi editado para somente o reconhecimento e verificado sem os links de notificação. O risco residual de cache ou cópia externa permanece registrado. O subgate deste drill está PASS; disponibilidade e escalonamento por múltiplos operadores não foram provados.

## K. Backup, restore, RPO e RTO

O restore lógico histórico de dataset pequeno mediu 3,179 s e não é RTO de serviço. O proprietário autorizou avaliar e implementar alternativa gratuita num repo GitHub privado; genesis360-staging-backups foi criado privado, immutable releases enabled=true e PR privado #1 foi incorporado no SHA fd593c1. O blueprint é manual-only; 15 testes sintéticos passaram. Não há credenciais instaladas, snapshot, release de backup, agendamento, retenção efetiva, restauração externa nem RPO/RTO reais. GitHub Releases é autogerido e não cumpre literalmente o requisito de backup gerenciado sem decisão expressa de controle equivalente. **Gate BLOCKED.**

## L. Carga de 100 tenants

O run histórico de 20/09 durou 3.600,9 s, visitou 100 tenants, executou 18.610 requests e 600 negativas esperadas com zero falhas funcionais, mas falhou em p95. No 8df90d9, smoke af3269d3df91 durou 30 s e executou 10 logins, 340 requests, 50 escritas e 10 negativas esperadas, visitando 50/100 tenants com zero erro inesperado. A fixture de 100 empresas continua disponível de modo temporário e privado. **O ensaio de 60 minutos no SHA atual ainda não foi concluído; HSP-3 não passa.** O run anterior 6737406 abortou no preflight e não conta como ensaio de 60 minutos.

## M. p50 / p95 / p99 / error rate / saturação

| Operação, smoke 30 s | p50 | p95 | p99 | Amostras |
| --- | ---: | ---: | ---: | ---: |
| Login | 2.050,55 ms | 2.164,45 ms | 2.164,45 ms | 10 |
| Troca de tenant | 460,20 ms | 721,00 ms | 791,80 ms | 50 |
| Home | 1.038,99 ms | 1.326,37 ms | 1.616,31 ms | 50 |
| Escrita de fato | 1.040,40 ms | 1.512,60 ms | 1.575,30 ms | 50 |
| Leitura de fato | 759,30 ms | 1.174,80 ms | 1.253,90 ms | 50 |
| Negativa cross-tenant | 492,10 ms | 695,10 ms | 695,10 ms | 10 |

Error rate no smoke: **0%** em 340 requests observadas. Railway reportou, na janela consultada, p95 Home **1.166 ms**, escrita **1.377 ms** e geral **842 ms**; a janela do provedor não equivale à amostra controlada. Não há série completa da mesma janela de 60 minutos de pool, conexões, slow queries, outbox, worker latency, retries, dead jobs, quotas, CPU, memória ou saturação. O limite de 750 ms falha nos dados disponíveis.

## N. FinOps inicial

O painel Railway mostrava custo acumulado de **US$ 0,394** na consulta desta rechecagem; isso não é custo total de Supabase/GitHub nem custo por tenant. O objetivo de usar soluções gratuitas permanece, com risco de limite de franquia durante carga e backup. Custo por operação e projeção após 60 minutos continuam PENDING; não presumir gratuidade ilimitada.

## O. Débitos técnicos restantes

Backup externo automático, retenção e restore operacional com Storage; RPO/RTO; composição exata do bundle Linux, notices e decisão LGPL; carga 100 tenants/60 min com SLO; isolamento HTTP multi-role; novo login do usuário convidado; observação contínua do worker; causalidade documento→conclusão; análise de arquivo real apenas após gate jurídico/segurança; calibração e superfícies de V1 futuras.

## P. Riscos para piloto

Latência acima do SLO, recuperação não medida, dependência de conta GitHub única para cópia autogerida, licença sem disposição, ausência de prova de login novo, leituras fictícias interpretadas como verificadas e possíveis cópias externas do comentário de ACK antes da sanitização. Vazamento cross-tenant, corrupção/perda de dados ou exposição de secret material produz FAIL imediato da Wave correspondente.

## Q. Acessos e decisões humanas pendentes

O proprietário aprovou avaliar/implementar backup GitHub privado, mas ainda precisa prover por cofre a configuração de exportação, CA e guarda separada da chave privada, verificar orçamento/franquia e decidir expressamente se aceita o controle autogerido como equivalente ao runbook. Engenharia precisa provar snapshot, agendamento, retenção e restore sem imprimir segredos. Proprietário/jurídico precisam decidir a disposição LGPL/NOTICE do artefato efetivo. O usuário convidado precisa confirmar logout e novo login por senha sem transmitir a senha. Engenharia pode seguir com diagnóstico do p95 e ensaio controlado de 60 minutos sem habilitar flags sensíveis.

## R. Percentuais de conclusão

**Fundação 92%; MVP 82%; V1 64% — estimativas históricas mantidas, sem aumento.** A Fundação tem 24 migrations hospedadas, RLS 12/12, CI remoto e web/worker, mas backup/recuperação, licença e escala operacional não fecharam. O MVP já percorre Auth, tenant, Passport, FULL e relatório, mas onboarding de novo login e conclusões sustentadas por documentação real não têm prova completa. V1 continua parcial: upload real, qualification, contato, rede, entitlements completos e outras entregas futuras seguem congelados ou dependentes de decisão. Esses percentuais descrevem escopo aproximado de código e runtime, **não** substituem gates objetivos nem significam prontidão para piloto.

## S. Declaração objetiva provisória

- **100 TENANTS READY: NÃO.**
- **PILOTO CONTROLADO: NO-GO.**
- **PRODUÇÃO ABERTA: NO-GO.**

## T. Próxima ação recomendada

Medir e corrigir o gargalo observado, repetir carga de 100 empresas por pelo menos 60 minutos no artefato final, incluindo HTTP→Auth→Tenant Context→API→Application Services→PostgreSQL→Outbox→Worker→Observabilidade; comprovar backup privado automático e restauração representativa com RPO/RTO; concluir disposição LGPL e novo login do convidado. Repetir todos os testes afetados por correções. Só então emitir decisão HSP-4 final e **interromper**, sem iniciar PILOT-1 ou qualquer Wave posterior automaticamente.
