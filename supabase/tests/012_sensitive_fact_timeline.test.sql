begin;

select plan(11);

select tests.create_supabase_user('timeline_owner', 'timeline-owner@genesis.test');
select tests.create_supabase_user('timeline_manager', 'timeline-manager@genesis.test');
select tests.create_supabase_user('timeline_member', 'timeline-member@genesis.test');
select tests.create_supabase_user('timeline_other_member', 'timeline-other@genesis.test');
select tests.authenticate_as_service_role();

insert into public.tenants(id, name) values
  ('82400000-0000-4000-8000-000000000001', 'Timeline Tenant A'),
  ('82400000-0000-4000-8000-000000000002', 'Timeline Tenant B');

insert into public.memberships(tenant_id, user_id, role) values
  ('82400000-0000-4000-8000-000000000001', tests.get_supabase_uid('timeline_owner'), 'owner'),
  ('82400000-0000-4000-8000-000000000001', tests.get_supabase_uid('timeline_manager'), 'manager'),
  ('82400000-0000-4000-8000-000000000001', tests.get_supabase_uid('timeline_member'), 'member'),
  ('82400000-0000-4000-8000-000000000002', tests.get_supabase_uid('timeline_other_member'), 'member');

insert into public.companies(id, tenant_id, trade_name) values
  ('82410000-0000-4000-8000-000000000001', '82400000-0000-4000-8000-000000000001', 'Timeline Company A'),
  ('82410000-0000-4000-8000-000000000003', '82400000-0000-4000-8000-000000000001', 'Timeline Company A2'),
  ('82410000-0000-4000-8000-000000000002', '82400000-0000-4000-8000-000000000002', 'Timeline Company B');

insert into public.business_facts(id, tenant_id, company_id, fact_key, value, source, sensitivity) values
  ('82420000-0000-4000-8000-000000000001', '82400000-0000-4000-8000-000000000001', '82410000-0000-4000-8000-000000000001', 'identity.public_test', '"visible"'::jsonb, 'declared', 'internal'),
  ('82420000-0000-4000-8000-000000000002', '82400000-0000-4000-8000-000000000001', '82410000-0000-4000-8000-000000000001', 'people.personal_test', '"hidden-personal"'::jsonb, 'declared', 'personal'),
  ('82420000-0000-4000-8000-000000000003', '82400000-0000-4000-8000-000000000001', '82410000-0000-4000-8000-000000000001', 'finance.sensitive_test', '"hidden-financial"'::jsonb, 'declared', 'financial'),
  ('82420000-0000-4000-8000-000000000004', '82400000-0000-4000-8000-000000000001', '82410000-0000-4000-8000-000000000001', 'strategy.restricted_test', '"hidden-restricted"'::jsonb, 'declared', 'restricted'),
  ('82420000-0000-4000-8000-000000000005', '82400000-0000-4000-8000-000000000002', '82410000-0000-4000-8000-000000000002', 'identity.other_test', '"other-tenant"'::jsonb, 'declared', 'internal');

insert into public.business_timeline_events(
  tenant_id, company_id, event_type, actor_type, subject_type, subject_id, payload, source_ref
) values
  ('82400000-0000-4000-8000-000000000001', '82410000-0000-4000-8000-000000000001', 'passport.fact.created', 'user', 'business_fact', '82420000-0000-4000-8000-000000000001', '{"factKey":"identity.public_test"}'::jsonb, 'public-ref'),
  ('82400000-0000-4000-8000-000000000001', '82410000-0000-4000-8000-000000000001', 'passport.fact.created', 'user', 'business_fact', '82420000-0000-4000-8000-000000000002', '{"factKey":"people.personal_test"}'::jsonb, 'secret-personal-ref'),
  ('82400000-0000-4000-8000-000000000001', '82410000-0000-4000-8000-000000000001', 'passport.fact.created', 'user', 'business_fact', '82420000-0000-4000-8000-000000000003', '{"factKey":"finance.sensitive_test"}'::jsonb, 'secret-financial-ref'),
  ('82400000-0000-4000-8000-000000000001', '82410000-0000-4000-8000-000000000001', 'passport.fact.created', 'user', 'business_fact', '82420000-0000-4000-8000-000000000004', '{"factKey":"strategy.restricted_test"}'::jsonb, 'secret-restricted-ref'),
  ('82400000-0000-4000-8000-000000000001', '82410000-0000-4000-8000-000000000001', 'mission.suggested', 'system', 'mission', '82430000-0000-4000-8000-000000000001', '{"status":"SUGGESTED"}'::jsonb, null),
  ('82400000-0000-4000-8000-000000000001', '82410000-0000-4000-8000-000000000001', 'passport.fact.created', 'user', 'business_fact', 'not-a-uuid', '{"factKey":"secret.orphaned"}'::jsonb, 'secret-orphaned-ref'),
  ('82400000-0000-4000-8000-000000000001', '82410000-0000-4000-8000-000000000003', 'passport.fact.created', 'user', 'business_fact', '82420000-0000-4000-8000-000000000001', '{"factKey":"identity.public_test"}'::jsonb, 'wrong-company-ref'),
  ('82400000-0000-4000-8000-000000000002', '82410000-0000-4000-8000-000000000002', 'passport.fact.created', 'user', 'business_fact', '82420000-0000-4000-8000-000000000005', '{"factKey":"identity.other_test"}'::jsonb, null);

select tests.authenticate_as('timeline_member');

select results_eq(
  $$select count(*) from public.business_facts$$,
  array[1::bigint],
  'Member cannot read personal, financial or restricted fact values'
);

select results_eq(
  $$select fact_key from public.business_facts$$,
  array['identity.public_test'::text],
  'The only readable fact is the internal one'
);

select results_eq(
  $$select count(*) from public.business_timeline_events$$,
  array[2::bigint],
  'Member sees only internal fact and unrelated mission event'
);

select results_eq(
  $$select payload->>'factKey' from public.business_timeline_events where subject_type='business_fact'$$,
  array['identity.public_test'::text],
  'Member cannot infer sensitive fact keys from timeline payload'
);

select results_eq(
  $$select count(*) from public.business_timeline_events where source_ref like 'secret-%'$$,
  array[0::bigint],
  'Member cannot read sensitive source references through Data API table'
);

select tests.authenticate_as('timeline_manager');

select results_eq(
  $$select count(*) from public.business_timeline_events$$,
  array[5::bigint],
  'Manager sees four same-tenant fact events and unrelated mission event'
);

select results_eq(
  $$select count(*) from public.business_timeline_events where source_ref like 'secret-%'$$,
  array[3::bigint],
  'Manager may read sensitive source references'
);

select results_eq(
  $$select count(*) from public.business_timeline_events where source_ref = 'wrong-company-ref'$$,
  array[0::bigint],
  'A fact event cannot point to a fact in another company of the same tenant'
);

select tests.authenticate_as('timeline_owner');

select results_eq(
  $$select count(*) from public.business_timeline_events$$,
  array[5::bigint],
  'Owner sees authorized events, but not malformed fact reference'
);

select tests.authenticate_as('timeline_other_member');

select results_eq(
  $$select count(*) from public.business_timeline_events$$,
  array[1::bigint],
  'Member of another tenant sees no first-tenant events'
);

select results_eq(
  $$select count(*) from public.business_facts$$,
  array[1::bigint],
  'Member of another tenant cannot read first-tenant facts'
);

select * from finish();
rollback;
