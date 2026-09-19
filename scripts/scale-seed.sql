\set ON_ERROR_STOP on
insert into public.tenants(id,name)
select md5('load-tenant-' || g)::uuid, 'Load Tenant ' || g from generate_series(1,2000) g
on conflict (id) do nothing;

insert into public.companies(id,tenant_id,trade_name,fictional)
select md5('load-company-' || g)::uuid, md5('load-tenant-' || g)::uuid, 'Load Company ' || g, true
from generate_series(1,2000) g on conflict (id) do nothing;

insert into public.diagnostics(id,tenant_id,company_id,diagnostic_version_id,status,created_at)
select md5('load-diagnostic-' || g || '-' || n)::uuid,
       md5('load-tenant-' || g)::uuid, md5('load-company-' || g)::uuid,
       (select id from public.diagnostic_versions order by published_at desc nulls last limit 1),
       case when n=5 then 'draft' else 'scored' end,
       now() - make_interval(days => 5-n)
from generate_series(1,2000) g cross join generate_series(1,5) n
on conflict (id) do nothing;

insert into public.audit_events(tenant_id,action,resource_type,resource_id,metadata,created_at)
select md5('load-tenant-' || g)::uuid, 'load.test', 'company', md5('load-company-' || g)::text,
       '{}'::jsonb, now() - make_interval(secs => n)
from generate_series(1,2000) g cross join generate_series(1,10) n;

insert into public.event_outbox(id,tenant_id,event_type,aggregate_type,aggregate_id,idempotency_key,payload)
select md5('load-event-' || g || '-' || n)::uuid, md5('load-tenant-' || g)::uuid,
       'load.observed', 'company', md5('load-company-' || g)::uuid,
       'load:' || g || ':' || n, '{}'::jsonb
from generate_series(1,2000) g cross join generate_series(1,5) n
on conflict (id) do nothing;

analyze public.tenants; analyze public.companies; analyze public.diagnostics;
analyze public.audit_events; analyze public.event_outbox;
