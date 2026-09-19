begin;

select plan(3);

select tests.create_supabase_user('fk_user_a', 'fk-a@genesis.test');
select tests.create_supabase_user('fk_user_b', 'fk-b@genesis.test');
select tests.authenticate_as_service_role();

insert into public.tenants(id, name) values
  ('41000000-0000-0000-0000-000000000001', 'FK Tenant A'),
  ('42000000-0000-0000-0000-000000000002', 'FK Tenant B');

insert into public.memberships(tenant_id, user_id, role) values
  ('41000000-0000-0000-0000-000000000001', tests.get_supabase_uid('fk_user_a'), 'owner'),
  ('42000000-0000-0000-0000-000000000002', tests.get_supabase_uid('fk_user_b'), 'owner');

insert into public.companies(id, tenant_id, trade_name) values
  ('41100000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000001', 'FK Company A'),
  ('42200000-0000-0000-0000-000000000002', '42000000-0000-0000-0000-000000000002', 'FK Company B');

insert into public.diagnostic_versions(id, version, status, content_hash)
values (
  '43000000-0000-0000-0000-000000000003',
  'fk-test',
  'published',
  'fk-test'
);

insert into public.diagnostics(
  id, tenant_id, company_id, diagnostic_version_id, status
) values (
  '44000000-0000-0000-0000-000000000004',
  '42000000-0000-0000-0000-000000000002',
  '42200000-0000-0000-0000-000000000002',
  '43000000-0000-0000-0000-000000000003',
  'draft'
);

select throws_ok(
  $$insert into public.answers(
      tenant_id, diagnostic_id, question_id, response, maturity
    ) values (
      '41000000-0000-0000-0000-000000000001',
      '44000000-0000-0000-0000-000000000004',
      'EST-001',
      '{"maturity":2}'::jsonb,
      2
    )$$,
  '23503',
  'insert or update on table "answers" violates foreign key constraint "answers_diagnostic_same_tenant_fk"',
  'Even service role cannot create cross-tenant diagnostic reference'
);

insert into public.diagnostics(
  id, tenant_id, company_id, diagnostic_version_id, status
) values (
  '45000000-0000-0000-0000-000000000005',
  '41000000-0000-0000-0000-000000000001',
  '41100000-0000-0000-0000-000000000001',
  '43000000-0000-0000-0000-000000000003',
  'draft'
);

select throws_ok(
  $$insert into public.pain_findings(
      tenant_id, company_id, diagnostic_id, dimension, pain_code, title,
      severity, confidence, rule_version
    ) values (
      '41000000-0000-0000-0000-000000000001',
      '42200000-0000-0000-0000-000000000002',
      '45000000-0000-0000-0000-000000000005',
      'FIN',
      'TEST',
      'Cross-company',
      .5,
      .5,
      'v1'
    )$$,
  '23514',
  'COMPANY_TENANT_MISMATCH',
  'Company/tenant trigger rejects cross-tenant company before relation is persisted'
);

select lives_ok(
  $$insert into public.answers(
      tenant_id, diagnostic_id, question_id, response, maturity
    ) values (
      '41000000-0000-0000-0000-000000000001',
      '45000000-0000-0000-0000-000000000005',
      'EST-001',
      '{"maturity":2}'::jsonb,
      2
    )$$,
  'Same-tenant diagnostic reference remains valid'
);

select * from finish();
rollback;
