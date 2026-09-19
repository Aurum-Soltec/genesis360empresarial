begin;

create type public.business_fact_source as enum
  ('declared', 'inferred', 'verified', 'imported');

create type public.business_fact_sensitivity as enum
  ('public', 'internal', 'personal', 'financial', 'restricted');

create table public.business_facts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  fact_key text not null,
  value jsonb not null,
  source public.business_fact_source not null,
  source_ref text,
  captured_at timestamptz not null default now(),
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  sensitivity public.business_fact_sensitivity not null default 'internal',
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending','verified','rejected','expired')),
  purpose_codes text[] not null default array['CORE_OPERATION']::text[],
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  supersedes_fact_id uuid references public.business_facts(id),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  constraint business_facts_valid_range check (valid_to is null or valid_to > valid_from)
);

create index business_facts_company_key_current_idx
  on public.business_facts(tenant_id, company_id, fact_key, valid_from desc)
  where valid_to is null;

create table public.business_timeline_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  event_type text not null,
  occurred_at timestamptz not null default now(),
  actor_type text not null check (actor_type in ('user','system','agent','integration')),
  actor_id text,
  subject_type text not null,
  subject_id text,
  payload jsonb not null default '{}'::jsonb,
  source_ref text,
  created_at timestamptz not null default now()
);

create index business_timeline_company_time_idx
  on public.business_timeline_events(tenant_id, company_id, occurred_at desc);

alter table public.business_facts enable row level security;
alter table public.business_timeline_events enable row level security;

create policy "business_facts_member_all"
on public.business_facts for all to authenticated
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create policy "business_timeline_member_all"
on public.business_timeline_events for all to authenticated
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

-- Prevent accidental cross-tenant company references even when IDs are known.
create or replace function public.enforce_company_tenant()
returns trigger language plpgsql set search_path = public as $$
declare company_tenant uuid;
begin
  select tenant_id into company_tenant from public.companies where id = new.company_id;
  if company_tenant is null or company_tenant <> new.tenant_id then
    raise exception 'COMPANY_TENANT_MISMATCH';
  end if;
  return new;
end $$;

create trigger business_facts_company_tenant_guard
before insert or update on public.business_facts
for each row execute function public.enforce_company_tenant();

create trigger business_timeline_company_tenant_guard
before insert or update on public.business_timeline_events
for each row execute function public.enforce_company_tenant();

commit;
