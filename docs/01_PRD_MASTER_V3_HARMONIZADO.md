# GENESIS 360º | BUSINESS INTELLIGENCE
## PRD TÉCNICO MASTER — VERSÃO 3.0 HARMONIZADA

**Data-base:** 25 de junho de 2026  
**Status:** aprovado como baseline de execução, condicionado aos gates de segurança, jurídico/tributário e capacidade  
**Categoria:** sistema operacional de inteligência empresarial contínua para PMEs e ecossistemas  
**Promessa central:** transformar contexto empresarial em diagnóstico, decisão, execução, evidência, resultado e aprendizado verificável.

# 1. Resumo executivo

O Genesis 360º é uma plataforma SaaS B2B que organiza dados empresariais, identifica prioridades, estrutura decisões, cria missões, registra evidências, mensura resultados e conecta necessidades a especialistas homologados.

A versão V3 preserva a visão ampla do projeto, mas separa claramente:

- o que será demonstrado em 5 dias;
- o que será robustecido para piloto em 30 dias;
- o que estará disponível na versão Starter em 45 dias;
- o que permanece fora do Starter.

O núcleo de valor é:

> Contexto confiável → diagnóstico → decisão → missão → evidência → resultado → próximo aprendizado.

No fluxo tributário:

> Sinal preliminar → critérios configurados → consentimento → caso → revisão especializada → execução fora da plataforma por profissional habilitado → resultado registrado.

# 2. Problema e custo da inação

PMEs operam com dados dispersos, decisões dependentes do fundador, baixa priorização e dificuldade para diferenciar sintoma, causa e solução. Consultorias são pontuais; ERPs registram operação, mas não estruturam prioridades; chatbots não possuem memória governada nem evidência.

Sem um núcleo de decisão e execução, o Genesis corre quatro riscos:

1. virar apenas um diagnóstico;
2. prometer inteligência sem dados confiáveis;
3. recomendar parceiros de forma comercialmente enviesada;
4. ampliar o escopo antes de provar retenção e resultado.

# 3. Objetivos e métricas

## 3.1 Objetivos do M0 — 5 dias

- demonstrar o fluxo completo em reunião com a Unique;
- concluir uma jornada simulada em 8 a 12 minutos;
- mostrar diagnóstico, score, decisão e Tax Check;
- registrar consentimento e encaminhamento;
- usar linguagem tributária segura;
- operar com dados fictícios ou autorizados.

## 3.2 Objetivos do M1 — 30 dias

- disponibilizar um MVP robusto para Onda 1 de 10 a 15 empresas;
- garantir isolamento entre tenants;
- implementar Twin, GDS, missões, evidências e resultados;
- criar rules engine tributário versionado;
- disponibilizar portal de revisão e Tax Evidence Room básico;
- implantar observabilidade, LGPD, auditoria e evals.

## 3.3 Objetivos da V1 Starter — 45 dias

- disponibilizar versão comercial inicial;
- operar planos e entitlements;
- manter ciclo essencial no Bronze;
- operar parceiros homologados e referral rastreável;
- oferecer marketplace fechado sem ranking público;
- gerar relatórios, suporte e analytics;
- preparar ondas seguintes até 65 empresas.

## 3.4 North Star

**Empresas que concluem um ciclo de valor no período:**

> diagnóstico atualizado + decisão aprovada + missão criada/concluída + resultado ou aprendizado registrado.

## 3.5 Métricas nucleares

- tempo mediano até primeiro valor;
- conclusão do diagnóstico;
- primeira missão;
- retorno em 30 dias;
- missão concluída;
- recomendação compreendida/aceita;
- referral consentido;
- taxa de sinais tributários validados;
- falso positivo tributário;
- SLA de contato do parceiro;
- satisfação;
- upgrade pago ou carta de intenção;
- custo por empresa ativa;
- incidente de segurança.

# 4. Usuários e ICP inicial

## 4.1 ICP de validação

[SUPOSIÇÃO] Para os primeiros 45 dias, priorizar empresas:

- brasileiras;
- pequenas e médias;
- com operação formal e documentação mínima;
- com decisor acessível;
- com necessidade de caixa, eficiência, gestão ou crescimento;
- capazes de participar de entrevistas e check-ins;
- pertencentes à rede inicial autorizada.

A definição final do ICP deve ser aprovada antes da Onda 2.

## 4.2 Papéis

- proprietário da empresa;
- administrador/gestor;
- colaborador;
- especialista tributário;
- parceiro homologado;
- operador Unique;
- administrador Genesis;
- auditor;
- líder de ecossistema futuro.

# 5. Registro de verdade e linguagem

Toda informação deve ser classificada como:

- **Fato:** sustentado por fonte e data;
- **Declaração:** informada pelo usuário;
- **Inferência:** calculada ou interpretada;
- **Hipótese:** precisa ser testada;
- **Recomendação:** orientação baseada em evidência disponível;
- **Decisão aprovada:** validada por pessoa autorizada.

O sistema não pode:

- transformar hipótese em fato;
- afirmar causalidade sem base;
- garantir crédito tributário;
- afirmar parceria BNI/BEE4 sem contrato;
- usar patrocínio como critério técnico;
- recomendar ação crítica sem humano no loop.

# 6. Escopo por marco

## 6.1 M0 — MVP Básico, demo em 5 dias

Incluído:

- landing/login de demonstração;
- cadastro de empresa;
- consentimentos;
- diagnóstico essencial;
- score determinístico;
- dashboard com principal gargalo;
- GDS mínimo;
- Tax Check preliminar;
- resultado tributário seguro;
- disclosure da Unique;
- encaminhamento consentido;
- registro de auditoria;
- conta e dados de demonstração;
- roteiro e contingência.

Fora:

- uso irrestrito por público externo;
- pagamentos;
- multi-tenant endurecido para escala;
- upload de documentos sensíveis reais;
- cálculo monetário de crédito;
- execução tributária;
- agentes autônomos;
- marketplace;
- BEE4 e Capital Readiness.

## 6.2 M1 — MVP Robusto em 30 dias

Incluído:

- multi-tenancy com RLS obrigatória;
- RBAC;
- diagnóstico e regras versionados;
- Business Twin;
- GDS completo;
- missões, evidências e resultados;
- Tax Room;
- portal de revisão;
- estados e SLA do caso;
- notificações essenciais;
- painel admin;
- auditoria expandida;
- observabilidade;
- LGPD e retenção;
- backups e restauração;
- threat model;
- evals;
- telemetria do piloto;
- onboarding da Onda 1.

## 6.3 V1 Starter em 45 dias

Incluído:

- planos e permissões por plano;
- ciclo essencial Bronze;
- parceiros homologados;
- atribuição de referrals;
- marketplace fechado;
- ranking orgânico independente de patrocínio;
- relatórios;
- suporte;
- analytics comercial/operacional;
- feature flags e kill switch;
- documentação de API;
- runbooks;
- preparação de Onda 2 e Onda 3.

## 6.4 Fora do Starter

- BEE4 Readiness;
- acompanhamento de listagem/captação;
- Capital Readiness completo;
- Data Room avançado;
- Conselho Executivo Digital completo;
- agentes autônomos;
- debate multiagente em produção;
- Outcome Graph preditivo ou causal;
- marketplace aberto;
- ranking público;
- dezenas de integrações;
- microserviços;
- fine-tuning ou modelo próprio;
- compensação tributária automática;
- alteração contábil/fiscal;
- garantias de êxito.

# 7. Jornada principal e fluidez

## 7.1 Golden Path

1. login/cadastro;
2. empresa e consentimentos;
3. diagnóstico de 10 a 15 minutos;
4. resultado de uma página;
5. um problema prioritário;
6. uma decisão explicada;
7. uma missão;
8. check-in;
9. evidência;
10. resultado/aprendizado;
11. próxima ação.

O usuário não precisa compreender internamente Twin, GDS, agentes ou Outcome Graph. Esses elementos sustentam a experiência, mas a interface deve priorizar clareza e próxima ação.

## 7.2 Tax Check

1. usuário visualiza objetivo e limites;
2. aceita termos da triagem;
3. responde perguntas configuradas;
4. rules engine classifica:
   - revisão prioritária;
   - possível aderência;
   - dados insuficientes;
   - não priorizado no momento;
5. tela explica os fatores;
6. disclosure informa que a Unique é patrocinadora/parceira de lançamento;
7. usuário escolhe encaminhar;
8. consentimento de compartilhamento é registrado;
9. caso é criado;
10. especialista revisa no M1;
11. execução ocorre fora da Genesis;
12. Genesis registra status e resultado informado, sem validar tese jurídica autonomamente.

# 8. Business Digital Twin

Cada fato do Twin deve possuir:

- tenant e empresa;
- domínio;
- campo e valor;
- tipo de dado;
- origem;
- fonte;
- data da fonte;
- autor;
- confiança;
- validade;
- status;
- versão;
- finalidade;
- classificação de sensibilidade.

## 8.1 Precedência

1. documento validado;
2. integração autorizada;
3. revisão humana;
4. declaração do usuário;
5. inferência da regra;
6. inferência de IA.

Conflitos não são sobrescritos silenciosamente. O sistema registra versões, sinaliza divergência e solicita resolução.

## 8.2 Expiração

A validade é configurável por tipo. Dado vencido não é removido; fica marcado como desatualizado e não pode sustentar decisão crítica sem confirmação.

# 9. Scoring e decisão

## 9.1 Scoring

- determinístico no M0/M1;
- regras versionadas;
- pesos explicáveis;
- saída com contribuição de cada resposta;
- sem score oculto;
- rollback de versão;
- testes de regressão.

## 9.2 Genesis Decision Standard

Campos mínimos:

- problema;
- impacto;
- fatos;
- hipóteses;
- causas possíveis;
- alternativas;
- recomendação;
- risco;
- dependências;
- responsável;
- prazo;
- métrica;
- nível de confiança;
- aprovação necessária;
- próxima ação.

Decisões tributárias, jurídicas, financeiras, societárias, regulatórias ou de capital são sempre de alto risco e exigem validação humana.

# 10. Execução, evidência e resultado

Missão obrigatoriamente contém:

- objetivo;
- owner;
- prazo;
- tarefas;
- indicador;
- baseline;
- meta;
- dependências;
- status.

Evidência contém:

- autor;
- data;
- origem;
- tipo;
- versão/hash;
- vínculo;
- validação;
- justificativa de rejeição.

Resultado contém:

- baseline;
- valor posterior;
- janela;
- fatores externos;
- contribuição estimada;
- confiança;
- aprendizado.

A interface deve usar “associado a”, “contribuiu para” ou “coincidiu com”, e não “causou”, salvo evidência apropriada.

# 11. CTO-Tax e parceria Unique

## 11.1 Papel da Genesis

Pode:

- coletar dados;
- detectar sinais;
- classificar prioridade;
- organizar documentos;
- gerar checklist;
- encaminhar;
- acompanhar status;
- registrar resultado informado.

Não pode autonomamente:

- garantir existência ou valor de crédito;
- prometer recuperação;
- alterar escrituração;
- transmitir compensação;
- emitir parecer profissional;
- substituir contador/advogado;
- executar tese controversa;
- definir direito definitivo.

## 11.2 Papel da Unique

[SUJEITO A CONTRATO]

- receber casos consentidos;
- confirmar recebimento;
- realizar análise profissional;
- solicitar documentação;
- aceitar, rejeitar ou pedir complemento;
- cumprir SLA;
- comunicar status;
- registrar resultado autorizado;
- respeitar LGPD, confidencialidade e segurança.

## 11.3 Integridade do patrocínio

- a tela informa “Parceira patrocinadora de lançamento”.
- patrocínio não é prova de superioridade técnica.
- a recomendação depende dos critérios vigentes.
- no MVP com um único parceiro, não existe ranking comparativo.
- quando houver múltiplos parceiros, score orgânico exclui plano e patrocínio.
- exposição patrocinada futura deve ser separada e rotulada.

## 11.4 Critérios configuráveis

Os critérios da Unique serão cadastrados em versão contendo:

- identificador;
- descrição;
- tipo de empresa;
- regime/segmento;
- pré-condições;
- perguntas;
- pesos;
- bloqueios;
- documentos;
- vigência;
- fonte;
- aprovador;
- data;
- versão anterior;
- motivo da alteração.

Até aprovação, a demo usa regras fictícias claramente identificadas como “SIMULAÇÃO”.

# 12. Planos e contradições corrigidas

## Bronze

- diagnóstico anual;
- score e prioridades;
- ciclo essencial de 30 dias;
- uma decisão;
- uma missão;
- check-in do ciclo;
- perfil e selo básico;
- benchmark apenas quando houver base suficiente.

## Prata

- atualização trimestral;
- histórico;
- missões e check-ins;
- dashboard de evolução;
- COO/CMO assistivos;
- sinalização tributária preliminar.

## Ouro

- diagnóstico avançado;
- oportunidades;
- marketplace fechado;
- reputação;
- atribuição;
- Growth Studio;
- acesso ampliado a agentes.

## Platinum

- conselho e governança avançados;
- CTO-Tax avançado;
- preparação institucional futura.

BEE4 e Capital Readiness não fazem parte do Starter e dependem de validação posterior.

## 12.1 Ranking orgânico

Pesos iniciais sugeridos, a calibrar:

- fit com a necessidade: 40%;
- reputação verificável: 20%;
- maturidade/risco: 15%;
- capacidade: 10%;
- SLA: 10%;
- contexto/localização: 5%.

**Plano contratado: 0%. Patrocínio: 0%.**

# 13. Requisitos funcionais consolidados

A matriz completa está no workbook. Requisitos P0:

- REQ-001 baseline documental;
- REQ-002 autenticação;
- REQ-003 tenancy/RLS;
- REQ-004 consentimento;
- REQ-005 empresa;
- REQ-006 diagnóstico;
- REQ-007 score;
- REQ-008 Twin;
- REQ-009 GDS;
- REQ-010 missões;
- REQ-011 evidências;
- REQ-012 resultados;
- REQ-013 dashboard;
- REQ-014 Tax Screener;
- REQ-015 regras tributárias;
- REQ-016 linguagem segura;
- REQ-017 referral Unique;
- REQ-018 disclosure;
- REQ-019 revisão tributária;
- REQ-020 auditoria;
- REQ-021 permissões;
- REQ-022 LGPD;
- REQ-023 IA governada;
- REQ-024 evals;
- REQ-026 admin;
- REQ-027 observabilidade;
- REQ-028 resiliência;
- REQ-029 piloto;
- REQ-035 ranking íntegro.

# 14. Requisitos não funcionais

## Segurança

- deny-by-default;
- RLS obrigatória;
- MFA para admin/especialista no M1;
- TLS;
- segredos fora do código;
- signed URLs;
- limite de upload;
- scan de arquivo;
- rate limit;
- logs de acesso;
- testes cross-tenant;
- kill switch do módulo tributário.

## Performance

- páginas críticas com resposta percebida inferior a 2,5 s em condições normais;
- processamento de score inferior a 3 s;
- timeout de integrações;
- jobs idempotentes;
- degradação graciosa.

## Disponibilidade

- M0: best effort controlado;
- M1: alvo 99,0% durante piloto;
- Starter: alvo 99,5%, condicionado à infraestrutura.

## Acessibilidade

- navegação por teclado;
- contraste;
- labels;
- mensagens de erro;
- foco;
- WCAG 2.1 AA como referência.

## Auditabilidade

Toda ação crítica registra:

- ator;
- tenant;
- recurso;
- ação;
- estado anterior/posterior quando aplicável;
- data;
- request id;
- IP/dispositivo quando legítimo;
- versão da regra/prompt;
- finalidade.

# 15. IA e agentes

No Starter, IA é assistiva. Rules engine calcula; IA resume e explica.

Contrato de saída:

- fatos citados;
- hipóteses marcadas;
- nível de confiança;
- fontes;
- ações proibidas;
- recomendação;
- necessidade de revisão;
- custo/latência;
- versão.

Condições de abstenção:

- falta de dados;
- conflito não resolvido;
- fonte vencida;
- decisão crítica sem aprovador;
- pergunta fora do escopo;
- tentativa de injeção;
- custo excedido.

Thresholds mínimos:

- vazamento entre tenants: zero;
- recomendação crítica sem evidência: zero;
- disclaimer tributário: 100%;
- bloqueio de ação tributária automática: 100%;
- escalonamento correto em casos críticos: >=98%;
- factualidade em casos de teste aprovados: >=95%;
- falso positivo tributário: <=20% na Onda 1, alvo <=10%;
- custo máximo por execução: [DECISÃO PENDENTE].

# 16. Dados e retenção

Entidades nucleares Starter:

- tenant;
- user;
- membership;
- role/permission;
- company;
- consent/consent_version;
- diagnostic/question/answer;
- score/rule_version;
- business_twin/twin_fact;
- decision/review;
- mission/task/metric;
- evidence/outcome;
- partner/sponsor_disclosure;
- tax_assessment/tax_rule_version/tax_case/tax_review;
- referral/attribution_event;
- notification;
- audit_event;
- data_request;
- feature_flag;
- product_event.

Retenção deve ser definida por categoria. Não coletar documento tributário real no M0. No M1, armazenamento exige consentimento, finalidade, acesso mínimo, criptografia, quarentena e política aprovada.

# 17. APIs essenciais

M0:

- POST `/v1/companies`
- POST `/v1/consents`
- POST `/v1/diagnostics`
- POST `/v1/diagnostics/{id}/submit`
- GET `/v1/diagnostics/{id}/scores`
- GET `/v1/dashboard`
- POST `/v1/tax/assessments`
- POST `/v1/referrals`
- GET `/v1/legal/disclaimers`

M1/Starter:

- GET/POST `/v1/twins/{companyId}`
- POST `/v1/decisions`
- POST `/v1/decisions/{id}/approve`
- POST `/v1/missions`
- POST `/v1/missions/{id}/evidence`
- POST `/v1/outcomes`
- POST `/v1/tax/cases/{id}/review`
- POST `/v1/admin/tax-rules`
- GET `/v1/admin/audit`
- POST `/v1/privacy/requests`
- GET `/v1/analytics/pilot`
- GET `/v1/partners`
- POST `/v1/referrals/{id}/events`

Convenções:

- `/v1`;
- JSON;
- OpenAPI;
- problem details;
- request id;
- idempotency key para criação externa;
- paginação por cursor;
- scopes;
- rate limit;
- tenant derivado da sessão, nunca do corpo sem validação.

# 18. Arquitetura

Decisão de velocidade:

- Next.js/TypeScript em monólito modular;
- PostgreSQL gerenciado;
- autenticação e storage gerenciados;
- RLS;
- API versionada;
- rules engine separado por módulo;
- fila leve para notificações e jobs;
- gateway de IA;
- observabilidade gerenciada;
- deploy de preview, staging e produção.

A arquitetura preserva fronteiras para extração futura, mas não cria microserviços nos primeiros 45 dias.

# 19. Segurança, LGPD e compliance

Artefatos obrigatórios antes da Onda 1:

- mapa de dados;
- classificação;
- bases/finalidades;
- registro de subprocessadores;
- política de retenção;
- RIPD simplificado;
- termos/privacidade;
- DPA/contrato Unique;
- matriz de acesso;
- threat model;
- plano de incidente;
- rotina de revisão de acesso;
- teste de restauração;
- testes de autorização;
- política de IA;
- termo de uso tributário.

# 20. Piloto

Ondas:

- Demo Unique;
- Onda 1: 10 a 15 empresas;
- Onda 2: +15 a 20;
- Onda 3: até 65.

Avanço depende de gate. Não liberar 65 empresas de uma vez.

“Upgrade declarado” é substituído por:

- upgrade pago;
- carta de intenção;
- contrato;
- renovação;
- depósito;
- compromisso verificável.

# 21. Governança e RACI

- Produto/PO: Hudson — A/R por 45 dias;
- Tecnologia: Fernando — A/R;
- Administração/financeiro/LGPD operacional: Lilian — A/R;
- Comercial/parcerias/piloto: Tatyanne — A/R;
- Tributário: especialista habilitado — A/R técnico;
- Unique: R no atendimento dos casos, sujeito a contrato;
- segurança crítica: Fernando R, Hudson A;
- release: diretoria A.

# 22. Definition of Done

Funcionalidade concluída apenas quando:

- requisito e aceite aprovados;
- rastreabilidade atualizada;
- testes passam;
- autorização e privacidade revisadas;
- logs/métricas presentes;
- erro e vazio tratados;
- acessibilidade mínima validada;
- documentação atualizada;
- rollback/flag quando aplicável;
- owner de operação definido;
- risco residual registrado.

# 23. Gates

## Gate M0

- fluxo crítico passa;
- disclaimer 100%;
- dados fictícios/autorizados;
- referral não envia sem consentimento;
- conta demo e contingência;
- nenhum erro bloqueador.

## Gate M1

- RLS e cross-tenant;
- RBAC;
- regra tributária aprovada;
- especialista ativo;
- contrato/DPA mínimos;
- restore testado;
- observabilidade;
- LGPD;
- evals;
- suporte Onda 1.

## Gate Starter

- P0 zerado;
- KPIs da Onda 1 avaliados;
- unit economics preliminar;
- suporte e incidentes;
- contratos de parceiros;
- ranking íntegro;
- relatórios;
- documentação;
- decisão formal go/no-go.

# 24. Riscos

Os riscos críticos são:

- escopo;
- cronograma/capacidade;
- interpretação tributária;
- conflito de patrocínio;
- vazamento;
- critérios Unique não aprovados;
- contrato/LGPD;
- baixa adoção;
- score genérico;
- IA sem evidência;
- SLA do parceiro;
- custo/margem;
- divergência documental.

O registro completo está no workbook.

# 25. Pendências críticas

Antes do Dia 2:

- confirmar capacidade técnica;
- validar branding/telas;
- definir conta demo;
- obter critérios ou autorizar simulação;
- aprovar texto de disclosure;
- definir contato Unique.

Antes de referral real:

- contrato;
- DPA;
- política de dados;
- SLA;
- critérios;
- especialista;
- responsabilidade;
- remuneração/fee;
- gestão de reclamações.

Antes da Onda 1:

- todos os itens do Gate M1.

# 26. Aprovação

Esta V3 substitui as partes conflitantes dos documentos anteriores e deve ser usada com a matriz de rastreabilidade e os ADRs.
