# GENESIS 360º — BANCO MESTRE DO DIAGNÓSTICO EMPRESARIAL 360º V3

**Versão:** 3.0  
**Data-base:** 25 de junho de 2026  
**Status:** baseline funcional para implementação do questionário dinâmico  
**Aplicação:** M0 demonstrável, M1 robusto, Starter e diagnóstico avançado  
**Owner metodológico:** Hudson Lopes Custódio  
**Owner técnico:** Fernando Lima  
**Governança administrativa/financeira e privacidade:** Lilian Lopes  
**Operação comercial e parceiros:** Tatyanne Tavares  

---

# 1. Propósito

Este documento define o banco mestre de perguntas, evidências, documentos opcionais, escalas, regras de confiança, sinais de risco e lógica de progressão do Diagnóstico Genesis 360º.

O diagnóstico não deve funcionar como um formulário único e longo. Ele deve operar em camadas:

1. **Perfil e contexto:** identifica porte, segmento, momento e restrições.
2. **Diagnóstico Essencial — M0:** produz o primeiro valor com poucas perguntas.
3. **Diagnóstico Completo — M1/Starter:** aprofunda causas, controles, métricas e riscos.
4. **Módulos avançados:** são ativados por plano, necessidade, risco ou consentimento.
5. **Evidências e documentos:** aumentam a confiança, mas o upload não é obrigatório.
6. **Revisão humana:** exigida para decisões tributárias, jurídicas, financeiras, de dados, segurança e capital.

A promessa do diagnóstico é:

> Identificar o problema prioritário, explicar os fatores que sustentam a conclusão, indicar o que ainda não foi comprovado e recomendar a próxima ação de menor risco e maior impacto.

---

# 2. Texto de abertura para o usuário

## 2.1 Mensagem principal

> **Vamos conhecer sua empresa por completo.**  
> Você poderá responder apenas às perguntas essenciais e aprofundar as áreas mais relevantes depois. Sempre que possível, apresentaremos exemplos de documentos que podem confirmar as informações fornecidas. O envio é opcional.

## 2.2 Aviso sobre documentos opcionais

> **Os documentos não são obrigatórios para concluir o diagnóstico.**  
> No entanto, quanto mais completas, atuais e verificáveis forem as informações fornecidas, maior será a confiança, a precisão e a personalização do resultado. A ausência de documentos reduz o nível de confiança da análise, mas não reprova automaticamente a empresa.

## 2.3 Aviso de segurança e minimização

> Envie apenas documentos necessários para a finalidade informada. Você pode ocultar dados pessoais ou comerciais que não sejam relevantes. Não envie senhas, certificados digitais, chaves privadas, tokens, códigos de autenticação, dados bancários completos ou documentos pessoais sem necessidade. Documentos sensíveis devem ser acessados somente por pessoas autorizadas.

## 2.4 Texto curto para cada área

> **Quer aumentar a confiança desta análise?**  
> Você pode anexar um ou mais documentos sugeridos abaixo. Esta etapa é opcional e poderá ser concluída depois.

## 2.5 Indicadores exibidos ao usuário

- progresso do questionário;
- tempo estimado restante;
- cobertura por dimensão;
- documentos enviados;
- dados ainda não confirmados;
- nível de confiança;
- áreas de maior risco;
- próxima melhor pergunta;
- possibilidade de salvar e continuar.

---

# 3. Regras de experiência

1. Mostrar no máximo uma pergunta principal por tela.
2. Usar linguagem simples e explicar termos técnicos.
3. Oferecer `Não sei`, `Não se aplica` e `Prefiro informar depois`.
4. Não exigir documentos para avançar.
5. Não solicitar o mesmo dado duas vezes.
6. Pré-preencher dados já existentes no Business Digital Twin.
7. Ocultar perguntas sem pertinência por regime, setor, porte ou resposta anterior.
8. Informar por que uma pergunta sensível é necessária.
9. Separar fato, declaração, inferência e hipótese.
10. Exibir o resultado essencial antes de solicitar aprofundamentos.
11. Solicitar documentos por prioridade, nunca todos de uma vez.
12. Permitir revogação de consentimento e exclusão conforme política aplicável.
13. Em áreas críticas, apresentar aviso de que o Genesis não substitui profissional habilitado.
14. Nunca prometer crédito tributário, retorno financeiro, aprovação ou resultado.
15. Manter histórico de versão das perguntas e regras.

---

# 4. Camadas do diagnóstico

| Camada | Objetivo | Quantidade-alvo | Tempo estimado | Uso |
|---|---|---:|---:|---|
| Perfil | Conhecer empresa e contexto | 15–20 | 5–8 min | Todos |
| Essencial M0 | Identificar gargalos e primeira ação | 24 | 10–15 min | Demo e entrada |
| Completo M1 | Avaliar maturidade, causas e controles | 80–120 dinâmicas | 45–90 min fracionados | Piloto |
| Starter | Atualizar evidências, missões e resultados | Dinâmico | Contínuo | Operação |
| Avançado | Tributário, capital, segurança e temas específicos | Sob gatilho | Variável | Humano no loop |

**Regra:** o M0 utiliza duas perguntas essenciais por dimensão. O sistema escolhe as perguntas de aprofundamento conforme respostas, risco e relevância.

---

# 5. Escalas e tipos de resposta

## 5.1 Escala de maturidade 0–4

| Nota | Descrição |
|---:|---|
| 0 | Inexistente, desconhecido ou sem controle |
| 1 | Informal, reativo e dependente de pessoas |
| 2 | Parcialmente definido, aplicado de forma inconsistente |
| 3 | Definido, acompanhado e utilizado na gestão |
| 4 | Integrado, mensurado, revisado e melhorado continuamente |

`Não se aplica` não recebe nota. `Não sei` reduz cobertura e confiança.

## 5.2 Tipos permitidos

- escolha única;
- múltipla escolha;
- escala 0–4;
- sim/não/parcial;
- número;
- percentual;
- faixa monetária;
- data;
- texto curto;
- texto estruturado;
- matriz;
- upload opcional;
- confirmação de declaração;
- consentimento específico.

## 5.3 Pesos

| Peso | Uso |
|---:|---|
| 3 | P0 — influencia prioridade, risco ou primeira decisão |
| 2 | P1 — importante para maturidade e plano |
| 1 | P2 — complementar, benchmarking ou personalização |

## 5.4 Confiança da informação

| Nível | Evidência |
|---:|---|
| 0,50 | resposta sem confirmação |
| 0,65 | resposta com detalhes coerentes |
| 0,80 | relatório ou exportação interna |
| 0,90 | documento oficial ou fonte primária |
| 1,00 | integração, conciliação ou revisão humana autorizada |

A confiança deve ser calculada separadamente da maturidade. A falta de documento não reduz automaticamente a maturidade, exceto quando a própria ausência do documento representa falha de controle.

---

# 6. Motor de score

## 6.1 Score por pergunta

```text
score_pergunta = nota_maturidade × peso
```

## 6.2 Score bruto da dimensão

```text
score_dimensão = soma(score_pergunta) / soma(4 × peso das perguntas respondidas)
```

Converter para 0–100.

## 6.3 Cobertura

```text
cobertura = peso das perguntas válidas respondidas / peso total das perguntas aplicáveis
```

## 6.4 Confiança

```text
confiança = média ponderada do nível de evidência × atualidade × consistência
```

## 6.5 Penalidades de risco

Aplicar penalidade ou bloqueio quando houver:

- risco crítico sem responsável;
- descumprimento legal declarado;
- vazamento ou incidente não tratado;
- ausência de caixa para obrigações imediatas;
- dependência extrema de uma pessoa;
- fraude, manipulação ou inconsistência relevante;
- passivo fiscal/jurídico não dimensionado;
- ausência de backup para processo crítico;
- recomendação crítica sem evidência.

## 6.6 Leitura

| Score | Faixa | Leitura |
|---:|---|---|
| 0–24 | Preto | risco crítico; parar, proteger e validar |
| 25–44 | Vermelho | fragilidade elevada; corrigir antes de escalar |
| 45–64 | Amarelo | estrutura parcial; priorizar gargalos |
| 65–79 | Verde | gestão funcional; otimizar |
| 80–100 | Verde avançado | maturidade alta; escalar com monitoramento |

O score não deve ser exibido sem cobertura mínima de 60% na dimensão. Abaixo disso, mostrar `dados insuficientes`.

---

# 7. Perfil empresarial — não pontuado

| ID | Pergunta | Tipo | Observação |
|---|---|---|---|
| PERF-001 | Qual é a razão social e o nome fantasia da empresa? | Texto | Permitir preenchimento posterior |
| PERF-002 | Qual é o CNPJ principal? | Texto validado | Opcional no M0 demonstrativo |
| PERF-003 | Em quais cidades, estados e países a empresa opera? | Múltipla | Identifica jurisdição |
| PERF-004 | Qual é o setor e o principal modelo de negócio? | Escolha + texto | B2B, B2C, B2B2C, marketplace, indústria etc. |
| PERF-005 | Quais produtos ou serviços representam a maior parte da receita? | Lista | Percentual opcional |
| PERF-006 | Há quanto tempo a empresa opera? | Faixa | Pré-operacional, <1, 1–3, 4–10, >10 anos |
| PERF-007 | Qual é a faixa de faturamento anual? | Faixa | Permitir `prefiro não informar` |
| PERF-008 | Quantas pessoas trabalham na empresa, incluindo sócios? | Número/faixa | Separar CLT, terceiros e parceiros |
| PERF-009 | Quantas unidades, filiais ou CNPJs fazem parte da operação? | Número | Aciona estrutura multiempresa |
| PERF-010 | Quem está respondendo e qual é seu papel? | Escolha | Sócio, diretoria, gestor, contador etc. |
| PERF-011 | Quem pode validar informações financeiras, jurídicas, tributárias e de dados? | Lista | Define revisores |
| PERF-012 | Qual é o principal objetivo para os próximos 12 meses? | Múltipla | Caixa, vendas, margem, eficiência, escala, governança |
| PERF-013 | Qual problema mais preocupa a liderança hoje? | Texto estruturado | Sintoma inicial |
| PERF-014 | Qual decisão importante precisa ser tomada nos próximos 90 dias? | Texto | Alimenta GDS |
| PERF-015 | Qual é o nível atual de urgência? | 1–5 | Impacto e prazo |
| PERF-016 | A empresa pertence a grupo econômico, franquia, rede ou holding? | Sim/não/parcial | Aciona perguntas |
| PERF-017 | Existem atividades reguladas ou licenças específicas? | Múltipla | Jurídico/compliance |
| PERF-018 | Quais sistemas a empresa utiliza hoje? | Múltipla | ERP, CRM, contábil, RH, BI |
| PERF-019 | Quais áreas podem participar do diagnóstico? | Múltipla | Define cobertura |
| PERF-020 | Você autoriza o uso das respostas para gerar o diagnóstico e as recomendações? | Consentimento | Versionado |

---

# 8. Banco mestre de perguntas

**Legenda de fase:**  
`E` = Essencial M0 • `C` = Completo M1/Starter • `A` = Avançado/sob gatilho

## DIMENSÃO 1 — Estratégia, modelo de negócio e governança

**Objetivo:** Avaliar clareza estratégica, modelo de negócio, prioridades, governança decisória e dependência dos fundadores.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| EST-001 | E | A empresa possui prioridades estratégicas claramente definidas para os próximos 12 meses? | Escala 0–4 | Plano estratégico, OKRs, metas | 3 | 0/1 e mais de cinco prioridades |
| EST-002 | E | As decisões importantes têm responsável, prazo, critério e registro de aprovação? | Escala 0–4 | Atas, decision records, matriz de alçadas | 3 | Decisões críticas sem owner |
| EST-003 | C | A liderança consegue explicar de forma consistente qual problema central a empresa resolve e para quem? | Escala 0–4 | Proposta de valor, apresentações, entrevistas | 2 | Respostas divergentes |
| EST-004 | C | O modelo de receita, custos, canais e parceiros está documentado e atualizado? | Escala 0–4 | Business model, plano comercial, orçamento | 2 | Receita sem unidade econômica |
| EST-005 | C | Existem metas conectando estratégia, áreas, equipes e responsáveis? | Escala 0–4 | Mapa de metas, OKRs, dashboards | 3 | Metas órfãs ou conflitantes |
| EST-006 | C | A empresa revisa estratégia e prioridades em uma cadência definida? | Escolha | Calendário, atas, relatórios de revisão | 2 | Sem revisão há mais de 12 meses |
| EST-007 | C | Há critérios objetivos para iniciar, pausar ou encerrar projetos? | Escala 0–4 | Política de portfólio, business cases | 2 | Projetos mantidos sem evidência |
| EST-008 | C | Quais decisões ainda dependem exclusivamente do fundador ou de uma única pessoa? | Múltipla + texto | Matriz decisória, organograma | 3 | Dependência em finanças, vendas ou operação |
| EST-009 | C | Existem alçadas financeiras, contratuais e operacionais formalizadas? | Sim/não/parcial | Política de alçadas | 3 | Ausência em decisões de alto impacto |
| EST-010 | C | A empresa acompanha premissas estratégicas e sinais de mudança de mercado? | Escala 0–4 | Registro de hipóteses, pesquisas, relatórios | 2 | Tese não revisada |
| EST-011 | A | O conselho, comitê ou sócios recebem informações suficientes e comparáveis para decidir? | Escala 0–4 | Board pack, relatórios, atas | 2 | Decisão sem dados |
| EST-012 | A | Há plano de sucessão, saída de sócio ou continuidade da liderança? | Sim/não/parcial | Acordo, plano de sucessão, procurações | 3 | Nenhum substituto para papel crítico |

### Documentos opcionais da área

- Contrato/estatuto social e alterações consolidadas;
- Acordo de sócios ou acionistas, quando existente;
- Organograma e matriz de responsabilidades;
- Planejamento estratégico ou plano anual;
- OKRs, metas e indicadores estratégicos;
- Atas de reuniões de sócios, diretoria ou conselho;
- Orçamento e plano de investimentos;
- Políticas de alçadas e aprovação;
- Mapa de unidades, empresas e participações;
- Business plan, canvas ou tese de crescimento;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.


## DIMENSÃO 2 — Financeiro, caixa e rentabilidade

**Objetivo:** Avaliar liquidez, margem, previsibilidade, capital de giro, controles, custos e capacidade de decisão financeira.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| FIN-001 | E | A empresa conhece sua disponibilidade de caixa e as obrigações dos próximos 30, 60 e 90 dias? | Escala 0–4 | Fluxo de caixa, contas a pagar/receber | 3 | Caixa desconhecido ou insuficiente |
| FIN-002 | E | A empresa conhece a margem de contribuição e a rentabilidade dos principais produtos, serviços ou clientes? | Escala 0–4 | DRE gerencial, custos, precificação | 3 | Crescimento sem margem conhecida |
| FIN-003 | C | Existe conciliação regular entre bancos, ERP e contabilidade? | Escolha | Conciliação, razão, extratos | 3 | Diferenças não explicadas |
| FIN-004 | C | O fluxo de caixa é projetado e comparado com o realizado? | Escala 0–4 | Forecast e realizado | 3 | Sem previsão mínima de 13 semanas |
| FIN-005 | C | Qual é o prazo médio de recebimento, pagamento e estoque? | Número/faixa | Aging, estoque, fornecedores | 2 | Ciclo financeiro crescente |
| FIN-006 | C | Qual percentual da receita está vencido ou inadimplente? | Percentual/faixa | Aging de recebíveis | 3 | Inadimplência crítica |
| FIN-007 | C | Os preços são revisados com base em custos, impostos, mercado e valor percebido? | Escala 0–4 | Política e memória de cálculo | 3 | Preço sem custo/tributo |
| FIN-008 | C | A empresa possui orçamento anual e responsáveis por desvios? | Escala 0–4 | Budget, forecast, atas | 2 | Desvio relevante sem ação |
| FIN-009 | C | Existem despesas pessoais, de sócios ou não recorrentes misturadas à operação? | Escolha sensível | Plano de contas, política de despesas | 3 | Mistura recorrente |
| FIN-010 | C | Qual é a concentração de receita nos cinco maiores clientes? | Percentual/faixa | Relatório de receita por cliente | 2 | Concentração elevada |
| FIN-011 | A | A empresa possui dívidas, garantias, covenants ou parcelamentos que limitam decisões? | Múltipla | Contratos e cronograma da dívida | 3 | Covenant/obrigação não monitorado |
| FIN-012 | A | Há indicadores financeiros com owner e limite de alerta? | Matriz | Dashboard, política de limites | 2 | Sem alertas de caixa/margem |

### Documentos opcionais da área

- DRE mensal e anual dos últimos 12–24 meses;
- Balanço patrimonial e balancetes;
- Fluxo de caixa realizado e projetado;
- Extratos ou conciliações bancárias, preferencialmente com dados desnecessários ocultados;
- Contas a receber e a pagar por vencimento;
- Relatório de inadimplência;
- Orçamento, forecast e realizado versus previsto;
- Planilha de precificação, custos e margens;
- Contratos de empréstimos, financiamentos e parcelamentos;
- Relatório de estoque e perdas, quando aplicável;
- Plano de investimentos e uso de capital;
- Relatórios gerenciais do ERP/contabilidade;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.


## DIMENSÃO 3 — Comercial, vendas e receita

**Objetivo:** Avaliar previsibilidade de receita, processo comercial, pipeline, conversão, produtividade e qualidade da venda.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| VEN-001 | E | A empresa possui um processo comercial com etapas, critérios de avanço e responsáveis definidos? | Escala 0–4 | CRM, playbook, pipeline | 3 | Pipeline sem critérios |
| VEN-002 | E | A liderança consegue prever a receita dos próximos 30–90 dias com base em oportunidades reais? | Escala 0–4 | Forecast e histórico | 3 | Forecast inexistente |
| VEN-003 | C | Qual é a taxa de conversão por etapa e por origem? | Percentual/matriz | Funil do CRM | 3 | Não mede conversão |
| VEN-004 | C | Qual é o tempo médio de resposta a um lead e de fechamento? | Número/faixa | CRM, logs, relatórios | 2 | Resposta tardia |
| VEN-005 | C | Existe definição clara de ICP, qualificação e desqualificação? | Escala 0–4 | ICP, formulário, playbook | 3 | Venda para cliente inadequado |
| VEN-006 | C | Os motivos de perda são registrados e revisados? | Escala 0–4 | Lost reasons, atas | 2 | Motivo genérico ou ausente |
| VEN-007 | C | Descontos e condições especiais obedecem a alçadas e margem mínima? | Sim/não/parcial | Política comercial, aprovações | 3 | Desconto sem controle |
| VEN-008 | C | A remuneração variável incentiva receita saudável, margem, retenção e qualidade? | Escala 0–4 | Política de comissão | 2 | Incentivo a venda ruim |
| VEN-009 | C | A empresa acompanha produtividade e capacidade por vendedor ou canal? | Escala 0–4 | Dashboards | 2 | Meta incompatível com capacidade |
| VEN-010 | C | Quanto da receita vem de recorrência, expansão, indicação e novos clientes? | Matriz percentual | Receita por origem | 2 | Dependência de um canal |
| VEN-011 | A | Há processo estruturado de parceiros, canais e atribuição de origem? | Escala 0–4 | Contratos, referral logs | 2 | Fee sem rastreabilidade |
| VEN-012 | A | Vendas prometem prazos, funcionalidades ou resultados que a operação não consegue entregar? | Escolha + frequência | Contratos, reclamações, handoff | 3 | Promessas recorrentes não cumpridas |

### Documentos opcionais da área

- Exportação do CRM ou pipeline;
- Funil por etapa, origem e vendedor;
- Metas e resultados comerciais;
- Playbook, scripts e cadências;
- Propostas e modelos comerciais;
- Política de preços, descontos e comissões;
- Relatório de motivos de perda;
- Contratos de clientes e SLAs;
- Carteira por cliente, produto e canal;
- Forecast comercial;
- Gravações ou transcrições autorizadas de vendas;
- Relatórios de tempo de resposta e follow-up;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.


## DIMENSÃO 4 — Marketing, marca e aquisição

**Objetivo:** Avaliar posicionamento, geração de demanda, canais, eficiência de aquisição, conteúdo e integridade das promessas.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| MKT-001 | E | A empresa possui público prioritário e posicionamento claramente definidos? | Escala 0–4 | ICP, personas, brandbook | 3 | Mensagem genérica |
| MKT-002 | E | A empresa sabe quais canais geram leads qualificados e receita, não apenas alcance? | Escala 0–4 | Analytics, CRM, atribuição | 3 | Investe sem atribuição |
| MKT-003 | C | A proposta de valor é coerente em site, vendas, produto e atendimento? | Escala 0–4 | Materiais, scripts, páginas | 2 | Promessas divergentes |
| MKT-004 | C | Existe mensuração de CAC, conversão e payback por canal? | Escala 0–4 | Relatórios financeiros/comerciais | 3 | CAC desconhecido |
| MKT-005 | C | A empresa diferencia lead, MQL, SQL, oportunidade e cliente? | Sim/não/parcial | Definições no CRM | 2 | Conceitos inconsistentes |
| MKT-006 | C | Campanhas possuem objetivo, hipótese, orçamento, métrica e decisão de continuidade? | Escala 0–4 | Briefings e relatórios | 2 | Campanhas sem gate |
| MKT-007 | C | A empresa mantém registro de consentimento, opt-out e origem dos contatos? | Escala 0–4 | Base de consentimentos | 3 | Contato sem base |
| MKT-008 | C | Conteúdos e ofertas são revisados para evitar promessa enganosa ou não comprovada? | Escala 0–4 | Checklist, aprovações | 3 | Claim sem evidência |
| MKT-009 | C | A marca possui ativos próprios e dependência controlada de plataformas externas? | Escala 0–4 | Base, site, audiência | 2 | Dependência extrema |
| MKT-010 | C | A empresa acompanha participação de marca, reputação e menções críticas? | Escala 0–4 | Social listening, pesquisas | 1 | Crise não monitorada |
| MKT-011 | A | Há experimentação estruturada de canais, mensagens e ofertas? | Escala 0–4 | Backlog de testes | 2 | Teste sem aprendizado |
| MKT-012 | A | Existe processo para revisar materiais quando leis, preços, produtos ou condições mudam? | Escala 0–4 | Controle de versão | 2 | Material desatualizado |

### Documentos opcionais da área

- Plano de marketing e orçamento;
- Definição de ICP, personas e jornadas;
- Brandbook e mensagens principais;
- Relatórios de campanhas e mídia;
- Analytics de site e conversão;
- Calendário e desempenho de conteúdo;
- Relatórios de SEO e tráfego;
- Pesquisas de mercado e concorrência;
- Base de leads e consentimentos;
- Contratos com agências, plataformas e influenciadores;
- Materiais promocionais e claims;
- Relatórios de CAC por canal;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.


## DIMENSÃO 5 — Clientes, oferta, produto e experiência

**Objetivo:** Avaliar aderência da oferta, entrega de valor, retenção, qualidade percebida, suporte e aprendizado com clientes.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| CLI-001 | E | A empresa mede se o cliente alcançou o resultado prometido, e não apenas se a entrega foi concluída? | Escala 0–4 | Pesquisas, outcomes, indicadores | 3 | Entrega sem resultado |
| CLI-002 | E | As principais causas de reclamação, cancelamento ou retrabalho são conhecidas e tratadas? | Escala 0–4 | Tickets, churn, planos | 3 | Problema recorrente |
| CLI-003 | C | A empresa conhece os segmentos mais rentáveis, satisfeitos e aderentes? | Escala 0–4 | Rentabilidade e satisfação | 2 | Mesmo tratamento para todos |
| CLI-004 | C | O onboarding possui etapas, responsável, prazo e critério de ativação? | Escala 0–4 | Checklist, CRM/CS | 2 | Cliente sem ativação |
| CLI-005 | C | Há SLAs claros e monitorados para entrega e atendimento? | Escala 0–4 | Contratos, relatórios | 3 | SLA crítico descumprido |
| CLI-006 | C | A empresa mede churn, retenção, recompra e expansão? | Escala 0–4 | Relatórios de coorte | 3 | Retenção desconhecida |
| CLI-007 | C | Feedbacks são classificados, priorizados e vinculados a decisões? | Escala 0–4 | Backlog, atas | 2 | Feedback sem resposta |
| CLI-008 | C | Existe processo de recuperação de clientes insatisfeitos? | Escala 0–4 | Playbook, tickets | 2 | Crise sem owner |
| CLI-009 | C | A oferta possui escopo, limites, pré-requisitos e critérios de aceite claros? | Escala 0–4 | Propostas, contratos | 3 | Escopo ambíguo |
| CLI-010 | C | A empresa acompanha custo de servir e rentabilidade por perfil de cliente? | Escala 0–4 | DRE por cliente, horas | 2 | Cliente deficitário invisível |
| CLI-011 | A | O roadmap é orientado por evidências de problema, valor e viabilidade? | Escala 0–4 | Discovery, roadmap | 2 | Feature por opinião |
| CLI-012 | A | A empresa consegue comprovar cases e resultados divulgados? | Sim/não/parcial | Cases, autorizações, métricas | 3 | Case sem consentimento/evidência |

### Documentos opcionais da área

- Catálogo de produtos e serviços;
- Termos, contratos, propostas e SLAs;
- Mapa da jornada do cliente;
- Processo de onboarding;
- Relatórios de NPS, CSAT, CES ou pesquisas;
- Churn, cancelamentos e expansão;
- Tickets, reclamações e prazos de resposta;
- Roadmap de produto/serviço;
- Backlog de melhorias;
- Entrevistas e pesquisas com clientes;
- Base de conhecimento e scripts de suporte;
- Relatórios de devolução, garantia ou retrabalho;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.


## DIMENSÃO 6 — Operações, processos, qualidade e fornecedores

**Objetivo:** Avaliar previsibilidade, capacidade, processos críticos, qualidade, fornecedores, perdas e continuidade operacional.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| OPE-001 | E | Os processos críticos possuem responsável, etapas, padrão e indicador definidos? | Escala 0–4 | Mapa, SOP, KPI | 3 | Processo crítico informal |
| OPE-002 | E | A empresa conhece seus principais gargalos, perdas, atrasos e retrabalhos? | Escala 0–4 | Relatórios operacionais | 3 | Gargalo sem medição |
| OPE-003 | C | A capacidade é planejada em relação à demanda e aos recursos disponíveis? | Escala 0–4 | Plano de capacidade | 3 | Venda acima da capacidade |
| OPE-004 | C | Quais atividades dependem de conhecimento não documentado? | Múltipla + texto | SOPs, entrevistas | 3 | Conhecimento em uma pessoa |
| OPE-005 | C | Existem critérios de qualidade e aceite por produto, serviço ou etapa? | Escala 0–4 | Checklists, inspeções | 2 | Aceite subjetivo |
| OPE-006 | C | Incidentes e não conformidades geram causa raiz, ação e verificação? | Escala 0–4 | RCA, CAPA | 3 | Incidente repetido |
| OPE-007 | C | A empresa mede tempo de ciclo, fila, produtividade e retrabalho? | Escala 0–4 | Dashboards | 2 | Otimização sem dados |
| OPE-008 | C | Compras e fornecedores críticos possuem seleção, contrato, SLA e avaliação? | Escala 0–4 | Contratos, scorecards | 3 | Fornecedor crítico sem alternativa |
| OPE-009 | C | Estoque, materiais ou ativos são controlados com inventário e perdas? | Escala 0–4/N.A. | Inventário, ERP | 2 | Diferença material |
| OPE-010 | C | Há segregação de funções nas compras, recebimento, pagamento e cadastro? | Escala 0–4 | Matriz de acesso/processo | 3 | Mesma pessoa controla todo ciclo |
| OPE-011 | A | A empresa possui plano para operar durante falha de fornecedor, sistema, unidade ou pessoa-chave? | Escala 0–4 | BCP, contingência | 3 | Nenhuma alternativa |
| OPE-012 | A | Melhorias operacionais têm baseline, meta, owner e comprovação de resultado? | Escala 0–4 | Projetos e outcomes | 2 | Melhoria sem baseline |

### Documentos opcionais da área

- Mapa de processos e cadeia de valor;
- SOPs, manuais e checklists;
- Indicadores de produção, prazo, qualidade e retrabalho;
- Plano de capacidade e escala;
- Relatórios de estoque, perdas e inventário;
- Contratos e avaliação de fornecedores;
- Política de compras e aprovações;
- Registros de incidentes e não conformidades;
- Planos de manutenção;
- Certificações e auditorias de qualidade;
- Relatórios de produtividade e utilização;
- Planos de continuidade de processos críticos;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.


## DIMENSÃO 7 — Pessoas, liderança, cultura e sucessão

**Objetivo:** Avaliar clareza de papéis, capacidade, desempenho, autonomia, segurança psicológica, sucessão e sustentabilidade humana.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| PES-001 | E | As pessoas sabem o que se espera de seu papel, quais resultados são seus e quais decisões podem tomar? | Escala 0–4 | Cargos, RACI, alçadas | 3 | Papéis indefinidos |
| PES-002 | E | A operação consegue funcionar sem presença contínua do fundador ou gestor principal? | Escala 0–4 | Substitutos, testes, organograma | 3 | Paralisação sem líder |
| PES-003 | C | Existem metas e feedbacks regulares conectados aos resultados? | Escala 0–4 | Avaliações, 1:1 | 2 | Cobrança sem critério |
| PES-004 | C | A carga de trabalho, horas extras e sobrecarga de pessoas-chave são monitoradas? | Escala 0–4 | Indicadores agregados | 3 | Sobrecarga recorrente |
| PES-005 | C | Há substitutos ou sucessores para funções críticas? | Escala 0–4 | Plano de sucessão | 3 | Papel sem backup |
| PES-006 | C | Contratação, promoção, remuneração e desligamento seguem critérios documentados? | Escala 0–4 | Políticas e registros | 3 | Decisão discriminatória/subjetiva |
| PES-007 | C | As competências necessárias hoje e nos próximos 12 meses estão mapeadas? | Escala 0–4 | Matriz de competências | 2 | Lacuna crítica |
| PES-008 | C | A empresa mede turnover, absenteísmo, tempo de contratação e retenção de talentos? | Escala 0–4 | Indicadores agregados | 2 | Saídas sem análise |
| PES-009 | C | As pessoas conseguem apontar riscos, erros e problemas sem sofrer retaliação? | Escala confidencial 0–4 | Pesquisa anônima, canal | 3 | Retaliação/medo |
| PES-010 | C | Conhecimento crítico é documentado, treinado e transferido? | Escala 0–4 | Manuais, trilhas | 3 | Conhecimento concentrado |
| PES-011 | A | A empresa mede performance sem incentivar excesso, manipulação ou comportamento inseguro? | Escala 0–4 | Metas, incentivos | 3 | Meta nociva |
| PES-012 | A | Existe plano para desenvolver líderes e multiplicadores internos? | Escala 0–4 | Trilhas, sucessão | 2 | Crescimento sem liderança |

### Documentos opcionais da área

- Organograma;
- Descrições de cargos e responsabilidades;
- Matriz RACI/alçadas;
- Políticas de pessoas e código de conduta;
- Plano de cargos, salários e incentivos;
- Metas e avaliações de desempenho;
- Plano de treinamento e trilhas;
- Indicadores agregados de turnover, absenteísmo e horas extras;
- Pesquisa de clima ou pulse;
- Plano de sucessão e mapa de pessoas-chave;
- Registros agregados de saúde e segurança ocupacional, quando aplicável;
- Calendário de rituais, 1:1 e feedbacks;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.


## DIMENSÃO 8 — Tecnologia, dados, IA e segurança da informação

**Objetivo:** Avaliar adequação tecnológica, integração, qualidade de dados, segurança, continuidade, automação e governança de IA.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| TEC-001 | E | Os sistemas críticos, responsáveis, acessos e dependências estão inventariados? | Escala 0–4 | Inventário e matriz | 3 | Ativo crítico desconhecido |
| TEC-002 | E | A empresa possui backup dos dados críticos e já testou a restauração? | Escolha | Relatórios e evidências | 3 | Nunca restaurou |
| TEC-003 | C | Acessos são concedidos por função, revisados e removidos no desligamento? | Escala 0–4 | Matriz, logs | 3 | Conta ativa indevida |
| TEC-004 | C | MFA é usado em contas administrativas, financeiras e sistemas críticos? | Sim/não/parcial | Configurações, política | 3 | Admin sem MFA |
| TEC-005 | C | Dados possuem definição, owner, fonte, qualidade e frequência de atualização? | Escala 0–4 | Dicionário/catálogo | 2 | Indicadores contraditórios |
| TEC-006 | C | Sistemas trocam dados de forma controlada ou dependem de planilhas e retrabalho manual? | Matriz | Integrações, fluxos | 2 | Processo crítico manual |
| TEC-007 | C | Incidentes, falhas e indisponibilidades são registrados, tratados e revisados? | Escala 0–4 | Incident log, postmortem | 3 | Incidente oculto/repetido |
| TEC-008 | C | Fornecedores de tecnologia possuem contrato, SLA, segurança e plano de saída? | Escala 0–4 | Contratos, DPA, BCP | 2 | Lock-in sem saída |
| TEC-009 | C | A empresa monitora vulnerabilidades, atualizações e dependências? | Escala 0–4 | Scans, patch reports | 3 | Falha crítica sem correção |
| TEC-010 | C | Automações e IA possuem owner, limite, logs, revisão humana e métrica? | Escala 0–4 | Inventário, política, evals | 3 | IA decide tema crítico |
| TEC-011 | A | Há segregação entre desenvolvimento, homologação e produção? | Sim/não/parcial | Ambientes, CI/CD | 3 | Teste em produção |
| TEC-012 | A | A empresa sabe quanto custa e qual resultado cada sistema, automação ou uso de IA gera? | Escala 0–4 | FinOps, ROI | 2 | Custo sem valor |

### Documentos opcionais da área

- Inventário de sistemas, ativos e fornecedores;
- Diagrama de arquitetura e integrações;
- Matriz de acessos e perfis;
- Políticas de segurança e uso aceitável;
- Relatórios de backup e testes de restauração;
- Registro de incidentes e vulnerabilidades;
- Contratos e SLAs de tecnologia;
- Dicionário e catálogo de dados;
- Mapas de integração/API;
- Inventário de automações e agentes de IA;
- Política de IA e avaliações;
- Plano de continuidade e recuperação;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.


## DIMENSÃO 9 — Jurídico, compliance, LGPD e controles

**Objetivo:** Avaliar regularidade societária, contratos, licenças, passivos, privacidade, integridade e controles de conformidade.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| JUR-001 | E | Os atos societários, licenças e responsáveis legais estão atualizados e acessíveis? | Escala 0–4 | Atos, licenças, certidões | 3 | Documento vencido/crítico |
| JUR-002 | E | Contratos relevantes são revisados, aprovados, armazenados e acompanhados quanto a prazo e obrigação? | Escala 0–4 | Contratos, CLM, agenda | 3 | Obrigação vencida |
| JUR-003 | C | A empresa conhece processos judiciais, administrativos, multas e contingências? | Escala 0–4 | Mapa de contingências | 3 | Passivo não dimensionado |
| JUR-004 | C | Existem modelos contratuais e alçadas para assinatura e exceções? | Escala 0–4 | Templates, procurações | 2 | Assinatura sem poder |
| JUR-005 | C | Há código de conduta, conflitos de interesse e canal de reporte? | Escala 0–4 | Políticas, registros | 2 | Ausência em setor de risco |
| JUR-006 | C | A empresa mapeou quais dados pessoais coleta, por quê, onde armazena, com quem compartilha e por quanto tempo? | Escala 0–4 | Inventário e mapa de dados | 3 | Tratamento desconhecido |
| JUR-007 | C | Os avisos, consentimentos e contratos refletem as finalidades reais do tratamento? | Escala 0–4 | Políticas, termos, DPA | 3 | Finalidade incompatível |
| JUR-008 | C | Existe processo para acesso, correção, revogação e exclusão de dados quando aplicável? | Escala 0–4 | SOP e tickets | 3 | Direito sem atendimento |
| JUR-009 | C | Incidentes de dados possuem classificação, resposta, registro e comunicação? | Escala 0–4 | Plano e incidentes | 3 | Incidente não tratado |
| JUR-010 | C | Fornecedores que recebem dados ou executam processo crítico são avaliados contratualmente? | Escala 0–4 | DPA, due diligence | 3 | Compartilhamento sem contrato |
| JUR-011 | A | Tratamentos de alto risco possuem avaliação de impacto e medidas de mitigação? | Sim/não/parcial | RIPD/DPIA, risk assessment | 3 | Alto risco sem avaliação |
| JUR-012 | A | Claims comerciais, marcas, propriedade intelectual e autorizações de uso estão protegidos? | Escala 0–4 | Registros, licenças, autorizações | 2 | Uso sem direito |

### Documentos opcionais da área

- Contrato/estatuto social e alterações;
- Certidões e licenças aplicáveis;
- Contratos padrão e contratos materiais;
- Mapa de processos jurídicos e passivos;
- Código de conduta e políticas de compliance;
- Canal de denúncia e registros agregados;
- Política de privacidade, cookies e termos;
- Inventário de dados pessoais e bases/finalidades;
- Contratos com operadores/subprocessadores;
- Relatório de Impacto à Proteção de Dados quando aplicável;
- Plano de resposta a incidentes de dados;
- Apólices de seguro relevantes;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.


## DIMENSÃO 10 — Tributário e oportunidades de caixa

**Objetivo:** Realizar triagem preliminar de organização fiscal, riscos, inconsistências e possíveis sinais para revisão profissional, sem garantir crédito ou substituir especialista.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| TAX-001 | E | Qual é o regime tributário atual e quando ele foi revisado pela última vez? | Escolha + data | CNPJ, opção/regime, parecer | 3 | Regime desconhecido |
| TAX-002 | E | A empresa enfrenta pressão de caixa relacionada a tributos, parcelamentos, retenções ou divergências fiscais? | Múltipla + urgência | Fluxo, guias, parcelamentos | 3 | Obrigação imediata sem caixa |
| TAX-003 | C | Os CNAEs, atividades reais, municípios e estados de operação estão atualizados e coerentes? | Escala 0–4 | CNPJ, inscrições, notas | 3 | Atividade divergente |
| TAX-004 | C | Escrituração, declarações, notas e recolhimentos são conciliados periodicamente? | Escala 0–4 | SPED, DCTFWeb, razão | 3 | Diferença não explicada |
| TAX-005 | C | Existem pagamentos em duplicidade, saldo credor, retenções, créditos acumulados ou divergências já identificadas? | Múltipla | Relatórios e pareceres | 3 | Sinal requer revisão |
| TAX-006 | C | A empresa passou por mudança relevante de atividade, regime, estrutura, unidade, folha ou cadeia de fornecedores nos últimos cinco anos? | Múltipla + data | Atos, regimes, relatórios | 2 | Mudança não refletida |
| TAX-007 | C | Há operações interestaduais, importação, exportação, substituição tributária, monofásico ou benefícios fiscais? | Múltipla/N.A. | Documentos fiscais | 3 | Complexidade sem controle |
| TAX-008 | C | Retenções sobre serviços, folha e pagamentos a terceiros são revisadas e conciliadas? | Escala 0–4 | EFD-Reinf, eSocial, notas | 3 | Retenção divergente |
| TAX-009 | C | Existem autos de infração, fiscalizações, parcelamentos, discussões ou teses em andamento? | Múltipla | Autos, processos, contratos | 3 | Prazo/risco crítico |
| TAX-010 | C | A empresa já realizou revisão tributária? Quais períodos, tributos, conclusões e responsáveis? | Texto estruturado | Relatório, parecer, contrato | 2 | Revisões conflitantes |
| TAX-011 | A | Os documentos necessários para uma análise especializada estão completos, legíveis, consistentes e autorizados para compartilhamento? | Checklist | Data room e consentimento | 3 | Documento/consentimento ausente |
| TAX-012 | A | Você autoriza o encaminhamento dos dados mínimos deste caso à parceira patrocinadora indicada, após visualizar os critérios e limites? | Consentimento específico | Consent versionado | 3 | Sem consentimento: bloquear |

### Documentos opcionais da área

- Cartão CNPJ, CNAEs, regime e inscrições;
- ECD e ECF, quando aplicáveis;
- EFD-Contribuições, quando aplicável;
- DCTFWeb e informações do MIT, quando aplicáveis;
- EFD-Reinf e totalizadores do eSocial, quando aplicáveis;
- EFD ICMS/IPI e escriturações estaduais, quando aplicáveis;
- XMLs e relatórios de NF-e, NFC-e, CT-e e documentos fiscais eletrônicos aplicáveis;
- Notas fiscais de serviço e declarações municipais;
- Guias e comprovantes de recolhimento;
- Folha e encargos em formato agregado/adequado;
- PER/DCOMP, compensações, parcelamentos e autos;
- Pareceres, revisões e relatórios tributários anteriores;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.


## DIMENSÃO 11 — Inovação, escala, automação e maturidade digital

**Objetivo:** Avaliar capacidade de crescer sem multiplicar desorganização, testar hipóteses, automatizar com controle e construir ativos defensáveis.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| INO-001 | E | O crescimento atual pode ser sustentado sem aumentar custos, erros e pessoas na mesma proporção? | Escala 0–4 | Unit economics, capacidade | 3 | Escala destrói margem |
| INO-002 | E | A empresa testa novas ofertas, canais ou processos com hipótese, métrica e limite de investimento? | Escala 0–4 | Experiment backlog | 3 | Aposta sem gate |
| INO-003 | C | Os principais gargalos de escala estão identificados e priorizados? | Escala 0–4 | Plano de capacidade | 3 | Gargalo invisível |
| INO-004 | C | Processos repetitivos foram avaliados antes de contratar mais pessoas? | Escala 0–4 | Mapa de automação | 2 | Contratação para caos |
| INO-005 | C | Automações são implementadas somente após o processo estar definido? | Escala 0–4 | Fluxos, SOPs | 3 | Automatização de confusão |
| INO-006 | C | A empresa mede tempo, erro, custo e resultado antes e depois de automatizar? | Escala 0–4 | Baseline e ROI | 2 | Automação sem métrica |
| INO-007 | C | A expansão tem critérios de entrada, capacidade, risco, investimento e saída? | Escala 0–4 | Plano de expansão | 2 | Expansão por impulso |
| INO-008 | C | Dados e aprendizados de clientes são convertidos em decisões e ativos reutilizáveis? | Escala 0–4 | Knowledge base, roadmap | 2 | Aprendizado disperso |
| INO-009 | C | A empresa possui vantagem difícil de copiar: dados, rede, método, marca, integração ou distribuição? | Múltipla + evidência | Ativos, contratos, métricas | 2 | Diferencial apenas visual |
| INO-010 | C | Dependências técnicas e dívida acumulada são conhecidas e priorizadas? | Escala 0–4 | Tech debt register | 2 | Dívida bloqueia entrega |
| INO-011 | A | Há portfólio equilibrando operação, melhoria e inovação? | Matriz percentual | Portfólio e orçamento | 2 | Inovação compromete operação |
| INO-012 | A | A empresa possui critérios para construir, comprar, integrar ou terceirizar tecnologia? | Escala 0–4 | ADRs, business cases | 2 | Decisão por moda |

### Documentos opcionais da área

- Roadmap de produto e tecnologia;
- Backlog de experimentos e hipóteses;
- Relatórios de testes e aprendizados;
- Plano de expansão geográfica, canais ou unidades;
- Mapa de automações e oportunidades;
- Arquitetura de escala e capacidade;
- Unit economics e cenários;
- Plano de dados e analytics;
- Mapa de propriedade intelectual;
- Benchmark e pesquisas de mercado;
- Plano de contratação e fornecedores;
- Relatórios de inovação e portfólio;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.


## DIMENSÃO 12 — Riscos, continuidade, capital e prontidão institucional

**Objetivo:** Avaliar riscos integrados, continuidade, seguros, governança de capital e capacidade de apresentar informações confiáveis a terceiros.

| ID | Fase | Pergunta | Resposta | Evidência/documentos sugeridos | Peso | Sinal de atenção |
|---|---|---|---|---|---:|---|
| RSC-001 | E | A empresa conhece seus cinco riscos mais críticos, seus responsáveis e medidas de resposta? | Escala 0–4 | Registro de riscos | 3 | Risco crítico sem owner |
| RSC-002 | E | A empresa consegue manter operações essenciais diante da ausência de pessoa, sistema, fornecedor ou unidade crítica? | Escala 0–4 | BCP, testes | 3 | Ponto único de falha |
| RSC-003 | C | Os riscos são avaliados por probabilidade, impacto, velocidade e controle existente? | Escala 0–4 | Matriz de riscos | 2 | Priorização subjetiva |
| RSC-004 | C | Planos de continuidade e recuperação já foram testados? | Escolha | Relatórios de teste | 3 | Nunca testado |
| RSC-005 | C | Seguros cobrem riscos relevantes e são revisados? | Escala 0–4/N.A. | Apólices, avaliação | 2 | Risco material descoberto |
| RSC-006 | C | A empresa realiza cenários de queda de receita, aumento de custo, perda de cliente ou indisponibilidade? | Escala 0–4 | Stress tests | 2 | Sem plano de resposta |
| RSC-007 | C | Cap table, acordos, propriedade intelectual e poderes estão claros? | Escala 0–4 | Atos e contratos | 3 | Conflito societário |
| RSC-008 | C | Obrigações com investidores, financiadores e sócios são monitoradas? | Escala 0–4 | Covenants, reports | 3 | Obrigação vencida |
| RSC-009 | C | Indicadores e documentos podem ser reconciliados e apresentados a terceiro com confiança? | Escala 0–4 | Data room, auditoria | 2 | Números conflitantes |
| RSC-010 | C | Existe plano de uso de capital com marcos, responsáveis e retorno esperado? | Escala 0–4/N.A. | Use of funds, roadmap | 2 | Capital sem marco |
| RSC-011 | A | O data room possui índice, versão, owner, permissão e histórico? | Escala 0–4 | Data room index | 2 | Acesso excessivo |
| RSC-012 | A | A empresa está preparada para due diligence sem ocultar pendências materiais? | Escala 0–4 | Checklist e pendências | 3 | Omissão material |

### Documentos opcionais da área

- Registro de riscos e controles;
- Plano de continuidade e recuperação;
- Matriz de processos/pessoas/fornecedores críticos;
- Apólices de seguro;
- Relatórios de auditoria e controles internos;
- Cap table e acordo de sócios;
- Contratos de dívida, garantias e covenants;
- Relatórios de contingências;
- Orçamento e cenários de stress;
- Data room index;
- Pitch, plano de uso de recursos e milestones;
- Relatórios para investidores, conselho ou financiadores;

**Regra de upload:** solicitar inicialmente até três documentos prioritários conforme as respostas. Os demais ficam na lista de aprofundamento.

# 9. Diagnóstico Essencial M0

O M0 utiliza as 24 perguntas abaixo, além do perfil mínimo:

`EST-001, EST-002, FIN-001, FIN-002, VEN-001, VEN-002, MKT-001, MKT-002, CLI-001, CLI-002, OPE-001, OPE-002, PES-001, PES-002, TEC-001, TEC-002, JUR-001, JUR-002, TAX-001, TAX-002, INO-001, INO-002, RSC-001, RSC-002`

## 9.1 Saída mínima

- Genesis Growth Score preliminar;
- cobertura e confiança;
- três gargalos;
- fatores que sustentam cada gargalo;
- dados faltantes;
- um risco prioritário;
- uma decisão GDS mínima;
- uma primeira missão;
- convite para aprofundar a dimensão prioritária.

## 9.2 Regra de tempo

Se a resposta ultrapassar 15 minutos:

1. reduzir perguntas de perfil não críticas;
2. salvar automaticamente;
3. permitir continuar depois;
4. apresentar resultado preliminar;
5. pedir apenas a próxima pergunta de maior valor informacional.

---

# 10. Lógica dinâmica e dependências

## 10.1 Regras gerais

- resposta `0` ou risco alto abre pergunta de causa;
- resposta `Não sei` abre pergunta sobre fonte e responsável;
- inconsistência entre áreas gera confirmação;
- documento recente pré-preenche perguntas;
- documento antigo é marcado como vencido;
- pergunta `Não se aplica` exige justificativa quando o tema normalmente seria aplicável;
- área com score baixo e impacto alto sobe na prioridade;
- área com score baixo e baixa confiança gera missão de dados antes da recomendação operacional.

## 10.2 Gatilhos tributários

Abrir TAX completo quando houver:

- pressão de caixa associada a tributos;
- mudança de regime ou atividade;
- operações complexas;
- divergência entre escrituração e recolhimento;
- saldo, retenção, pagamento duplicado ou crédito já identificado;
- fiscalização, auto, parcelamento ou tese;
- solicitação expressa do usuário.

O sistema deve usar `dados insuficientes` quando faltar documentação. Não estimar valor ou confirmar direito.

## 10.3 Gatilhos de risco preto

Interromper recomendação automática e encaminhar para revisão humana quando houver:

- risco de insolvência imediata;
- suspeita de fraude;
- incidente grave de segurança;
- vazamento de dados;
- processo ou prazo legal crítico;
- obrigação tributária urgente;
- decisão societária conflituosa;
- risco à saúde ou segurança;
- ausência de autorização para dados;
- tentativa de usar a plataforma para ocultar informação material.

---

# 11. Solicitação inteligente de documentos

## 11.1 Prioridade

1. documento que confirme risco crítico;
2. documento que resolva contradição;
3. documento que sustente a primeira decisão;
4. documento que aumente confiança de score baixo;
5. documento útil para benchmark ou personalização.

## 11.2 Estados do documento

- sugerido;
- solicitado;
- enviado;
- em validação;
- validado;
- rejeitado;
- ilegível;
- desatualizado;
- substituído;
- revogado;
- excluído.

## 11.3 Metadados

- categoria;
- finalidade;
- empresa/tenant;
- período;
- data de emissão;
- fonte;
- responsável;
- nível de sensibilidade;
- consentimento;
- hash;
- versão;
- validade;
- revisores;
- data de exclusão/retensão.

## 11.4 Regras de privacidade

- upload opcional;
- finalidade explícita;
- mínimo necessário;
- acesso por função;
- armazenamento segregado;
- link temporário;
- trilha de acesso;
- possibilidade de revogação quando aplicável;
- proibição de reutilização incompatível;
- retenção definida;
- exclusão segura.

---

# 12. Perguntas de causa raiz

Após detectar gargalo, o sistema seleciona perguntas:

1. Quando o problema começou?
2. Qual indicador comprova o problema?
3. Qual impacto financeiro, operacional, humano ou reputacional?
4. O problema ocorre sempre ou em condições específicas?
5. Qual processo antecede o problema?
6. Quem possui a informação e quem pode agir?
7. O que já foi tentado?
8. O que melhorou ou piorou?
9. Há restrição de caixa, capacidade, tecnologia, pessoas, contrato ou regulação?
10. Qual evidência contradiz a hipótese?
11. Qual é a menor ação reversível para testar?
12. Como o resultado será medido?

---

# 13. Perguntas para o Genesis Decision Standard

1. Qual problema será decidido?
2. Quais fatos estão confirmados?
3. Quais informações são declarações?
4. Quais hipóteses precisam ser testadas?
5. Quais opções existem?
6. Qual opção preserva mais reversibilidade?
7. Qual impacto esperado?
8. Qual custo e prazo?
9. Quais riscos?
10. Quais dependências?
11. Quem decide, executa, aprova e revisa?
12. Qual métrica e baseline?
13. Qual evidência encerra a missão?
14. Quando a decisão será revista?
15. O que faria a decisão ser interrompida?

---

# 14. Catálogo de alertas

| Código | Alerta | Severidade inicial |
|---|---|---|
| ALR-CAIXA-001 | Caixa insuficiente para obrigações próximas | Crítico |
| ALR-MARGEM-001 | Receita cresce sem margem comprovada | Alto |
| ALR-CLIENTE-001 | Concentração excessiva em cliente | Alto |
| ALR-PESSOA-001 | Dependência de pessoa-chave sem substituto | Alto |
| ALR-PROCESSO-001 | Processo crítico sem padrão ou owner | Alto |
| ALR-DADOS-001 | Indicadores conflitantes | Alto |
| ALR-SEC-001 | Conta crítica sem MFA | Crítico |
| ALR-BACKUP-001 | Backup sem teste de restauração | Crítico |
| ALR-LGPD-001 | Compartilhamento sem finalidade/contrato | Crítico |
| ALR-TAX-001 | Obrigação ou prazo tributário crítico | Crítico |
| ALR-TAX-002 | Possível sinal tributário não validado | Médio |
| ALR-JUR-001 | Obrigação contratual vencida | Alto |
| ALR-GOV-001 | Decisão crítica sem responsável | Alto |
| ALR-OP-001 | Fornecedor crítico sem alternativa | Alto |
| ALR-CONT-001 | Ausência de plano de continuidade | Alto |

---

# 15. Resultado entregue ao usuário

## 15.1 Estrutura

- resumo executivo;
- score geral e por dimensão;
- cobertura;
- confiança;
- fatos confirmados;
- declarações não confirmadas;
- documentos analisados;
- gargalos;
- causas prováveis;
- riscos;
- oportunidades;
- primeira decisão;
- missão;
- indicadores;
- documentos prioritários faltantes;
- recomendações que exigem especialista;
- aviso de limitações.

## 15.2 Linguagem

Usar:

- “Os dados indicam…”
- “Há sinais de…”
- “A confiança é…”
- “Esta conclusão depende de…”
- “Recomendamos validar com…”
- “Não há evidência suficiente para…”

Não usar:

- “Garantido”
- “Com certeza”
- “Crédito aprovado”
- “Recuperação confirmada”
- “Esta ação causará…”
- “A empresa está regular” sem validação profissional.

---

# 16. Critérios de aceite para implementação

1. Todas as perguntas possuem ID único.
2. Perguntas e regras têm versão.
3. Perguntas podem ser ativadas/desativadas por configuração.
4. M0 contém exatamente 24 perguntas essenciais.
5. Upload é sempre opcional, salvo operação externa que dependa legalmente do documento.
6. Documento ausente altera confiança, não inventa resposta.
7. Perguntas condicionais não aparecem sem gatilho.
8. Respostas sensíveis possuem justificativa de finalidade.
9. Consentimentos são granulares e versionados.
10. Score é determinístico e explicável.
11. Resposta `Não sei` é aceita.
12. Dimensão com cobertura inferior a 60% exibe `dados insuficientes`.
13. Alertas críticos exigem humano no loop.
14. Referral tributário é bloqueado sem consentimento.
15. Patrocínio não altera score ou elegibilidade.
16. Dados e documentos não são compartilhados sem autorização.
17. Resultado mostra fatos, hipóteses e nível de confiança.
18. Histórico preserva metodologia usada.
19. Existe teste para cada regra crítica.
20. O usuário pode salvar e continuar.

---

# 17. Testes mínimos

- pergunta condicional correta;
- pergunta não aplicável;
- resposta desconhecida;
- cálculo de cobertura;
- cálculo de confiança;
- score com pesos;
- regra de risco;
- contradição entre respostas;
- upload opcional;
- documento vencido;
- consentimento revogado;
- acesso cross-tenant negado;
- referral bloqueado;
- resultado tributário sem garantia;
- score sem cobertura;
- histórico de versão;
- exclusão/retenção;
- recuperação de sessão;
- acessibilidade;
- tempo do M0.

---

# 18. Referências oficiais a manter atualizadas

A lista tributária deve ser revisada por especialista e por fontes oficiais antes de cada versão. Entre as fontes operacionais atuais estão:

- programas e escriturações do SPED, incluindo ECD, ECF e EFD-Contribuições;
- DCTFWeb e seu relacionamento com eSocial, EFD-Reinf e MIT;
- documentação técnica do eSocial;
- portais oficiais dos documentos fiscais eletrônicos;
- orientações da ANPD, inclusive sobre Relatório de Impacto à Proteção de Dados quando aplicável.

A existência de um documento na lista não significa que ele seja obrigatório para todas as empresas. Regime, atividade, jurisdição, período e finalidade determinam a aplicabilidade.

---

# 19. Pendências metodológicas

Antes de liberar o M1:

- validar as perguntas com especialistas de cada domínio;
- calibrar pesos com empresas-piloto;
- criar exemplos por setor;
- aprovar critérios tributários da Unique;
- aprovar textos jurídicos e de privacidade;
- definir política de retenção;
- definir faixas monetárias;
- validar linguagem com usuários;
- criar questionário de múltiplos respondentes;
- testar vieses e inconsistências;
- definir benchmark apenas após amostra suficiente.

---

# 20. Controle de versão

| Versão | Data | Mudança |
|---|---|---|
| 3.0 | 25/06/2026 | Banco mestre com 12 dimensões, 144 perguntas pontuadas, perfil, documentos, score, confiança, riscos e regras de implementação |
