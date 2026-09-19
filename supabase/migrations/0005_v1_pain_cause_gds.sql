begin;

create table if not exists public.cause_hypotheses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  pain_finding_id uuid not null references public.pain_findings(id) on delete cascade,
  statement text not null,
  status text not null default 'hypothesis'
    check (status in ('hypothesis','supported','rejected','unknown')),
  confidence numeric(6,5) not null check (confidence between 0 and 1),
  evidence_refs jsonb not null default '[]'::jsonb,
  validation_plan jsonb not null default '[]'::jsonb,
  source_type text not null check (source_type in ('rule','agent','user')),
  source_version text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.decision_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  diagnostic_id uuid references public.diagnostics(id) on delete set null,
  pain_finding_id uuid references public.pain_findings(id) on delete set null,
  problem text not null,
  evidence_refs jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  cause_hypotheses jsonb not null default '[]'::jsonb,
  alternatives jsonb not null default '[]'::jsonb,
  recommendation jsonb not null default '{}'::jsonb,
  expected_impact jsonb not null default '{}'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  confidence numeric(6,5) not null check (confidence between 0 and 1),
  validation_plan jsonb not null default '[]'::jsonb,
  proposed_mission_code text,
  metric jsonb not null default '{}'::jsonb,
  source_type text not null check (source_type in ('rule','agent','hybrid')),
  source_version text not null,
  created_at timestamptz not null default now()
);

alter table public.cause_hypotheses enable row level security;
alter table public.decision_records enable row level security;

create policy "cause_hypotheses_member_all" on public.cause_hypotheses
for all to authenticated using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create policy "decision_records_member_all" on public.decision_records
for all to authenticated using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create trigger cause_hypotheses_company_tenant_guard
before insert or update on public.cause_hypotheses
for each row execute function public.enforce_company_tenant();

create trigger decision_records_company_tenant_guard
before insert or update on public.decision_records
for each row execute function public.enforce_company_tenant();

commit;
