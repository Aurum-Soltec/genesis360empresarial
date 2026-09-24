# HSP-4 — isolamento HTTP multi-role hospedado na fonte `458aac9`

**Data:** 2026-09-24 UTC. Este registro público contém apenas metadados
de execução. Nenhum secret, token, credencial ou dado de fixture é incluído.

O proprietário configurou `STAGING_SUPABASE_ANON_KEY` diretamente nos
secrets do GitHub Actions privado. Trata-se apenas da chave anon/publicável;
seu valor não foi exibido ao agente, ao chat, a logs ou a este repositório.
O [workflow HTTP multi-role hospedado, run
`36062309891`](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/36062309891)
terminou **SUCCESS** no claim de fonte
`458aac964d1f9a7016ac1804fe99d68637a3c0b8`. Os jobs de exercício e
de `independent-residue-guard` terminaram **SUCCESS**. O [backstop
`workflow_run`, run
`36062480126`](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/36062480126)
também terminou **SUCCESS**.

O runner revisado é fail-fast e contém **12 assertions HTTP** para membro,
gestor e outro tenant. Assim, os jobs SUCCESS suportam **inferência de
12/12 e ausência de resíduo segundo os guards executáveis**, com escopo
limitado à execução hospedada e ao claim de SHA. O artefato sanitizado
`10834806637`, 511 bytes, digest
`sha256:96cbe42af882a26bb7a21ec135840d9783034fb747c5362297f79c5542399840`,
**não foi inspecionado independentemente pelo agente**. Esta página não
afirma que seus campos ou valores tenham sido lidos.

Os deployments web/worker do staging vieram de worktree limpa detached no
SHA alegado, mas o Railway registrou `meta.commitHash=null`. Logo, a
proveniência depende do checkout/mensagem/digests, não de atestação nativa
do provedor. A evidência permite PASS **limitado ao subgate HTTP multi-role
executado**; não autoriza transferir PASS à Wave HSP-1 completa, ao
diagnóstico documental real, ao p95, ao backup ou à decisão HSP-4. A
[revisão operacional vigente](HSP4_CURRENT_REVIEW_458AAC9_2026-09-24.md)
permanece **NO-GO**.
