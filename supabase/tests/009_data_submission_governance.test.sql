begin;

select plan(7);

select tests.create_supabase_user('upload_user', 'upload@genesis.test');
select tests.authenticate_as_service_role();

insert into public.tenants(id, name)
values ('91000000-0000-0000-0000-000000000001', 'Upload Tenant');

insert into public.memberships(tenant_id, user_id, role)
values (
  '91000000-0000-0000-0000-000000000001',
  tests.get_supabase_uid('upload_user'),
  'owner'
);

insert into public.companies(id, tenant_id, trade_name)
values (
  '91100000-0000-0000-0000-000000000001',
  '91000000-0000-0000-0000-000000000001',
  'Upload Company'
);

select throws_ok(
  $$select public.accept_data_submission_attestation(
    '91000000-0000-0000-0000-000000000001',
    '91100000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('upload_user'),
    (select id from public.data_submission_attestation_versions
      where code = 'DIAGNOSTIC_EVIDENCE_UPLOAD' limit 1),
    'upload_session',
    null,
    '{}'::jsonb
  )$$,
  '23514',
  'ATTESTATION_VERSION_NOT_ACTIVE',
  'Draft legal copy cannot be accepted'
);

update public.data_submission_attestation_versions
set status = 'active', effective_at = now()
where code = 'DIAGNOSTIC_EVIDENCE_UPLOAD';

select lives_ok(
  $$select public.accept_data_submission_attestation(
    '91000000-0000-0000-0000-000000000001',
    '91100000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('upload_user'),
    (select id from public.data_submission_attestation_versions
      where code = 'DIAGNOSTIC_EVIDENCE_UPLOAD' and status = 'active'),
    'upload_session',
    'batch-1',
    '{}'::jsonb
  )$$,
  'Active attestation can be accepted'
);

select results_eq(
  $$select count(*) from public.event_outbox
    where event_type = 'data_submission.attestation.accepted'$$,
  array[1::bigint],
  'Attestation acceptance is auditable through the outbox'
);

select lives_ok(
  $$select public.create_document_upload_session(
    '91000000-0000-0000-0000-000000000001',
    '91100000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('upload_user'),
    (select id from public.data_submission_attestations
      order by accepted_at desc limit 1),
    'CORE_OPERATION'
  )$$,
  'Upload session can be created only after active attestation'
);

select results_eq(
  $$select count(*) from public.document_upload_sessions$$,
  array[1::bigint],
  'Exactly one governed upload session exists'
);

update public.data_submission_attestation_versions
set status = 'retired'
where code = 'DIAGNOSTIC_EVIDENCE_UPLOAD';

select throws_ok(
  $$select public.create_document_upload_session(
    '91000000-0000-0000-0000-000000000001',
    '91100000-0000-0000-0000-000000000001',
    tests.get_supabase_uid('upload_user'),
    (select id from public.data_submission_attestations
      order by accepted_at desc limit 1),
    'CORE_OPERATION'
  )$$,
  '23514',
  'ATTESTATION_REFRESH_REQUIRED',
  'Retired text requires a fresh attestation version'
);

select tests.authenticate_as('upload_user');

select results_eq(
  $$select count(*) from public.data_submission_attestations$$,
  array[1::bigint],
  'User can read own attestation audit record'
);

select * from finish();
rollback;
