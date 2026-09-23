# HSP-4 — rechecagem final hospedada, rascunho controlado

**Data:** 2026-09-23. **Estado deste documento:** RASCUNHO; a decisão
operacional vigente continua **NO-GO**. Não usar este rascunho para liberar
`PILOT-1`, produção aberta ou qualquer Wave posterior. Só evidência executada
no artefato identificado recebe crédito de runtime. A revisão inicial de
20/09, em `docs/canonical/v1/delivery/GENESIS_360_HSP_0_4_FINAL_REPORT_2026-09-20.md`,
permanece histórica.

## A. Executive Summary

O SHA `fe0e5b4583d98bf9985bf247c5976a367fc3b3e9` passou CI
quality/database/CodeQL; web e worker do staging Railway reportaram `SUCCESS`
no mesmo SHA. A migration `0024` está aplicada e 12/12 assertions RLS
hospedadas passaram sob papéis autenticados simulados. Um novo FULL no SHA
anterior `5e6e836` percorreu 55 respostas e gerou relatório; o fluxo afetado
precisa de rechecagem no SHA final. Isso melhora a evidência do core, mas **não
fecha HSP-4**: convite, backup/RPO, entrega e ACK de alerta, disposição LGPL e
SLO de 100 tenants ainda não têm PASS.

## B. Estado de cada Wave HSP-0 a HSP-4

| Wave | Estado desta rechecagem | Limite |
| --- | --- | --- |
| HSP-0 | PASS histórico; CI final PASS | Controle remoto e PR/CI preservados. |
| HSP-1 | BLOCKED no callback; core hospedado parcial PASS | `0024` RLS 12/12 e FULL 55 respostas no SHA anterior; fluxo afetado precisa rechecagem. Convite no SHA final passou HTTP 201/Auth/membership Tenant A/audit/e-mail recebido, mas callback falhou e não criou sessão app. |
| HSP-2 | BLOCKED | Falha e recuperação de monitor observadas na issue #27; notificação/ACK ausentes, backup/RPO e LGPL sem aceite. |
| HSP-3 | FAIL histórico de p95; novo soak PENDING | Fixture privada reconstituída; 10/10 contas e 100/100 tenants, empresas e vínculos passaram pré-checagem read-only. Login real e novo run de 60 minutos no SHA final pendentes. |
| HSP-4 | REVISÃO EM ANDAMENTO; NO-GO vigente | Decisão final depende dos gates acima e da conciliação A–T. |

## C. PASS / FAIL / BLOCKED por Gate

| Gate | Estado | Evidência ou falta objetiva |
| --- | --- | --- |
| CI e mesmo SHA web/worker | PASS limitado | CI quality/database/CodeQL PASS; web `0205de1b-e123-407d-b6c5-d048ee8888aa`, worker `6110522e-c59e-4830-b1c3-457abbbf1714` SUCCESS, ambos em `fe0e5b4…`. |
| Migration `0024` / RLS hospedada | PASS DB | 12/12 asserts, rollback e zero fixtures residuais; sessões HTTP de cada papel não repetidas. |
| FULL autenticado no staging | PASS limitado no SHA anterior | 55 respostas, score 48, cobertura 100%, confiança 78%; 0 fontes vinculadas/verificadas. Reexecutar gate afetado no SHA final. |
| Convite administrado | PASS parcial / callback FAIL | HTTP 201, Auth user criado, `member` só no Tenant A, audit `membership.invited` e e-mail recebido. Link abriu raiz com fragmento implícito; não houve sessão app nem tela de senha. |
| Backup automático/retido e RPO/RTO | BLOCKED | Restore lógico histórico não é backup gerenciado nem mede RPO real. |
| Alerta entregue e ACK | BLOCKED | Issue #27 criou/recuperou evento técnico; operador não recebeu notificação e abriu manualmente. |
| Licenças do artefato | BLOCKED | SBOM CI Linux de 455 entradas identifica `LGPL-3.0-or-later` em libvips; bundle final, NOTICE e decisão jurídica pendentes. |
| 100 tenants/60 min p95 ≤750 ms | FAIL histórico / novo run PENDING | Ensaio anterior excedeu p95. Fixture privada passou pré-checagem estrutural e agregada; login real e carga final ainda não executados. |

## D. Evidências produzidas

- [`hosted-diagnostic-rls-2026-09-23.md`](hosted-diagnostic-rls-2026-09-23.md),
  [probe SQL](hosted-diagnostic-rls-2026-09-23.sql) e
  [12 resultados JSON](hosted-diagnostic-rls-2026-09-23.json).
- [`STAGING_PROMOTION_5e6e836_2026-09-23.md`](STAGING_PROMOTION_5e6e836_2026-09-23.md)
  descreve a promoção anterior e seus limites; não substitui a evidência do
  SHA final.
- [`hsp4-license-inventory-ci-5e6e836-2026-09-23.md`](hsp4-license-inventory-ci-5e6e836-2026-09-23.md)
  registra a cadeia LGPL; confirmar o artefato do CI para o SHA final antes
  da decisão jurídica.
- Issue #27: identificador de falha simulada e recuperação; anexar horário,
  logs e comprovação de entrega/ACK se surgirem.
- Pendente anexar IDs de run e métricas do novo soak após validar login com a
  fixture privada; logs sanitizados do callback/novo convite corrigido;
  snapshot/restore gerenciado e CI/deploy final em formato persistente.

## E. Mudanças realizadas

O candidato final contém correções de fronteira de leitura e verdade do
cockpit: as fontes apenas cadastradas agora são distinguidas das vinculadas ao
relatório mais recente. O novo FULL demonstrou que essas duas coisas diferem.
Tracing e monitoramento foram usados para medir e simular falha. Este texto
não considera mudança local como validada no staging sem reexecutar seu teste
afetado no SHA final.

## F. Problemas encontrados e respectivas correções

1. A nova leitura tinha 3 fontes fictícias na empresa, mas 0 no relatório.
   O relatório alertou corretamente; o cockpit anterior ainda mostrava 7/7.
   O SHA final corrige a contagem do cockpit; falta rechecagem visual hospedada.
   Não houve vínculo documental automático.
2. O monitor abriu e recuperou issue #27, mas o operador não recebeu alerta.
   Falta canal de entrega comprovado e ACK humano.
3. O inventário local não havia encontrado LGPL; o SBOM Linux do CI revelou
   `@img/sharp-libvips-linux-x64` sob `LGPL-3.0-or-later`. Gate de licença segue
   bloqueado até disposição técnica/jurídica.
4. O ensaio anterior de 100 tenants falhou em p95. Medidas por hop estão em
   andamento; a fixture privada foi reconstituída e passou pré-checagem.
   Nenhum ajuste deve ser creditado antes de nova carga comparável.
5. O novo convite foi entregue, mas `redirect_to` levou à raiz com fragmento
   implícito. O callback PKCE da aplicação exige código; após o clique não houve
   sessão app nem tela de senha. A correção e a repetição hospedada são exigidas.

## G. Segurança e isolamento multi-tenant

`0024` foi aplicada append-only. O teste hospedado usou `SET LOCAL ROLE
authenticated` e JWT subjects sintéticos diferentes: membro vê somente fato
interno e evento de missão; gestor vê fatos sensíveis autorizados; outro
tenant não vê fatos/eventos do primeiro. **12/12 PASS**, rollback confirmado e
nenhum fixture residual. Isso é prova do banco/RLS, não de três sessões HTTP
independentes. Nenhum relaxamento de RLS ou service role no cliente foi feito.

## H. Resultado de Auth e onboarding hospedados

A sessão autenticada existente completou um FULL no tenant fictício e abriu o
relatório correto no SHA anterior. No SHA final, convite administrado retornou
HTTP 201, criou usuário Auth, registrou `member` somente no Tenant A e audit
`membership.invited`; o e-mail chegou à caixa controlada. Após um clique, o
navegador terminou em `/entrar?next=/` com fragmento implícito; o callback PKCE
não estabeleceu sessão app nem abriu tela de senha. **Onboarding E2E: FAIL / gate
BLOCKED.** O 502 histórico foi superado nessa etapa, mas não demonstra causa
única nem resolve o callback.

## I. Resultado do worker contínuo

O worker do SHA final reportou deploy `SUCCESS`. O evento
`passport.fact.created` processado em 1,247 s é evidência do artefato anterior.
Registrar observação contínua, retries, dead jobs e outbox do SHA final antes
de dar crédito de operação prolongada.

## J. Resultado da observabilidade e alertas

Logs/traces de aplicação e provedor permitiram observar requisições e simular
falha. A issue #27 demonstra detecção e recuperação técnica. **Entrega ao
operador e ACK: BLOCKED**, conforme confirmação de que nenhuma notificação
chegou; abrir manualmente a issue não satisfaz o gate. Acrescentar trace IDs,
horários UTC, tempo de detecção e reação humana quando houver.

## K. Backup, restore, RPO e RTO medidos

Restore lógico histórico em dataset pequeno: **3,179 s** (RTO limitado ao
ensaio lógico). Não há prova de snapshot automático retido, idade do ponto
efetivamente recuperável, RPO real ou tempo de restabelecimento operacional
com volume representativo. Gate: **BLOCKED**.

## L. Resultado da carga de 100 tenants

Histórico de 20/09: 100 tenants, 10 sessões, 3.600,9 s, 18.610 requests,
600 negações cross-tenant esperadas e zero falha funcional. Esse run precede
o SHA final e falhou no SLO de latência. Há 100 tenants sintéticos e 10 usuários
× 10. A fixture privada temporária foi reconstituída; pré-checagem somente
leitura confirmou 10/10 contas e 100/100 empresas/vínculos. **Login real e novo
run: PENDING, não executados.**
Registrar run/deploy IDs, duração ≥60 minutos e fluxo HTTP→Auth→Tenant→API→
Services→PostgreSQL→Outbox→Worker→Observabilidade.

## M. p50 / p95 / p99 / error rate / saturação

No ensaio histórico, p95 login 2.103,47 ms, tenant switch 756,06 ms,
dashboard 1.474,87 ms e escrita 1.166,55 ms; limite era 750 ms. CPU web
5,9%, memória 22,6%, 19 conexões e zero deadlock ao fim da janela eram
observações pontuais, não prova de causa. **p50/p95/p99/error rate/saturação
do novo SHA: PENDING**. Medir pool, slow queries, outbox, worker latency,
retries, dead jobs, quotas e custos antes de concluir.

## N. FinOps inicial

O objetivo de soluções gratuitas permanece. Custo por tenant/operação e
projeção do novo soak não foram medidos neste rascunho; **PENDING**. Gratuidade
não reduz requisitos de retenção, recuperação, alerta ou segurança.

## O. Débitos técnicos restantes

Vínculo causal documento→conclusão com regra de relevância revisada; prova HTTP
multi-role; teste reproduzível de carga hospedada; convite com reconciliação
Auth/membership em falha parcial; backup/RPO/RTO; entrega/ACK de alertas;
inventário e notices do bundle final; latência por hop e regressão no SHA final.

## P. Riscos para piloto

Latência fora do SLO, indisponibilidade sem recuperação mensurada, incidente
sem operador avisado, callback de convite quebrado, licença sem aceite e interpretação
indevida de fontes fictícias como verificadas. Qualquer vazamento cross-tenant,
perda/corrupção de dados ou secret exposto produziria FAIL imediato.

## Q. Acessos ou decisões humanas ainda pendentes

Operação/proprietário: pessoa de plantão e canal de notificação com ACK;
solução de backup automático/retido
com restore em staging; decisão técnica/jurídica sobre LGPL e NOTICE.
Engenharia: corrigir redirect/callback do convite e repetir onboarding hospedado;
executar login e carga com a fixture privada sem registrar segredos em artefatos.
Pode continuar profiling, testes locais e revisão sem
contornar esses bloqueios.

## R. Percentuais atualizados

**PENDING reconciliação final baseada em código e runtime**. Referência
histórica anterior: Fundação 92%, MVP 82%, V1 64%; não aumentar percentuais
apenas por CI, documentação ou tela de demo. Recalcular depois do fechamento
ou bloqueio definitivo dos gates da rechecagem.

## S. Declaração objetiva

- **100 TENANTS READY: NÃO**.
- **PILOTO CONTROLADO: NO-GO**.
- **PRODUÇÃO ABERTA: NO-GO**.

## T. Próxima ação recomendada

Corrigir e repetir callback do convite e investigar entrega de alerta; obter backup
automático/retido e restauração mensurada; decidir LGPL/NOTICE; executar a
carga de 100 tenants por 60 minutos no SHA final após validar login da fixture privada,
medir e corrigir o
gargalo demonstrado. Repetir os testes invalidados por cada correção e só
então emitir a decisão HSP-4 final. Parar ao final desta Wave; não iniciar
`PILOT-1` automaticamente.
