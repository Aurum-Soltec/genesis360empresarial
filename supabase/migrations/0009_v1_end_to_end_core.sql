begin;

-- -------------------------------------------------------------------------
-- Commercial plan catalog.
-- Provider-network eligibility is deliberately FALSE until PEND-004 is
-- explicitly approved; higher price never buys ranking.
-- -------------------------------------------------------------------------
create table public.plan_catalog (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  monthly_price_brl numeric(10,2) not null check (monthly_price_brl >= 0),
  contract_months integer not null check (contract_months >= 0),
  provider_network_eligible boolean not null default false,
  entitlements jsonb not null default '{}'::jsonb,
  status text not null default 'published'
    check (status in ('draft','published','retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.plan_catalog(
  code, name, monthly_price_brl, contract_months,
  provider_network_eligible, entitlements, status
)
values
  (
    'FREE', 'Genesis Free', 0, 0, false,
    '{"diagnostic":"essential","passport":"basic","human_accompaniment":false}'::jsonb,
    'published'
  ),
  (
    'START', 'Genesis Start', 99, 12, false,
    '{"diagnostic":"full","passport":"evolving","missions":true,"human_accompaniment":false}'::jsonb,
    'published'
  ),
  (
    'PRO', 'Genesis Pro', 297, 12, false,
    '{"diagnostic":"continuous","passport":"advanced","missions":true,"council":"higher_budget","human_accompaniment":false}'::jsonb,
    'published'
  )
on conflict (code) do update
set name = excluded.name,
    monthly_price_brl = excluded.monthly_price_brl,
    contract_months = excluded.contract_months,
    entitlements = excluded.entitlements,
    updated_at = now();

create table public.tenant_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  plan_id uuid not null references public.plan_catalog(id),
  status text not null
    check (status in ('trialing','active','past_due','canceled','expired')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

create unique index tenant_subscriptions_one_current_uidx
  on public.tenant_subscriptions(tenant_id)
  where status in ('trialing','active','past_due');

alter table public.plan_catalog enable row level security;
alter table public.tenant_subscriptions enable row level security;

create policy "plan_catalog_authenticated_select"
on public.plan_catalog for select to authenticated
using (status = 'published');

create policy "tenant_subscriptions_member_select"
on public.tenant_subscriptions for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

revoke all on public.plan_catalog, public.tenant_subscriptions from anon, authenticated;
grant select on public.plan_catalog, public.tenant_subscriptions to authenticated;


-- Consent decisions are user-specific. Tenant membership alone must not expose
-- another user's consent history through the public Data API.
drop policy if exists "consents_member_select" on public.consents;
create policy "consents_own_user_select"
on public.consents for select to authenticated
using (
  tenant_id is not null
  and (select private.is_tenant_member(tenant_id))
  and user_id = (select auth.uid())
);

-- -------------------------------------------------------------------------
-- Qualification policy is versioned and fail-closed. No active policy is
-- published until thresholds are methodologically approved.
-- -------------------------------------------------------------------------
create table public.provider_network_policies (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  minimum_qualification_score numeric(6,2)
    check (
      minimum_qualification_score is null
      or minimum_qualification_score between 0 and 100
    ),
  require_compliance boolean not null default true,
  require_capacity boolean not null default true,
  ranking_weights jsonb not null default
    '{"fit":0.45,"qualification":0.25,"outcomes":0.20,"capacity":0.10}'::jsonb,
  status text not null default 'draft'
    check (status in ('draft','published','retired')),
  created_at timestamptz not null default now()
);

insert into public.provider_network_policies(
  version, minimum_qualification_score, require_compliance,
  require_capacity, status
)
values ('v1-draft', null, true, true, 'draft')
on conflict (version) do nothing;

create unique index provider_network_one_published_uidx
  on public.provider_network_policies((1))
  where status = 'published';

alter table public.provider_network_policies enable row level security;
create policy "provider_network_policies_authenticated_select"
on public.provider_network_policies for select to authenticated
using (status = 'published');

revoke all on public.provider_network_policies from anon, authenticated;
grant select on public.provider_network_policies to authenticated;

-- -------------------------------------------------------------------------
-- Decision / Mission / Capability bridge.
-- -------------------------------------------------------------------------
create table public.mission_capability_requirements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  capability_id uuid not null references public.capabilities(id),
  fit_weight numeric(6,5) not null default 1 check (fit_weight between 0 and 1),
  source_type text not null check (source_type in ('pain_rule','decision','admin')),
  source_ref text,
  created_at timestamptz not null default now(),
  unique(mission_id, capability_id)
);

alter table public.mission_capability_requirements enable row level security;
create policy "mission_capability_member_select"
on public.mission_capability_requirements for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

revoke all on public.mission_capability_requirements from anon, authenticated;
grant select on public.mission_capability_requirements to authenticated;

create trigger mission_capability_company_tenant_guard
before insert or update on public.mission_capability_requirements
for each row execute function public.enforce_company_tenant();

create unique index if not exists provider_capabilities_tenant_company_id_uidx
  on public.provider_capabilities(tenant_id, company_id, id);

create unique index if not exists mission_capability_tenant_company_id_uidx
  on public.mission_capability_requirements(tenant_id, company_id, id);

alter table public.mission_capability_requirements
  add constraint mission_capability_same_company_fk
  foreign key (tenant_id, company_id, mission_id)
  references public.missions(tenant_id, company_id, id)
  on delete cascade;

-- -------------------------------------------------------------------------
-- Contact requests are never exposed directly through PostgREST.
-- Cross-tenant disclosure happens only through a trusted Genesis API.
-- -------------------------------------------------------------------------
create unique index if not exists companies_tenant_id_uidx
  on public.companies(tenant_id, id);

create table public.solution_contact_requests (
  id uuid primary key default gen_random_uuid(),
  consumer_tenant_id uuid not null references public.tenants(id) on delete cascade,
  consumer_company_id uuid not null references public.companies(id) on delete cascade,
  provider_tenant_id uuid not null references public.tenants(id) on delete cascade,
  provider_company_id uuid not null references public.companies(id) on delete cascade,
  provider_capability_id uuid not null references public.provider_capabilities(id),
  pain_finding_id uuid not null references public.pain_findings(id),
  capability_id uuid not null references public.capabilities(id),
  consumer_consent_id uuid not null references public.consents(id),
  status text not null default 'REQUESTED'
    check (status in ('REQUESTED','ACCEPTED','DECLINED','SHARED','CLOSED','CANCELLED')),
  match_snapshot jsonb not null default '{}'::jsonb,
  requested_by uuid references auth.users(id),
  requested_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index solution_contact_consumer_idx
  on public.solution_contact_requests(consumer_tenant_id, requested_at desc);
create index solution_contact_provider_idx
  on public.solution_contact_requests(provider_tenant_id, requested_at desc);

create unique index solution_contact_one_open_uidx
  on public.solution_contact_requests(
    consumer_company_id, pain_finding_id, provider_capability_id
  )
  where status in ('REQUESTED','ACCEPTED','SHARED');

alter table public.solution_contact_requests enable row level security;
revoke all on public.solution_contact_requests from anon, authenticated;

alter table public.solution_contact_requests
  add constraint solution_contact_consumer_company_fk
  foreign key (consumer_tenant_id, consumer_company_id)
  references public.companies(tenant_id, id)
  on delete cascade;

alter table public.solution_contact_requests
  add constraint solution_contact_provider_company_fk
  foreign key (provider_tenant_id, provider_company_id)
  references public.companies(tenant_id, id)
  on delete cascade;

alter table public.solution_contact_requests
  add constraint solution_contact_provider_capability_fk
  foreign key (provider_tenant_id, provider_company_id, provider_capability_id)
  references public.provider_capabilities(tenant_id, company_id, id)
  on delete cascade;

alter table public.solution_contact_requests
  add constraint solution_contact_pain_same_consumer_fk
  foreign key (consumer_tenant_id, consumer_company_id, pain_finding_id)
  references public.pain_findings(tenant_id, company_id, id)
  on delete cascade;

alter table public.solution_contact_requests
  add constraint solution_contact_consent_same_consumer_fk
  foreign key (consumer_tenant_id, consumer_consent_id)
  references public.consents(tenant_id, id);


-- -------------------------------------------------------------------------
-- Generic mission template for the only safe fallback when root cause has
-- not been proven yet: validate cause/evidence before intervention.
-- -------------------------------------------------------------------------
insert into public.mission_templates(
  code, version, domain, title, objective, trigger_rules, prerequisites,
  steps, completion_criteria, evidence_requirements, expected_metric,
  risk_level, effort, applicable_segments, status
)
values (
  'GENESIS-VALIDATE-CAUSE',
  1,
  'GDS',
  'Validar a causa prioritária',
  'Coletar evidências suficientes para confirmar ou rejeitar a principal hipótese de causa antes de recomendar uma intervenção específica.',
  '[{"source":"decision_record","condition":"cause_not_validated"}]'::jsonb,
  '[]'::jsonb,
  '[
    {"order":1,"title":"Revisar evidências já disponíveis"},
    {"order":2,"title":"Coletar a evidência faltante mais relevante"},
    {"order":3,"title":"Confirmar, rejeitar ou manter a hipótese como inconclusiva"}
  ]'::jsonb,
  '[{"type":"cause_validation","required":true}]'::jsonb,
  '[{"minimum":1}]'::jsonb,
  '{"metricCode":"cause_validation_confidence"}'::jsonb,
  'low',
  '30–90 min',
  '[]'::jsonb,
  'published'
)
on conflict (code, version) do update
set title = excluded.title,
    objective = excluded.objective,
    trigger_rules = excluded.trigger_rules,
    steps = excluded.steps,
    completion_criteria = excluded.completion_criteria,
    evidence_requirements = excluded.evidence_requirements,
    expected_metric = excluded.expected_metric,
    status = 'published';

-- -------------------------------------------------------------------------
-- Create mission from a Decision Record. Uses a published proposed template
-- when present; otherwise uses the safe validation template.
-- Also projects any already-approved pain->capability rules.
-- -------------------------------------------------------------------------
create or replace function public.create_mission_from_decision(
  p_tenant_id uuid,
  p_decision_record_id uuid,
  p_due_at timestamptz default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_decision public.decision_records%rowtype;
  v_template public.mission_templates%rowtype;
  v_pain_code text;
  v_mission_id uuid;
begin
  select * into v_decision
  from public.decision_records d
  where d.id = p_decision_record_id
    and d.tenant_id = p_tenant_id
  for update;

  if v_decision.id is null then
    raise exception 'DECISION_NOT_FOUND' using errcode = 'P0002';
  end if;

  if exists (
    select 1 from public.missions m
    where m.tenant_id = p_tenant_id
      and m.decision_record_id = p_decision_record_id
      and m.status not in ('CANCELLED','EXPIRED')
  ) then
    raise exception 'MISSION_ALREADY_EXISTS' using errcode = '23505';
  end if;

  if v_decision.proposed_mission_code is not null then
    select * into v_template
    from public.mission_templates mt
    where mt.code = v_decision.proposed_mission_code
      and mt.status = 'published'
    order by mt.version desc
    limit 1;
  end if;

  if v_template.id is null then
    select * into v_template
    from public.mission_templates mt
    where mt.code = 'GENESIS-VALIDATE-CAUSE'
      and mt.status = 'published'
    order by mt.version desc
    limit 1;
  end if;

  if v_template.id is null then
    raise exception 'MISSION_TEMPLATE_NOT_AVAILABLE' using errcode = 'P0002';
  end if;

  insert into public.missions(
    tenant_id, company_id, template_id, decision_record_id, status,
    personalized_payload, due_at
  )
  values (
    p_tenant_id,
    v_decision.company_id,
    v_template.id,
    v_decision.id,
    'SUGGESTED',
    jsonb_build_object(
      'problem', v_decision.problem,
      'recommendation', v_decision.recommendation,
      'confidence', v_decision.confidence,
      'validationPlan', v_decision.validation_plan
    ),
    p_due_at
  )
  returning id into v_mission_id;

  if v_decision.pain_finding_id is not null then
    select pf.pain_code into v_pain_code
    from public.pain_findings pf
    where pf.id = v_decision.pain_finding_id
      and pf.tenant_id = p_tenant_id;

    insert into public.mission_capability_requirements(
      tenant_id, company_id, mission_id, capability_id,
      fit_weight, source_type, source_ref
    )
    select
      p_tenant_id,
      v_decision.company_id,
      v_mission_id,
      pcr.capability_id,
      pcr.fit_weight,
      'pain_rule',
      'pain:' || v_decision.pain_finding_id::text || ':rule:' || pcr.id::text
    from public.pain_capability_rules pcr
    where pcr.pain_code = v_pain_code
      and pcr.status = 'published'
    on conflict (mission_id, capability_id) do nothing;
  end if;

  insert into public.business_timeline_events(
    tenant_id, company_id, event_type, actor_type,
    subject_type, subject_id, payload
  )
  values (
    p_tenant_id,
    v_decision.company_id,
    'mission.suggested',
    'system',
    'mission',
    v_mission_id::text,
    jsonb_build_object(
      'decisionRecordId', v_decision.id,
      'templateCode', v_template.code
    )
  );

  return v_mission_id;
end
$$;

revoke all on function public.create_mission_from_decision(uuid, uuid, timestamptz)
from public, anon, authenticated;
grant execute on function public.create_mission_from_decision(uuid, uuid, timestamptz)
to service_role;

-- -------------------------------------------------------------------------
-- Evidence submission for missions.
-- User-created evidence remains unverified until a trusted verification step.
-- -------------------------------------------------------------------------
create or replace function public.record_mission_evidence(
  p_tenant_id uuid,
  p_mission_id uuid,
  p_evidence_type text,
  p_payload jsonb,
  p_summary text,
  p_source_ref text default null,
  p_created_by uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_mission public.missions%rowtype;
  v_evidence_id uuid;
begin
  select * into v_mission
  from public.missions m
  where m.id = p_mission_id
    and m.tenant_id = p_tenant_id
  for update;

  if v_mission.id is null then
    raise exception 'MISSION_NOT_FOUND' using errcode = 'P0002';
  end if;

  if v_mission.status not in ('IN_PROGRESS','EVIDENCE_PENDING','BLOCKED') then
    raise exception 'MISSION_NOT_ACCEPTING_EVIDENCE' using errcode = '23514';
  end if;

  insert into public.mission_evidence(
    tenant_id, company_id, mission_id, evidence_type,
    payload, verification_status
  )
  values (
    p_tenant_id,
    v_mission.company_id,
    v_mission.id,
    p_evidence_type,
    p_payload,
    'unverified'
  )
  returning id into v_evidence_id;

  perform public.record_evidence(
    p_tenant_id,
    v_mission.company_id,
    case
      when p_evidence_type = 'document' then 'document'
      when p_evidence_type = 'metric' then 'metric'
      when p_evidence_type = 'integration' then 'integration'
      else 'user_declaration'
    end,
    p_summary,
    p_payload,
    p_source_ref,
    1,
    'internal',
    array['CORE_OPERATION']::text[],
    p_created_by,
    'mission',
    v_mission.id,
    'supports'
  );

  if v_mission.status = 'IN_PROGRESS' then
    update public.missions
    set status = 'EVIDENCE_PENDING',
        updated_at = now()
    where id = v_mission.id;
  end if;

  return v_evidence_id;
end
$$;

revoke all on function public.record_mission_evidence(
  uuid, uuid, text, jsonb, text, text, uuid
) from public, anon, authenticated;
grant execute on function public.record_mission_evidence(
  uuid, uuid, text, jsonb, text, text, uuid
) to service_role;

-- -------------------------------------------------------------------------
-- Outcome closes the Mission -> Timeline loop and optionally updates one
-- Business Fact ONLY when the versioned mission template explicitly declares
-- `passportFactKey` in expected_metric.
-- -------------------------------------------------------------------------
create or replace function public.record_mission_outcome(
  p_tenant_id uuid,
  p_mission_id uuid,
  p_outcome_status text,
  p_before_value jsonb,
  p_after_value jsonb,
  p_metric_code text,
  p_source text,
  p_confidence numeric,
  p_created_by uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_mission public.missions%rowtype;
  v_template public.mission_templates%rowtype;
  v_outcome_id uuid;
  v_fact_key text;
begin
  select * into v_mission
  from public.missions m
  where m.id = p_mission_id
    and m.tenant_id = p_tenant_id
  for update;

  if v_mission.id is null then
    raise exception 'MISSION_NOT_FOUND' using errcode = 'P0002';
  end if;

  if v_mission.status = 'COMPLETED' then
    update public.missions
    set status = 'OUTCOME_PENDING',
        updated_at = now()
    where id = v_mission.id;
    v_mission.status := 'OUTCOME_PENDING';
  end if;

  if v_mission.status <> 'OUTCOME_PENDING' then
    raise exception 'MISSION_NOT_READY_FOR_OUTCOME' using errcode = '23514';
  end if;

  insert into public.mission_outcomes(
    tenant_id, company_id, mission_id, outcome_status,
    before_value, after_value, metric_code, source, confidence
  )
  values (
    p_tenant_id,
    v_mission.company_id,
    v_mission.id,
    p_outcome_status,
    p_before_value,
    p_after_value,
    p_metric_code,
    p_source,
    p_confidence
  )
  returning id into v_outcome_id;

  update public.missions
  set status = 'OUTCOME_RECORDED',
      updated_at = now()
  where id = v_mission.id;

  insert into public.business_timeline_events(
    tenant_id, company_id, event_type, actor_type, actor_id,
    subject_type, subject_id, payload
  )
  values (
    p_tenant_id,
    v_mission.company_id,
    'mission.outcome.recorded',
    case when p_source = 'declared' then 'user' else 'system' end,
    p_created_by::text,
    'mission_outcome',
    v_outcome_id::text,
    jsonb_build_object(
      'missionId', v_mission.id,
      'outcomeStatus', p_outcome_status,
      'metricCode', p_metric_code,
      'confidence', p_confidence
    )
  );

  select * into v_template
  from public.mission_templates mt
  where mt.id = v_mission.template_id;

  v_fact_key := nullif(v_template.expected_metric ->> 'passportFactKey', '');

  if v_fact_key is not null and p_after_value is not null then
    perform public.record_business_fact(
      p_tenant_id,
      v_mission.company_id,
      v_fact_key,
      p_after_value,
      p_source,
      'mission_outcome:' || v_outcome_id::text,
      p_confidence,
      'internal',
      array['CORE_OPERATION']::text[],
      p_created_by
    );
  end if;

  return v_outcome_id;
end
$$;

revoke all on function public.record_mission_outcome(
  uuid, uuid, text, jsonb, jsonb, text, text, numeric, uuid
) from public, anon, authenticated;
grant execute on function public.record_mission_outcome(
  uuid, uuid, text, jsonb, jsonb, text, text, numeric, uuid
) to service_role;


-- -------------------------------------------------------------------------
-- Outbox lifecycle completion/failure. Claiming already exists in 0007.
-- -------------------------------------------------------------------------
create or replace function public.complete_event_outbox(
  p_worker_id text,
  p_event_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.event_outbox
  set status = 'processed',
      processed_at = now(),
      leased_by = null,
      leased_until = null,
      last_error = null
  where id = p_event_id
    and status = 'processing'
    and leased_by = p_worker_id;

  if not found then
    raise exception 'OUTBOX_LEASE_MISMATCH' using errcode = '23514';
  end if;
end
$$;

revoke all on function public.complete_event_outbox(text, uuid)
from public, anon, authenticated;
grant execute on function public.complete_event_outbox(text, uuid)
to service_role;

create or replace function public.fail_event_outbox(
  p_worker_id text,
  p_event_id uuid,
  p_error text,
  p_retry_seconds integer default 60
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempts integer;
  v_max_attempts integer;
begin
  if p_retry_seconds < 1 or p_retry_seconds > 86400 then
    raise exception 'INVALID_RETRY_SECONDS' using errcode = '23514';
  end if;

  select attempts, max_attempts into v_attempts, v_max_attempts
  from public.event_outbox
  where id = p_event_id
    and status = 'processing'
    and leased_by = p_worker_id
  for update;

  if v_attempts is null then
    raise exception 'OUTBOX_LEASE_MISMATCH' using errcode = '23514';
  end if;

  update public.event_outbox
  set status = case when v_attempts >= v_max_attempts then 'dead' else 'failed' end,
      available_at = case
        when v_attempts >= v_max_attempts then available_at
        else now() + make_interval(secs => p_retry_seconds)
      end,
      leased_by = null,
      leased_until = null,
      last_error = left(coalesce(p_error, 'UNKNOWN_ERROR'), 2000)
  where id = p_event_id;
end
$$;

revoke all on function public.fail_event_outbox(text, uuid, text, integer)
from public, anon, authenticated;
grant execute on function public.fail_event_outbox(text, uuid, text, integer)
to service_role;

-- Contact request emits metadata-only event for a future notification worker.
create or replace function private.emit_solution_contact_requested()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.event_outbox(
    tenant_id,
    company_id,
    event_type,
    aggregate_type,
    aggregate_id,
    idempotency_key,
    payload
  )
  values (
    new.consumer_tenant_id,
    new.consumer_company_id,
    'solution.contact.requested',
    'solution_contact_requests',
    new.id,
    'solution.contact.requested:' || new.id::text,
    jsonb_build_object(
      'providerTenantId', new.provider_tenant_id,
      'providerCompanyId', new.provider_company_id,
      'providerCapabilityId', new.provider_capability_id,
      'painFindingId', new.pain_finding_id,
      'capabilityId', new.capability_id
    )
  )
  on conflict (tenant_id, idempotency_key) do nothing;

  return new;
end
$$;

revoke all on function private.emit_solution_contact_requested()
from public, anon, authenticated;

create trigger solution_contact_requested_outbox
after insert on public.solution_contact_requests
for each row execute function private.emit_solution_contact_requested();


commit;
