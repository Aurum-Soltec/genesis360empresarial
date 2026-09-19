# Production Foundation Blueprint

**Classificação:** GZ-C — evolução estrutural  
**Modo:** FOUNDATION → IMPLEMENTATION → VERIFICATION

## 1. Objetivo
Congelar uma fundação suficientemente simples, segura e rastreável para que o desenvolvimento de produção possa avançar sem rediscutir arquitetura a cada story.

## 2. Arquitetura base
- Next.js + React + TypeScript;
- Supabase/PostgreSQL;
- monólito modular;
- RLS e trusted-server boundaries;
- Zod nos contratos de entrada;
- OpenAPI como catálogo HTTP;
- event outbox para efeitos duráveis;
- agentic isolado e sem acesso direto ao banco.

## 3. Bounded contexts lógicos
- Identity & Tenancy;
- Business Passport;
- Diagnostic;
- Decision/GDS;
- Mission;
- Qualification Network;
- Evidence & Documents;
- Ecosystem;
- Intelligence Runtime;
- Trust/Admin/Operations.

Esses limites são módulos de domínio, não microserviços obrigatórios.

## 4. Fluxo de valor canônico
`Passport → Diagnóstico → Score/Confidence → Pain → GDS → Mission → Evidence → Outcome → Timeline`

Rede:
`Pain → Capability → Qualification → Eligibility → Neutral Ranking → Consent → Contact → Outcome`

## 5. Invariantes
1. tenant explícito;
2. RLS ativa em dados tenant-owned;
3. cross-tenant somente por trusted server service;
4. provider não se autoqualifica;
5. plano nunca compra ranking;
6. policy ausente = fail closed;
7. `Unknown` não é score zero;
8. Growth Score usa anchors estáveis;
9. LLM não recalcula score nem autorização;
10. upload exige attestation ativa;
11. efeito crítico deve ser auditável;
12. migrations aplicadas são append-only.

## 6. O que NÃO entra sem gatilho
- microserviços;
- Kubernetes;
- Temporal;
- OPA;
- graph database;
- event sourcing;
- CQRS;
- service mesh;
- multi-region active-active;
- data mesh;
- microfrontends.

## 7. Critério para avançar
A Foundation só é considerada **runtime verified** depois de:
- migrations 0001→0012 em banco real;
- pgTAP;
- lint/typecheck/tests/build;
- browser E2E;
- backup/restore;
- scans;
- Wave 8 UX browser gate.

Até lá, o status correto é:
**implemented-by-contract / runtime-pending**.
