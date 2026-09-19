begin;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

-- RLS helper moved out of the exposed public schema.
create or replace function private.is_tenant_member(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships m
    where m.user_id = (select auth.uid())
      and m.tenant_id = target_tenant_id
  )
$$;

revoke all on function private.is_tenant_member(uuid) from public, anon;
grant execute on function private.is_tenant_member(uuid) to authenticated, service_role;

create index if not exists memberships_user_tenant_idx
  on public.memberships(user_id, tenant_id);

-- Keep the old helper only as a compatibility shim during this migration window.
create or replace function public.is_tenant_member(target_tenant_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_tenant_member(target_tenant_id)
$$;
revoke all on function public.is_tenant_member(uuid) from public, anon, authenticated;
grant execute on function public.is_tenant_member(uuid) to service_role;

-- Company/tenant invariant, including nullable company_id tables such as consents.
create or replace function public.enforce_company_tenant()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  company_tenant uuid;
begin
  if new.company_id is null then
    return new;
  end if;

  select c.tenant_id into company_tenant
  from public.companies c
  where c.id = new.company_id;

  if company_tenant is null or company_tenant <> new.tenant_id then
    raise exception 'COMPANY_TENANT_MISMATCH' using errcode = '23514';
  end if;
  return new;
end
$$;
revoke all on function public.enforce_company_tenant() from public, anon, authenticated;

-- Add missing company/tenant guards to legacy company-scoped tables.
drop trigger if exists diagnostics_company_tenant_guard on public.diagnostics;
create trigger diagnostics_company_tenant_guard
before insert or update on public.diagnostics
for each row execute function public.enforce_company_tenant();

drop trigger if exists consents_company_tenant_guard on public.consents;
create trigger consents_company_tenant_guard
before insert or update on public.consents
for each row execute function public.enforce_company_tenant();

drop trigger if exists tax_company_tenant_guard on public.tax_assessments;
create trigger tax_company_tenant_guard
before insert or update on public.tax_assessments
for each row execute function public.enforce_company_tenant();

drop trigger if exists referrals_company_tenant_guard on public.referrals;
create trigger referrals_company_tenant_guard
before insert or update on public.referrals
for each row execute function public.enforce_company_tenant();

-- One current Business Fact per company/key. Duplicate currents fail the migration,
-- forcing explicit reconciliation instead of silent data loss.
drop index if exists public.business_facts_company_key_current_idx;
create unique index business_facts_company_key_current_uidx
  on public.business_facts(tenant_id, company_id, fact_key)
  where valid_to is null;

create unique index if not exists score_results_diag_dimension_rule_uidx
  on public.score_results(diagnostic_id, dimension, rule_version);

create unique index if not exists pain_findings_diag_code_rule_uidx
  on public.pain_findings(diagnostic_id, pain_code, rule_version);

-- Global/configuration tables are readable but not client-writable.
alter table public.consent_versions enable row level security;
alter table public.diagnostic_versions enable row level security;
alter table public.mission_templates enable row level security;
alter table public.capabilities enable row level security;
alter table public.pain_capability_rules enable row level security;

drop policy if exists "consent_versions_authenticated_select" on public.consent_versions;
create policy "consent_versions_authenticated_select"
on public.consent_versions for select to authenticated using (true);

drop policy if exists "diagnostic_versions_authenticated_select" on public.diagnostic_versions;
create policy "diagnostic_versions_authenticated_select"
on public.diagnostic_versions for select to authenticated using (status = 'published');

drop policy if exists "mission_templates_authenticated_select" on public.mission_templates;
create policy "mission_templates_authenticated_select"
on public.mission_templates for select to authenticated using (status = 'published');

drop policy if exists "capabilities_authenticated_select" on public.capabilities;
create policy "capabilities_authenticated_select"
on public.capabilities for select to authenticated using (status = 'published');

drop policy if exists "pain_capability_rules_authenticated_select" on public.pain_capability_rules;
create policy "pain_capability_rules_authenticated_select"
on public.pain_capability_rules for select to authenticated using (status = 'published');

drop policy if exists "tenants_member_select" on public.tenants;
create policy "tenants_member_select"
on public.tenants for select to authenticated
using ((select private.is_tenant_member(id)));

-- Replace tenant policies so they call the private helper.
drop policy if exists "companies_member_all" on public.companies;
create policy "companies_member_all" on public.companies for all to authenticated
using ((select private.is_tenant_member(tenant_id)))
with check ((select private.is_tenant_member(tenant_id)));

drop policy if exists "consents_member_all" on public.consents;
create policy "consents_member_select" on public.consents for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "diagnostics_member_all" on public.diagnostics;
create policy "diagnostics_member_select" on public.diagnostics for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "answers_member_all" on public.answers;
create policy "answers_member_select" on public.answers for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "scores_member_select" on public.score_results;
create policy "scores_member_select" on public.score_results for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "tax_member_all" on public.tax_assessments;
create policy "tax_member_select" on public.tax_assessments for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "referrals_member_all" on public.referrals;
create policy "referrals_member_select" on public.referrals for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "audit_member_select" on public.audit_events;
create policy "audit_member_select" on public.audit_events for select to authenticated
using (tenant_id is not null and (select private.is_tenant_member(tenant_id)));

drop policy if exists "business_facts_member_all" on public.business_facts;
create policy "business_facts_member_select" on public.business_facts for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "business_timeline_member_all" on public.business_timeline_events;
create policy "business_timeline_member_select" on public.business_timeline_events for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "pain_findings_member_all" on public.pain_findings;
create policy "pain_findings_member_select" on public.pain_findings for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "cause_hypotheses_member_all" on public.cause_hypotheses;
create policy "cause_hypotheses_member_select" on public.cause_hypotheses for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "decision_records_member_all" on public.decision_records;
create policy "decision_records_member_select" on public.decision_records for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "missions_member_all" on public.missions;
create policy "missions_member_select" on public.missions for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "mission_evidence_member_all" on public.mission_evidence;
create policy "mission_evidence_member_select" on public.mission_evidence for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "mission_outcomes_member_all" on public.mission_outcomes;
create policy "mission_outcomes_member_select" on public.mission_outcomes for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

drop policy if exists "provider_capabilities_member_all" on public.provider_capabilities;
create policy "provider_capabilities_member_select" on public.provider_capabilities for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

-- Explicit grants. Derived/controlled records are read-only through the public Data API.
revoke all on table
  public.tenants, public.memberships, public.companies, public.consent_versions,
  public.consents, public.consent_purposes, public.diagnostic_versions,
  public.diagnostics, public.answers, public.score_results, public.tax_assessments,
  public.referrals, public.audit_events, public.business_facts,
  public.business_timeline_events, public.pain_findings, public.cause_hypotheses,
  public.decision_records, public.mission_templates, public.missions,
  public.mission_evidence, public.mission_outcomes, public.capabilities,
  public.provider_capabilities, public.pain_capability_rules
from anon, authenticated;

grant select on public.tenants, public.memberships, public.consent_versions,
  public.consent_purposes, public.diagnostic_versions, public.score_results,
  public.tax_assessments, public.referrals, public.audit_events,
  public.business_facts, public.business_timeline_events, public.pain_findings,
  public.cause_hypotheses, public.decision_records, public.mission_templates,
  public.missions, public.mission_evidence, public.mission_outcomes,
  public.capabilities, public.provider_capabilities, public.pain_capability_rules
to authenticated;

grant select, insert, update on public.companies to authenticated;
grant select on public.diagnostics, public.answers to authenticated;

-- Canonical diagnostic version is migration-owned; users only read it.
insert into public.diagnostic_versions(version, status, content_hash, published_at, profile_code, rules_version)
values ('3.0', 'published', 'a74de7ffa3c182be1ff3402bfcd88a7e98736754e1868cfbb190e90562e18a5a', now(), 'FULL', 'v1')
on conflict (version) do update
set status = 'published',
    content_hash = excluded.content_hash,
    rules_version = excluded.rules_version;

-- Evidence Ledger: observation/evidence exists before it can support a fact or decision.
create table public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  evidence_type text not null
    check (evidence_type in ('user_declaration','document','metric','integration','observation','agent_output')),
  source_ref text,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  confidence numeric(6,5) check (confidence is null or confidence between 0 and 1),
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending','verified','rejected','expired')),
  sensitivity text not null default 'internal'
    check (sensitivity in ('public','internal','personal','financial','restricted')),
  purpose_codes text[] not null default array['CORE_OPERATION']::text[],
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.evidence_links (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  evidence_id uuid not null references public.evidence_items(id) on delete cascade,
  subject_type text not null
    check (subject_type in ('business_fact','diagnostic','pain_finding','cause_hypothesis','decision_record','mission','provider_capability')),
  subject_id uuid not null,
  relation text not null
    check (relation in ('supports','contradicts','context_for','verifies')),
  created_at timestamptz not null default now(),
  unique(evidence_id, subject_type, subject_id, relation)
);

create index evidence_items_company_time_idx
  on public.evidence_items(tenant_id, company_id, captured_at desc);
create index evidence_links_subject_idx
  on public.evidence_links(tenant_id, subject_type, subject_id);

alter table public.evidence_items enable row level security;
alter table public.evidence_links enable row level security;

create policy "evidence_items_member_select" on public.evidence_items for select to authenticated
using ((select private.is_tenant_member(tenant_id)));
create policy "evidence_links_member_select" on public.evidence_links for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

revoke all on public.evidence_items, public.evidence_links from anon, authenticated;
grant select on public.evidence_items, public.evidence_links to authenticated;

create trigger evidence_items_company_tenant_guard
before insert or update on public.evidence_items
for each row execute function public.enforce_company_tenant();
create trigger evidence_links_company_tenant_guard
before insert or update on public.evidence_links
for each row execute function public.enforce_company_tenant();

-- Durable outbox. It contains operational metadata only; never store full sensitive documents.
create table public.event_outbox (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  event_type text not null,
  aggregate_type text not null,
  aggregate_id uuid not null,
  idempotency_key text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending','processing','processed','failed','dead')),
  attempts integer not null default 0 check (attempts >= 0),
  max_attempts integer not null default 8 check (max_attempts between 1 and 100),
  available_at timestamptz not null default now(),
  leased_by text,
  leased_until timestamptz,
  processed_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  unique(tenant_id, idempotency_key)
);

create index event_outbox_due_idx
  on public.event_outbox(status, available_at, created_at)
  where status in ('pending','failed');
create index event_outbox_tenant_idx on public.event_outbox(tenant_id, created_at desc);

alter table public.event_outbox enable row level security;
revoke all on public.event_outbox from anon, authenticated;

create trigger event_outbox_company_tenant_guard
before insert or update on public.event_outbox
for each row execute function public.enforce_company_tenant();

-- Service-role-only atomic leasing. No network call is performed from a DB trigger.
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
  if p_worker_id is null or length(trim(p_worker_id)) < 3 then
    raise exception 'INVALID_WORKER_ID';
  end if;
  if p_batch_size < 1 or p_batch_size > 100 then
    raise exception 'INVALID_BATCH_SIZE';
  end if;
  if p_lease_seconds < 10 or p_lease_seconds > 900 then
    raise exception 'INVALID_LEASE_SECONDS';
  end if;

  return query
  with due as (
    select e.id
    from public.event_outbox e
    where (
      (
        e.status in ('pending','failed')
        and e.available_at <= now()
      )
      or (
        e.status = 'processing'
        and e.leased_until < now()
      )
    )
    and e.attempts < e.max_attempts
    order by e.available_at, e.created_at
    for update skip locked
    limit p_batch_size
  )
  update public.event_outbox e
  set status = 'processing',
      leased_by = p_worker_id,
      leased_until = now() + make_interval(secs => p_lease_seconds),
      attempts = e.attempts + 1
  from due
  where e.id = due.id
  returning e.*;
end
$$;

revoke all on function public.claim_event_outbox(text, integer, integer)
from public, anon, authenticated;
grant execute on function public.claim_event_outbox(text, integer, integer)
to service_role;

-- Lightweight transactional event emitter: metadata only.
create or replace function private.emit_domain_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_json jsonb;
  v_tenant uuid;
  v_company uuid;
  v_id uuid;
  v_status text;
  v_stamp text;
  v_event text := tg_argv[0];
begin
  row_json := to_jsonb(new);
  v_tenant := (row_json ->> 'tenant_id')::uuid;
  v_company := nullif(row_json ->> 'company_id','')::uuid;
  v_id := (row_json ->> 'id')::uuid;
  v_status := coalesce(row_json ->> 'status', row_json ->> 'qualification_status', row_json ->> 'outcome_status');
  v_stamp := coalesce(row_json ->> 'updated_at', row_json ->> 'recorded_at', row_json ->> 'created_at', now()::text);

  if tg_op = 'UPDATE' and (to_jsonb(old) ->> 'status') is not distinct from (row_json ->> 'status')
     and (to_jsonb(old) ->> 'qualification_status') is not distinct from (row_json ->> 'qualification_status') then
    return new;
  end if;

  insert into public.event_outbox(
    tenant_id, company_id, event_type, aggregate_type, aggregate_id, idempotency_key, payload
  )
  values (
    v_tenant, v_company, v_event, tg_table_name, v_id,
    v_event || ':' || v_id::text || ':' || v_stamp,
    jsonb_strip_nulls(jsonb_build_object('status', v_status))
  )
  on conflict (tenant_id, idempotency_key) do nothing;

  return new;
end
$$;
revoke all on function private.emit_domain_event() from public, anon, authenticated;

create trigger business_fact_outbox
after insert on public.business_facts
for each row execute function private.emit_domain_event('passport.fact.created');

create trigger diagnostic_status_outbox
after update of status on public.diagnostics
for each row execute function private.emit_domain_event('diagnostic.status.changed');

create trigger decision_record_outbox
after insert on public.decision_records
for each row execute function private.emit_domain_event('decision.created');

create trigger mission_created_outbox
after insert on public.missions
for each row execute function private.emit_domain_event('mission.created');

create trigger mission_status_outbox
after update of status on public.missions
for each row execute function private.emit_domain_event('mission.status.changed');

create trigger mission_outcome_outbox
after insert on public.mission_outcomes
for each row execute function private.emit_domain_event('mission.outcome.recorded');

create trigger provider_qualification_outbox
after update of qualification_status on public.provider_capabilities
for each row execute function private.emit_domain_event('provider.qualification.changed');

-- Mission state machine is enforced in the DB as well as TypeScript.
create or replace function private.enforce_mission_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = old.status then
    return new;
  end if;

  if not (
    (old.status = 'SUGGESTED' and new.status in ('ACCEPTED','CANCELLED','EXPIRED')) or
    (old.status = 'ACCEPTED' and new.status in ('IN_PROGRESS','PAUSED','CANCELLED')) or
    (old.status = 'IN_PROGRESS' and new.status in ('EVIDENCE_PENDING','COMPLETED','PAUSED','BLOCKED','CANCELLED')) or
    (old.status = 'EVIDENCE_PENDING' and new.status in ('COMPLETED','IN_PROGRESS','BLOCKED')) or
    (old.status = 'COMPLETED' and new.status = 'OUTCOME_PENDING') or
    (old.status = 'OUTCOME_PENDING' and new.status = 'OUTCOME_RECORDED') or
    (old.status = 'PAUSED' and new.status in ('IN_PROGRESS','CANCELLED','EXPIRED')) or
    (old.status = 'BLOCKED' and new.status in ('IN_PROGRESS','CANCELLED','EXPIRED'))
  ) then
    raise exception 'INVALID_MISSION_TRANSITION:%->%', old.status, new.status
      using errcode = '23514';
  end if;

  return new;
end
$$;

revoke all on function private.enforce_mission_transition() from public, anon, authenticated;

drop trigger if exists missions_transition_guard on public.missions;
create trigger missions_transition_guard
before update of status on public.missions
for each row execute function private.enforce_mission_transition();


-- Atomic Business Fact versioning. Only the trusted server/service role may call it.
create or replace function public.record_business_fact(
  p_tenant_id uuid,
  p_company_id uuid,
  p_fact_key text,
  p_value jsonb,
  p_source text,
  p_source_ref text default null,
  p_confidence numeric default null,
  p_sensitivity text default 'internal',
  p_purpose_codes text[] default array['CORE_OPERATION']::text[],
  p_created_by uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current_id uuid;
  v_new_id uuid;
  v_now timestamptz := now();
begin
  if not exists (
    select 1 from public.companies c
    where c.id = p_company_id and c.tenant_id = p_tenant_id
  ) then
    raise exception 'COMPANY_TENANT_MISMATCH' using errcode = '23514';
  end if;

  if p_fact_key is null or p_fact_key !~ '^[a-z0-9_.-]{2,120}$' then
    raise exception 'INVALID_FACT_KEY' using errcode = '23514';
  end if;

  select bf.id into v_current_id
  from public.business_facts bf
  where bf.tenant_id = p_tenant_id
    and bf.company_id = p_company_id
    and bf.fact_key = p_fact_key
    and bf.valid_to is null
  for update;

  if v_current_id is not null then
    update public.business_facts
    set valid_to = v_now
    where id = v_current_id;
  end if;

  insert into public.business_facts(
    tenant_id, company_id, fact_key, value, source, source_ref, captured_at,
    confidence, sensitivity, verification_status, purpose_codes, valid_from,
    supersedes_fact_id, created_by
  )
  values (
    p_tenant_id, p_company_id, p_fact_key, p_value,
    p_source::public.business_fact_source, p_source_ref, v_now,
    p_confidence, p_sensitivity::public.business_fact_sensitivity,
    case when p_source = 'verified' then 'verified' else 'unverified' end,
    p_purpose_codes, v_now, v_current_id, p_created_by
  )
  returning id into v_new_id;

  insert into public.business_timeline_events(
    tenant_id, company_id, event_type, occurred_at, actor_type, actor_id,
    subject_type, subject_id, payload, source_ref
  )
  values (
    p_tenant_id, p_company_id,
    case when v_current_id is null then 'passport.fact.created' else 'passport.fact.updated' end,
    v_now, 'user', p_created_by::text, 'business_fact', v_new_id::text,
    jsonb_build_object('factKey', p_fact_key, 'source', p_source), p_source_ref
  );

  return v_new_id;
end
$$;
revoke all on function public.record_business_fact(
  uuid, uuid, text, jsonb, text, text, numeric, text, text[], uuid
) from public, anon, authenticated;
grant execute on function public.record_business_fact(
  uuid, uuid, text, jsonb, text, text, numeric, text, text[], uuid
) to service_role;

-- Atomic Evidence Ledger write + optional link.
create or replace function public.record_evidence(
  p_tenant_id uuid,
  p_company_id uuid,
  p_evidence_type text,
  p_summary text,
  p_payload jsonb default '{}'::jsonb,
  p_source_ref text default null,
  p_confidence numeric default null,
  p_sensitivity text default 'internal',
  p_purpose_codes text[] default array['CORE_OPERATION']::text[],
  p_created_by uuid default null,
  p_subject_type text default null,
  p_subject_id uuid default null,
  p_relation text default 'supports'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if not exists (
    select 1 from public.companies c
    where c.id = p_company_id and c.tenant_id = p_tenant_id
  ) then
    raise exception 'COMPANY_TENANT_MISMATCH' using errcode = '23514';
  end if;

  insert into public.evidence_items(
    tenant_id, company_id, evidence_type, source_ref, summary, payload,
    confidence, sensitivity, purpose_codes, created_by
  )
  values (
    p_tenant_id, p_company_id, p_evidence_type, p_source_ref, p_summary, p_payload,
    p_confidence, p_sensitivity, p_purpose_codes, p_created_by
  )
  returning id into v_id;

  if p_subject_type is not null or p_subject_id is not null then
    if p_subject_type is null or p_subject_id is null then
      raise exception 'EVIDENCE_LINK_INCOMPLETE' using errcode = '23514';
    end if;
    insert into public.evidence_links(
      tenant_id, company_id, evidence_id, subject_type, subject_id, relation
    ) values (
      p_tenant_id, p_company_id, v_id, p_subject_type, p_subject_id, p_relation
    );
  end if;

  return v_id;
end
$$;
revoke all on function public.record_evidence(
  uuid, uuid, text, text, jsonb, text, numeric, text, text[], uuid, text, uuid, text
) from public, anon, authenticated;
grant execute on function public.record_evidence(
  uuid, uuid, text, text, jsonb, text, numeric, text, text[], uuid, text, uuid, text
) to service_role;

-- Atomic persistence for a deterministic diagnostic result computed in the trusted app.
create or replace function public.persist_diagnostic_result(
  p_tenant_id uuid,
  p_diagnostic_id uuid,
  p_scores jsonb,
  p_pains jsonb,
  p_coverage integer,
  p_confidence integer,
  p_rule_version text default 'v1'
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_company_id uuid;
  v_now timestamptz := now();
begin
  select d.company_id into v_company_id
  from public.diagnostics d
  where d.id = p_diagnostic_id and d.tenant_id = p_tenant_id
  for update;

  if v_company_id is null then
    raise exception 'DIAGNOSTIC_NOT_FOUND' using errcode = 'P0002';
  end if;

  delete from public.score_results
  where diagnostic_id = p_diagnostic_id and tenant_id = p_tenant_id;

  insert into public.score_results(
    tenant_id, diagnostic_id, dimension, score, coverage, confidence, rule_version, explanation
  )
  select
    p_tenant_id, p_diagnostic_id, x.dimension, x.score, x.coverage, x.confidence,
    p_rule_version, jsonb_build_object('deterministic', true)
  from jsonb_to_recordset(p_scores) as x(
    dimension text, score integer, coverage integer, confidence integer
  );

  delete from public.pain_findings
  where diagnostic_id = p_diagnostic_id and tenant_id = p_tenant_id;

  insert into public.pain_findings(
    tenant_id, company_id, diagnostic_id, dimension, pain_code, title,
    severity, confidence, gap_summary, rule_version
  )
  select
    p_tenant_id, v_company_id, p_diagnostic_id, x.dimension, x.pain_code, x.title,
    x.severity, x.confidence, x.gap_summary, p_rule_version
  from jsonb_to_recordset(p_pains) as x(
    dimension text, pain_code text, title text, severity numeric,
    confidence numeric, gap_summary text
  );

  update public.diagnostics
  set status = 'scored',
      coverage = p_coverage,
      confidence = p_confidence,
      submitted_at = v_now,
      updated_at = v_now
  where id = p_diagnostic_id and tenant_id = p_tenant_id;
end
$$;
revoke all on function public.persist_diagnostic_result(
  uuid, uuid, jsonb, jsonb, integer, integer, text
) from public, anon, authenticated;
grant execute on function public.persist_diagnostic_result(
  uuid, uuid, jsonb, jsonb, integer, integer, text
) to service_role;


commit;
