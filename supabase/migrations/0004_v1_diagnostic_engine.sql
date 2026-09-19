begin;

alter table public.diagnostic_versions
  add column if not exists profile_code text not null default 'FULL',
  add column if not exists rules_version text not null default 'v1';

alter table public.diagnostics
  add column if not exists profile_code text not null default 'ESSENTIAL',
  add column if not exists started_at timestamptz not null default now(),
  add column if not exists last_saved_at timestamptz,
  add column if not exists question_path jsonb not null default '[]'::jsonb;

alter table public.answers
  add column if not exists answered_at timestamptz not null default now(),
  add column if not exists source text not null default 'declared',
  add column if not exists applicable boolean not null default true;

create table if not exists public.pain_findings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  dimension text not null,
  pain_code text not null,
  title text not null,
  severity numeric(6,5) not null check (severity between 0 and 1),
  confidence numeric(6,5) not null check (confidence between 0 and 1),
  evidence_refs jsonb not null default '[]'::jsonb,
  gap_summary text,
  rule_version text not null,
  created_at timestamptz not null default now()
);
create index if not exists pain_findings_diag_idx on public.pain_findings(tenant_id,diagnostic_id,severity desc);
alter table public.pain_findings enable row level security;
create policy "pain_findings_member_all" on public.pain_findings for all to authenticated
using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create trigger pain_findings_company_tenant_guard before insert or update on public.pain_findings
for each row execute function public.enforce_company_tenant();

commit;
