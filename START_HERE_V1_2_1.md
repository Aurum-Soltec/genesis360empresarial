# Começar pela V1.2.1 RC2

> **RC2, 2026-09-19:** para o trabalho atual, leia primeiro
> `PROJECT-STATE.md` e
> `docs/canonical/v1/delivery/RC2_SCOPE_FREEZE_2026-09-19.md`.
> O lock, build e banco já receberam a primeira execução verde do RC2; repita
> os gates no hash que será promovido. As instruções RC1 abaixo permanecem como
> histórico e procedimento de reconstrução.

## 1. Publicar a cópia correta
Usar **somente a pasta `genesis360empresarial` deste pacote saneado**, incluindo `.github/` e os demais arquivos iniciados por ponto.
Não misturar com os três dossiês originais nem com a extração antiga.
O ZIP original continua preservado fora do repositório para consulta privada.

Repositório aprovado: `https://github.com/Aurum-Soltec/genesis360empresarial`.
Esta entrega não fez push nem alterou configurações do GitHub.

Na pasta copiada para o clone do repositório:
```sh
node scripts/check-public-package.mjs
git status --short
git add --all
git diff --cached --name-only
git commit -m "chore: add Genesis V1.2.1 hardening candidate"
git push origin main
```
O comando de staging é apropriado apenas à cópia saneada e depois da revisão dos nomes dos arquivos.
Não incluir `.env` real. O scanner fornecido é estreito e não substitui revisão ou proteção de segredos.

## 2. Gerar a resolução real de dependências
O primeiro CI de qualidade ficará bloqueado enquanto faltar o lock correto. Isso é esperado e visível; não desabilitar a verificação.

Opção no GitHub: Actions → `Resolve candidate lockfile (manual, no deployment)` → Run workflow.
Inspecionar o resultado do audit e o artefato `candidate-lockfile-review-required`.
Extrair o `pnpm-lock.yaml` para a raiz do projeto, revisar as dependências e versionar em novo commit.
O workflow não faz commit automático e não publica aplicação.

Alternativa local, em ambiente com acesso ao registro oficial:
```sh
# Pré-requisitos: Node 24.21.0 e pnpm 10.32.1.
pnpm deps:bootstrap
pnpm audit --audit-level=high
# Revisar pnpm-lock.yaml; não ignorar advisories de nível high/critical.
pnpm install --frozen-lockfile
pnpm quality
```
Falha na resolução, incompatibilidade ou advisory é bloqueio para correção, não permissão de relaxar o gate.
Os tipos Node herdados (`@types/node` 26.0.1) precisam ser alinhados a Node24 na revisão do lock; não foi inventado um número de pacote não verificado.
Revisar os scripts nativos permitidos em `pnpm.onlyBuiltDependencies`, as versões transitivas e o audit antes de instalar.

## 3. Executar banco isolado
Pré-requisitos: Docker disponível e Supabase CLI 2.117.0.
```sh
supabase start
supabase db reset --local
supabase test db
```
`db reset --local` apaga APENAS a instância local selecionada. Nunca adaptar esse comando para produção.
O job `database` do CI executa essa sequência e publica o log dos testes.
A suíte de suporte `basejump-supabase_test_helpers` usa instalação por dbdev e depende de disponibilidade externa.
Nesta entrega o PostgreSQL alvo17 e a compatibilidade do CLI foram CONFIGURADOS, não executados.

## 4. Homologar a migração e a aplicação
Há três migrações novas, 0013–0015. As doze anteriores foram preservadas.
Índices únicos fazem a migração falhar se existirem fatos correntes ou resultados finais duplicados. Não excluir registros automaticamente.
Diagnósticos V1.2 não recebem notas recalculadas silenciosamente: snapshots antigos permanecem históricos.
Rascunhos antigos sem `context_snapshot` exigem revisão/migração ou nova avaliação; não continuar pelo endpoint novo.

Após os testes locais, usar ambiente de homologação isolado: fluxo de autenticação/provisionamento,
APIs com usuários de empresas distintas, concorrência real, navegação e registros persistidos.
Login/cadastro/recuperação/provisionamento ainda não foram implementados nesta tranche; os testes locais criam identidades sintéticas.

## 5. Evidência a devolver para a próxima etapa
Resultado do workflow de dependências, novo lockfile revisado e logs completos dos jobs `quality` e `database`.
Não enviar tokens, senhas, cookies, `.env` real, dados de clientes nem documentos confidenciais.
O próximo gate é uma execução integrada reproduzível, não a ampliação de módulos.
