begin;

select plan(11);

select tests.create_supabase_user('flow_consumer', 'consumer@genesis.test');
select tests.create_supabase_user('flow_provider', 'provider@genesis.test');
select tests.authenticate_as_service_role();

insert into public.tenants(id, name) values
  ('51000000-0000-0000-0000-000000000001', 'Flow Consumer'),
  ('52000000-0000-0000-0000-000000000002', 'Flow Provider');

insert into public.memberships(tenant_id, user_id, role) values
  (
    '51000000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('flow_consumer'),
    'owner'
  ),
  (
    '52000000-0000-0000-0000-000000000002',
    tests.get_supabase_uid('flow_provider'),
    'owner'
  );

insert into public.companies(id, tenant_id, trade_name) values
  (
    '51100000-0000-0000-0000-000000000001',
    '51000000-0000-0000-0000-000000000001',
    'Consumer Company'
  ),
  (
    '52200000-0000-0000-0000-000000000002',
    '52000000-0000-0000-0000-000000000002',
    'Provider Company'
  );

insert into public.diagnostic_versions(id, version, status, content_hash)
values (
  '53000000-0000-0000-0000-000000000003',
  'flow-test',
  'published',
  'flow-test'
);

insert into public.diagnostics(
  id, tenant_id, company_id, diagnostic_version_id, status, coverage, confidence
) values (
  '54000000-0000-0000-0000-000000000004',
  '51000000-0000-0000-0000-000000000001',
  '51100000-0000-0000-0000-000000000001',
  '53000000-0000-0000-0000-000000000003',
  'scored',
  100,
  90
);

insert into public.pain_findings(
  id, tenant_id, company_id, diagnostic_id, dimension, pain_code, title,
  severity, confidence, rule_version
) values (
  '55000000-0000-0000-0000-000000000005',
  '51000000-0000-0000-0000-000000000001',
  '51100000-0000-0000-0000-000000000001',
  '54000000-0000-0000-0000-000000000004',
  'FIN',
  'TEST_FLOW_PAIN',
  'Flow pain',
  .7,
  .9,
  'v1'
);

insert into public.decision_records(
  id, tenant_id, company_id, diagnostic_id, pain_finding_id, problem,
  evidence_refs, gaps, cause_hypotheses, alternatives, recommendation,
  expected_impact, risks, confidence, validation_plan, metric,
  source_type, source_version
) values (
  '56000000-0000-0000-0000-000000000006',
  '51000000-0000-0000-0000-000000000001',
  '51100000-0000-0000-0000-000000000001',
  '54000000-0000-0000-0000-000000000004',
  '55000000-0000-0000-0000-000000000005',
  'Problema de teste com causa ainda não validada.',
  '["pain_finding:55000000-0000-0000-0000-000000000005"]'::jsonb,
  '["causa pendente"]'::jsonb,
  '[]'::jsonb,
  '[{"code":"VALIDATE","title":"Validar","tradeoffs":[]}]'::jsonb,
  '{"alternativeCode":"VALIDATE","rationale":"Validar antes de agir"}'::jsonb,
  '{}'::jsonb,
  '[]'::jsonb,
  .9,
  '["coletar evidência"]'::jsonb,
  '{"type":"dimension_score","dimension":"FIN"}'::jsonb,
  'rule',
  'gds-v1'
);

insert into public.capabilities(
  id, code, version, domain, title, status
) values (
  '57000000-0000-0000-0000-000000000007',
  'TEST-FIN-CAP',
  1,
  'FIN',
  'Capability financeira de teste',
  'published'
);

insert into public.pain_capability_rules(
  pain_code, capability_id, rule_version, fit_weight, status
) values (
  'TEST_FLOW_PAIN',
  '57000000-0000-0000-0000-000000000007',
  'test-v1',
  .95,
  'published'
);

select lives_ok(
  $$select public.create_mission_from_decision(
    '51000000-0000-0000-0000-000000000001',
    '56000000-0000-0000-0000-000000000006',
    null
  )$$,
  'Decision can create a mission through trusted domain RPC'
);

select results_eq(
  $$select status from public.missions
    where decision_record_id = '56000000-0000-0000-0000-000000000006'$$,
  array['SUGGESTED'::text],
  'Created mission starts SUGGESTED'
);

select results_eq(
  $$select count(*) from public.mission_capability_requirements mcr
    join public.missions m on m.id = mcr.mission_id
    where m.decision_record_id = '56000000-0000-0000-0000-000000000006'$$,
  array[1::bigint],
  'Published pain->capability rule is projected to the mission'
);

update public.missions
set status = 'ACCEPTED'
where decision_record_id = '56000000-0000-0000-0000-000000000006';

update public.missions
set status = 'IN_PROGRESS'
where decision_record_id = '56000000-0000-0000-0000-000000000006';

select lives_ok(
  $$select public.record_mission_evidence(
    '51000000-0000-0000-0000-000000000001',
    (
      select id from public.missions
      where decision_record_id = '56000000-0000-0000-0000-000000000006'
    ),
    'declaration',
    '{"text":"evidência de teste"}'::jsonb,
    'Evidência de teste',
    null,
    tests.get_supabase_uid('flow_consumer')
  )$$,
  'Mission accepts evidence through trusted RPC'
);

select results_eq(
  $$select status from public.missions
    where decision_record_id = '56000000-0000-0000-0000-000000000006'$$,
  array['EVIDENCE_PENDING'::text],
  'Evidence moves IN_PROGRESS mission to EVIDENCE_PENDING'
);

update public.missions
set status = 'COMPLETED'
where decision_record_id = '56000000-0000-0000-0000-000000000006';

select lives_ok(
  $$select public.record_mission_outcome(
    '51000000-0000-0000-0000-000000000001',
    (
      select id from public.missions
      where decision_record_id = '56000000-0000-0000-0000-000000000006'
    ),
    'improved',
    '{"value":"before"}'::jsonb,
    '{"value":"after"}'::jsonb,
    'TEST_METRIC',
    'declared',
    null,
    tests.get_supabase_uid('flow_consumer')
  )$$,
  'Completed mission records an outcome'
);

select results_eq(
  $$select status from public.missions
    where decision_record_id = '56000000-0000-0000-0000-000000000006'$$,
  array['OUTCOME_RECORDED'::text],
  'Outcome closes mission state machine'
);

select results_eq(
  $$select count(*) from public.business_timeline_events
    where tenant_id = '51000000-0000-0000-0000-000000000001'
      and event_type = 'mission.outcome.recorded'$$,
  array[1::bigint],
  'Outcome is written to Business Timeline'
);

select results_eq(
  $$select count(*) from public.event_outbox eo
    join public.missions m on m.id = eo.aggregate_id
    where m.decision_record_id = '56000000-0000-0000-0000-000000000006'
      and eo.event_type = 'mission.status.changed'$$,
  array[6::bigint],
  'Every mission status transition gets a distinct durable outbox event'
);

insert into public.plan_catalog(
  id, code, name, monthly_price_brl, contract_months,
  provider_network_eligible, status
) values (
  '58000000-0000-0000-0000-000000000008',
  'TEST-NETWORK',
  'Test Network Plan',
  0,
  0,
  true,
  'published'
);

insert into public.tenant_subscriptions(
  tenant_id, plan_id, status
) values (
  '52000000-0000-0000-0000-000000000002',
  '58000000-0000-0000-0000-000000000008',
  'active'
);

insert into public.provider_network_policies(
  version, minimum_qualification_score, require_compliance, require_capacity, status
) values ('flow-test', 70, true, true, 'published');

insert into public.provider_capabilities(
  id, tenant_id, company_id, capability_id, qualification_status,
  qualification_score, capacity_status, compliance_status
) values (
  '59000000-0000-0000-0000-000000000009',
  '52000000-0000-0000-0000-000000000002',
  '52200000-0000-0000-0000-000000000002',
  '57000000-0000-0000-0000-000000000007',
  'qualified',
  90,
  'available',
  'valid'
);

insert into public.consent_versions(
  id, code, version, content_hash, active, purpose_code
) values (
  '5a000000-0000-0000-0000-00000000000a',
  'QUALIFIED_MATCHING_TEST',
  '1',
  'test',
  true,
  'QUALIFIED_MATCHING'
);

insert into public.consents(
  id, tenant_id, company_id, user_id, consent_version_id,
  purpose, purpose_code, granted, granted_at, decision_at
) values (
  '5b000000-0000-0000-0000-00000000000b',
  '51000000-0000-0000-0000-000000000001',
  '51100000-0000-0000-0000-000000000001',
  tests.get_supabase_uid('flow_consumer'),
  '5a000000-0000-0000-0000-00000000000a',
  'QUALIFIED_MATCHING',
  'QUALIFIED_MATCHING',
  true,
  now(),
  now()
);

insert into public.solution_contact_requests(
  id, consumer_tenant_id, consumer_company_id, provider_tenant_id,
  provider_company_id, provider_capability_id, pain_finding_id,
  capability_id, consumer_consent_id, requested_by
) values (
  '5c000000-0000-0000-0000-00000000000c',
  '51000000-0000-0000-0000-000000000001',
  '51100000-0000-0000-0000-000000000001',
  '52000000-0000-0000-0000-000000000002',
  '52200000-0000-0000-0000-000000000002',
  '59000000-0000-0000-0000-000000000009',
  '55000000-0000-0000-0000-000000000005',
  '57000000-0000-0000-0000-000000000007',
  '5b000000-0000-0000-0000-00000000000b',
  tests.get_supabase_uid('flow_consumer')
);

select results_eq(
  $$select count(*) from public.event_outbox
    where event_type = 'solution.contact.requested'
      and aggregate_id = '5c000000-0000-0000-0000-00000000000c'$$,
  array[1::bigint],
  'Contact request emits durable outbox event'
);

select throws_ok(
  $$insert into public.solution_contact_requests(
    consumer_tenant_id, consumer_company_id, provider_tenant_id,
    provider_company_id, provider_capability_id, pain_finding_id,
    capability_id, consumer_consent_id, requested_by
  ) values (
    '52000000-0000-0000-0000-000000000002',
    '52200000-0000-0000-0000-000000000002',
    '52000000-0000-0000-0000-000000000002',
    '52200000-0000-0000-0000-000000000002',
    '59000000-0000-0000-0000-000000000009',
    '55000000-0000-0000-0000-000000000005',
    '57000000-0000-0000-0000-000000000007',
    '5b000000-0000-0000-0000-00000000000b',
    tests.get_supabase_uid('flow_provider')
  )$$,
  '23503',
  null,
  'Contact request cannot reuse consent from another consumer tenant'
);

select * from finish();
rollback;
