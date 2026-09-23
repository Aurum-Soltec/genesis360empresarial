# HSP-4: recuperação e alertas — ensaio de 23/09/2026

Decisão limitada: **backup/RPO/RTO em volume representativo BLOCKED; alerta automatizado até issue PASS, recebimento/ACK humano BLOCKED**. Nenhum teste deste arquivo altera dados do staging ou prova prontidão para piloto.

## Backup e recuperação

- Critério canônico: backup automático diário com 30 dias de retenção, RPO de até 24 h e RTO de até 30 min em restauração isolada, com backup gerenciado, criptografado e separado (`docs/canonical/v1/operations/BACKUP_RESTORE_RUNBOOK.md`).
- O ensaio hospedado anterior (`docs/audit-2026-09-20/hsp2-hosted-logical-restore.json`) restaurou em 3,179 s apenas um snapshot lógico manual de dois tenants. Não mede idade do último ponto recuperável, retenção, recuperação operacional completa nem RTO em volume representativo.
- A documentação oficial do Supabase informa que backups automáticos são dos planos Pro, Team e Enterprise; para Free recomenda exportações e cópias externas. A [tabela oficial de preços](https://supabase.com/pricing) também marca “Automatic backups” como não incluído no Free. Fonte: https://supabase.com/docs/guides/platform/backups.
- Um dump armazenado como artefato **não criptografado** no repositório público seria inadmissível: usuários com leitura no repositório podem baixar seus artefatos. Fonte: https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts.
- Não foi configurado backup em storage separado com criptografia/retenção nem houve restore de snapshot automático. Permanecem pendentes um destino privado autorizado, credencial de leitura segura, retenção comprovável de 30 dias, política de acesso e ensaio isolado em volume de piloto. Não se deve tratar o tempo do drill local como RPO.
- O script `scripts/run-backup-restore-drill.ps1` foi corrigido localmente: passa a registrar horário do snapshot, horário do restore, duração total, `rpo_status=not_measured_without_durable_prior_backup_and_simulated_incident` e escopo de RTO. O antigo campo `rpo_observed_seconds` era duração do ensaio, não perda potencial de dados. O arquivo histórico de PS-8 não foi reescrito.

## Ensaio controlado do monitor

- Antes do teste, não havia issue operacional aberta com o título esperado.
- Simulação `simulate_failure=true`: [run 35926770290](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/35926770290), criada às 22:09:54 UTC; probe executado às 22:09:58–59 UTC. O log mostra login HTTP 200 e redirecionamento anônimo HTTP 307. A falha foi **sintética** (`manual_alert_drill`), sem indisponibilidade real.
- O passo automático criou a [issue #26](https://github.com/Aurum-Soltec/genesis360empresarial/issues/26) às 22:10:00 UTC e a atribuiu a `hudsonlcustodio`. O tempo de criação de issue a partir do disparo foi 6 s; isso não mede tempo de entrega de e-mail nem reação humana.
- O corpo inicial da issue perdeu motivo, códigos HTTP e SHA: backticks de Markdown em um heredoc Bash sem escape foram interpretados como comandos. O [log do run](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/35926770290) confirma `command not found`. Um [comentário corretivo](https://github.com/Aurum-Soltec/genesis360empresarial/issues/26#issuecomment-5803825211) registrou explicitamente a falha e que não houve ACK humano.
- Probe saudável: [run 35927209374](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/35927209374), iniciado às 22:14:24 UTC. O workflow existente comentou recuperação e fechou automaticamente a issue às 22:14:33 UTC, **sem** reconhecimento humano. Esse fechamento não aprova o gate de atendimento.
- Corrigido localmente `.github/workflows/staging-monitor.yml` para formatar dados sem execução de comandos via backticks e registrar recuperação sem fechar a issue antes do ACK. A correção ainda precisa passar no CI e executar no workflow remoto; o ensaio acima avaliou a versão `179a9c523ff8b2d91a8a1eacf38e74fea85650cc` do monitor.
- Atribuição no GitHub não é comprovante de notificação externa recebida. Falta o operador nomeado confirmar recebimento e comentar ACK, com timestamps, antes de repetir o drill no workflow corrigido.

## Verificação local

- YAML e os três blocos Bash do workflow corrigido: parse PASS; nenhum backtick de shell nos blocos.
- Script PowerShell do drill: parse PASS.
- `git diff --check`: PASS; apenas avisos de normalização de LF/CRLF do Git no Windows.

**Ponto humano obrigatório:** titular/operador escolhe e configura destino privado gratuito que cumpra retenção e criptografia (ou altera a restrição de custo), fornece credenciais por cofre/secret store e executa ACK real. Sem isso, backup e atendimento externo permanecem BLOCKED. Nenhuma credencial foi exibida ou persistida neste ensaio.
