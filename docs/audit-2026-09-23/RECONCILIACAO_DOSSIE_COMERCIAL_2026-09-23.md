# GÊNESIS 360 — Reconciliação do dossiê comercial com produto e roadmap

Data: 2026-09-23. Fonte examinada: `GENESIS_360_EMPRESARIAL_DOSSIE_COMERCIAL_PREMIUM.pdf`, 20 páginas, produzido em 2026-09-03. Código examinado: `55967dd8c47285fed0b29f36a3c97e9a48c1d4bd`. Nenhuma alteração de código, flag, staging ou roadmap foi feita nesta reconciliação.

## Parecer

O dossiê descreve uma **visão de produto coerente**: contexto empresarial → diagnóstico → leitura com confiança → prioridade → decisão → missão → resultado → rede qualificada e inteligência coletiva. A arquitetura Next.js/Supabase modular, com tenant explícito, RLS, trilha de eventos e contratos versionados, permite desenvolver boa parte dessa visão sem reconstruir a fundação. Isso não significa que todas as promessas já estejam implementadas nem que a entrega integral esteja garantida pela sequência operacional aprovada.

O documento antecede decisões posteriores. `PRD_HARDENING_V1_2_1.md` e `data/commercial-plans.json` superam a ressalva histórica de que o preço Pro de R$297 era apenas hipótese: o valor está aprovado como baseline comercial inicial; **checkout, termos jurídicos e direitos por plano não estão operacionais**. `RC2_SCOPE_FREEZE_2026-09-19.md` mantém cinco recursos sensíveis desligados. `PRODUCTION_WAVES_MASTER.md` posiciona `AGENTIC-1` e `MEMORY-1` **depois** de `V1-GA`, diferentemente da leitura histórica de Conselho ampliado como entrega V1. HSP-4 continua NO-GO.

## Matriz das 26 funcionalidades das páginas 6–8

Legenda: **D** = demonstrável no staging, com os limites indicados; **P** = implementação parcial/contrato sem experiência completa; **G** = dependente de gate e flag; **F** = visão futura sem entrega operacional detalhada. Nenhuma letra equivale a aprovação de produção.

| Nº | Promessa comercial | Estado verificável e lacuna de entrega |
|---:|---|---|
| 01 | Painel executivo | **D/P.** Home com score, confiança, prioridade e próximo passo; separação das páginas foi corrigida apenas em commits locais ainda não hospedados. `app/page.tsx`. |
| 02 | Passaporte vivo | **P.** `business_facts`, API, RLS e proveniência existem; tela resume presença/status de sete campos, sem edição/freshness por domínio. `app/passaporte/page.tsx`; ST-009 parcial. |
| 03 | Linha do Tempo | **P.** Eventos e consulta existem; UI atual mostra códigos e UUIDs crus, sem narrativa executiva completa. `app/historico/page.tsx`. |
| 04 | Diagnóstico adaptativo | **D/P.** Biblioteca de 144, 24 âncoras e 31 interações iniciais; aprofundamento determinístico presente, calibração setorial pendente. `data/diagnostic-strategy-v1.1.json`; ST-086/119. |
| 05 | Doze dimensões | **D.** Doze dimensões em seis etapas no método e no score versionado. `data/diagnostic-strategy-v1.1.json`. |
| 06 | Formatos de pergunta | **P.** UI/metadata permitem escala, seleção e campos estruturados; falta aceite por formato para garantir a lista inteira do dossiê. `app/diagnostico-v1/journey.tsx`; ST-077/083. |
| 07 | Progresso | **D.** Jornada mostra etapa e avanço. `app/diagnostico-v1/journey.tsx`; ST-081. |
| 08 | Termômetro de Confiabilidade | **P.** Score/confiança/cobertura separados; uma mera referência de arquivo **não eleva** confiança e consistência está neutra até regra verificável. `lib/diagnostic-answer-quality.ts:112-124`; ST-118 pendente. |
| 09 | “Não sei”, “Não se aplica”, “Depois” | **D com restrição.** Estados distintos existem; “Não se aplica” não é permitido nas 24 âncoras universais. A redação comercial não deve sugerir uso irrestrito. |
| 10 | Índice Genesis de Crescimento | **D.** 24 âncoras estáveis, versão metodológica e score determinístico; benchmark futuro não decorre automaticamente do índice. `lib/diagnostic-evaluation.ts`. |
| 11 | Top prioridades | **D.** Achados e ordenação exibidos com score/confiança; não significam causa comprovada. `app/prioridades/page.tsx`. |
| 12 | Leitura de causa | **P.** Há estrutura para hipótese; `lib/gds.ts` deixa `causeHypotheses` vazio e recomenda investigar. Não há validação documental de causa-raiz. |
| 13 | Padrão Genesis de Decisão | **P.** Contratos, tabela e API existem; relatório executivo não incorpora `decision_records` na síntese atual. `app/api/pains/[id]/gds/route.ts`; `app/resultado-v1/page.tsx`. |
| 14 | Missões | **P.** Estados, transições, evidências e critérios têm contratos; a demo hospedada não mostra o ciclo decisão→missão→outcome concluído. `app/missoes/page.tsx`; migrations `0006`/`0009`. |
| 15 | Evidências | **P.** Metadados e vínculos existem; pacote da demo tem três fontes sintéticas não verificadas; upload real desligado. O relatório mostra 50/50 respostas com referências genéricas, sem pertinência por pergunta provada. |
| 16 | Registro de resultados | **P.** API/tabela de outcome presentes, mas nenhum resultado empresarial da demo comprova o ciclo completo. `app/api/missions/[id]/outcome/route.ts`. |
| 17 | Seis níveis de evolução | **P/F.** Nomes e intenção no PRD, helper de evento no código; não há estado persistido, regra versionada e progressão por evidência/outcome implementados. ST-022 parcial. |
| 18 | Soluções qualificadas | **G.** Prévia fictícia explicável existe; endpoint real falha fechado com flag desligada. Metodologia/capability/threshold pendentes. `app/api/solutions/route.ts`; ST-023..030. |
| 19 | Qualificação de prestadores | **G.** Schema e motor de elegibilidade existem; declaração, revisão, policy e operação completas não. Planos não compram ranking. ST-116/117 e PEND-003..006. |
| 20 | Conexão neutra | **G.** A regra de neutralidade está expressa e há simulação; contato real desligado até elegibilidade, consentimento e governança aprovados. |
| 21 | Conselho Genesis | **D/G/pós-V1.** Hoje três sínteses determinísticas da demo, sem agentes externos. Conselho ampliado/Agentic é `AGENTIC-1`, após `V1-GA`; avaliação, orçamento e controles ainda pendentes. |
| 22 | Comparativos de referência | **F.** Não há coortes, supressão, amostra mínima, motor operacional ou tela de benchmark; ST-044 e PEND-008 pendentes. O próprio PDF condiciona a amostra/privacidade. |
| 23 | Inteligência para ecossistemas | **F.** Consent purpose e placeholder existem; não há associação empresa–ecossistema, agregação governada, dashboard institucional ou identidade configurável operacionais. EPIC-08 e PEND-009 pendentes. |
| 24 | Privacidade e proteção | **P.** Tenant/RLS, RBAC, consentimentos e audit presentes; tratamento jurídico e operacional por finalidade, retenção e fluxos futuros dependem de gates. |
| 25 | Declaração antes do envio | **P/G.** Contratos versionados e tela de intenção presentes; upload binário permanece desligado até revisão jurídica, scanner, retenção e exclusão. |
| 26 | Experiência premium simples | **P.** Genesis Precision Light aplicado e navegação principal funcional; auditoria visual encontrou texto secundário abaixo do contraste AA, foco fraco, rótulos móveis de 8 px e páginas legadas desestruturadas. |

## Promessas transversais fora da lista numerada

- **Planos na página 11.** Preços Free/Start/Pro estão aprovados no catálogo (`data/commercial-plans.json`) e persistidos, mas `checkoutEnabled`, `providerNetworkEligibilityApproved` e `aiQuotasApproved` são `false`. O diagnóstico FULL é aceito sem verificar assinatura (`app/api/diagnostics/route.ts`); portanto a tabela de benefícios por plano não é enforcement executável. O contrato de 12 meses ainda requer revisão jurídica de lançamento.
- **Texto “31 âncoras”.** A UI usa essa expressão em `app/diagnostico-v1/journey.tsx:443`, embora o método tenha **24 âncoras** e **31 interações iniciais**. Corrigir a cópia antes da apresentação.
- **Administração Genesis da página 19.** A central existente é somente owner/admin do tenant fictício; não existe backoffice global para regras, versões, qualificações, planos, conteúdo e qualidade. ST-040 pendente.
- **Mensagens prontas da página 18.** Falas em tempo presente sobre prestadores qualificados e visão agregada podem parecer oferta disponível. A ressalva da página 20 é correta, mas distante do script; anexar status/condições em cada fala usada na reunião.
- **Promessa de utilidade documental.** Evidências sintéticas não equivalem a receber, extrair, validar e analisar arquivos do cliente. A confiança demonstrativa de 78% não é precisão documental certificada.

## Garantia de entrega e direção operacional

A sequência aprovada é `Hosted Staging → 100 Tenants Ready → Piloto Controlado → 500 Tenants Ready → Fechamento Funcional da V1 → 2.000 Tenants Ready → V1 Completa → Agentic → Enterprise Memory`. Só HSP-0..4 foram autorizadas; HSP-4 terminou NO-GO. As etapas seguintes estão nomeadas, porém sem ligação item a item das 26 promessas a uma Wave, dono, dependência, critério PASS/FAIL e evidência obrigatória. O catálogo de histórias contém status históricos contraditórios. Assim, **não há base técnica para garantir hoje que todo o dossiê será entregue na V1-GA ou em uma data específica**.

Para transformar a visão em compromisso verificável, aprovar uma matriz de escopo por promessa (`já demonstrável`, `V1-F/V1-GA com gate`, `condicionado a decisão`, `pós-V1`); vincular cada linha a story, contrato/API/UI, migração, teste E2E, indicador operacional e decisão jurídica/comercial; detalhar Waves futuras com gates; reconciliar PRD e dossiê com a sequência aprovada. Ecosystem, benchmark e seis níveis precisam de desenho/contratos próprios; não inferir que aparecerão automaticamente da arquitetura atual. Não ativar flags sensíveis por causa do material comercial.

Depois da reconciliação, a ordem de correção imediata da auditoria anterior permanece: rotas legadas/CTA indevido → proveniência fiel e erros de leitura fail-closed → contraste/mobile/semântica → gate de baseline/CI → nova prova no staging do artefato exato. Esse trabalho melhora a apresentação sem antecipar módulos congelados.

## Enquadramento de entrega proposto, ainda não aprovado como escopo

| Marco | Itens do dossiê que podem ser creditados apenas com gate próprio |
|---|---|
| Apresentação demonstrativa | 01, 04, 05, 07, 09, 10, 11 e Conselho determinístico (parte de 21), com rótulo explícito de cenário sintético; 26 apenas após verificação visual do artefato novo. |
| Fechamento funcional V1, a detalhar em stories e aceite | 02, 03, 06, 08, 12, 13, 14, 15, 16, 17, 24, 25 e enforcement dos benefícios por plano. Nenhum desses itens recebe PASS por existir uma tabela ou contrato isolado. |
| Decisão comercial, jurídica e operacional anterior à ativação | 18, 19, 20 e upload real em 15/25: metodologia neutra, prestador qualificado, consentimento, segurança do arquivo e gates de contato. Não vinculados automaticamente a `V1-F` ou `V1-GA`. |
| Após V1-GA pela sequência vigente | Conselho com agentes (21) em `AGENTIC-1`; memória em `MEMORY-1`. |
| Sem Wave e aceite suficientemente definidos | Benchmark (22) e inteligência institucional (23). Exigem arquitetura de coorte, privacidade, contratos, interface e decisão de prioridade antes de qualquer promessa de entrega. |

`SCALE-500` e `SCALE-2000` são provas operacionais de escala, não autorização implícita de funcionalidades. Esta alocação é análise, não mudança do roadmap aprovado.

## Correções locais iniciadas após o snapshot

As primeiras quatro frentes da ordem acima foram implementadas no workspace em 23/09, sem publicar: rotas legadas/CTA, proveniência/erros de leitura, contraste/mobile/semântica e baseline de 23 rotas. O relatório de auditoria e a matriz acima descrevem o estado **antes** dessas correções; a execução antiga do staging também não muda por causa delas. `PROJECT-STATE.md` registra os testes locais e as provas hospedadas ainda pendentes. Não se credita PASS de runtime às alterações locais.

### Adendo do candidato local posterior à matriz

O lote `LOCAL_CORRECTION_BATCH_2026-09-23.md` acrescentou edição declarativa
dos sete campos essenciais do Passport e apresentação legível da Timeline;
portanto, as descrições das linhas 02 e 03 acima são um **snapshot anterior**,
não a UX local mais recente. A nova interface ainda não prova freshness por
domínio nem fechamento completo da história V1-ST-009. A demo, Home,
Indicadores, Prioridades e Missões agora falham fechado se a empresa não for
inequívoca. Fontes fictícias são validadas por conteúdo antes de contabilização,
e uma migration local adicional restringe a leitura de eventos de fatos
sensíveis. `pnpm quality` e 106/106 pgTAP passaram localmente; o staging não foi
atualizado. As linhas 15, 21–25 e a conclusão de HSP-4 conservam os limites
anteriores, inclusive upload real e Agentic desligados.
