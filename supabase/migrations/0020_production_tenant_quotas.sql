begin;

create table public.tenant_operation_limits (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  operation text not null,
  window_seconds integer not null check (window_seconds between 1 and 86400),
  max_requests integer not null check (max_requests between 1 and 1000000),
  max_concurrency integer not null check (max_concurrency between 1 and 1000),
  primary key (tenant_id, operation)
);

create table public.tenant_rate_windows (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  operation text not null,
  window_started_at timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  primary key (tenant_id, operation, window_started_at)
);
create index tenant_rate_windows_cleanup_idx on public.tenant_rate_windows(window_started_at);

alter table public.tenant_operation_limits enable row level security;
alter table public.tenant_rate_windows enable row level security;
revoke all on public.tenant_operation_limits, public.tenant_rate_windows from anon, authenticated;

create or replace function public.consume_tenant_quota(
  p_tenant_id uuid,
  p_operation text,
  p_default_max_requests integer default 600,
  p_default_window_seconds integer default 60
)
returns table(allowed boolean, remaining integer, retry_after_seconds integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_max integer;
  v_window integer;
  v_start timestamptz;
  v_count integer;
begin
  if auth.uid() is null or not exists (
    select 1 from public.memberships m where m.tenant_id = p_tenant_id and m.user_id = auth.uid()
  ) then raise exception 'TENANT_ACCESS_DENIED' using errcode = '42501'; end if;
  if p_operation !~ '^[a-z0-9_.:-]{1,80}$' then
    raise exception 'INVALID_OPERATION' using errcode = '23514';
  end if;
  select l.max_requests, l.window_seconds into v_max, v_window
  from public.tenant_operation_limits l
  where l.tenant_id = p_tenant_id and l.operation = p_operation;
  v_max := coalesce(v_max, p_default_max_requests);
  v_window := coalesce(v_window, p_default_window_seconds);
  v_start := to_timestamp(floor(extract(epoch from clock_timestamp()) / v_window) * v_window);
  insert into public.tenant_rate_windows(tenant_id, operation, window_started_at, request_count)
  values (p_tenant_id, p_operation, v_start, 1)
  on conflict (tenant_id, operation, window_started_at)
  do update set request_count = public.tenant_rate_windows.request_count + 1
  returning request_count into v_count;
  return query select v_count <= v_max, greatest(0, v_max - v_count),
    case when v_count <= v_max then 0 else greatest(1, ceil(extract(epoch from (v_start + make_interval(secs => v_window) - clock_timestamp())))::integer) end;
end
$$;

revoke all on function public.consume_tenant_quota(uuid,text,integer,integer) from public, anon;
grant execute on function public.consume_tenant_quota(uuid,text,integer,integer) to authenticated;

-- Fair claiming caps each tenant contribution to a batch, avoiding worker starvation.
create or replace function public.claim_event_outbox(
  p_worker_id text,
  p_batch_size integer default 25,
  p_lease_seconds integer default 60
)
returns setof public.event_outbox
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_worker_id is null or length(trim(p_worker_id)) < 3 then raise exception 'INVALID_WORKER_ID'; end if;
  if p_batch_size < 1 or p_batch_size > 100 then raise exception 'INVALID_BATCH_SIZE'; end if;
  if p_lease_seconds < 10 or p_lease_seconds > 900 then raise exception 'INVALID_LEASE_SECONDS'; end if;
  return query
  with ranked as (
    select e.id, row_number() over (partition by e.tenant_id order by e.available_at, e.created_at) as tenant_rank
    from public.event_outbox e
    where ((e.status in ('pending','failed') and e.available_at <= now())
       or (e.status = 'processing' and e.leased_until < now()))
      and e.attempts < e.max_attempts
  ), due as (
    select e.id
    from public.event_outbox e join ranked r on r.id = e.id
    where r.tenant_rank <= 5
    order by e.available_at, e.created_at
    for update of e skip locked
    limit p_batch_size
  )
  update public.event_outbox e
  set status = 'processing', leased_by = p_worker_id,
      leased_until = now() + make_interval(secs => p_lease_seconds),
      attempts = e.attempts + 1
  from due where e.id = due.id returning e.*;
end
$$;

revoke all on function public.claim_event_outbox(text,integer,integer) from public, anon, authenticated;
grant execute on function public.claim_event_outbox(text,integer,integer) to service_role;

commit;
