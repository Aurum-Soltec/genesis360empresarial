begin;

select plan(6);

select tests.create_supabase_user('rc2_consent_user', 'rc2-consent@genesis.test');
select tests.authenticate_as_service_role();

insert into public.tenants(id, name)
values ('71000000-0000-0000-0000-000000000001', 'RC2 Guard Tenant');

insert into public.memberships(tenant_id, user_id, role)
values (
  '71000000-0000-0000-0000-000000000001',
  tests.get_supabase_uid('rc2_consent_user'),
  'owner'
);

insert into public.companies(id, tenant_id, trade_name)
values (
  '71100000-0000-0000-0000-000000000001',
  '71000000-0000-0000-0000-000000000001',
  'RC2 Guard Company'
);

insert into public.capabilities(id, code, version, domain, title, status)
values (
  '71300000-0000-0000-0000-000000000001',
  'RC2-GUARD-CAPABILITY',
  1,
  'governance',
  'RC2 Guard Capability',
  'published'
);

insert into public.consent_versions(
  id, code, version, content_hash, active, purpose_code
) values (
  '71200000-0000-0000-0000-000000000001',
  'RC2_AI_PROCESSING',
  '1',
  'rc2-ai-processing',
  true,
  'AI_PROCESSING'
);

select throws_ok(
  $$insert into public.consents(
      tenant_id, company_id, user_id, consent_version_id,
      purpose, purpose_code, granted, granted_at, decision_at
    ) values (
      '71000000-0000-0000-0000-000000000001',
      '71100000-0000-0000-0000-000000000001',
      tests.get_supabase_uid('rc2_consent_user'),
      '71200000-0000-0000-0000-000000000001',
      'QUALIFIED_MATCHING', 'QUALIFIED_MATCHING', true, now(), now()
    )$$,
  '23514',
  null,
  'Consent version cannot authorize a different purpose'
);

select throws_ok(
  $$insert into public.consent_versions(
      code, version, content_hash, active, purpose_code
    ) values ('RC2_UNBOUND_ACTIVE', '1', 'unbound', true, null)$$,
  '23514',
  null,
  'New active consent version must declare its purpose'
);

select throws_ok(
  $$insert into public.provider_capabilities(
      tenant_id, company_id, capability_id, qualification_status,
      qualification_score, capacity_status, compliance_status
    ) values (
      '71000000-0000-0000-0000-000000000001',
      '71100000-0000-0000-0000-000000000001',
      '71300000-0000-0000-0000-000000000001',
      'qualified', 101, 'available', 'valid'
    )$$,
  '23514',
  null,
  'Qualification score above 100 is rejected'
);

select lives_ok(
  $$insert into public.consents(
      tenant_id, company_id, user_id, consent_version_id,
      purpose, purpose_code, granted, granted_at, decision_at
    ) values (
      '71000000-0000-0000-0000-000000000001',
      '71100000-0000-0000-0000-000000000001',
      tests.get_supabase_uid('rc2_consent_user'),
      '71200000-0000-0000-0000-000000000001',
      'AI_PROCESSING', 'AI_PROCESSING', true, now(), now()
    )$$,
  'Consent version authorizes its bound purpose'
);

select ok(
  has_table_privilege('authenticated', 'public.consents', 'SELECT'),
  'Authenticated role can read own consent through RLS'
);

select has_column(
  'public',
  'diagnostics',
  'rules_version',
  'Diagnostic snapshot has a rule-version column'
);

select * from finish();
rollback;
