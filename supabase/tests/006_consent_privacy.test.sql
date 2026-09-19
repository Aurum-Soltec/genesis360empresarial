begin;

select plan(2);

select tests.create_supabase_user('consent_owner_a', 'consent-a@genesis.test');
select tests.create_supabase_user('consent_member_b', 'consent-b@genesis.test');
select tests.authenticate_as_service_role();

insert into public.tenants(id, name)
values ('61000000-0000-0000-0000-000000000001', 'Consent Tenant');

insert into public.memberships(tenant_id, user_id, role) values
  (
    '61000000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('consent_owner_a'),
    'owner'
  ),
  (
    '61000000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('consent_member_b'),
    'member'
  );

insert into public.companies(id, tenant_id, trade_name)
values (
  '61100000-0000-0000-0000-000000000001',
  '61000000-0000-0000-0000-000000000001',
  'Consent Company'
);

insert into public.consent_versions(
  id, code, version, content_hash, active, purpose_code
) values (
  '61200000-0000-0000-0000-000000000001',
  'CONSENT_PRIVACY_TEST',
  '1',
  'consent-privacy-test',
  true,
  'AI_PROCESSING'
);

insert into public.consents(
  id, tenant_id, company_id, user_id, consent_version_id,
  purpose, purpose_code, granted, granted_at, decision_at
) values (
  '61300000-0000-0000-0000-000000000001',
  '61000000-0000-0000-0000-000000000001',
  '61100000-0000-0000-0000-000000000001',
  tests.get_supabase_uid('consent_member_b'),
  '61200000-0000-0000-0000-000000000001',
  'AI_PROCESSING',
  'AI_PROCESSING',
  true,
  now(),
  now()
);

select tests.authenticate_as('consent_owner_a');

select results_eq(
  $$select count(*) from public.consents$$,
  array[0::bigint],
  'Owner cannot read another user consent merely because they share a tenant'
);

select tests.authenticate_as('consent_member_b');

select results_eq(
  $$select count(*) from public.consents
    where purpose_code = 'AI_PROCESSING'$$,
  array[1::bigint],
  'User can read own consent decision'
);

select * from finish();
rollback;
