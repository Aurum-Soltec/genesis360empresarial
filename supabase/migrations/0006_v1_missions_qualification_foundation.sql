begin;

create table public.mission_templates (
 id uuid primary key default gen_random_uuid(),
 code text not null,
 version integer not null default 1,
 domain text not null,
 title text not null,
 objective text not null,
 trigger_rules jsonb not null default '[]',
 prerequisites jsonb not null default '[]',
 steps jsonb not null default '[]',
 completion_criteria jsonb not null default '[]',
 evidence_requirements jsonb not null default '[]',
 expected_metric jsonb not null default '{}',
 risk_level text not null check (risk_level in ('low','medium','high')),
 effort text,
 applicable_segments jsonb not null default '[]',
 status text not null default 'draft' check(status in ('draft','published','retired')),
 created_at timestamptz not null default now(),
 unique(code,version)
);

create table public.missions (
 id uuid primary key default gen_random_uuid(),
 tenant_id uuid not null references public.tenants(id) on delete cascade,
 company_id uuid not null references public.companies(id) on delete cascade,
 template_id uuid not null references public.mission_templates(id),
 decision_record_id uuid references public.decision_records(id) on delete set null,
 status text not null default 'SUGGESTED'
  check(status in ('SUGGESTED','ACCEPTED','IN_PROGRESS','EVIDENCE_PENDING','COMPLETED','OUTCOME_PENDING','OUTCOME_RECORDED','PAUSED','BLOCKED','CANCELLED','EXPIRED')),
 personalized_payload jsonb not null default '{}',
 due_at timestamptz,
 accepted_at timestamptz,
 completed_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table public.mission_evidence (
 id uuid primary key default gen_random_uuid(),
 tenant_id uuid not null references public.tenants(id) on delete cascade,
 company_id uuid not null references public.companies(id) on delete cascade,
 mission_id uuid not null references public.missions(id) on delete cascade,
 evidence_type text not null check(evidence_type in ('declaration','document','integration','metric','link')),
 payload jsonb not null default '{}',
 verification_status text not null default 'unverified' check(verification_status in ('unverified','pending','verified','rejected')),
 created_at timestamptz not null default now()
);

create table public.mission_outcomes (
 id uuid primary key default gen_random_uuid(),
 tenant_id uuid not null references public.tenants(id) on delete cascade,
 company_id uuid not null references public.companies(id) on delete cascade,
 mission_id uuid not null references public.missions(id) on delete cascade,
 outcome_status text not null check(outcome_status in ('no_change','small_improvement','improved','significant_improvement','worsened','unknown')),
 before_value jsonb,
 after_value jsonb,
 metric_code text,
 source text not null check(source in ('declared','verified','imported')),
 confidence numeric(6,5) check(confidence between 0 and 1),
 recorded_at timestamptz not null default now()
);

create table public.capabilities (
 id uuid primary key default gen_random_uuid(),
 code text not null,
 version integer not null default 1,
 domain text not null,
 title text not null,
 description text,
 status text not null default 'published' check(status in ('draft','published','retired')),
 unique(code,version)
);

create table public.provider_capabilities (
 id uuid primary key default gen_random_uuid(),
 tenant_id uuid not null references public.tenants(id) on delete cascade,
 company_id uuid not null references public.companies(id) on delete cascade,
 capability_id uuid not null references public.capabilities(id),
 qualification_status text not null default 'pending' check(qualification_status in ('pending','qualified','suspended','expired','rejected')),
 qualification_score numeric(6,2),
 valid_until timestamptz,
 evidence_refs jsonb not null default '[]',
 service_regions jsonb not null default '[]',
 capacity_status text not null default 'unknown' check(capacity_status in ('available','limited','unavailable','unknown')),
 compliance_status text not null default 'pending' check(compliance_status in ('valid','pending','invalid')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(company_id,capability_id)
);

create table public.pain_capability_rules (
 id uuid primary key default gen_random_uuid(),
 pain_code text not null,
 capability_id uuid not null references public.capabilities(id),
 rule_version text not null,
 fit_weight numeric(6,5) not null default 1 check(fit_weight between 0 and 1),
 status text not null default 'published' check(status in ('draft','published','retired')),
 unique(pain_code,capability_id,rule_version)
);

alter table public.missions enable row level security;
alter table public.mission_evidence enable row level security;
alter table public.mission_outcomes enable row level security;
alter table public.provider_capabilities enable row level security;

create policy "missions_member_all" on public.missions for all to authenticated
 using(public.is_tenant_member(tenant_id)) with check(public.is_tenant_member(tenant_id));
create policy "mission_evidence_member_all" on public.mission_evidence for all to authenticated
 using(public.is_tenant_member(tenant_id)) with check(public.is_tenant_member(tenant_id));
create policy "mission_outcomes_member_all" on public.mission_outcomes for all to authenticated
 using(public.is_tenant_member(tenant_id)) with check(public.is_tenant_member(tenant_id));
create policy "provider_capabilities_member_all" on public.provider_capabilities for all to authenticated
 using(public.is_tenant_member(tenant_id)) with check(public.is_tenant_member(tenant_id));

create trigger missions_company_tenant_guard before insert or update on public.missions
 for each row execute function public.enforce_company_tenant();
create trigger mission_evidence_company_tenant_guard before insert or update on public.mission_evidence
 for each row execute function public.enforce_company_tenant();
create trigger mission_outcomes_company_tenant_guard before insert or update on public.mission_outcomes
 for each row execute function public.enforce_company_tenant();
create trigger provider_capabilities_company_tenant_guard before insert or update on public.provider_capabilities
 for each row execute function public.enforce_company_tenant();

commit;
