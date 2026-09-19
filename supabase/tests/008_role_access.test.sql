begin;

select plan(7);

select tests.create_supabase_user('rbac_owner', 'rbac-owner@genesis.test');
select tests.create_supabase_user('rbac_manager', 'rbac-manager@genesis.test');
select tests.create_supabase_user('rbac_member', 'rbac-member@genesis.test');
select tests.create_supabase_user('rbac_auditor', 'rbac-auditor@genesis.test');
select tests.authenticate_as_service_role();

insert into public.tenants(id, name)
values ('81000000-0000-0000-0000-000000000001', 'RBAC Tenant');

insert into public.memberships(tenant_id, user_id, role) values
  (
    '81000000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('rbac_owner'),
    'owner'
  ),
  (
    '81000000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('rbac_manager'),
    'manager'
  ),
  (
    '81000000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('rbac_member'),
    'member'
  ),
  (
    '81000000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('rbac_auditor'),
    'auditor'
  );

insert into public.companies(id, tenant_id, trade_name)
values (
  '81100000-0000-0000-0000-000000000001',
  '81000000-0000-0000-0000-000000000001',
  'RBAC Company'
);

insert into public.business_facts(
  tenant_id, company_id, fact_key, value, source, sensitivity
) values
  (
    '81000000-0000-0000-0000-000000000001',
    '81100000-0000-0000-0000-000000000001',
    'identity.public_test',
    '"visible"'::jsonb,
    'declared',
    'internal'
  ),
  (
    '81000000-0000-0000-0000-000000000001',
    '81100000-0000-0000-0000-000000000001',
    'finance.sensitive_test',
    '"restricted"'::jsonb,
    'declared',
    'financial'
  );

insert into public.audit_events(
  tenant_id, actor_id, action, resource_type, resource_id
) values (
  '81000000-0000-0000-0000-000000000001',
  tests.get_supabase_uid('rbac_owner'),
  'test',
  'company',
  '81100000-0000-0000-0000-000000000001'
);

select tests.authenticate_as('rbac_member');

select results_eq(
  $$select count(*) from public.companies$$,
  array[1::bigint],
  'Member can read tenant company'
);

select throws_ok(
  $$insert into public.companies(
      tenant_id, trade_name
    ) values (
      '81000000-0000-0000-0000-000000000001',
      'Member Cannot Create'
    )$$,
  '42501',
  null,
  'Member cannot create company'
);

select results_eq(
  $$select count(*) from public.business_facts$$,
  array[1::bigint],
  'Member sees internal fact but not financial fact'
);

select results_eq(
  $$select count(*) from public.audit_events$$,
  array[0::bigint],
  'Member cannot read audit events'
);

select tests.authenticate_as('rbac_manager');

select lives_ok(
  $$insert into public.companies(
      tenant_id, trade_name
    ) values (
      '81000000-0000-0000-0000-000000000001',
      'Manager Created Company'
    )$$,
  'Manager can create company'
);

select results_eq(
  $$select count(*) from public.business_facts$$,
  array[2::bigint],
  'Manager can read sensitive Business Passport fact'
);

select tests.authenticate_as('rbac_auditor');

select results_eq(
  $$select count(*) from public.audit_events$$,
  array[1::bigint],
  'Auditor can read audit events'
);

select * from finish();
rollback;
