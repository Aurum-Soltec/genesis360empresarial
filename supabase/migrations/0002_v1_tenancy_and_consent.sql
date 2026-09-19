begin;

-- V1-ST-003/004: authorization is membership-based. The active tenant is an
-- explicit application context; RLS independently proves membership on each row.
drop policy if exists "companies_tenant_all" on public.companies;
drop policy if exists "consents_tenant_all" on public.consents;
drop policy if exists "diagnostics_tenant_all" on public.diagnostics;
drop policy if exists "answers_tenant_all" on public.answers;
drop policy if exists "scores_tenant_select" on public.score_results;
drop policy if exists "tax_tenant_all" on public.tax_assessments;
drop policy if exists "referrals_tenant_all" on public.referrals;
drop policy if exists "audit_tenant_select" on public.audit_events;

create or replace function public.is_tenant_member(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memberships m
    where m.user_id = auth.uid()
      and m.tenant_id = target_tenant_id
  )
$$;

revoke all on function public.is_tenant_member(uuid) from public;
grant execute on function public.is_tenant_member(uuid) to authenticated;

create policy "companies_member_all"
on public.companies for all to authenticated
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create policy "consents_member_all"
on public.consents for all to authenticated
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create policy "diagnostics_member_all"
on public.diagnostics for all to authenticated
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create policy "answers_member_all"
on public.answers for all to authenticated
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create policy "scores_member_select"
on public.score_results for select to authenticated
using (public.is_tenant_member(tenant_id));

create policy "tax_member_all"
on public.tax_assessments for all to authenticated
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create policy "referrals_member_all"
on public.referrals for all to authenticated
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create policy "audit_member_select"
on public.audit_events for select to authenticated
using (tenant_id is not null and public.is_tenant_member(tenant_id));

-- V1-ST-005: purposes are explicit, versioned and revocable.
create table if not exists public.consent_purposes (
  code text primary key,
  description text not null,
  required_for_core boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.consent_purposes enable row level security;

create policy "consent_purposes_authenticated_select"
on public.consent_purposes for select to authenticated
using (active = true);

alter table public.consents
  add column if not exists purpose_code text references public.consent_purposes(code),
  add column if not exists decision_at timestamptz;

insert into public.consent_purposes(code, description, required_for_core)
values
  ('CORE_OPERATION', 'Processamento necessário para operar o Genesis 360.', true),
  ('AI_PROCESSING', 'Uso de dados autorizados como contexto para recursos de inteligência artificial.', false),
  ('QUALIFIED_MATCHING', 'Uso de dados para identificar soluções qualificadas e solicitar contato.', false),
  ('ECOSYSTEM_ANALYTICS', 'Uso autorizado em inteligência agregada do ecossistema.', false),
  ('BENCHMARK_ANALYTICS', 'Uso autorizado em benchmarks e análises agregadas quando elegíveis.', false)
on conflict (code) do update
set description = excluded.description,
    required_for_core = excluded.required_for_core,
    active = true;

update public.consents
set purpose_code = case
  when purpose = 'DIAGNOSTIC_PROCESSING' then 'CORE_OPERATION'
  when purpose = 'UNIQUE_REFERRAL' then 'QUALIFIED_MATCHING'
  else null
end
where purpose_code is null;

-- Keep legacy `purpose` during the compatibility window. New writes must use
-- purpose_code; removal requires a later migration after application cutover.
create index if not exists consents_tenant_user_purpose_idx
  on public.consents(tenant_id, user_id, purpose_code, created_at desc);

commit;
