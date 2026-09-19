# Changelog

## [0.2.0-v1-wave0] - 2026-08-18

- V1-ST-001: baseline canônica V1 e ADR-011..016 incorporados em `docs/v1`.
- V1-ST-002: feature flags V1 deny-by-default; hardcoding de referral deixa de ser regra futura do domínio.
- V1-ST-003: contexto de tenant ativo explícito via cookie HTTP-only, validado contra membership autenticada.
- V1-ST-004: migration substitui RLS baseada em “primeira membership” por autorização membership-based; prova cross-tenant automatizada ainda é gate pendente.
- V1-ST-005: catálogo de finalidades de consentimento e compatibilidade com registros legados.
- Documentos V3 passam a ser históricos quando conflitarem com PRD/ADRs V1.
- Nenhuma alegação de production-ready: restore, cross-tenant integration test, observabilidade e demais gates permanecem pendentes.


## [0.1.0-bootstrap] - 2026-06-26

- ST-001 / ST-002: Bootstrap da Baseline Master
- Instalação de dependências e travamento de versões no TECH_STACK_LOCK.md
- Inicialização do Git e pipeline mínimo funcional (Lint, Typecheck, Test, Build, DbCheck)
- Correção de conflitos de ESLint 10 com plugins para a versão 9
- Remoção do `typedRoutes` experimental do next config para evitar falha no link string
- Auditoria ST-001/ST-002: aprovado com correções de linguagem e evidência
- Deploy externo de preview permanece pendente de evidência; há apenas build comprovado
- Isolamento RLS real permanece pendente para ST-016 com testes cross-tenant
- Proteção append-only de migrations deve ser formalizada em processo/CI
- `pnpm audit` deve acompanhar alegações futuras sobre vulnerabilidades bloqueantes
- Next.js atualizado de 16.2.0 para 16.2.6 após `pnpm audit` identificar vulnerabilidades altas corrigidas nessa linha de patch
- Overrides pnpm adicionados para `postcss@8.5.10` e `@eslint/plugin-kit@0.3.4` após advisories transitivos
- CI mínimo GitHub Actions adicionado sem secrets e sem deploy
- ST-003 e UI-001 permanecem não iniciadas nesta publicação da baseline

## [Baseline]
- Baseline Master gerada para importação no Antigravity.
