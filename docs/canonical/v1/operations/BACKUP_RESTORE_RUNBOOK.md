# Backup / Restore Runbook

## Objetivo
Provar recuperação, não apenas possuir backup configurado.

## Alvos do piloto
- RPO: 24 horas, com backup diário e retenção mínima de 30 dias.
- RTO: 30 minutos para restauração em ambiente isolado.
- Responsável: operador de produção designado no release.
- Produção deve usar backup gerenciado, criptografado e em conta/projeto separado.

## Drill
1. registrar timestamp de início;
2. criar/identificar dataset sintético;
3. confirmar backup;
4. restaurar em ambiente isolado;
5. validar schema/migrations;
6. validar tenant A/B;
7. validar registros críticos;
8. medir tempo;
9. registrar gaps;
10. destruir ambiente temporário.

## Evidência
- backup ID/time;
- restore start/end;
- RTO real;
- data checks;
- screenshots/logs;
- responsável;
- conclusão PASS/FAIL.

## Gate
Sem restore executado:
`GATE-PROD = BLOCKED`.

## Drill PS-8 executado em 2026-09-19
Foi criado um dump customizado dos schemas `public`, `private`, `auth`, `storage` e
`supabase_migrations`, restaurado com `--exit-on-error` no banco temporário
`genesis_restore_drill` e validado por marcador, contagens, migrations e policies.

Resultado local: PASS. Backup 0,364 s; restore 2,062 s; RPO observado do snapshot
3,312 s. Evidência: `docs/audit-2026-09-18/ps8-backup-restore.json`.

Este resultado prova o procedimento local. O gate de produção continua exigindo o
mesmo drill em staging com volume representativo e backup gerenciado do provedor.
