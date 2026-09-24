# HSP-4 — smoke hospedado após promoção, 2026-09-24 UTC

## Artefato identificado

O [PR público #25](https://github.com/Aurum-Soltec/genesis360empresarial/pull/25) foi integrado à `main` no commit `31df6086cb612886dc5db4a45b946ea80dde2cf1`. O último commit com alterações de código no PR foi `6d4d569be50acc03999eebb23faa1dfc10fc7725`; os commits posteriores do PR alteraram documentação. Os checks finais quality, database, CodeQL e Analyze passaram nos runs `36009033246` e `36009024373`. No projeto Railway isolado de staging, o deployment web `09f91585-1ec8-47d9-9b2c-5c40950527f0` e o worker `86828bcf-dd39-44a7-a94d-ef5819da766f` terminaram `SUCCESS` e ambos registraram o mesmo commit `31df6086cb612886dc5db4a45b946ea80dde2cf1`. O nome `production` no ambiente/hostname Railway não constitui liberação de produção aberta.

## Provas limitadas no runtime promovido

| Superfície | Observação | Alcance |
| --- | --- | --- |
| Entrada pública | `GET /entrar` retornou HTTP 200. | Disponibilidade da tela; não repete convite ou fluxo de senha. |
| Negativas anônimas | `GET /demonstracao` e `/demonstracao/administracao` retornaram 307 para `/entrar`; `GET /api/passport/facts` retornou 401. | Controles anônimos nessas rotas; não substitui matriz multi-role. |
| Sessão autenticada | A sessão `user-a@genesis.test` selecionou explicitamente Tenant A com papel `owner` e abriu a administração demonstrativa. | Acesso observado desse usuário/tenant, sem novo cenário FULL. |
| Administração | Tenant A/Empresa A, FULL existente com score 48, três fontes fictícias registradas e zero verificadas; cinco flags sensíveis mostradas OFF. | Leitura da interface e da configuração; não prova análise documental real. |
| Business Passport | Tenant A/Empresa A, um fato declarado e zero verificados. | Leitura isolada do registro existente. |
| Documentos | `/documentos` abriu “Envio governado” e listou três documentos do pacote sintético TXT/CSV/JSON, todos “Não verificada”; upload real OFF e declaração jurídica ainda em revisão. | Registro de fontes fictícias, sem upload de cliente ou validação documental. |
| Cockpit de demonstração | Mostrou **6/7 etapas**, porque três fontes fictícias estavam registradas mas **zero vinculadas à leitura**; a etapa documental não foi marcada como concluída. | Correção fail-closed da apresentação, sem inventar pertinência documental. |
| Relatório existente | Score 48, confiança 78, 55 respostas, zero referências por resposta, zero fontes vinculadas ao diagnóstico e zero verificadas. Exibiu plano de 90 dias e três recomendações de serviços/empresas **explicitamente fictícias**. | Readback de diagnóstico anterior após o deploy; não equivale a completar um novo roteiro no SHA promovido nem a recomendar fornecedores reais. |
| Navegação superior autenticada | Diagnóstico abriu `/diagnostico-v1` com a introdução do questionário; Evolução abriu `/missoes` e seu estado vazio; Soluções abriu `/solucoes` com rede real indisponível na demo; Conselho abriu `/conselho` em modo determinístico somente leitura, Agentic OFF. | Quatro destinos funcionaram nesta sessão; não é varredura exaustiva de rotas, viewports ou acessibilidade. |
| Navegação lateral autenticada | `/prioridades` abriu três gaps e avisou que a causa raiz não está validada; `/indicadores` abriu score 48, cobertura 100% e confiança 78%; `/historico` abriu a Timeline de Tenant A. | Destinos e conteúdos distintos observados; não comprova matriz multi-role nem precisão causal das prioridades. |

O proprietário confirmou separadamente que entrou com o alias exato convidado `influx.creative.br+genesis-hsp4@gmail.com` e viu somente Tenant A. Essa confirmação humana fecha o subgate de novo login no escopo observado, sem expor senha ou link de recuperação.

## Limites e discrepância do runner

O runner corrigido de proveniência foi tentado antes da promoção com duas contas sintéticas protegidas. Ambas autenticaram, mas o fluxo automatizado observou zero escolhas de tenant e não escreveu dados. A navegação autenticada acima, após a promoção, encontrou Tenant A para `user-a@genesis.test`. Portanto **não há evidência de que falte membership à fixture**; a causa da discrepância entre runner e UI permanece desconhecida. O runner ainda deve concluir um novo diagnóstico com fontes atribuídas somente onde houver pertinência explícita.

Esta checagem não repetiu no commit `31df6086` os 12/12 testes SQL, os 12/12 HTTP multi-role, a carga de 100 empresas por 60 minutos, o outbox completo, restore de serviço, RPO/RTO, retenção nem inspeção dos bytes/licenças do contêiner. A prova anterior no SHA `bb290bc7bc35f77b4ca01aecdbf19b748c386270` permanece histórica e não deve ser transferida automaticamente ao novo artefato. O último ensaio de 60 minutos falhou p95 ≤750 ms. **HSP-4 permanece NO-GO; 100 TENANTS READY: NÃO; PILOTO CONTROLADO: NO-GO; PRODUÇÃO ABERTA: NO-GO.**
