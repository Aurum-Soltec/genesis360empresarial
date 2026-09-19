# Incident Response Runbook

## Severidade
### SEV-0
Vazamento cross-tenant, comprometimento de secrets, corrupção ampla ou risco legal imediato.

### SEV-1
Indisponibilidade crítica, auth/consent quebrados, perda relevante de dados.

### SEV-2
Degradação significativa sem perda/violação crítica.

### SEV-3
Problema limitado.

## Fluxo
1. detectar;
2. classificar;
3. conter;
4. preservar evidência;
5. mitigar;
6. restaurar;
7. validar integridade;
8. comunicar conforme obrigação;
9. postmortem;
10. action items rastreáveis.

## Kill switches prioritários
- agentic;
- provider matching/contact;
- upload;
- ecosystem analytics;
- benchmark.

## Não fazer
- apagar logs necessários;
- expor PII em chat/issue;
- “corrigir” sem entender tenant/data impact;
- reativar feature sem prova.
