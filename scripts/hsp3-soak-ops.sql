-- Read-only operator query after the 60-minute run. Supply run_id through psql
-- (-v run_id=<12-hex-run-id>). Do not place DATABASE_URL or credentials in logs.
-- Correlates only synthetic Passport facts and outbox events from this exact run.
\set ON_ERROR_STOP on
with facts as (
  select id from public.business_facts
  where source_ref = 'HSP3:' || :'run_id'
), events as (
  select e.status, e.attempts, e.created_at, e.processed_at, e.id
  from public.event_outbox e
  join facts f on f.id = e.aggregate_id
  where e.aggregate_type = 'business_facts'
    and e.event_type = 'passport.fact.created'
), attempts as (
  select a.duration_ms from public.outbox_attempts a
  join events e on e.id = a.event_id
)
select jsonb_build_object(
  'factRowsMatched', (select count(*) from facts),
  'matchedFactEvents', (select count(*) from events),
  'processedFactEvents', (select count(*) from events where status = 'processed'),
  'deadFactEvents', (select count(*) from events where status = 'dead'),
  'pendingFactEvents', (select count(*) from events where status in ('pending','processing','failed')),
  'workerRetries', (select coalesce(sum(greatest(attempts - 1, 0)), 0) from events),
  'workerLatencyP95Ms', (select round(percentile_cont(0.95) within group
    (order by extract(epoch from (processed_at - created_at)) * 1000)::numeric, 2)
    from events where processed_at is not null),
  'attemptP95Ms', (select round(percentile_cont(0.95) within group
    (order by duration_ms)::numeric, 2) from attempts)
);
