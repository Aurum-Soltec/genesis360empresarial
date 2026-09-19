# THREAT MODEL V1

## Ativos críticos
- dados empresariais;
- dados pessoais;
- scores;
- qualificações;
- ranking;
- consentimentos;
- decisões;
- documentos/evidências;
- prompts/tool calls;
- secrets.

## Trust boundaries
- browser/server;
- tenant A/tenant B;
- app/Supabase;
- app/LLM provider;
- agent/tool;
- Genesis/provider externo;
- Genesis/ecossistema.

## Ameaças prioritárias
- cross-tenant leakage;
- privilege escalation;
- tenant switching indevido;
- consent bypass;
- prompt injection;
- indirect prompt injection por documento;
- tool misuse;
- data poisoning;
- fraude de score/qualificação;
- ranking manipulation;
- exfiltração via logs;
- secret leakage;
- dependency compromise;
- resource exhaustion.

## Controles
- RLS;
- tenant ativo explícito;
- deny-by-default;
- validation;
- least privilege;
- tool allowlist;
- read/write segregation;
- audit;
- rate/budget controls;
- redaction;
- dependency/license/security scans;
- kill switch.
