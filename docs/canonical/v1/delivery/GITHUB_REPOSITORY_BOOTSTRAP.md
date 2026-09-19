# GitHub Repository Bootstrap

**Repository:** `https://github.com/Aurum-Soltec/genesis360empresarial`  
**Verificação:** 2026-08-28 — repositório público criado e vazio no momento da verificação.

## Objetivo
Publicar esta baseline como primeiro commit canônico sem perder histórico documental dentro do pacote.

## Comandos
Execute na raiz extraída:

```bash
git init
git branch -M main
git remote add origin https://github.com/Aurum-Soltec/genesis360empresarial.git
git add .
git commit -m "chore: bootstrap Genesis 360 Empresarial production foundation v1.2"
git push -u origin main
```

Se o remote já existir:

```bash
git remote set-url origin https://github.com/Aurum-Soltec/genesis360empresarial.git
```

## Antes do push
```bash
git status
pnpm install --frozen-lockfile
pnpm work:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:check
```

Banco local/Supabase:
```bash
supabase test db
```

Não execute push de `.env`, service-role keys, database URLs, tokens ou secrets.

## Branch model
Baseline simples:
- `main` protegida;
- feature branches curtas;
- PR obrigatório;
- squash merge preferido;
- sem `develop` permanente enquanto um único fluxo de release for suficiente.

## Proteção recomendada para main
- require pull request;
- require CI status;
- require conversation resolution;
- block force pushes;
- block deletion;
- stale approvals dismissed após mudança significativa;
- secret scanning habilitado quando disponível;
- dependabot/security alerts conforme plano GitHub.

## Labels
- `P0`
- `P1`
- `P2`
- `security`
- `privacy`
- `database`
- `frontend`
- `backend`
- `diagnostic`
- `mission`
- `qualification`
- `agentic`
- `ux`
- `runtime`
- `blocked`
- `decision-needed`
- `evidence-needed`

## Milestones
1. Production Foundation
2. Security & Recovery
3. UX Runtime Validation
4. Sensitive Feature Activation
5. Release Candidate
6. Pilot
7. GA
