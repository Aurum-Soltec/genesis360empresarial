# ARQUITETURA MASTER - GENESIS 360 EMPRESARIAL V1

## Estilo

**Monólito modular primeiro**, com fronteiras explícitas e possibilidade de extração apenas por gatilho de escala, ownership, fault isolation, runtime ou compliance.

## Topologia

```mermaid
flowchart TB
  UI[Next.js Web App]
  AUTH[Identity + Tenant Context]
  APP[Application Services]
  DB[(Supabase / PostgreSQL)]
  INTEL[Genesis Intelligence Runtime]
  MODEL[LLM Providers]
  TOOLS[Authorized Tools]
  EXT[External Integrations]

  UI --> AUTH
  UI --> APP
  AUTH --> DB
  APP --> DB
  APP --> INTEL
  INTEL --> MODEL
  INTEL --> TOOLS
  TOOLS --> APP
  APP --> EXT
```

## Módulos de domínio

```mermaid
flowchart LR
  ID[Identity/Tenancy]
  PASS[Business Passport]
  DIAG[Diagnostic]
  DEC[Decision/GDS]
  MIS[Mission]
  QUAL[Qualification]
  SOL[Solution Network]
  ECO[Ecosystem]
  AI[Agentic]
  TRUST[Trust/Audit]
  DATA[Outcome Intelligence]

  ID --> PASS
  PASS --> DIAG
  DIAG --> DEC
  DEC --> MIS
  DEC --> QUAL
  QUAL --> SOL
  MIS --> DATA
  SOL --> DATA
  PASS --> AI
  DIAG --> AI
  MIS --> AI
  ECO --> SOL
  TRUST -.controls.-> ID
  TRUST -.controls.-> AI
```

## Fonte de verdade

- identidade/tenant: Postgres + Supabase Auth;
- fatos da empresa: Business Facts;
- histórico: Timeline;
- score: Rules Engine persistido;
- decisão: Decision Record;
- missão/outcome: Mission tables;
- qualificação: Provider Capabilities;
- consentimento: consent versions/decisions;
- agente: nunca source of truth.

## Arquitetura de deploy V1

- uma aplicação Next.js;
- uma base PostgreSQL/Supabase;
- runtime agentic isolável como processo/serviço quando adotado;
- CDN/edge conforme provedor;
- observabilidade vendor-neutral quando viável;
- nenhuma exigência de microserviços, Kafka, graph DB ou multi-region active-active na V1.

## Trigger de revisão

Extrair módulo somente quando:
- escala independente comprovada;
- deploy independente gera valor material;
- isolamento de falha/compliance necessário;
- equipe/ownership independente;
- runtime incompatível justificado.
