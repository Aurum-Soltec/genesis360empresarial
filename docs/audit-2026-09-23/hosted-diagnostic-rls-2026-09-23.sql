-- HSP-4 hosted RLS probe for migration 0024.
-- All synthetic rows, memberships, claims and result rows live in one
-- transaction. The final ROLLBACK is mandatory: do not remove it.
-- No service-role session is used for the observations; each assertion runs
-- under SET LOCAL ROLE authenticated with a distinct simulated auth.uid().
begin;

do $$
begin
  if exists (select 1 from public.tenants where id::text like '93400000-%')
    or exists (select 1 from auth.users where id::text like '93490000-%') then
    raise exception 'HSP4_FIXTURE_COLLISION';
  end if;
end
$$;

create temp table hsp4_rls_results (
  case_name text primary key,
  expected bigint not null,
  observed bigint not null,
  passed boolean not null
) on commit drop;
grant select, insert on pg_temp.hsp4_rls_results to authenticated;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
select id, '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated', 'authenticated', identifier || '@example.invalid', '',
  now(), '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('hsp4_fixture', identifier), now(), now()
from (values
  ('93490000-0000-4000-8000-000000000001'::uuid, 'hsp4-owner'),
  ('93490000-0000-4000-8000-000000000002'::uuid, 'hsp4-manager'),
  ('93490000-0000-4000-8000-000000000003'::uuid, 'hsp4-member'),
  ('93490000-0000-4000-8000-000000000004'::uuid, 'hsp4-other')
) as users(id, identifier);

insert into public.tenants(id, name) values
  ('93400000-0000-4000-8000-000000000001', 'HSP4 Synthetic Tenant A'),
  ('93400000-0000-4000-8000-000000000002', 'HSP4 Synthetic Tenant B');

insert into public.memberships(tenant_id, user_id, role) values
  ('93400000-0000-4000-8000-000000000001', '93490000-0000-4000-8000-000000000001', 'owner'),
  ('93400000-0000-4000-8000-000000000001', '93490000-0000-4000-8000-000000000002', 'manager'),
  ('93400000-0000-4000-8000-000000000001', '93490000-0000-4000-8000-000000000003', 'member'),
  ('93400000-0000-4000-8000-000000000002', '93490000-0000-4000-8000-000000000004', 'member');

insert into public.companies(id, tenant_id, trade_name) values
  ('93410000-0000-4000-8000-000000000001', '93400000-0000-4000-8000-000000000001', 'HSP4 Synthetic Company A'),
  ('93410000-0000-4000-8000-000000000003', '93400000-0000-4000-8000-000000000001', 'HSP4 Synthetic Company A2'),
  ('93410000-0000-4000-8000-000000000002', '93400000-0000-4000-8000-000000000002', 'HSP4 Synthetic Company B');

insert into public.business_facts(id, tenant_id, company_id, fact_key, value, source, sensitivity) values
  ('93420000-0000-4000-8000-000000000001', '93400000-0000-4000-8000-000000000001', '93410000-0000-4000-8000-000000000001', 'identity.public_test', '"visible"'::jsonb, 'declared', 'internal'),
  ('93420000-0000-4000-8000-000000000002', '93400000-0000-4000-8000-000000000001', '93410000-0000-4000-8000-000000000001', 'people.personal_test', '"hidden-personal"'::jsonb, 'declared', 'personal'),
  ('93420000-0000-4000-8000-000000000003', '93400000-0000-4000-8000-000000000001', '93410000-0000-4000-8000-000000000001', 'finance.sensitive_test', '"hidden-financial"'::jsonb, 'declared', 'financial'),
  ('93420000-0000-4000-8000-000000000004', '93400000-0000-4000-8000-000000000001', '93410000-0000-4000-8000-000000000001', 'strategy.restricted_test', '"hidden-restricted"'::jsonb, 'declared', 'restricted'),
  ('93420000-0000-4000-8000-000000000005', '93400000-0000-4000-8000-000000000002', '93410000-0000-4000-8000-000000000002', 'identity.other_test', '"other-tenant"'::jsonb, 'declared', 'internal');

insert into public.business_timeline_events(
  tenant_id, company_id, event_type, actor_type, subject_type, subject_id, payload, source_ref
) values
  ('93400000-0000-4000-8000-000000000001', '93410000-0000-4000-8000-000000000001', 'passport.fact.created', 'user', 'business_fact', '93420000-0000-4000-8000-000000000001', '{"factKey":"identity.public_test"}'::jsonb, 'public-ref'),
  ('93400000-0000-4000-8000-000000000001', '93410000-0000-4000-8000-000000000001', 'passport.fact.created', 'user', 'business_fact', '93420000-0000-4000-8000-000000000002', '{"factKey":"people.personal_test"}'::jsonb, 'secret-personal-ref'),
  ('93400000-0000-4000-8000-000000000001', '93410000-0000-4000-8000-000000000001', 'passport.fact.created', 'user', 'business_fact', '93420000-0000-4000-8000-000000000003', '{"factKey":"finance.sensitive_test"}'::jsonb, 'secret-financial-ref'),
  ('93400000-0000-4000-8000-000000000001', '93410000-0000-4000-8000-000000000001', 'passport.fact.created', 'user', 'business_fact', '93420000-0000-4000-8000-000000000004', '{"factKey":"strategy.restricted_test"}'::jsonb, 'secret-restricted-ref'),
  ('93400000-0000-4000-8000-000000000001', '93410000-0000-4000-8000-000000000001', 'mission.suggested', 'system', 'mission', '93430000-0000-4000-8000-000000000001', '{"status":"SUGGESTED"}'::jsonb, null),
  ('93400000-0000-4000-8000-000000000001', '93410000-0000-4000-8000-000000000001', 'passport.fact.created', 'user', 'business_fact', 'not-a-uuid', '{"factKey":"secret.orphaned"}'::jsonb, 'secret-orphaned-ref'),
  ('93400000-0000-4000-8000-000000000001', '93410000-0000-4000-8000-000000000003', 'passport.fact.created', 'user', 'business_fact', '93420000-0000-4000-8000-000000000001', '{"factKey":"identity.public_test"}'::jsonb, 'wrong-company-ref'),
  ('93400000-0000-4000-8000-000000000002', '93410000-0000-4000-8000-000000000002', 'passport.fact.created', 'user', 'business_fact', '93420000-0000-4000-8000-000000000005', '{"factKey":"identity.other_test"}'::jsonb, null);

select set_config('request.jwt.claim.sub', '93490000-0000-4000-8000-000000000003', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;
insert into pg_temp.hsp4_rls_results
select 'member_internal_fact_only', 1, count(*), count(*) = 1
from public.business_facts;
insert into pg_temp.hsp4_rls_results
select 'member_timeline_internal_and_mission', 2, count(*), count(*) = 2
from public.business_timeline_events;
insert into pg_temp.hsp4_rls_results
select 'member_no_sensitive_source_ref', 0, count(*), count(*) = 0
from public.business_timeline_events where source_ref like 'secret-%';
insert into pg_temp.hsp4_rls_results
select 'member_no_sensitive_fact_payload', 0, count(*), count(*) = 0
from public.business_timeline_events
where payload->>'factKey' in ('people.personal_test','finance.sensitive_test','strategy.restricted_test');
reset role;

select set_config('request.jwt.claim.sub', '93490000-0000-4000-8000-000000000002', true);
set local role authenticated;
insert into pg_temp.hsp4_rls_results
select 'manager_all_own_tenant_facts', 4, count(*), count(*) = 4
from public.business_facts where tenant_id = '93400000-0000-4000-8000-000000000001';
insert into pg_temp.hsp4_rls_results
select 'manager_four_facts_and_mission', 5, count(*), count(*) = 5
from public.business_timeline_events;
insert into pg_temp.hsp4_rls_results
select 'manager_sensitive_sources', 3, count(*), count(*) = 3
from public.business_timeline_events where source_ref like 'secret-%';
insert into pg_temp.hsp4_rls_results
select 'manager_no_wrong_company_reference', 0, count(*), count(*) = 0
from public.business_timeline_events where source_ref = 'wrong-company-ref';
reset role;

select set_config('request.jwt.claim.sub', '93490000-0000-4000-8000-000000000001', true);
set local role authenticated;
insert into pg_temp.hsp4_rls_results
select 'owner_no_malformed_reference', 5, count(*), count(*) = 5
from public.business_timeline_events;
reset role;

select set_config('request.jwt.claim.sub', '93490000-0000-4000-8000-000000000004', true);
set local role authenticated;
insert into pg_temp.hsp4_rls_results
select 'other_tenant_no_first_tenant_events', 0, count(*), count(*) = 0
from public.business_timeline_events where tenant_id = '93400000-0000-4000-8000-000000000001';
insert into pg_temp.hsp4_rls_results
select 'other_tenant_no_first_tenant_facts', 0, count(*), count(*) = 0
from public.business_facts where tenant_id = '93400000-0000-4000-8000-000000000001';
insert into pg_temp.hsp4_rls_results
select 'other_tenant_own_event', 1, count(*), count(*) = 1
from public.business_timeline_events;
reset role;

select case_name, expected, observed, passed from pg_temp.hsp4_rls_results order by case_name;
rollback;
