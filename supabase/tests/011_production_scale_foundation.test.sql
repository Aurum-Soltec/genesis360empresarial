begin;
select plan(15);

select has_table('public','outbox_attempts','outbox attempts are durable');
select has_table('public','tenant_operation_limits','tenant quotas exist');
select has_table('public','tenant_rate_windows','rate windows exist');
select has_table('public','tenant_storage_quotas','storage quotas exist');
select has_view('public','outbox_operational_health','outbox metrics view exists');
select has_view('public','database_operational_health','database metrics view exists');
select has_function('public','consume_tenant_quota',array['uuid','text','integer','integer'],'quota function exists');
select has_function('public','reprocess_dead_event_outbox',array['uuid','uuid','uuid','text'],'controlled reprocess exists');
select ok((select not public from storage.buckets where id='genesis-private-documents'),'document bucket is private');
select is((select file_size_limit from storage.buckets where id='genesis-private-documents'),10485760::bigint,'bucket limit is 10 MiB');
select is((select count(*)::integer from pg_policies where schemaname='storage' and tablename='objects' and policyname like 'genesis_documents_%'),3,'storage has three scoped policies');

select tests.create_supabase_user('ps_user','ps-user@genesis.test');
select tests.authenticate_as_service_role();
insert into public.tenants(id,name) values ('92000000-0000-4000-8000-000000000001','PS Tenant');
insert into public.memberships(tenant_id,user_id,role)
values ('92000000-0000-4000-8000-000000000001',tests.get_supabase_uid('ps_user'),'owner');

select tests.authenticate_as('ps_user');
select is((select allowed from public.consume_tenant_quota('92000000-0000-4000-8000-000000000001','test.limit',1,60)),true,'first request is allowed');
select is((select allowed from public.consume_tenant_quota('92000000-0000-4000-8000-000000000001','test.limit',1,60)),false,'excess request is denied atomically');

select tests.authenticate_as_service_role();
insert into public.event_outbox(id,tenant_id,event_type,aggregate_type,aggregate_id,idempotency_key,status,attempts,max_attempts)
values ('92000000-0000-4000-8000-000000000002','92000000-0000-4000-8000-000000000001','test.dead','test','92000000-0000-4000-8000-000000000003','ps-test-dead','dead',1,1);
select lives_ok(
  $$select public.reprocess_dead_event_outbox('92000000-0000-4000-8000-000000000001','92000000-0000-4000-8000-000000000002',tests.get_supabase_uid('ps_user'),'approved operational retry')$$,
  'owner-authorized dead event can be reprocessed'
);
select is((select status from public.event_outbox where id='92000000-0000-4000-8000-000000000002'),'pending','reprocessed event returns to pending');

select * from finish();
rollback;
