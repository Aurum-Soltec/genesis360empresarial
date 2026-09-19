begin;

-- Operational attempt history is append-only and contains metadata only.
create table public.outbox_attempts (
  id bigint generated always as identity primary key,
  event_id uuid not null references public.event_outbox(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  worker_id text not null,
  correlation_id text not null,
  attempt integer not null check (attempt > 0),
  result text not null check (result in ('processed','failed','dead')),
  duration_ms integer not null check (duration_ms >= 0),
  error_code text,
  recorded_at timestamptz not null default now()
);

create index outbox_attempts_tenant_time_idx
  on public.outbox_attempts(tenant_id, recorded_at desc);
create index outbox_attempts_event_idx on public.outbox_attempts(event_id, attempt);
alter table public.outbox_attempts enable row level security;
revoke all on public.outbox_attempts from anon, authenticated;
grant select, insert on public.outbox_attempts to service_role;

create or replace function public.reprocess_dead_event_outbox(
  p_tenant_id uuid,
  p_event_id uuid,
  p_actor_id uuid,
  p_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if length(trim(coalesce(p_reason, ''))) < 10 then
    raise exception 'REPROCESS_REASON_REQUIRED' using errcode = '23514';
  end if;
  if not exists (
    select 1 from public.memberships
    where tenant_id = p_tenant_id and user_id = p_actor_id and role in ('owner','admin')
  ) then
    raise exception 'REPROCESS_NOT_AUTHORIZED' using errcode = '42501';
  end if;

  update public.event_outbox
  set status = 'pending', attempts = 0, available_at = now(), leased_by = null,
      leased_until = null, processed_at = null, last_error = null
  where id = p_event_id and tenant_id = p_tenant_id and status = 'dead';
  if not found then
    raise exception 'DEAD_EVENT_NOT_FOUND' using errcode = 'P0002';
  end if;

  insert into public.audit_events(tenant_id, actor_id, action, resource_type, resource_id, metadata)
  values (p_tenant_id, p_actor_id, 'outbox.dead_reprocessed', 'event_outbox', p_event_id::text,
          jsonb_build_object('reason', left(p_reason, 500)));
end
$$;

revoke all on function public.reprocess_dead_event_outbox(uuid,uuid,uuid,text)
from public, anon, authenticated;
grant execute on function public.reprocess_dead_event_outbox(uuid,uuid,uuid,text) to service_role;

commit;
