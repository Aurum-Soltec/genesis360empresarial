# HSP-4 — FULL hospedado e isolamento HTTP da migration 0024

Execução de 2026-09-24 UTC no projeto Railway isolado de staging. O web
`ab3f2a2d-9507-4e24-8749-bc313c7691fa` e o worker
`96c1e771-c895-4f15-a8f5-157b4f97f892` reportaram `SUCCESS` no mesmo
SHA `bb290bc7bc35f77b4ca01aecdbf19b748c386270`. O nome do ambiente
Railway é `production`, mas o projeto é o staging dedicado. Esta prova não
habilitou upload para usuários reais nem as outras flags sensíveis.

## Isolamento por três sessões HTTP: PASS

Um fixture **exclusivamente fictício**, com duas empresas em tenants
distintos, quatro fatos no primeiro tenant (interno, pessoal, financeiro e
restrito), um fato no segundo e seis eventos de timeline, foi criado para o
ensaio. Três usuários Auth temporários fizeram login pelo formulário hospedado
em contextos de navegador separados: membro do tenant A, gestor do tenant A e
membro do tenant B. As observações acessaram as rotas normais
`/api/passport/facts`, `/api/passport/timeline` e `/api/tenant/active`, sob as
sessões de cada usuário. A service role foi usada somente no processo local
de criação e remoção do fixture; **nenhuma chamada HTTP observada com papel
de usuário usou service role**.

| Observação | Esperado | Observado |
| --- | ---: | ---: |
| Membro A: fatos próprios visíveis | 1 interno | 1 |
| Membro A: eventos próprios visíveis | 2 (fato interno e missão) | 2 |
| Membro A: fato pessoal/financeiro/restrito | 0 | 0 |
| Membro A: eventos sensíveis | 0 | 0 |
| Gestor A: fatos próprios | 4 | 4 |
| Gestor A: eventos próprios | 5 | 5 |
| Membro B: fato e evento próprios | 1 e 1 | 1 e 1 |
| Membro B: fatos/eventos do tenant A | 0 e 0 | 0 e 0 |
| Membro B: marcador do tenant A no corpo HTTP | ausente | ausente |
| Membro B: tentativa de ativar tenant A | HTTP 403 | HTTP 403 |

O harness registrou **12/12 assertions PASS**. Depois do ensaio, exclusão e
leitura de verificação encontraram zero eventos, fatos, memberships, empresas
e tenants de teste. Uma consulta separada às contas Auth confirmou zero dos
três usuários sintéticos remanescentes entre as 16 contas inspecionadas. Esta
é a prova HTTP complementar às 12/12 assertions SQL hospedadas já registradas
em `hosted-diagnostic-rls-2026-09-23.*`; não substitui outros gates HSP-4.

## Diagnóstico FULL pela UI e relatório: PASS para fluxo, limite documental explícito

Uma sessão `owner` da empresa fictícia A iniciou um diagnóstico novo
(`resumed=false`, ID `3bfbdd46-02f0-4cea-a0b7-eb62212d278d`). A interface
percorreu as seis etapas, salvou **55 respostas** por `/api/diagnostics/:id/answers`,
alcançou **100% de progresso** e **78% de confiança**, e a submissão retornou
HTTP 200. O relatório foi aberto em nova sessão autenticada, HTTP 200:
Growth Score **48/100**, **12 dimensões**, **três ações** no plano de 90 dias
e **três sugestões de empresas explicitamente fictícias**.

A seção de proveniência mostra 55 respostas avaliadas, **zero** respostas
com referência declarada, **zero** fontes registradas no diagnóstico e
**zero** fontes verificadas. O relatório informa que foi calculado com
respostas declaradas, sem evidência vinculada. Portanto o fluxo questionário
→ score/relatório está comprovado; a exatidão de conclusões **fundamentadas
em documentos** continua sem prova nesta execução. Nenhuma fonte empresarial
foi vinculada automaticamente a uma pergunta.

O primeiro harness FULL marcou `FAIL` após a submissão porque leu a página
antes de o relatório terminar a navegação. As 55 gravações e a submissão
estavam concluídas. Uma reabertura independente do relatório em nova sessão
validou todos os elementos acima e passou. O falso negativo do harness
permanece no arquivo bruto e não foi apagado nem descrito como falha do
produto. Um teste posterior deve aguardar `.result-experience`/`.result-score`
antes de julgar o relatório.

## Evidência e limites

Os registros locais ignorados pelo Git não contêm senha, token, service role
ou URL de banco. Seus SHA-256 permitem conferir a mesma evidência:

| Registro local | SHA-256 |
| --- | --- |
| `.audit-work/evidence/hsp4-http-rls-0e3d1cc1-e170-4b0d-9dd4-f75d205b3064.json` | `fcb8f66220ef15c45e9d301c2ae9eeed5f6124b37b9ec081fdb109d1189bf406` |
| `.audit-work/evidence/hsp4-full-ui-3bfbdd46-02f0-4cea-a0b7-eb62212d278d.json` | `cf72cb332152337f82c1e2756f1429773612bac3f8506a95342d75ff72c81868` |
| `.audit-work/evidence/hsp4-full-report-3bfbdd46-02f0-4cea-a0b7-eb62212d278d.json` | `da2b6fc141e4afa1d6b16df5f49338917fc3bf94e1eb48f0b9f9578d45f17192` |

Os scripts de execução permanecem em `.audit-work/` para rechecagem local.
Esta prova não afirma recebimento de documento real, validação independente
da fonte, restauração de backup, p95 conforme SLO, ou prontidão de piloto.
