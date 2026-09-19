# HANDOFF PARA CHATGPT WORK

## Objetivo
Continuar a produção do Genesis 360 Empresarial sem reconstruir contexto.

## Estado
A fundação de contratos está criada; a prova runtime ainda não fechou.

## Ordem sugerida no Work

### 1. Verificar ambiente
- instalar com lockfile;
- rodar db:check/lint/typecheck/test/build;
- não corrigir “por tentativa” sem registrar causa.

### 2. Executar PW-0
Foundation Verification.

### 3. Fechar PW-1
A nova arquitetura visual light já está especificada e a shell inicial está incluída neste pacote.

### 4. Fechar gaps do diagnóstico
- applicability methodology;
- progressive profiling;
- Passport projection;
- evidence richness.

### 5. Fechar Mission + Qualification
Usar contratos já implementados.

### 6. Agentic
Somente depois do deterministic core estar comprovado.

## Não fazer
- rewrite;
- microservices;
- dark theme;
- ranking pago;
- agentes com DB irrestrito;
- dados fictícios em dashboard de produção;
- “Digital Twin” complexo antes do workload justificar.

## Handoff update — 2026-08-28

Antes de qualquer nova feature:

```bash
pnpm work:check
pnpm security:check
pnpm db:check
supabase test db
pnpm quality
```

Depois:
1. corrigir somente falhas comprovadas;
2. registrar EVID para ST-065/066/069;
3. rodar spike em `/intelligence`;
4. não instalar Paperclip/Hermes/AgentOS/Temporal/OPA/Semantica no core.

## Handoff update — Wave 6

Depois do Foundation Verification:

1. executar `WAVE6_VERIFICATION_PLAN.md`;
2. aprovar PEND-003/004/005/006 antes de habilitar `FEATURE_QUALIFICATION_NETWORK`;
3. aprovar PEND-010 antes de habilitar `FEATURE_REAL_CONTACT`;
4. executar minimal-vs-Pydantic scorecard;
5. somente depois considerar Agentic V1.

## Production Foundation Master V1.2

Entrypoint atual:
`00_PRODUCTION_START_HERE.md`

Repositório alvo:
`https://github.com/Aurum-Soltec/genesis360empresarial`

Próximo gate:
PW-0 / Repository + Runtime Foundation Verification.
