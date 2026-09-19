begin;

select plan(3);

select tests.create_supabase_user('mission_owner', 'mission@genesis.test');
select tests.authenticate_as_service_role();

insert into public.tenants(id, name)
values ('30000000-0000-0000-0000-000000000003', 'Mission Tenant');

insert into public.memberships(tenant_id, user_id, role)
values (
  '30000000-0000-0000-0000-000000000003',
  tests.get_supabase_uid('mission_owner'),
  'owner'
);

insert into public.companies(id, tenant_id, trade_name)
values (
  '33000000-0000-0000-0000-000000000003',
  '30000000-0000-0000-0000-000000000003',
  'Mission Company'
);

insert into public.mission_templates(
  id, code, version, domain, title, objective, risk_level, status
) values (
  '34000000-0000-0000-0000-000000000003',
  'TEST-MISSION', 1, 'TEST', 'Test mission', 'Test invariant', 'low', 'published'
);

insert into public.missions(
  id, tenant_id, company_id, template_id, status
) values (
  '35000000-0000-0000-0000-000000000003',
  '30000000-0000-0000-0000-000000000003',
  '33000000-0000-0000-0000-000000000003',
  '34000000-0000-0000-0000-000000000003',
  'SUGGESTED'
);

select lives_ok(
  $$update public.missions
    set status = 'ACCEPTED', updated_at = now()
    where id = '35000000-0000-0000-0000-000000000003'$$,
  'SUGGESTED -> ACCEPTED is valid'
);

select throws_ok(
  $$update public.missions
    set status = 'OUTCOME_RECORDED', updated_at = now()
    where id = '35000000-0000-0000-0000-000000000003'$$,
  '23514',
  'INVALID_MISSION_TRANSITION:ACCEPTED->OUTCOME_RECORDED',
  'Mission cannot jump directly to outcome'
);

select results_eq(
  $$select status from public.missions
    where id = '35000000-0000-0000-0000-000000000003'$$,
  array['ACCEPTED'::text],
  'Invalid transition leaves state unchanged'
);

select * from finish();
rollback;
