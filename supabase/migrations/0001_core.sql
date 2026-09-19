begin;

create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'active' check (status in ('active','suspended','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','manager','member','specialist','auditor')),
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  legal_name text,
  trade_name text not null,
  cnpj text,
  sector text,
  fictional boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consent_versions (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  version text not null,
  content_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(code, version)
);

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_version_id uuid not null references public.consent_versions(id),
  purpose text not null,
  granted boolean not null,
  granted_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostic_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  status text not null check (status in ('draft','published','retired')),
  content_hash text not null,
  published_at timestamptz
);

create table if not exists public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  diagnostic_version_id uuid not null references public.diagnostic_versions(id),
  status text not null default 'draft' check (status in ('draft','submitted','scored','archived')),
  coverage numeric(5,2),
  confidence numeric(5,2),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  question_id text not null,
  response jsonb not null,
  maturity smallint check (maturity between 0 and 4),
  confidence numeric(4,3) check (confidence between 0 and 1),
  evidence_status text not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(diagnostic_id, question_id)
);

create table if not exists public.score_results (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  dimension text not null,
  score smallint check (score between 0 and 100),
  coverage smallint not null check (coverage between 0 and 100),
  confidence smallint not null check (confidence between 0 and 100),
  rule_version text not null,
  explanation jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.tax_assessments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  diagnostic_id uuid references public.diagnostics(id) on delete set null,
  rule_version text not null,
  simulation boolean not null default true,
  classification text not null check (classification in ('priority_review','possible_fit','insufficient_data','not_prioritized')),
  factors jsonb not null default '[]'::jsonb,
  disclaimer_version text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  tax_assessment_id uuid references public.tax_assessments(id) on delete set null,
  partner_code text not null,
  status text not null default 'draft' check (status in ('draft','awaiting_consent','simulated','sent','received','closed')),
  simulation boolean not null default true,
  consent_id uuid references public.consents(id),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  tenant_id uuid,
  actor_id uuid,
  action text not null,
  resource_type text not null,
  resource_id text,
  request_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select m.tenant_id
  from public.memberships m
  where m.user_id = auth.uid()
  order by m.created_at asc
  limit 1
$$;

alter table public.tenants enable row level security;
alter table public.memberships enable row level security;
alter table public.companies enable row level security;
alter table public.consents enable row level security;
alter table public.diagnostics enable row level security;
alter table public.answers enable row level security;
alter table public.score_results enable row level security;
alter table public.tax_assessments enable row level security;
alter table public.referrals enable row level security;
alter table public.audit_events enable row level security;

create policy "memberships_self_select"
on public.memberships for select
to authenticated
using (user_id = auth.uid());

create policy "companies_tenant_all"
on public.companies for all
to authenticated
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "consents_tenant_all"
on public.consents for all
to authenticated
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "diagnostics_tenant_all"
on public.diagnostics for all
to authenticated
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "answers_tenant_all"
on public.answers for all
to authenticated
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "scores_tenant_select"
on public.score_results for select
to authenticated
using (tenant_id = public.current_tenant_id());

create policy "tax_tenant_all"
on public.tax_assessments for all
to authenticated
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "referrals_tenant_all"
on public.referrals for all
to authenticated
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "audit_tenant_select"
on public.audit_events for select
to authenticated
using (tenant_id = public.current_tenant_id());

commit;
