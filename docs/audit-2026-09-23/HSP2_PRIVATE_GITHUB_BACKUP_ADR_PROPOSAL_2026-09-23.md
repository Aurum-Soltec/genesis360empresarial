# HSP-2 — ADR proposta: cópia privada cifrada em GitHub Releases

**Status: repositório privado criado; controle de backup não implantado; ADR de equivalência pendente; GATE BLOCKED.**

## Contexto e evidência

O runbook canônico exige backup automático, criptografado, separado, 30 dias de retenção, RPO ≤24 h e RTO ≤30 min, e usa a expressão “backup gerenciado” para produção. [Supabase Free não oferece backup automático](https://supabase.com/docs/guides/platform/backups), e um dump do banco não inclui bytes dos objetos Storage. O proprietário recusou R2 e autorizou avaliar/implementar a alternativa gratuita. O repositório `Aurum-Soltec/genesis360-staging-backups` foi criado privado em 2026-09-23, e recebeu blueprint manual-only via PR privado #1; não recebeu secrets, chave, cópias ou agendamento. A organização concede READ herdado a `aurumsoltec`; somente `hudsonlcustodio` possui ADMIN. O leitor poderá baixar futuros arquivos cifrados e ver logs, o que reforça a exigência de chave privada de recuperação fora do GitHub e revisão de acesso antes de dados reais. Em 2026-09-23, consultas agregadas no staging mediram 29.756.563 bytes de banco e zero objetos Storage; o tamanho comprimido/cifrado permanece desconhecido. Ver [análise de capacidade e limites](HSP2_FREE_BACKUP_OPTIONS_2026-09-23.md).

## Decisão candidata, ainda não aprovada como equivalente canônico

Usar o **repositório privado exclusivo já criado**, com workflow inicialmente manual e agendamento futuro a cada 12 horas após prova de recuperação, para exportar os schemas críticos, Auth, histórico de migrations, roles sem senhas e bytes Storage; cifrar o pacote localmente com chave pública `age`; publicar apenas o arquivo cifrado e um manifesto sem dados de cliente como assets de Release; verificar o download; exigir [Release imutável](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases); reter cada snapshot ao menos 32 dias; apagar os mais antigos só quando houver uma cópia nova íntegra. [GitHub documenta limite de 2 GiB por asset e nenhum limite publicado para o tamanho total da Release](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases). O blueprint está em `tmp/hsp4-private-backup/` e o clone local separado em `tmp/hsp4-private-backup-repo/`, ambos **ignorados pelo Git do repositório público**. Ainda não há backup real, Release, secrets ou agendamento. O blueprint passou **15/15** testes sintéticos em 2026-09-23 (`python -m unittest discover -s tmp/hsp4-private-backup-repo/tests -v`); testa invariantes e sequência sintética, não runtime hospedado.

A execução usa `PGSSLMODE=verify-full` e certificado CA Supabase fornecido pelo proprietário, porque [`require` cifra mas não verifica o servidor](https://supabase.com/docs/guides/database/connecting-to-postgres). [GitHub Actions é IPv4-only](https://supabase.com/docs/guides/troubleshooting/supabase--your-network-ipv4-and-ipv6-compatibility-cHe3BP), portanto o script exige o **session pooler Supabase na porta 5432**, que a [documentação da Supabase recomenda para backup quando não há IPv6](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore). O runner recebe apenas a chave pública de cifragem; a chave privada de recuperação fica fora do GitHub. Os secrets de exportação só entram na etapa de backup, não na etapa de checkout/instalação. Os [S3 access keys do Supabase Storage são server-only, dão acesso total e bypass de RLS](https://supabase.com/docs/guides/storage/s3/authentication); não devem ser fornecidos a agentes nem ao repositório público. O script falha se encontrar objetos Storage sem credenciais privadas autorizadas e força endereçamento S3 no estilo path.

## Limites e risco residual

GitHub Releases não é um serviço contratado de backup, não tem SLA ou retenção mínima nativa de 30 dias, e a release inteira ainda pode ser excluída por administrador autorizado. O [uso excessivo pode ser limitado pelo GitHub](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies). Repositório privado separado reduz exposição, mas compartilha o provedor/conta administrativa com o código. O agendamento [pode atrasar](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows); precisa de monitor independente da idade do último snapshot recuperável. GitHub Free para organizações inclui [2.000 minutos privados/mês](https://docs.github.com/en/billing/concepts/product-billing/github-actions), compartilhados com outras rotinas; o proprietário deve configurar orçamento de US$ 0/bloqueio do excedente e aceitar que esgotamento da franquia interrompe backups.

O backup proposto coleta arquivos Storage, mas o **restore local automatizado apenas reconstitui o banco e confere integridade dos bytes Storage**. `roles.sql` é arquivado sem senhas, porém **não é aplicado** no cluster local compartilhado; o ensaio pressupõe os papéis que já vêm da baseline Supabase. Se houver objetos, ele falha antes de declarar recuperação completa: a importação no Storage de um projeto isolado, Auth/HTTP/worker e o RTO operacional ainda exigem implementação e ensaio. O banco no staging tinha zero objetos quando medido; isso pode mudar. `pg_dump` oferece snapshot transacional do banco, mas não snapshot atômico com o backend de Storage; a comparação do inventário antes/depois reduz o risco de corrida, sem eliminá-lo em todas as condições. A [documentação oficial do S3](https://supabase.com/docs/guides/storage/s3/authentication) confirma o host direto `<project-ref>.storage.supabase.co/storage/v1/s3`. [O GitHub documenta a opção de imutabilidade](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/establish-provenance-and-integrity/prevent-release-changes), e a configuração real do repositório privado retornou enabled=true; a Release inteira ainda pode ser excluída por administrador autorizado. O SHA do checkout fixado corresponde ao [commit da versão 7.0.1](https://github.com/actions/checkout/commit/3d3c42e5aac5ba805825da76410c181273ba90b1). Staging reportou PostgreSQL 17.6 em consulta agregada; a conexão `verify-full` do runner permanece sem teste e depende do certificado CA do projeto.

## Gate de decisão e evidência para PASS

O proprietário precisa decidir se aceita **backup autoexecutado em GitHub Release privado como controle compensatório** para “backup gerenciado”, com seu risco de conta única, sem fornecedor adicional, e aprovar a política de dados/credenciais. Caso a exigência literal de backup gerenciado permaneça, esta opção **não satisfaz** o gate. A decisão não altera PostgreSQL/Supabase primário, tenancy, RLS ou aplicação.

Mesmo após aceite, HSP-2/HSP-4 só pode avançar com: repositório privado e política de imutabilidade; secrets colocados pelo proprietário em cofre sem exposição; medição do arquivo completo comprimido/cifrado e da franquia; snapshot agendado baixado e verificado; configuração e verificação de 30 dias de retenção; alerta entregue/ACK; restauração isolada completa a partir da Release; incidente simulado com último dado recuperado, **RPO real ≤24 h** e **RTO de serviço ≤30 min** em volume representativo. Correções invalidam e repetem os testes afetados. Até isso ocorrer, **BLOCKED**.

Rollback da proposta local: remover a linha específica de `.gitignore`, a pasta ignorada `tmp/hsp4-private-backup/` e esta nota. Após ativação remota, rollback exige preservar snapshots válidos durante sua janela de retenção e migrar a recuperação para destino aprovado antes de desativar o workflow.



## Estado remoto após implementação do blueprint

O repositório genesis360-staging-backups permanece **privado**. Immutable
releases foi habilitado e verificado como enabled=true. O PR privado #1 foi
incorporado no SHA fd593c1. O workflow remoto permanece **manual-only**;
15 testes sintéticos do blueprint passaram. Não foi instalado segredo de
exportação, chave privada de recuperação, certificado CA nem agendamento.
Nenhum backup, Release de dados ou restauração ocorreu. A política de
retenção de 30 dias, RPO ≤24 h e RTO ≤30 min continua **sem prova**.

O proprietário autorizou avaliação e implementação no GitHub privado,
mas ainda não aceitou formalmente esse controle autogerido como equivalente
ao backup gerenciado exigido pelo runbook. A imutabilidade de assets não
impede exclusão da Release inteira por administrador autorizado. O gate
HSP-2/HSP-4 só poderá mudar após decisão de equivalência, configuração
segura, cópia automática cifrada, restauração isolada representativa e
medições reais de retenção/RPO/RTO.
