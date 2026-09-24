# HSP-4 — primeiro backup privado cifrado e restore isolado

**Estado:** subprova manual PASS; gate de backup/recuperação HSP-4 ainda **BLOCKED**. Nenhuma conclusão de RPO/RTO de serviço ou retenção de 30 dias é inferida deste ensaio.

## Objeto e proteção

- Fonte: Supabase staging `memhdbkfiocheulskqxw`, PostgreSQL 17, pooler de sessão IPv4 na porta 5432. A conexão exige `PGSSLMODE=verify-full`; teste independente sem senha verificou cadeia e hostname `*.pooler.supabase.com` com a Supabase Root 2021 CA. O hash DER da CA foi `807025AD50D4ED219D2C9C7D299C004F824EB00CF7F65AFEF607D07B72E6CAFA`. Isso prova TLS, não a correção do backup.
- Destino: repositório separado **privado** `Aurum-Soltec/genesis360-staging-backups`; workflow `main` em `7e6a54edd5c440bcd8507c8dfd3f655b75698bc3`. A chave pública age fica no runner; a identidade privada ficou somente em DPAPI no computador do operador e foi removida do arquivo temporário usado no restore. Guarda independente permanece pendente.
- Secrets de Actions configurados no repositório privado: `BACKUP_PGHOST`, `BACKUP_PGPORT`, `BACKUP_PGUSER`, `BACKUP_PGPASSWORD`, `BACKUP_PGDATABASE` e `BACKUP_PG_CA_PEM`. Seus **valores não constam** deste relatório, Git, logs ou evidências públicas. A validação do script exige projeto staging, repositório privado exato, TLS `verify-full` e release imutável antes de exportar.

## Execuções reais

| Tentativa | Resultado | Alcance |
| --- | --- | --- |
| [35944633830](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/35944633830) | FAIL, instalador `awscli` sem candidato APT no Ubuntu 24.04 | Parou antes de carregar secrets ou ler dados. Corrigido no PR privado #3. |
| [35945058146](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/35945058146) | FAIL, cliente `pg_dump` padrão não era o 17 instalado | Parou antes de carregar secrets ou ler dados. Corrigido no PR privado #4. |
| [35945384891](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/35945384891) | **PASS**, todas as etapas, incluindo TLS, exportação, cifragem, upload, download de verificação e publicação | O backup foi criado às **2026-09-24 02:00:55 UTC** e publicado às **02:01:37 UTC**. |

A release privada `genesis-hsp2-backup-20260924T020055Z-35945384891` está publicada, não é rascunho e retornou `isImmutable=true`. O manifesto declara PostgreSQL 17, dump customizado de **4.021.285 bytes**, **zero objetos Storage** nessa captura e arquivo cifrado de **3.613.039 bytes**. O SHA-256 do arquivo cifrado baixado de volta é `0be8f4891367599203526d65969ebd1b0262940a1195ae4bce3792c0dc82d285`, igual ao manifesto; SHA-256 do manifesto baixado `310e6f06db407332beaa2c6f6ba79ed7e7e797eb3cb79e6a234dcbaf07c667d`. Nenhum dump ou chave foi publicado no repositório público.

## Restauração controlada

O arquivo cifrado e manifesto foram baixados da release privada para `.audit-work/backups/` ignorado pelo Git. A identidade DPAPI foi usada somente no computador do operador para decifrar em diretório temporário. O script recusaria Docker remoto, exigiu contêiner local `supabase_db_genesis360-local`, criou uma base nova temporária, restaurou e validou contagens; ao final apagou essa base e o arquivo temporário da identidade. Resultado sanitizado:

| Verificação | Resultado |
| --- | ---: |
| Tenants restaurados | 102 |
| Usuários Auth restaurados | 16 |
| Objetos Storage | 0 |
| Migrations registradas | 24 |
| Restore do banco e verificações | **32,241 s** |
| Drill local completo após download (decifrar, validar, restaurar, verificar) | **37,476 s** |

O teste prova a legibilidade da release e a restauração **lógica do banco** em isolamento. Não prova que web, Auth, Storage, outbox e worker retomam serviço nesse ambiente; portanto **37,476 s não é RTO de serviço**. O manifesto não inclui marcador transacional de falha e houve apenas uma captura manual, de modo que **RPO real não foi medido**. A lógica de retenção de 32 dias tem 19 testes sintéticos, mas 30 dias de cópias reais ainda não transcorreram. O workflow permanece `workflow_dispatch`, **sem agendamento automático**. Também faltam cópia independente da chave, confirmação de orçamento/franquia da conta GitHub e aceitação formal do controle autogerido como equivalente ao backup gerenciado originalmente exigido.

## Problema estrutural encontrado antes do ensaio de serviço

**Problema e evidência.** O exportador usa `pg_dump --no-owner --no-privileges` e o restore usa `pg_restore --no-owner --no-privileges`; este último valida quatro contagens e apaga a base temporária. A [documentação do PostgreSQL 17](https://www.postgresql.org/docs/17/app-pgdump.html) confirma que `--no-privileges` omite `GRANT/REVOKE` e `--no-owner` não preserva proprietários. As migrations Genesis estabelecem permissões específicas para `authenticated` e `service_role`, além de RLS e funções `SECURITY DEFINER`. As contagens restauradas não provam ACLs, proprietários ou funcionamento de Auth/API/worker.

**Impacto.** Uma recuperação que parece íntegra pelas contagens pode falhar na aplicação ou ter permissões diferentes da origem. Não se deve declarar RTO nem usar `GRANT ALL`, desativar RLS ou apontar o staging ao banco de ensaio como atalho.

**Alternativas.** (1) Em instância Supabase local separada, restaurar dados sobre uma baseline de migrations/ACLs equivalentes e comparar catálogos antes do teste HTTP; (2) ajustar o export/restore para preservar ACLs e owners compatíveis, gerar **nova** cópia cifrada e repetir o ensaio. Ambas exigem validar schemas geridos por Supabase. **Recomendação:** montar primeiro o ensaio isolado com projeto/portas próprios, comparar ACL/RLS/owners com a origem, autenticar usuário sintético, provar membro/gestor/outro tenant por HTTP e processar evento no worker; só então escolher a correção de backup com evidência. Nenhuma mudança arquitetural nem relaxamento de segurança foi feito.

**Gate:** BLOCKED até agendamento seguro, histórico/retensão, restore representativo de serviço, RPO/RTO medidos, custódia independente e decisão de equivalência. As cinco flags sensíveis permaneceram desligadas durante este ensaio.
