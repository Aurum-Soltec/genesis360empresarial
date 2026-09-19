begin;

select plan(11);

select tests.create_supabase_user('genesis_user_a', 'a@genesis.test');
select tests.create_supabase_user('genesis_user_b', 'b@genesis.test');
select tests.authenticate_as_service_role();

insert into public.tenants(id, name) values
  ('10000000-0000-0000-0000-000000000001', 'Tenant A'),
  ('20000000-0000-0000-0000-000000000002', 'Tenant B');

insert into public.memberships(tenant_id, user_id, role) values
  (
    '10000000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('genesis_user_a'),
    'owner'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    tests.get_supabase_uid('genesis_user_b'),
    'owner'
  );

insert into public.companies(id, tenant_id, trade_name) values
  (
    '11000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Company A'
  ),
  (
    '22000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    'Company B'
  );

insert into public.evidence_items(
  id, tenant_id, company_id, evidence_type, summary
) values (
  '23000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000002',
  '22000000-0000-0000-0000-000000000002',
  'observation',
  'Tenant B fixture'
);

select tests.authenticate_as('genesis_user_a');

select results_eq(
  $$select count(*) from public.companies$$,
  array[1::bigint],
  'User A sees only own tenant company'
);

select results_eq(
  $$select count(*) from public.companies where tenant_id = '20000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'User A sees zero Tenant B companies'
);

select is(
  (select private.is_tenant_member('10000000-0000-0000-0000-000000000001')),
  true,
  'Private helper recognizes Tenant A membership'
);

select is(
  (select private.is_tenant_member('20000000-0000-0000-0000-000000000002')),
  false,
  'Private helper rejects Tenant B membership'
);

select throws_ok(
  $$insert into public.companies(tenant_id, trade_name)
    values ('20000000-0000-0000-0000-000000000002', 'Forbidden')$$,
  '42501',
  'new row violates row-level security policy for table "companies"',
  'User A cannot insert into Tenant B'
);

select is_empty(
  $$update public.companies
    set trade_name = 'Hacked'
    where id = '22000000-0000-0000-0000-000000000002'
    returning id$$,
  'User A cannot update Tenant B'
);

select throws_ok(
  $$delete from public.companies
    where id = '22000000-0000-0000-0000-000000000002'$$,
  '42501',
  'permission denied for table companies',
  'Authenticated clients have no direct company DELETE privilege'
);

select results_eq(
  $$select count(*) from public.evidence_items
    where tenant_id = '20000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'User A sees zero Tenant B evidence'
);

select throws_ok(
  $$insert into public.evidence_items(
      tenant_id, company_id, evidence_type, summary
    ) values (
      '10000000-0000-0000-0000-000000000001',
      '11000000-0000-0000-0000-000000000001',
      'user_declaration',
      'Direct client write must be blocked'
    )$$,
  '42501',
  'permission denied for table evidence_items',
  'Authenticated client cannot write controlled Evidence Ledger directly'
);

select throws_ok(
  $$insert into public.consents(
      tenant_id, user_id, consent_version_id, purpose, granted
    ) values (
      '10000000-0000-0000-0000-000000000001',
      tests.get_supabase_uid('genesis_user_a'),
      '00000000-0000-0000-0000-000000000000',
      'CORE_OPERATION',
      true
    )$$,
  '42501',
  'permission denied for table consents',
  'Authenticated client cannot bypass consent API with direct table write'
);

select throws_ok(
  $$select public.is_tenant_member('10000000-0000-0000-0000-000000000001')$$,
  '42501',
  'permission denied for function is_tenant_member',
  'Legacy exposed helper is not callable by authenticated clients'
);

select * from finish();
rollback;
