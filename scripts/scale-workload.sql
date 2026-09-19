\set tenant random(1, :tenant_count)
select id,status,created_at from public.diagnostics
where tenant_id = md5('load-tenant-' || :tenant)::uuid and status='scored'
order by created_at desc limit 1;
select id,action,created_at from public.audit_events
where tenant_id = md5('load-tenant-' || :tenant)::uuid
order by created_at desc limit 50;
select id,status,available_at from public.event_outbox
where tenant_id = md5('load-tenant-' || :tenant)::uuid
order by created_at desc limit 25;
