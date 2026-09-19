# Wave 1A — Foundation Closure + Business Passport
**Data:** 2026-08-18

## Implementado
- Next.js 16 `proxy.ts` para refresh/validação de sessão Supabase SSR.
- Business DNA facts com proveniência, confiança, sensibilidade, verificação e finalidade.
- Business Timeline append-oriented.
- guard de consistência `company_id ↔ tenant_id`.
- RLS membership-based para Passport/Timeline.
- API de fatos versionados; atualização fecha versão anterior em vez de sobrescrever história.
- API de Timeline.
- API de decisão de consentimento por finalidade.
- primeira UI `/passaporte` com completude essencial.
- testes unitários da completude/validação.
- extensão da especificação de testes cross-tenant para as novas tabelas.

## Estado
- V1-ST-003: implementação reforçada; falta evidência em ambiente Supabase real.
- V1-ST-004: continua BLOCKER até teste A→B real.
- V1-ST-005: backend de decisão implementado; falta UX completa de onboarding/revogação.
- V1-ST-006: implementado.
- V1-ST-007: implementado.
- V1-ST-008: primeira implementação; evoluir UX na próxima wave.
- V1-ST-009: fundação criada; progressive profiling ainda pendente.

## Não declarado como concluído
Não há evidência neste pacote de `pnpm lint/typecheck/test/build` nem de execução SQL em uma instância Supabase real. Esses gates continuam obrigatórios.
