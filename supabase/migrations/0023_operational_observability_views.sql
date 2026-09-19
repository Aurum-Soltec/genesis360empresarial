begin;

create view public.outbox_operational_health
with (security_invoker = true)
as
select
  count(*) filter (where status in ('pending','failed')) as backlog,
  count(*) filter (where status = 'dead') as dead_jobs,
  count(*) filter (where status = 'processed' and processed_at >= now() - interval '5 minutes') as throughput_5m,
  coalesce(round(100.0 * count(*) filter (where status in ('failed','dead')) / nullif(count(*),0), 3),0) as failure_percent,
  coalesce((select percentile_cont(0.95) within group (order by duration_ms) from public.outbox_attempts where recorded_at >= now() - interval '1 hour'),0) as attempt_p95_ms
from public.event_outbox;

create view public.database_operational_health
with (security_invoker = true)
as
select datname,
  numbackends as connections,
  xact_commit,
  xact_rollback,
  blks_read,
  blks_hit,
  deadlocks,
  temp_bytes
from pg_catalog.pg_stat_database
where datname = current_database();

revoke all on public.outbox_operational_health, public.database_operational_health from public, anon, authenticated;
grant select on public.outbox_operational_health, public.database_operational_health to service_role;

commit;
