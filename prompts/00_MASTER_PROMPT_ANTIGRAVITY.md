# PROMPT MESTRE 001 — BOOTSTRAP CONTROLADO DO GENESIS 360º

Você está operando dentro de um novo repositório que contém a Baseline Master do Genesis 360º.

## Missão desta execução

Preparar o repositório para desenvolvimento, validar a base entregue e concluir somente:

- ST-001 — baseline e controle documental;
- ST-002 — fundação, ambiente e pipeline mínimo.

Não implemente ainda autenticação, banco remoto, diagnóstico, CTO-Tax ou referral.

## Leitura obrigatória, nesta ordem

1. `AGENTS.md`
2. `README.md`
3. `docs/00_README_CONTROLE_DOCUMENTAL_V3.md`
4. `docs/01_PRD_MASTER_V3_HARMONIZADO.md`
5. `docs/02_PLANO_MVP_5_30_45_DIAS.md`
6. `docs/05_ARQUITETURA_SEGURANCA_LGPD_E_ADRS_V3.md`
7. `docs/UX/01_DESIGN_SYSTEM_GENESIS_GLASS.md`
8. `.project-ai/memory/project-state.json`
9. `.project-ai/memory/stories.json`
10. `prompts/REPORT_TEMPLATE.md`

Não leia todos os documentos novamente durante a execução. Use os arquivos de memória e abra apenas a seção necessária.

## Contexto técnico

- monólito modular;
- Next.js 16.2;
- React 19.2;
- TypeScript 6.0;
- Tailwind 4.3;
- Supabase previsto, ainda sem credenciais;
- modo demo deve funcionar sem backend remoto;
- RLS será obrigatória quando o banco for ativado;
- interface Genesis Glass já possui scaffold;
- dependências `latest` devem ser resolvidas, testadas e fixadas no manifest/lockfile.

## Tarefas

### 1. Inicialização

- iniciar Git;
- criar branch `feature/ST-001-ST-002-bootstrap`;
- revisar os arquivos existentes;
- não apagar documentação;
- configurar `pnpm`;
- instalar dependências;
- gerar lockfile;
- substituir versões `latest` por versões exatas instaladas quando seguro;
- registrar versões em `docs/TECH_STACK_LOCK.md`.

### 2. Validação do scaffold

- corrigir apenas erros necessários para compilar;
- preservar identidade visual;
- manter `DEMO_MODE=true`;
- validar rotas:
  - `/`
  - `/diagnostico`
  - `/resultado`
  - `/cto-tax`
  - `/referral`
- não ativar referral real;
- não usar Supabase se as variáveis não existirem;
- nenhum segredo deve ser criado ou solicitado.

### 3. Qualidade

Executar:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:check
```

Corrigir falhas dentro do escopo.

### 4. Documentação

Atualizar:

- `docs/TECH_STACK_LOCK.md`;
- `.project-ai/memory/project-state.json`;
- `docs/12_CHANGELOG.md`.

Registrar:

- versões;
- comandos;
- limitações;
- decisões;
- riscos;
- próximos passos.

### 5. Git

- revisar `git diff`;
- garantir ausência de secrets;
- commit sugerido:
  `chore: bootstrap Genesis 360 master baseline`

Não fazer merge.

## Critérios de aceite

- repositório inicializado;
- dependências instaladas;
- lockfile criado;
- cinco rotas compilam;
- lint aprovado;
- typecheck aprovado;
- testes aprovados;
- build aprovado;
- migration check aprovado;
- modo demo preservado;
- documentação sincronizada;
- nenhum segredo;
- nenhum escopo adicional.

## Regras de parada

Pare e reporte `BLOQUEADO` se:

- uma dependência exigir mudança arquitetural;
- a stack entregue for incompatível de forma material;
- houver necessidade de credencial;
- algum documento contradizer o PRD V3;
- a correção exigir implementar história futura.

## Resposta obrigatória

Entregue exclusivamente no formato de `prompts/REPORT_TEMPLATE.md`, preenchido com evidências reais.
