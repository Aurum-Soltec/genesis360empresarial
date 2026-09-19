# GENESIS 360º — ARQUITETURA, SEGURANÇA, LGPD, IA E ADRs V3

## 1. Arquitetura lógica

```text
Web responsiva
  → autenticação/sessão
  → BFF/API /v1
  → módulos de domínio
      Identidade
      Empresa
      Consentimento
      Diagnóstico
      Scoring
      Twin
      GDS
      Missões/Evidências
      CTO-Tax
      Parceiros/Referrals
      Admin/Auditoria
      Analytics
  → PostgreSQL com RLS
  → Storage particionado
  → Jobs/notificações
  → Gateway de IA
  → Observabilidade
```

## 2. Stack provisória

- Next.js + TypeScript;
- PostgreSQL gerenciado;
- auth gerenciado;
- storage S3-compatible/gerenciado;
- UI acessível baseada em componentes;
- deploy gerenciado;
- OpenAPI;
- fila leve;
- gateway de IA;
- logs/erros/métricas gerenciados.

A escolha final de fornecedores exige ADR, custo e DPA.

## 3. Fronteiras

Cada módulo:

- possui serviços e regras próprias;
- não acessa tabela de outro módulo diretamente sem contrato;
- publica eventos;
- valida tenant e finalidade;
- registra auditoria em ação crítica.

## 4. Multi-tenancy

- `tenant_id` obrigatório;
- tenant derivado da sessão;
- RLS em todas as tabelas tenant-owned;
- policy de select/insert/update/delete;
- storage por tenant/caso;
- cache com chave tenant;
- jobs/eventos com tenant;
- testes cross-tenant em CI;
- admin break-glass temporário e auditado.

## 5. Modelo de dados mínimo

### Identidade

- tenant;
- user;
- membership;
- role;
- permission.

### Negócio

- company;
- company_profile;
- diagnostic;
- question;
- answer;
- score;
- rule_version;
- business_twin;
- twin_fact;
- decision;
- review;
- mission;
- task;
- metric;
- evidence;
- outcome.

### Tributário/parceiros

- partner;
- sponsor_disclosure;
- tax_assessment;
- tax_answer;
- tax_rule_version;
- tax_case;
- tax_review;
- referral;
- referral_status;
- attribution_event.

### Governança

- consent;
- consent_version;
- audit_event;
- feature_flag;
- data_request;
- retention_policy;
- product_event;
- incident.

## 6. APIs

Regras:

- autorização antes do domínio;
- validação de payload;
- idempotência;
- erros padronizados;
- versionamento;
- rate limit;
- request id;
- auditoria;
- nenhum tenant confiado diretamente do cliente.

## 7. Threat model resumido

Ameaças:

- vazamento cross-tenant;
- privilege escalation;
- credential stuffing;
- upload malicioso;
- enumeração de casos;
- prompt injection;
- data poisoning;
- referral sem consentimento;
- fraude de parceiro;
- adulteração de regras;
- exposição de documento;
- abuso de break-glass.

Controles P0:

- RLS;
- RBAC;
- deny-by-default;
- MFA admin/especialista;
- signed URLs;
- quarentena;
- secret scan;
- SAST/dependency scan;
- audit append-only;
- rule versioning;
- feature flag;
- kill switch;
- testes negativos.

## 8. LGPD

Artefatos:

- inventário de dados;
- mapa de fluxo;
- classificação;
- base/finalidade;
- consentimento;
- contratos/subprocessadores;
- política de retenção;
- RIPD;
- direitos do titular;
- transferência internacional;
- segurança;
- incidentes;
- revisão automatizada;
- canal de atendimento.

Papéis precisam ser formalizados em contrato. A Genesis não deve assumir que é sempre controladora ou operadora em todos os fluxos.

## 9. Agentes e IA

Agente deve possuir:

- missão;
- escopo;
- entradas;
- fontes;
- ferramentas;
- memória;
- saídas;
- proibições;
- escalonamento;
- custo;
- timeout;
- evals;
- owner;
- versão.

No M0, preferir regras e templates. No M1, IA assistiva pode resumir, nunca aprovar caso tributário.

## 10. Evals

Suítes:

- factualidade;
- evidência;
- abstenção;
- segurança;
- prompt injection;
- dados sensíveis;
- autorização;
- consistência;
- custo;
- latência;
- tom;
- tributário;
- regressão.

Release blocker:

- qualquer vazamento;
- ação tributária automática;
- recomendação crítica sem evidência;
- disclaimer ausente;
- falha de autorização;
- fonte não permitida.

## 11. Observabilidade

- logs estruturados;
- traces;
- métricas técnicas;
- eventos de produto;
- eventos tributários;
- custo;
- qualidade;
- alertas;
- correlação;
- painel de incidentes.

## 12. Backups e continuidade

- backup automático;
- PITR quando disponível;
- storage versionado;
- teste de restauração antes da Onda 1;
- RPO M1 24h;
- RTO M1 8h;
- rollback;
- runbook;
- contato.

## 13. ADRs vigentes

- ADR-001 arquitetura de entrega rápida;
- ADR-002 RLS obrigatória;
- ADR-003 CTO-Tax rules-first;
- ADR-004 Unique com disclosure;
- ADR-005 plano/patrocínio fora do ranking;
- ADR-006 Outcome Graph sem causalidade;
- ADR-007 ciclo Bronze;
- ADR-008 BEE4/Capital fora do Starter;
- ADR-009 Hudson como PO provisório;
- ADR-010 M0 é demo controlada.

Detalhes completos no workbook.

## 14. Critérios de produção

O Starter não é liberado se houver:

- P0 aberto;
- RLS sem teste;
- contrato de dados ausente para referral real;
- regra tributária sem aprovação;
- restore não testado;
- incidente crítico não encerrado;
- falta de owner;
- monitoramento ausente;
- linguagem insegura;
- documentação divergente.
