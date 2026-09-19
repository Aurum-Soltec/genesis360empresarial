begin;
-- Existing duplicates must be reviewed, not silently deleted by a migration.
create unique index business_facts_one_current_value
  on public.business_facts(tenant_id,company_id,fact_key) where valid_to is null;
create unique index mission_outcomes_one_final_record
  on public.mission_outcomes(tenant_id,mission_id);
-- The original RPC signatures and service_role-only grants are preserved.
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
  v_current public.business_facts%rowtype;
  v_now timestamptz := now();
begin
  perform private.require_management_actor(p_tenant_id,p_created_by);
  if p_source is distinct from 'declared' or p_confidence is not null then
    raise exception 'DECLARATION_ONLY' using errcode='42501';
  end if;
  -- Serializes even the first insert, when SELECT FOR UPDATE finds no row.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_tenant_id::text || ':' || p_company_id::text || ':' || coalesce(p_fact_key,''),0)
  );
  if not exists (
    select 1 from public.companies c
    where c.id = p_company_id and c.tenant_id = p_tenant_id
  ) then
    raise exception 'COMPANY_TENANT_MISMATCH' using errcode = '23514';
  end if;

  if p_fact_key is null or p_fact_key !~ '^[a-z0-9_.-]{2,120}$' then
    raise exception 'INVALID_FACT_KEY' using errcode = '23514';
  end if;

  select bf.* into v_current
  from public.business_facts bf
  where bf.tenant_id = p_tenant_id
    and bf.company_id = p_company_id
    and bf.fact_key = p_fact_key
    and bf.valid_to is null
  for update;

  v_current_id := v_current.id;
  if v_current_id is not null and v_current.value is not distinct from p_value
    and v_current.source::text = 'declared'
    and v_current.source_ref is not distinct from p_source_ref
    and v_current.sensitivity::text is not distinct from p_sensitivity
    and v_current.purpose_codes is not distinct from p_purpose_codes then
    return v_current_id;
  end if;
  v_now := greatest(clock_timestamp(), coalesce(v_current.valid_from + interval '1 microsecond',clock_timestamp()));
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
    'unverified',
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
  perform private.require_management_actor(p_tenant_id,p_created_by);
  if p_evidence_type not in ('user_declaration','metric','observation')
    or p_evidence_type is null or p_confidence is not null
    or p_relation is null or p_relation not in ('supports','contradicts','context_for')
  then raise exception 'DECLARATION_ONLY' using errcode='42501'; end if;
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
  perform private.require_management_actor(p_tenant_id,p_created_by);
  if p_evidence_type is null or p_evidence_type not in ('declaration','metric','link')
  then raise exception 'DECLARATION_ONLY' using errcode='42501'; end if;
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
    null,
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
  v_existing public.mission_outcomes%rowtype;
begin
  perform private.require_management_actor(p_tenant_id,p_created_by);
  if p_source is distinct from 'declared' or p_confidence is not null
  then raise exception 'DECLARATION_ONLY' using errcode='42501'; end if;
  select * into v_mission
  from public.missions m
  where m.id = p_mission_id
    and m.tenant_id = p_tenant_id
  for update;

  if v_mission.id is null then
    raise exception 'MISSION_NOT_FOUND' using errcode = 'P0002';
  end if;

  select * into v_existing from public.mission_outcomes
  where mission_id=p_mission_id and tenant_id=p_tenant_id;
  if v_existing.id is not null then
    if v_existing.outcome_status is not distinct from p_outcome_status
      and v_existing.before_value is not distinct from p_before_value
      and v_existing.after_value is not distinct from p_after_value
      and v_existing.metric_code is not distinct from p_metric_code
      and v_existing.source is not distinct from p_source
    then return v_existing.id; end if;
    raise exception 'OUTCOME_ALREADY_RECORDED' using errcode='23514';
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
commit;
