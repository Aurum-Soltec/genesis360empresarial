# HSP-2 — backup gratuito usando somente GitHub (blueprint, sem backup runtime)

**Estado em 2026-09-23: BLOCKED.** O proprietário **recusou Cloudflare R2**; não abrir conta, bucket ou checkout. Esta nota reavalia apenas GitHub Free privado. Após a análise inicial, o proprietário criou `Aurum-Soltec/genesis360-staging-backups`, confirmado privado. O PR privado #1 agora contém blueprint manual-only, sem agendamento, secrets, Release ou backup real. A organização herda READ para `aurumsoltec` e somente `hudsonlcustodio` tem ADMIN; esse leitor poderá acessar futuros arquivos cifrados e logs.

## Requisito canônico e dados medidos

O [runbook canônico](../canonical/v1/operations/BACKUP_RESTORE_RUNBOOK.md) pede cópia automática diária, criptografada, em conta/projeto separado, retenção mínima de 30 dias, **RPO ≤ 24 h** e **RTO ≤ 30 min** em restauração isolada com volume representativo. Para produção, diz literalmente **“backup gerenciado”**. O [Supabase Free não inclui backups automáticos](https://supabase.com/docs/guides/platform/backups). Mesmo backups do PostgreSQL da plataforma **não contêm os bytes de Supabase Storage**, apenas metadados; [objetos exigem exportação separada](https://supabase.com/docs/guides/storage/management/download-objects).

Consultas agregadas, somente leitura, ao staging em 2026-09-23, sem nomes de arquivo nem conteúdo: `pg_database_size(current_database()) = 29.756.563 bytes` (~28,4 MiB) e `storage.objects`: **0 objetos, 0 bytes declarados, 0 tamanhos desconhecidos**. Foram executadas com `supabase db query --linked` e estas consultas reproduzíveis:

```sql
select pg_database_size(current_database()) as database_bytes;
select count(*) as object_count,
       coalesce(sum(case when metadata->>'size' ~ '^[0-9]+$'
                         then (metadata->>'size')::bigint else 0 end), 0) as recorded_object_bytes,
       count(*) filter (where metadata->>'size' is null
                        or metadata->>'size' !~ '^[0-9]+$') as unknown_size_objects
from storage.objects;
```

Isto é **tamanho físico do banco**, não tamanho de dump comprimido/cifrado; os arquivos de clientes futuros podem mudar radicalmente a conta. Nenhum dump foi gerado para esta análise.

## Duas formas de armazenar em GitHub Free privado

| Destino | Limite oficial e consequência |
| --- | --- |
| **Artifacts de GitHub Actions** | [GitHub Free para organizações](https://docs.github.com/en/billing/concepts/product-billing/github-actions) inclui 500 MB de artifacts/Packages **compartilhados** e 2.000 minutos de runner privado por mês. Para manter 32 snapshots diários, cada arquivo completo cifrado precisaria medir **≤16,4 MB** se toda a franquia estivesse livre; para duas cópias/dia por 32 dias, **≤8,2 MB**. O banco físico atual tem 29,8 MB, mas o tamanho comprimido é desconhecido. Portanto não se pode declarar nem viável nem inviável sem medição segura do arquivo final. Outras artifacts da organização reduzem a margem. A [retenção pode ser configurada](https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization), mas deletar a execução também [deleta sua artifact](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts). |
| **Assets de Releases em repositório privado** | O [GitHub informa limite de <2 GiB por arquivo, sem limite documentado de tamanho total da release nem de bandwidth](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases). Não usa a cota de 500 MB de Actions artifacts. Uma release por snapshot poderia conter arquivo cifrado e manifesto, com limpeza **somente depois de 32 dias**. [Releases imutáveis](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases) impedem alteração/exclusão de assets de uma release publicada; a release inteira ainda pode ser apagada por operador autorizado, portanto não é retenção WORM garantida. GitHub Releases é distribuição de software, **não um serviço de backup com SLA/retention nativos**; o [termo de uso reserva limitação para consumo excessivo](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies). Exige aceite explícito desse uso e risco. |

**Recomendação para avaliação, não implantação:** release privada e cifrada é a única das duas opções cuja capacidade nominal não depende do dump ficar abaixo de ~8–16 MB. A viabilidade operacional, contratual e de restauração continua **não demonstrada**. Não usar repositório público, cache, commit Git/LFS ou artifacts públicos como backup. Não afirmar que “sem limite de tamanho total da release” equivale a armazenamento ilimitado contratado ou disponibilidade garantida.

## Desenho mínimo sujeito a ADR

O **repositório GitHub privado separado** já foi criado na organização. O workflow preparado é inicialmente **manual-only**; após snapshot real, restore isolado e decisão de equivalência, um agendamento a cada 12 horas em branch default controlada poderia exportar roles/schema/data/migration history seguindo o [guia oficial Supabase](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore), mais bytes Storage se houver, conferiria integridade e cifraria o arquivo **antes de publicar**. Apenas chave **pública** de cifragem no runner; chave privada de restore sob guarda humana fora do GitHub. Segredos de conexão e, se necessário, acesso Storage ficariam só nos secrets do repositório privado, nunca no repo público, logs ou relatórios. A release se publicaria somente após todos os arquivos e checksums estarem prontos; uma segunda rotina apagaria somente releases com idade **>32 dias** e preservaria sempre a última cópia íntegra. Probes periódicos verificariam recuperabilidade e idade do snapshot; [agendas Actions podem atrasar](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), logo executar uma vez a cada 24 h sem margem não comprova RPO ≤24 h. Uma política de orçamento de **US$ 0/bloqueio de excedentes** e monitor de minutos/uso são necessários para respeitar o pedido de soluções gratuitas; ao atingir a cota, a rotina pode parar e o RPO falhar.

O GitHub é um **projeto separado** do banco, mas não um provedor independente da conta GitHub que também abriga o código; comprometimento administrativo ou exclusão do repo pode atingir as cópias. A execução é **autogerida** e o destino Release não é backup gerenciado; o runbook não pode ser marcado PASS sem **ADR/decisão expressa do proprietário** aceitando esse controle compensatório e documentando recuperação alternativa, risco de conta única, política de retenção e proteção de dados de clientes futuros. Esta decisão não altera PostgreSQL, Supabase primário, tenancy, RLS ou código de aplicação.

## Responsabilidades e prova necessária

Proprietário/operador: aprovar ou recusar ADR de equivalência; autorizar o repositório privado separado e sua política de acesso/immutability; provisionar os segredos de exportação por secret store e guardar a chave privada fora do CI; verificar franquia/orçamento; designar responsável por monitor, restore e proteção de dados. O [Supabase Free admite até dois projetos ativos](https://supabase.com/pricing), mas não foi verificado se há uma vaga de restauração isolada. Um ambiente local isolado pode servir a um ensaio técnico, mas o aceite de RTO hospedado requer prova no ambiente representativo definido pelo gate.

Para reavaliar PASS: medir tamanho final **DB + Storage cifrados** sem exibir conteúdo; publicar snapshot automático com ID/UTC/hash; demonstrar política de retenção de ≥30 dias e proteção contra exclusão prematura; restaurar **esse arquivo externo** em ambiente isolado com Auth, migrations, RLS, tenant A/B, worker/outbox e HTTP; simular incidente e medir RPO como idade do último dado efetivamente recuperável no instante da falha, e RTO da falha até serviço funcional. Retestar após correções. Até lá, **backup automático/retido e RPO/RTO HSP-2/HSP-4 seguem BLOCKED**.

## Atualização do repositório privado — 23/09, sem backup runtime

A organização criou o repositório separado genesis360-staging-backups, confirmado
privado, e habilitou immutable releases (enabled=true). O PR privado #1 foi
incorporado no SHA fd593c1. O conteúdo remoto é **blueprint manual-only**:
scripts/workflow preparados e **15 testes sintéticos** aprovados, sem secrets,
chaves, dump, objeto Storage, Release de backup ou agendamento. Portanto não há
cópia recuperável nem janela de retenção observada. O uso de releases imutáveis
não garante que um administrador não apague a release inteira.

A autorização do proprietário cobre avaliar e implementar essa alternativa
gratuita; ainda falta decisão expressa de que o controle autogerido pode
substituir o requisito canônico de backup gerenciado, com aceitação dos riscos
de mesma conta administrativa, ausência de SLA e retenção autogerida. Antes
do primeiro snapshot real, guardar chave privada fora do GitHub, provisionar
credenciais somente no cofre do repo privado, validar CA/verify-full, orçamento
e permissões. Após isso, testar backup completo, download, restauração isolada,
serviço HTTP/Auth/worker, retenção e RPO/RTO reais em volume representativo.
Até esses testes, **HSP-2 e HSP-4 continuam BLOCKED**.
