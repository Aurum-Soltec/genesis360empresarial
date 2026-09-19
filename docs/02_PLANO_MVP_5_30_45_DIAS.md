# GENESIS 360º — PLANO DE ENTREGA 5 / 30 / 45 DIAS

## 1. Premissas de capacidade

O prazo somente é viável com:

- 1 desenvolvedor full-stack sênior alocado integralmente;
- PO disponível diariamente;
- decisões em até 2 horas úteis para bloqueios;
- design simples com componentes prontos;
- serviços gerenciados;
- nenhum pagamento ou integração complexa no M0;
- critérios tributários recebidos até o Dia 2 ou uso de simulação;
- escopo congelado.

Sem essa capacidade, o marco de 5 dias deve ser tratado como protótipo navegável, não aplicação funcional.

## 2. Datas

[SUPOSIÇÃO] Contagem em dias corridos a partir de 25/06/2026.

- M0: 25 a 29/06; reunião em 30/06.
- M1: até 25/07/2026.
- V1 Starter: até 09/08/2026.

## 3. M0 — MVP Básico em 5 dias

### Dia 1 — Fundação

- baseline V3;
- repositório;
- preview/staging;
- layout;
- login demo;
- empresa;
- conta demonstrativa.

**Gate:** build e deploy; fluxo login → empresa.

### Dia 2 — Diagnóstico e consentimento

- consentimentos;
- questionário;
- salvamento;
- score;
- explicação.

**Gate:** conclusão em até 15 minutos.

### Dia 3 — Decisão e Tax Check

- dashboard;
- gargalo prioritário;
- GDS mínimo;
- triagem tributária;
- classificação segura;
- disclosure Unique.

**Gate:** nenhuma promessa de crédito; regras identificadas como reais ou simuladas.

### Dia 4 — Referral e auditoria

- CTA;
- consentimento de compartilhamento;
- criação de caso;
- status;
- audit log;
- dados de demonstração.

**Gate:** caso sem consentimento é bloqueado.

### Dia 5 — Qualidade e reunião

- smoke;
- testes negativos;
- roteiro;
- ensaio;
- backup;
- vídeo curto;
- conta reserva;
- registro de limitações.

**Gate:** demonstração repetida duas vezes sem falha bloqueadora.

## 4. Roteiro da reunião Unique

1. dor de caixa e decisão errada;
2. empresa demo;
3. diagnóstico;
4. score e gargalo;
5. Tax Check;
6. critérios e linguagem segura;
7. resultado preliminar;
8. disclosure de patrocínio;
9. consentimento;
10. caso encaminhado;
11. visão do portal de revisão M1;
12. proposta de piloto e KPIs.

Não demonstrar cálculo de crédito, garantia, compensação, BEE4 ou parceria não assinada.

## 5. M1 — MVP Robusto em 30 dias

### Sprint A — Dias 6 a 10

- RLS;
- RBAC;
- Twin;
- diagnóstico versionado;
- rules engine;
- matriz de acesso.

### Sprint B — Dias 11 a 15

- GDS;
- aprovação humana;
- missões;
- score versionado;
- critérios Unique aprovados.

### Sprint C — Dias 16 a 20

- evidências;
- resultados;
- Tax Evidence Room;
- portal de revisão;
- estados do caso;
- termos.

### Sprint D — Dias 21 a 25

- admin;
- notificações;
- auditoria;
- observabilidade;
- LGPD;
- backup.

### Sprint E — Dias 26 a 30

- threat model;
- evals;
- segurança;
- acessibilidade;
- performance;
- instrumentação;
- onboarding Onda 1;
- gate.

## 6. V1 Starter — Dias 31 a 45

### Dias 31 a 35

- planos e entitlements;
- ciclo Bronze;
- homologação;
- contratos;
- atribuição.

### Dias 36 a 40

- marketplace fechado;
- ranking íntegro;
- relatórios;
- suporte;
- analytics.

### Dias 41 a 45

- feature flags;
- retenção;
- runbooks;
- API docs;
- hardening;
- ondas 2/3;
- go/no-go.

## 7. Arquitetura de velocidade

- monólito modular;
- frontend e API no mesmo produto com fronteiras;
- banco/auth/storage gerenciados;
- RLS;
- ambiente de preview;
- regras em configuração versionada;
- IA opcional e atrás de feature flag;
- fallback determinístico.

## 8. Plano de contingência

### Se os critérios Unique não chegarem

- usar conjunto simulado;
- exibir selo “DEMONSTRAÇÃO”;
- bloquear referral real;
- coletar apenas intenção.

### Se a aplicação não estiver estável no Dia 5

- usar vídeo curto gravado;
- protótipo navegável;
- ambiente local/preview reserva;
- apresentar arquitetura e cronograma M1;
- não afirmar que está em produção.

### Se contrato/DPA não estiverem aprovados no M1

- operar sem compartilhar dados;
- referral fica em “aguardando autorização operacional”;
- usar contato manual anonimizado.

## 9. Critério de sucesso

O cronograma é bem-sucedido quando entrega valor controlado sem transformar velocidade em risco jurídico, tributário ou de dados.
