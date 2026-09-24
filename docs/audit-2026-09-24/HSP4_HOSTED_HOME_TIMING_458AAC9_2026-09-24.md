# HSP-4 — medição hospedada limitada da Home na fonte `458aac9`

**Data:** 2026-09-24 UTC. A [PR privada #23](https://github.com/Aurum-Soltec/genesis360-staging-backups/pull/23)
foi integrada na main privada em `489c24a`, com CI unitário PASS. O [run
`36063913391`](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/36063913391)
terminou SUCCESS nos jobs de exercício e guard independente; o [backstop
`36064075371`](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/36064075371)
também terminou SUCCESS. O artefato sanitizado id `10834954067`, digest
`sha256:c1b5cec46e26a6c6ad6552520cb19c3c661b993101ebf4d22cb11870c95fcc23`,
passou validação de schema apenas numérico/status para **16/16 amostras**.
Nenhum token, dado de cliente ou resposta diagnóstica está reproduzido aqui.

| Fase | p50 (ms) | p95 (ms) |
| --- | ---: | ---: |
| Total | 799,01 | 1.337,44 |
| Tenant context | 504,71 | 709,60 |
| Dashboard | 284,31 | 810,15 |
| Auth user | 138,91 | 182,30 |
| Membership | 147,18 | 526,88 |
| Quota | 149,82 | 456,06 |
| Company selection | 139,31 | 407,04 |
| Diagnostic | 141,29 | 432,50 |

A fixture é **escassa e sem diagnóstico/pains**. As fases sugerem custo
relevante no acesso remoto serial de Auth/contexto/empresa/diagnóstico e
picos no dashboard. Para as mesmas 16 amostras completas, o residual
calculado **por amostra** como `tenant_context − auth_user − active_cookie −
max(membership, quota)` teve p50 **0,40 ms**, p95 **0,49 ms** e máximo
**0,49 ms**; `auth_user` teve p95 e máximo **182,30 ms**. Isso reduz a
suspeita de overhead local no cálculo do contexto nessa fixture e aponta
as chamadas remotas como parcela dominante. Não se devem somar ou subtrair
percentis agregados para reconstruir o total. O resultado ainda não isola
um gargalo definitivo no workload representativo. Não houve ajuste
de código baseado nessa amostra, nem carga de **100 tenants por 60 minutos**
no candidato. O último p95 desse gate permanece **FAIL histórico**; esta
medição limitada não dá PASS de SLO, de Home com dados representativos ou
de prontidão para piloto.

## Segunda amostra protegida com fixture scored e três dores

A [PR privada #26](https://github.com/Aurum-Soltec/genesis360-staging-backups/pull/26)
foi integrada na main privada em `5ba5bcf13ef8149cdafd6aecb840334a85c33c16`
(head `939106c`, CI PASS). O [run `36068483011`](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/36068483011)
terminou PASS com **200 GETs autenticados** da Home: 100 como membro e
100 como gestor, em **um tenant** com fixture scored e três dores. Cleanup
primário e guard registraram 14 categorias sem resíduo. O artefato
sanitizado tem id `10837144687`; este relatório usa os números resumidos
do run, sem reproduzir dados de autenticação ou respostas do cliente.

| Série de 200 GETs | Valor |
| --- | ---: |
| Total p50 / p95 / p99 / máximo | 728,55 / 1.229,81 / 1.758,33 / 3.902,15 ms |
| Acima de 750 ms | 77/200 |
| Membro p95 / gestor p95 | 1.237,05 / 1.133,92 ms |
| Tenant context p95 / Auth p95 | 637,76 / 182,05 ms |
| Membership p95 / quota p95 | 164,33 / 411,05 ms |
| Dashboard p95 | 719,51 ms |
| Company / diagnostic / pains p95 | 182,37 / 381,97 / 194,07 ms |

Nas 77 amostras acima de 750 ms, as medianas de context/dashboard foram
516,24/446,28 ms. Dentro do contexto, Auth/membership/quota tiveram
medianas 139,08/142,62/271,70 ms; dentro do dashboard,
company/diagnostic/pains tiveram 144,14/143,75/142,07 ms. Esses valores
sugerem múltiplas chamadas remotas e cauda de quota, **sem provar causa**.
Percentis de fases não devem ser somados. Região do runner GitHub não foi
verificada como Brasil; o método de score da fixture não foi validado.
Uma empresa, 200 GETs e uma amostra curta não substituem **100 empresas
por 60 minutos**. O gate p95 ≤750 ms permanece FAIL pela carga histórica,
e a amostra nova também excede 750 ms. Nenhuma correção de gargalo ou
mudança arquitetural foi validada por esta série.

`getClaims` no lugar de `getUser` no core permanece apenas hipótese:
mesmo a economia máxima observada de Auth user (**182,30 ms**) não cobre
sozinha a diferença entre p95 total desta amostra e o limite de 750 ms,
nem melhora o login de navegador. Assimetria do JWT e semântica de
revogação precisam de prova antes de qualquer troca. Um canário regional
sintético poderia comparar backend, banco e também navegador brasileiro →
Auth no login; mover o banco para Virgínia pode piorar esse caminho e
exigiria ADR e decisão de residência de dados antes de promoção real.
Só cabe criar esse canário sintético `us-east-1` se houver slot e orçamento
Free; a comparação deve incluir login navegador Brasil → Auth e Home com
diagnóstico e três dores em carga representativa. A segunda amostra mediu
três dores, porém somente um tenant, sem validar a região brasileira do
runner ou o método de score. Qualquer promoção regional real exigiria também validar Auth,
Storage, ACL/RLS, backup e repetir 100×60. Nenhuma dessas alternativas
foi implementada nesta revisão.

Web/worker Railway seguem nos deployments SUCCESS `65ede85d-f918-4ccf-b161-a9396d6c702a`
e `8e460f0f-4c6b-4506-b490-90682b5b1b4d` oriundos de worktree limpa
detached no claim `458aac9`; `meta.commitHash=null` continua sem atestação
nativa do SHA. A navegação autenticada direta no Chrome/IAB havia sido
bloqueada por `ERR_BLOCKED_BY_CLIENT`; o run privado fornece a série
numérica limitada sem converter esse bloqueio de cliente em erro de
servidor. A [revisão HSP-4 vigente](HSP4_CURRENT_REVIEW_458AAC9_2026-09-24.md)
permanece **NO-GO**.
