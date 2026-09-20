# GÊNESIS 360 — Relatório Final HSP-0 a HSP-4

Data: 2026-09-20  
Baseline preservada: V1.2.1 RC2 + Production & Scale Foundation  
Artefato funcional ensaiado: `5e91ce37d5b931eafeb1a598bdfeb62235cb11dc`  
Decisão: **NO-GO COM CORREÇÕES OBJETIVAS**

## A. Executive Summary

O núcleo hospedado funciona e manteve isolamento multi-tenant. GitHub, CI remoto,
Supabase, Railway web/worker, Auth, tenant context, API, PostgreSQL, outbox e
observabilidade do provedor foram exercitados. Migrations 23/23, pgTAP 95/95,
browser E2E 10/10, worker e restore lógico passaram. A carga de 100 tenants
terminou sem falha funcional nem violação cross-tenant.

O candidato ainda não satisfaz o gate do piloto. A latência hospedada excedeu o
SLO de p95 <= 750 ms; a topologia gratuita ficou dividida entre Railway US East
e Supabase São Paulo. Também faltam backup gerenciado com retenção automática,
receiver/paging externo, convite por e-mail com inbox controlado, completude do
SBOM e decisão jurídica sobre licenças. Nenhum desses gaps foi ocultado para
cumprir a meta de cinco dias.

## B. Estado de cada Wave HSP-0 a HSP-4

| Wave | Estado | Evidência | Limite |
|---|---|---|---|
| HSP-0 | **PASS** | Repositório público organizacional; PR; CI; proteção de `main`; commit rastreável | Uma única pessoa com acesso de escrita impede exigir aprovação sem bloquear o proprietário |
| HSP-1 | **BLOCKED no convite; core PASS** | Staging isolado; migrations 23/23; pgTAP 95/95; E2E 10/10; worker processou em primeira tentativa | Convite real retornou 502 e exige SMTP/inbox controlado |
| HSP-2 | **BLOCKED; subgates técnicos PASS** | Headers, flags, logs, métricas, restore lógico, GitHub security e zero alertas | Backup gerenciado/retenção e paging externo ausentes no stack gratuito |
| HSP-3 | **FAIL de performance** | 100 tenants, 10 sessões autenticadas, isolamento negativo contínuo, DB/outbox/worker observados | p95 acima de 750 ms |
| HSP-4 | **CONCLUÍDA — NO-GO** | Código, gates, waves, stories, evidências e flags reconciliados | Requer repetir somente gates afetados após correções |

## C. PASS / FAIL / BLOCKED por Gate

| Gate | Estado | Critério objetivo |
|---|---|---|
| Repositório e rastreabilidade | **PASS** | `main` protegida; CI obrigatório; force push/delete desligados |
| CI remoto | **PASS** | Runs `35541611582` e `35541750402` verdes |
| Staging isolado | **PASS** | Web e worker separados; Supabase staging dedicado |
| Migrations/DB/RLS | **PASS** | 23 migrations e 95/95 pgTAP hospedados |
| Auth e tenant context | **PASS** | Sessão, seleção, troca e expiração exercitadas |
| Cross-tenant | **PASS** | 403 em tentativas A -> B; nenhuma exposição detectada |
| Worker contínuo | **PASS** | Evento processado, uma tentativa, sem dead job |
| Security headers | **PASS** | CSP, HSTS, Permissions-Policy, COOP, nosniff, frame e referrer |
| Supply chain básico | **PASS** | Audit sem advisory; Dependabot/secret scanning/push protection ativos; CodeQL passou; zero alertas |
| Inventário de licenças | **PASS técnico** | 433 pacotes em 13 grupos, extraídos do lockfile congelado e publicados sem caminhos locais |
| SBOM/aceite jurídico de licenças | **BLOCKED** | SBOM GitHub ainda contém apenas o pacote raiz; combinação LGPL requer decisão jurídica |
| Observabilidade do provedor | **PASS** | Métricas/logs/correlation ID disponíveis |
| Paging externo | **BLOCKED** | Nenhum receiver gratuito configurado |
| Restore lógico isolado | **PASS** | Restore em 3,179 s, contagens e policies verificadas |
| Backup gerenciado/retenção | **BLOCKED** | Plano gratuito não fornece o gate canônico de retenção automática |
| Convite/e-mail real | **BLOCKED** | API de convite retornou 502; entrega/callback sem inbox controlado |
| Carga funcional de 100 tenants | **PASS** | `18610` requests; `600` negações esperadas; `0` falhas |
| SLO de latência | **FAIL** | p95 de dashboard e escrita excedeu 750 ms |
| HSP-4 / Pilot readiness | **FAIL** | Um FAIL ou blocker operacional impede GO |

## D. Evidências produzidas

- `docs/audit-2026-09-20/hsp0-repository-ci.json`
- `docs/audit-2026-09-20/hsp1-hosted-pgtap.txt`
- `docs/audit-2026-09-20/hsp1-hosted-environment.json`
- `docs/audit-2026-09-20/hsp1-browser-e2e.json`
- `docs/audit-2026-09-20/hsp1-worker-e2e.json`
- `docs/audit-2026-09-20/hsp1-hosted-invite.json`
- `docs/audit-2026-09-20/hsp2-auth-policy.json`
- `docs/audit-2026-09-20/hsp2-security-headers.json`
- `docs/audit-2026-09-20/hsp2-feature-flags.json`
- `docs/audit-2026-09-20/hsp2-hosted-logical-restore.json`
- `docs/audit-2026-09-20/hsp2-github-security.json`
- `docs/audit-2026-09-20/hsp2-license-inventory.json`
- `docs/audit-2026-09-20/hsp2-sbom.spdx.json`
- `docs/audit-2026-09-20/hsp2-operational-health-during-load.json`
- `docs/audit-2026-09-20/hsp3-100-tenants-load.json`
- `docs/audit-2026-09-20/hsp3-hosted-metrics.json`
- `docs/audit-2026-09-20/hsp3-operational-health-final.json`
- `docs/audit-2026-09-20/hsp3-hosted-inventory.json`
- GitHub Actions runs `35520665377`, `35541611582`, `35541750402` e
  CodeQL `35543226136`.

Backups, chaves, tokens, service role, `DATABASE_URL`, usuários Auth e dumps não
foram incluídos no repositório nem nas evidências públicas.

## E. Mudanças realizadas

- Publicação e proteção do repositório `Aurum-Soltec/genesis360empresarial`.
- Correção portável de integridade para normalização CRLF/LF, mergeada na PR #6.
- Headers de segurança adicionados e validados na PR #7.
- Supabase staging e dois serviços Railway, web e worker, configurados.
- Dependabot security updates, secret scanning, push protection e CodeQL ativados.
- Inventário saneado de 433 pacotes/licenças gerado pelo lockfile congelado.
- Documentação canônica reconciliada com o runtime hospedado.

Não houve alteração de tenancy, RLS, Trusted Data Access Boundary, modelo de
outbox, quotas, pooling, storage foundation ou arquitetura modular.

## F. Problemas encontrados e respectivas correções

| Problema | Evidência | Correção/estado |
|---|---|---|
| Hash de integridade divergente entre Windows/Linux | CI inicial | Verificador passou a aceitar normalização segura de newline; CI verde |
| Headers CSP/HSTS/Permissions ausentes | Probe HTTP inicial | Corrigidos, testados e implantados |
| Chaves mascaradas incompatíveis com o cliente atual | Erro inicial de staging | Configuração corrigida com chaves legacy armazenadas apenas no provedor |
| Config Auth hospedada diferente do contrato | Probe de Auth | Confirmação, OTP, TOTP e signup fail-closed sincronizados |
| Convite hospedado retornando 502 | Evidência de convite | Pendente de SMTP/inbox controlado; sem bypass |
| p95 hospedado acima do SLO | Carga HSP-3 | Pendente: aproximar compute/DB ou reduzir round trips, medir e repetir |
| Backup gerenciado indisponível | Capacidade do plano Free | Restore lógico provado; retenção automática permanece blocker |

## G. Segurança e isolamento multi-tenant

RLS permaneceu ativa e 95 testes pgTAP passaram no banco hospedado. O E2E negou
seleção de tenant alheio com 403. Durante a carga, dez usuários cobriram 100
tenants e repetiram `600` tentativas negativas, todas negadas. Não houve
cross-tenant, corrupção, perda de dados ou exposição de segredo detectada.

As cinco flags permaneceram desligadas em web e worker:

- `FEATURE_AGENTIC=false`
- `FEATURE_DATA_UPLOAD=false`
- `FEATURE_QUALIFICATION_NETWORK=false`
- `FEATURE_REAL_CONTACT=false`
- `FEATURE_ECOSYSTEM=false`

## H. Resultado de Auth e onboarding hospedados

Login, sessão, tenant chooser, troca A/B autorizada, rejeição A -> tenant alheio,
usuário sem tenant e expiração de sessão passaram em 10/10 testes de navegador.
Signup público foi negado com 422. O onboarding por convite não fecha o gate:
a chamada hospedada retornou 502 e não houve caixa postal controlada para provar
recebimento e callback.

## I. Resultado do worker contínuo

O worker hospedado separado consumiu o evento
`f68f71d0-be7e-4be3-9d8f-738758861afb` em uma tentativa. Latência fim a fim:
2.481 ms; execução do handler: 143 ms. Durante a carga, throughput de cinco
minutos terminou em 500, failure rate ficou em 0%, p95 das tentativas em 158 ms
e dead jobs em zero. O backlog final foi `0`.

## J. Resultado da observabilidade e alertas

Correlation ID, JSON logs, métricas web/worker, CPU, memória, HTTP, banco, outbox,
retries e dead jobs ficaram visíveis. O período de carga não mostrou saturação de
CPU ou memória. Um 5xx observado veio do probe sintético de convite. Não existe
receiver/paging externo; portanto o gate de resposta automática permanece BLOCKED.

## K. Backup, restore, RPO e RTO medidos

Foi produzido backup lógico manual e restaurado em banco isolado. O restore levou
3,179 s contra alvo de RTO de 1.800 s e preservou 23 migrations, 37 policies,
tenants, memberships, companies, outbox, attempts e Auth do snapshot. A captura
levou 187,908 s, incluindo o download inicial da imagem da ferramenta.

Isso comprova recuperabilidade lógica manual. Não comprova backup gerenciado,
retenção de 30 dias nem RPO automático. O RPO operacional continua **não medido**
porque o plano gratuito não ofereceu snapshots automáticos para o drill.

## L. Resultado da carga de 100 tenants

Perfil: 100 tenants, 100 empresas sintéticas, dez usuários autenticados, dez
tenants por usuário, duração `3600,9` s. Cada ciclo percorreu tenant
switch, dashboard, escrita de Business Passport, commit PostgreSQL, outbox e
worker; cada usuário também tentou selecionar tenant alheio.

Resultado funcional: `18610` requests, `600` negações esperadas,
`0` falhas, error rate `0`%. A carga funcional passou;
o gate global falhou pelo SLO de latência.

## M. p50 / p95 / p99 / error rate / saturação

| Operação | Amostras | p50 | p95 | p99 | Máximo |
|---|---:|---:|---:|---:|---:|
| Login | `10` | `1773,11` ms | `2103,47` ms | `2103,47` ms | `2103,47` ms |
| Tenant switch | `6000` | `551,35` ms | `756,06` ms | `899,58` ms | `1864,48` ms |
| Dashboard | `6000` | `1257,49` ms | `1474,87` ms | `1680,3` ms | `2686,06` ms |
| Fact write | `6000` | `968,01` ms | `1166,55` ms | `1330,94` ms | `3192,6` ms |
| Cross-tenant deny | `600` | `548,36` ms | `625,78` ms | `798,93` ms | `1131,69` ms |

Error rate funcional: `0`%. Na janela Railway de 75 minutos: 20.013 requests,
um 5xx do probe de convite, error rate do provedor 0,004997%, p50 823 ms,
p95 1.131 ms e p99 1.243 ms. Ao final: web CPU 5,9%, memória 22,6%; worker
CPU 0,4%, memória 12,2%; 19 conexões PostgreSQL, zero deadlock e zero bytes
temporários. Não houve saturação de recurso. O perfil aponta latência de rede/
round trips como hipótese principal, ainda a confirmar.

## N. FinOps inicial

O staging usou Supabase Free, Railway trial/free allowance e GitHub público. Uso
Railway observado no período: US$ 0,022745, sendo US$ 0,019435 web e
US$ 0,003310 worker. Isto é uma observação,
não garantia de gratuidade futura; a continuidade gratuita do Railway precisa
ser decidida antes do piloto. Não foi aplicado limite financeiro global
porque afetaria outros projetos do workspace Railway.

## O. Débitos técnicos restantes

1. Reduzir p95 hospedado e repetir o soak afetado.
2. Prover backup gerenciado, retenção e drill do artefato gerenciado.
3. Configurar receiver/paging externo e testar alerta/acknowledgement.
4. Corrigir convite e provar entrega/callback com inbox controlado.
5. Aguardar/produzir SBOM completo e obter decisão jurídica sobre a licença combinada identificada.
6. Concluir WCAG 2.2 AA e regressão visual ampla.
7. Manter upload, qualification, real contact, ecosystem e agentic congelados até seus gates.
8. Confirmar infraestrutura sem cobrança após o término do trial Railway.
9. Evoluir a CSP de `unsafe-inline` para nonce/hash depois de validar a compatibilidade com Next.js.
10. Renomear o label interno `production` do ambiente Railway dedicado a staging para eliminar ambiguidade operacional.

## P. Riscos para piloto

- Latência degrada a jornada e viola o SLO antes de saturar recursos.
- Falha silenciosa pode não acordar o operador sem paging externo.
- Recuperação depende de processo manual sem retenção automática comprovada.
- Convite impede onboarding administrado reproduzível.
- Uma única pessoa administradora cria risco operacional e impede review obrigatório.

## Q. Acessos ou decisões humanas ainda pendentes

| Necessidade | Por quê | Quem fornece | Wave bloqueada | Trabalho paralelo possível |
|---|---|---|---|---|
| SMTP/inbox controlado | Provar convite, entrega e callback | Proprietário/operador de e-mail | HSP-1/HSP-4 | Correção de performance e docs |
| Solução gratuita de paging ou decisão de provedor | Provar alerta externo e ack | Proprietário/operação | HSP-2/HSP-4 | Instrumentação local |
| Backup gerenciado/retido ou decisão de aceitar outro tier/provedor | Provar RPO/retenção | Proprietário/operação | HSP-2/HSP-4 | Backups lógicos manuais |
| Região/topologia comum ou decisão arquitetural baseada em benchmark | Cumprir p95 | Proprietário + engenharia | HSP-3/HSP-4 | Profiling de round trips |
| Segundo revisor com write | Exigir aprovação sem auto-bloqueio | Proprietário da organização | governança futura | CI obrigatório já ativo |
| Destino gratuito após o trial Railway | Preservar a restrição de custo zero | Proprietário/operação | HSP-4/piloto | Correções locais e benchmark |
| Decisão jurídica sobre licença combinada | Aceitar ou substituir dependência antes do release | Jurídico/proprietário | HSP-2/HSP-4 | SBOM e demais scans |

## R. Percentuais atualizados

| Marco | Percentual | Justificativa por código/runtime |
|---|---:|---|
| Foundation | **92%** | Arquitetura, tenancy/RLS, boundary, CI, staging, worker, quotas, pooling, restore lógico e carga hospedada funcionam; faltam recovery gerenciado, paging e supply chain completo |
| MVP | **82%** | Core autenticado/tenant/passport/diagnóstico/missões e worker operam; convite e operação de piloto ainda falham gates |
| V1 | **64%** | Core preservado, mas ativação jurídica, upload seguro, qualification, contato, billing/entitlements completos e superfícies restantes continuam parciais ou congelados |

## S. Declaração objetiva

**100 TENANTS READY: NÃO** — o caminho funcional suportou 100 tenants sem erros,
mas o gate de prontidão inclui SLO, recuperação e alerting, ainda não satisfeitos.

**PILOTO CONTROLADO: NO-GO**

**PRODUÇÃO ABERTA: NO-GO**

## T. Próxima ação recomendada

Executar um pacote de correção limitado aos blockers: medir a distribuição de
latência por hop, colocar web e banco na topologia gratuita mais próxima possível
ou reduzir round trips com mudança mínima, configurar paging gratuito, prover
SMTP/inbox controlado, definir a estratégia de backup retido e produzir SBOM.
Depois, repetir HSP-1 convite, HSP-2 alert/recovery/supply chain e HSP-3 soak.

`PILOT-1`, `SCALE-500`, `V1-F`, `SCALE-2000`, `V1-GA`, `AGENTIC-1` e `MEMORY-1`
permanecem **não iniciadas** e exigem nova autorização depois de HSP-4 PASS.
