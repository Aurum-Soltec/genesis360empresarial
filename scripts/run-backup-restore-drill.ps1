param(
  [string]$Container = "supabase_db_genesis360-local",
  [string]$RestoreDatabase = "genesis_restore_drill",
  [string]$Output = "docs/audit-2026-09-18/ps8-backup-restore.json"
)
$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$backupDirectory = Join-Path $root ".audit-work/backups"
New-Item -ItemType Directory -Force -Path $backupDirectory | Out-Null
$backup = Join-Path $backupDirectory "genesis_ps8.dump"
$started = (Get-Date).ToUniversalTime()
$backupWatch = [Diagnostics.Stopwatch]::StartNew()
docker exec $Container pg_dump -U postgres -d postgres -Fc --no-owner --no-privileges `
  --schema=public --schema=private --schema=auth --schema=storage --schema=supabase_migrations `
  -f /tmp/genesis_ps8.dump
if ($LASTEXITCODE -ne 0) { throw "Backup failed" }
$backupWatch.Stop()
docker cp "${Container}:/tmp/genesis_ps8.dump" $backup
if ($LASTEXITCODE -ne 0) { throw "Backup copy failed" }
$restoreWatch = [Diagnostics.Stopwatch]::StartNew()
docker exec $Container dropdb -U postgres --if-exists $RestoreDatabase
docker exec $Container createdb -U postgres -T template0 $RestoreDatabase
docker exec $Container psql -U postgres -d $RestoreDatabase -v ON_ERROR_STOP=1 -c "drop schema public cascade;"
docker exec $Container pg_restore -U postgres -d $RestoreDatabase --no-owner --no-privileges `
  --exit-on-error /tmp/genesis_ps8.dump
if ($LASTEXITCODE -ne 0) { throw "Restore failed" }
$restoreWatch.Stop()
$query = "select json_build_object('tenants',(select count(*) from public.tenants),'memberships',(select count(*) from public.memberships),'diagnostics',(select count(*) from public.diagnostics),'outbox',(select count(*) from public.event_outbox),'migrations',(select count(*) from supabase_migrations.schema_migrations),'public_policies',(select count(*) from pg_policies where schemaname='public'))::text;"
$source = (docker exec $Container psql -U postgres -d postgres -At -c $query).Trim()
$restored = (docker exec $Container psql -U postgres -d $RestoreDatabase -At -c $query).Trim()
$result = [ordered]@{
  wave = "PS-8"; executed_at = $started.ToString("o")
  backup_duration_seconds = [math]::Round($backupWatch.Elapsed.TotalSeconds, 3)
  restore_duration_seconds = [math]::Round($restoreWatch.Elapsed.TotalSeconds, 3)
  rpo_observed_seconds = [math]::Round(((Get-Date).ToUniversalTime() - $started).TotalSeconds, 3)
  backup_sha256 = (Get-FileHash $backup -Algorithm SHA256).Hash.ToLower()
  source_counts = ($source | ConvertFrom-Json); restored_counts = ($restored | ConvertFrom-Json)
  integrity_pass = ($source -eq $restored)
}
$outputPath = Join-Path $root $Output
$result | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 $outputPath
$result | ConvertTo-Json -Depth 5
if (-not $result.integrity_pass) { throw "Restore integrity comparison failed" }
