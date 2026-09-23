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
