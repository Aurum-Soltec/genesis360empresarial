# HSP-1/HSP-4 — convite hospedado: rechecagem e correção local

Data: 2026-09-23. Ambiente: projeto Railway/Supabase dedicado de staging.
Artefato hospedado observado: `5e6e836ad828b075ca91e5fc7d9075e4f6a73918`.

**Gate: BLOCKED.** A evidência histórica de 20/09 registra HTTP 502 na API de
convite, sem comprovação de entrega de e-mail ou callback. Esse código de
resposta sozinho não identifica SMTP como causa. O artefato hospedado atual
registra `membership.invite_failed` com etapa fixa (`auth`, `membership` ou
`audit`) e identificador opaco; os últimos 1.000 registros de execução
consultados em 23/09 não continham evento desse tipo. Nenhum novo convite foi
disparado nesta rechecagem.

Uma inspeção **somente leitura** da API Auth no staging, executada com o segredo
apenas em memória, examinou 14 usuários. Nenhum tinha criação/convite na janela
de cinco minutos antes/depois do 502 histórico de 20/09 22:38:44 UTC. Isso é
compatível com rejeição antes da criação de um novo usuário, mas não exclui
convite a usuário preexistente e não revela o erro do provedor. Nenhum e-mail,
token, segredo, payload do provedor ou identificador de usuário foi registrado
nesta evidência.

## Correção local relacionada

O fluxo anterior usava `upsert` no vínculo `(tenant_id,user_id)` depois de Auth
aceitar. Se Auth devolvesse um usuário já vinculado, um novo convite poderia
sobrescrever seu papel, inclusive rebaixar o último owner. O candidato local
substitui o `upsert` por `insert` protegido pela constraint única existente.
Duplicata retorna `MEMBER_ALREADY_EXISTS`/HTTP 409 sem alterar o papel nem
gerar auditoria falsa. Outras falhas continuam fechadas e sanitizadas.

Validação local após essa alteração: 5/5 testes focados de convite, TypeScript,
ESLint dos arquivos afetados e `security:check` passaram. `work:check` precisa
ser repetido depois da atualização coordenada do manifesto de integridade;
existem alterações simultâneas em outros arquivos protegidos. Esta correção
**não está no SHA hospedado** e não fecha o gate.

## Prova que falta

1. Integrar a correção e promover SHA identificável com CI verde; repetir os
   testes afetados no mesmo artefato.
2. Usar uma **caixa postal controlada pelo proprietário/operador**, endereço
   único de teste e entrega SMTP admissível. Registrar a configuração de
   redirect permitido para o domínio hospedado, sem imprimir valores secretos.
3. Executar um convite e capturar resposta da API, recebimento no inbox,
   callback, definição de senha, login e vínculo ao tenant esperado. Verificar
   auditoria e negativa de acesso a outro tenant. Anonimizar e-mail/IDs nos
   artefatos públicos.
4. Se houver 502, usar a etapa sanitizada para localizar a falha. Quando Auth
   aceitar mas membership/audit falhar, reconciliar o estado antes de qualquer
   retry; um segundo convite cego pode duplicar e-mail ou deixar conta sem
   acesso.

Responsável pelo acesso externo: proprietário/operador da caixa postal e
configuração de e-mail. Engenharia pode concluir a integração e os testes
locais paralelamente, mas recebimento e callback não recebem PASS sem o inbox.

## Preparação do reteste com caixa postal controlada — 23/09

O proprietário informou uma caixa postal que controla, mantida fora deste
registro público. Antes de enviar qualquer convite, a consulta somente leitura
no projeto Supabase de staging retornou `auth_exists=false` e
`membership_exists=false` para esse endereço. A consulta exibiu somente esses
dois booleanos, sem e-mail, identificador de usuário ou tenant.

O tenant fictício `Tenant A` está ativo em sessão hospedada com perfil `owner`.
Foi adicionada à central demonstrativa uma interface de convite, guardada para
`owner/admin` pela página e pela API. Ela solicita apenas o papel `member` e
deixa explícito que HTTP 201 não comprova entrega ou ativação. Em resultado
incerto, bloqueia retry automático até reconciliação de Auth e membership.
Os dois testes focados da interface, TypeScript e ESLint passaram localmente.
Esta interface ainda não foi promovida no momento deste registro, e **nenhum
convite foi emitido**.

## Reteste hospedado do convite — artefato `fe0e5b4`

Após CI e web/worker no mesmo SHA, foi emitida **uma única tentativa** pela
interface owner do `Tenant A`. A API respondeu pelo ramo HTTP 201. Consulta
somente leitura, exibindo exclusivamente booleanos e contagens, confirmou um
usuário Auth convidado, um vínculo `member` no `Tenant A` e um evento
`membership.invited`. O e-mail de Supabase Auth foi recebido na caixa
controlada com assunto “You've been invited”. Até aqui, entrega não comprova
ativação.

**Problema:** o link recebido tinha `type=invite` e token, mas o parâmetro
`redirect_to` apontava para a raiz do web, não para o
`/auth/callback?next=/nova-senha` pedido pela API. O clique único confirmou
o e-mail em Auth, mas terminou em `/entrar?next=/` com tokens somente no
fragmento da URL e tela de senha existente; não houve tela de definição de
senha nem sessão utilizável demonstrada. Nenhum token, código, hash de token,
URL completa ou segredo foi registrado nesta nota. O cliente browser do
`@supabase/ssr` usa fluxo PKCE e o callback server atual só troca `code`; ele
não processa o retorno implícito em fragmento de convite.

**Impacto:** onboarding administrado permanece **FAIL** no callback, embora
API, e-mail, Auth, membership e auditoria tenham sido observados. Reenviar
cegamente ao mesmo endereço pode encontrar usuário já criado e não resolve o
callback. O link original foi consumido uma vez.

**Alternativas:** (A) receber o fragmento de convite numa rota pública do web,
remover o fragmento imediatamente, validar a sessão com `setSession` contra o
Auth de staging e encaminhar para `/nova-senha`; (B) personalizar o template
de e-mail para `token_hash` e verificar por `verifyOtp` no servidor. A segunda
opção exige mudança operacional adicional no template e deve ser testada em
conjunto com a entrega de e-mail.

**Decisão de correção:** a inspeção do painel Auth de staging expirou sem
permitir conferir ou editar com segurança template e allowlist. Nenhuma
configuração foi alterada. A opção A foi implementada localmente no ponto para
o qual o link existente realmente redireciona (`/entrar`): restringe-se a
`type=invite`, remove o fragmento antes de iniciar o cliente Auth, valida
`setSession` e `getUser` e só então encaminha para `/nova-senha`. Falhas
permanecem na entrada com mensagem genérica; nenhum token entra em logs,
estado React ou URL de destino. A atualização de senha oferece caminho para
`/selecionar-empresa` apenas após confirmação de `updateUser`. A alternativa B
permanece melhor para uma futura revisão de template/PKCE, com mudança
operacional e teste próprio; não foi aplicada cegamente.

**Próxima prova:** promover o artefato íntegro e reexecutar num endereço de
teste único sob a mesma caixa controlada, verificar sessão, definição de senha
pelo proprietário, login posterior e tenant correto. O gate não muda para PASS
antes dessa prova hospedada.
