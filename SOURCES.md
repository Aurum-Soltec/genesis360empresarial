# SOURCES — V1.2.1 RC1
Data de consulta: 2026-09-10.

## Fontes do projeto
1. Decisão do proprietário nesta conversa: saneamento autorizado, repositório público, Free/Start99/Pro297. Autoridade para essas decisões.
2. ZIP `GENESIS_360_EMPRESARIAL_PRODUCTION_FOUNDATION_MASTER_V1_2.zip`: código real, schemas, PRD e histórico; preservado sem alteração.
3. Dossiê Comercial Completo V1.2, especialmente páginas5–8,11–12: jornada, separação maturidade/confiança, planos e governança.
   Ressalva de preço Pro superada pela decisão1; demais condições não são presumidas como novas aprovações.
4. Relatório `GENESIS_360_ANALISE_E_PLANO_DE_CONTINUIDADE.md` e evidências anteriores: achados que motivam saneamento.
5. Execução local registrada em `docs/hardening-v1.2.1/VALIDATION-RESULTS.json`: evidência desta sessão, com escopo e limites.

## Fontes oficiais externas — usadas apenas para tecnologia atual e verificação
- Next.js, August2026 Security Release, 2026-08-25:
  https://nextjs.org/blog/august-2026-security-release
  Alvo recomendado16.3.3. A aplicabilidade das vulnerabilidades depende de configuração; não foi constatada exploração do Genesis.
- Node.js releases:
  https://nodejs.org/en/about/previous-releases
  Node20 EOL; alvo LTS24.21.0.
- React19.2.8:
  https://github.com/react/react/releases/tag/v19.2.8
  Patch da mesma linha19.2; compatibilidade ainda requer instalação/build.
- pnpm10.32.1:
  https://github.com/pnpm/pnpm/releases/tag/v10.32.1
  Versão fixada e verificada como existente; não apresentada como última versão global.
- pnpm action v4:
  https://github.com/pnpm/action-setup/tree/v4
  Versão explícita de package manager.
- Supabase CLI2.117.0:
  https://github.com/supabase/cli/releases/tag/v2.117.0
- Supabase local config:
  https://supabase.com/docs/guides/local-development/cli/config
- Supabase local testing:
  https://supabase.com/docs/guides/local-development/testing/overview
- RLS / limites de service_role:
  https://supabase.com/docs/guides/database/postgres/row-level-security
- Repositório consultado:
  https://github.com/Aurum-Soltec/genesis360empresarial

## Limites
Consulta web não resolve dependências instaláveis nem gera integrity hashes.
Não foi possível verificar uma revisão exata de @types/node24 pela fonte oficial acessível;
por isso o alinhamento dos tipos herdados está explicitamente pendente, não substituído por número inventado.
Fontes restritas não foram transferidas ao pacote público; os hashes estão no registro de exclusões.
