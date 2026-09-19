begin;

-- Additive migration. Historical V1.2 results remain historical, never silently re-scored.
alter table public.diagnostics
  add column answer_revision bigint not null default 0 check (answer_revision >= 0),
  add column context_snapshot jsonb,
  add column evaluation_as_of timestamptz not null default now(),
  add column result_snapshot jsonb,
  add column growth_score integer check (growth_score between 0 and 100),
  add column growth_score_status text not null default 'legacy_unreviewed'
    check (growth_score_status in ('legacy_unreviewed','scored','insufficient_data','not_applicable')),
  add column confidence_rule_version text;
alter table public.diagnostics add constraint diagnostic_growth_status_consistent
  check ((growth_score_status = 'scored') = (growth_score is not null));

create or replace function private.require_management_actor(p_tenant_id uuid, p_actor_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_actor_id is null or not exists (
    select 1 from public.memberships m
    where m.tenant_id = p_tenant_id and m.user_id = p_actor_id
      and m.role in ('owner','admin','manager')
  ) then
    raise exception 'ROLE_NOT_ALLOWED' using errcode = '42501';
  end if;
end
$$;
revoke all on function private.require_management_actor(uuid,uuid) from public,anon,authenticated;
grant execute on function private.require_management_actor(uuid,uuid) to service_role;

create or replace function private.guard_diagnostic_answer_write()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_diagnostic public.diagnostics%rowtype; v_id uuid; v_tenant uuid;
begin
  if tg_op = 'UPDATE' and (
    new.diagnostic_id is distinct from old.diagnostic_id or
    new.tenant_id is distinct from old.tenant_id or new.question_id is distinct from old.question_id
  ) then raise exception 'ANSWER_IDENTITY_IMMUTABLE' using errcode = '23514'; end if;
  v_id := case when tg_op = 'DELETE' then old.diagnostic_id else new.diagnostic_id end;
  v_tenant := case when tg_op = 'DELETE' then old.tenant_id else new.tenant_id end;
  select * into v_diagnostic from public.diagnostics where id = v_id and tenant_id = v_tenant for update;
  -- Parent-deletion cascade is allowed; retention/erasure is not a result mutation.
  if v_diagnostic.id is null and tg_op = 'DELETE' then return old; end if;
  -- Leave invalid references to the existing composite foreign key (23503).
  if v_diagnostic.id is null then return new; end if;
  if v_diagnostic.status <> 'draft' then
    raise exception 'DIAGNOSTIC_NOT_EDITABLE' using errcode = '23514';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end
$$;

create or replace function private.bump_diagnostic_answer_revision()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.diagnostics
  set answer_revision = answer_revision + 1, evaluation_as_of = clock_timestamp(),
      last_saved_at = clock_timestamp(), updated_at = clock_timestamp()
  where id = case when tg_op = 'DELETE' then old.diagnostic_id else new.diagnostic_id end;
  return null;
end
$$;
revoke all on function private.guard_diagnostic_answer_write(),
  private.bump_diagnostic_answer_revision() from public,anon,authenticated;
create trigger diagnostic_answer_edit_guard before insert or update or delete on public.answers
for each row execute function private.guard_diagnostic_answer_write();
create trigger diagnostic_answer_revision after insert or update or delete on public.answers
for each row execute function private.bump_diagnostic_answer_revision();

create or replace function public.save_diagnostic_answer_v1_2_1(
  p_tenant_id uuid, p_diagnostic_id uuid, p_actor_id uuid,
  p_expected_revision bigint, p_answer jsonb
)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_diagnostic public.diagnostics%rowtype; v_revision bigint;
begin
  perform private.require_management_actor(p_tenant_id, p_actor_id);
  select * into v_diagnostic from public.diagnostics
    where id = p_diagnostic_id and tenant_id = p_tenant_id for update;
  if v_diagnostic.id is null then raise exception 'DIAGNOSTIC_NOT_FOUND' using errcode = 'P0002'; end if;
  if v_diagnostic.status <> 'draft' then raise exception 'DIAGNOSTIC_NOT_EDITABLE' using errcode = '23514'; end if;
  if p_expected_revision is distinct from v_diagnostic.answer_revision then
    raise exception 'DIAGNOSTIC_CHANGED' using errcode = '40001';
  end if;
  if v_diagnostic.context_snapshot is null then
    raise exception 'LEGACY_DIAGNOSTIC_REASSESSMENT_REQUIRED' using errcode = '23514';
  end if;
  if jsonb_typeof(p_answer) is distinct from 'object'
    or p_answer->>'qualityVersion' is distinct from 'confidence-v1.2.1'
    or jsonb_typeof(p_answer->'evidenceRefs') is distinct from 'array'
  then raise exception 'INVALID_ANSWER' using errcode = '23514'; end if;
  if exists (
    select 1 from jsonb_array_elements_text(p_answer->'evidenceRefs') r(id)
    where not exists (
      select 1 from public.evidence_items e where e.id::text = r.id
        and e.tenant_id = p_tenant_id and e.company_id = v_diagnostic.company_id
        and e.verification_status not in ('expired','rejected')
    )
  ) then raise exception 'EVIDENCE_REFERENCE_NOT_AVAILABLE' using errcode = '23514'; end if;

  insert into public.answers(
    tenant_id,diagnostic_id,question_id,response,maturity,confidence,applicable,
    answer_state,completeness_score,evidence_strength,consistency_score,freshness_score,
    information_slots,evidence_refs,quality_version,source,evidence_status,answered_at,updated_at
  ) values (
    p_tenant_id,p_diagnostic_id,p_answer->>'questionId',coalesce(p_answer->'response','{}'::jsonb),
    (p_answer->>'maturity')::smallint,(p_answer->>'confidence')::numeric,
    (p_answer->>'applicable')::boolean,p_answer->>'answerState',
    (p_answer->>'completenessScore')::numeric,(p_answer->>'evidenceStrength')::numeric,
    (p_answer->>'consistencyScore')::numeric,(p_answer->>'freshnessScore')::numeric,
    p_answer->'informationSlots',p_answer->'evidenceRefs',p_answer->>'qualityVersion',
    'declared','unverified',clock_timestamp(),clock_timestamp()
  ) on conflict (diagnostic_id,question_id) do update set
    response=excluded.response,maturity=excluded.maturity,confidence=excluded.confidence,
    applicable=excluded.applicable,answer_state=excluded.answer_state,
    completeness_score=excluded.completeness_score,evidence_strength=excluded.evidence_strength,
    consistency_score=excluded.consistency_score,freshness_score=excluded.freshness_score,
    information_slots=excluded.information_slots,evidence_refs=excluded.evidence_refs,
    quality_version=excluded.quality_version,source='declared',evidence_status='unverified',
    answered_at=excluded.answered_at,updated_at=excluded.updated_at;
  select answer_revision into v_revision from public.diagnostics where id=p_diagnostic_id;
  return v_revision;
end
$$;
revoke all on function public.save_diagnostic_answer_v1_2_1(uuid,uuid,uuid,bigint,jsonb) from public,anon,authenticated;
grant execute on function public.save_diagnostic_answer_v1_2_1(uuid,uuid,uuid,bigint,jsonb) to service_role;

-- Legacy endpoint has no actor or optimistic revision and is no longer a write path.
create or replace function public.persist_diagnostic_result(
  p_tenant_id uuid,p_diagnostic_id uuid,p_scores jsonb,p_pains jsonb,
  p_coverage integer,p_confidence integer,p_rule_version text default 'v1'
) returns void language plpgsql security definer set search_path = '' as $$
begin raise exception 'LEGACY_RESULT_WRITER_DISABLED' using errcode = '42501'; end
$$;

create or replace function public.persist_diagnostic_result_v1_2_1(
  p_tenant_id uuid,p_diagnostic_id uuid,p_actor_id uuid,p_expected_revision bigint,
  p_snapshot jsonb,p_rule_version text,p_confidence_version text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_diagnostic public.diagnostics%rowtype; v_score jsonb; v_pain jsonb;
begin
  perform private.require_management_actor(p_tenant_id,p_actor_id);
  select * into v_diagnostic from public.diagnostics
    where id=p_diagnostic_id and tenant_id=p_tenant_id for update;
  if v_diagnostic.id is null then raise exception 'DIAGNOSTIC_NOT_FOUND' using errcode='P0002'; end if;
  if v_diagnostic.status='scored' then
    if v_diagnostic.result_snapshot is null then
      raise exception 'LEGACY_DIAGNOSTIC_REASSESSMENT_REQUIRED' using errcode='23514';
    end if;
    return v_diagnostic.result_snapshot || jsonb_build_object('replayed',true);
  end if;
  if v_diagnostic.status <> 'draft' then raise exception 'DIAGNOSTIC_NOT_EDITABLE' using errcode='23514'; end if;
  if p_expected_revision is distinct from v_diagnostic.answer_revision then
    raise exception 'DIAGNOSTIC_CHANGED' using errcode='40001';
  end if;
  if v_diagnostic.context_snapshot is null
     or p_rule_version is distinct from 'growth-v1.2.1'
     or p_confidence_version is distinct from 'confidence-v1.2.1'
     or p_snapshot#>>'{state,status}' is distinct from 'scored'
     or p_snapshot#>>'{state,scoringRuleVersion}' is distinct from p_rule_version
     or p_snapshot#>>'{state,confidenceRuleVersion}' is distinct from p_confidence_version
     or p_snapshot#>>'{state,confidencePercent}' is distinct from p_snapshot#>>'{confidence,percent}'
     or p_snapshot#>>'{state,confidenceLevel}' is distinct from p_snapshot#>>'{confidence,level}'
     or jsonb_typeof(p_snapshot->'scores') is distinct from 'array'
     or jsonb_typeof(p_snapshot->'pains') is distinct from 'array'
  then raise exception 'INVALID_RESULT_SNAPSHOT' using errcode='23514'; end if;
  if p_snapshot#>>'{state,nextQuestionId}' is not null
     or coalesce((p_snapshot#>>'{confidence,breakdown,criticalCoverage}')::numeric,0) < 0.6
     or jsonb_array_length(p_snapshot->'scores')<>12
     or (select count(distinct x->>'dimension') from jsonb_array_elements(p_snapshot->'scores') x)<>12
     or jsonb_array_length(p_snapshot->'pains')>3
  then raise exception 'INVALID_RESULT_COVERAGE' using errcode='23514'; end if;

  -- No delete/reinsert: a submitted result and the IDs used by decisions are stable.
  if exists(select 1 from public.score_results where diagnostic_id=p_diagnostic_id)
     or exists(select 1 from public.pain_findings where diagnostic_id=p_diagnostic_id)
  then raise exception 'DIAGNOSTIC_RESULT_ALREADY_EXISTS' using errcode='23514'; end if;
  for v_score in select value from jsonb_array_elements(p_snapshot->'scores') loop
    insert into public.score_results(tenant_id,diagnostic_id,dimension,score,coverage,confidence,rule_version,explanation)
    values(
      p_tenant_id,p_diagnostic_id,v_score->>'dimension',
      round((v_score->>'score')::numeric*100)::integer,
      round((v_score->>'coverage')::numeric*100)::integer,
      round((v_score->>'confidence')::numeric*100)::integer,p_rule_version,
      jsonb_build_object('deterministic',true,'status',v_score->>'status','policy',p_rule_version)
    );
  end loop;
  for v_pain in select value from jsonb_array_elements(p_snapshot->'pains') loop
    insert into public.pain_findings(
      tenant_id,company_id,diagnostic_id,dimension,pain_code,title,severity,confidence,gap_summary,rule_version
    ) values(
      p_tenant_id,v_diagnostic.company_id,p_diagnostic_id,v_pain->>'dimension',v_pain->>'painCode',
      v_pain->>'title',(v_pain->>'severity')::numeric,(v_pain->>'confidence')::numeric,
      v_pain->>'gapSummary',p_rule_version
    );
  end loop;
  update public.diagnostics set status='scored',submitted_at=clock_timestamp(),updated_at=clock_timestamp(),
    result_snapshot=p_snapshot,growth_score=(p_snapshot#>>'{state,growthScore}')::integer,
    growth_score_status=p_snapshot#>>'{state,growthScoreStatus}',
    coverage=round((p_snapshot#>>'{overall,coverage}')::numeric*100)::integer,
    confidence=(p_snapshot#>>'{confidence,percent}')::integer,
    confidence_level=p_snapshot#>>'{confidence,level}',
    confidence_breakdown=p_snapshot#>'{confidence,breakdown}',
    confidence_rule_version=p_confidence_version,rules_version=p_rule_version,progress_percent=100
  where id=p_diagnostic_id;
  return p_snapshot || jsonb_build_object('replayed',false);
end
$$;
revoke all on function public.persist_diagnostic_result_v1_2_1(uuid,uuid,uuid,bigint,jsonb,text,text) from public,anon,authenticated;
grant execute on function public.persist_diagnostic_result_v1_2_1(uuid,uuid,uuid,bigint,jsonb,text,text) to service_role;

create or replace function private.guard_scored_diagnostic()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.status='scored' and new is distinct from old then
    raise exception 'SCORED_DIAGNOSTIC_IMMUTABLE' using errcode='23514';
  end if;
  if old.context_snapshot is not null and (
    new.context_snapshot is distinct from old.context_snapshot or
    (new.evaluation_as_of is distinct from old.evaluation_as_of and new.answer_revision = old.answer_revision)
  ) then raise exception 'DIAGNOSTIC_CONTEXT_IMMUTABLE' using errcode='23514'; end if;
  return new;
end
$$;
revoke all on function private.guard_scored_diagnostic() from public,anon,authenticated;
create trigger scored_diagnostic_immutable before update on public.diagnostics
for each row execute function private.guard_scored_diagnostic();
commit;
