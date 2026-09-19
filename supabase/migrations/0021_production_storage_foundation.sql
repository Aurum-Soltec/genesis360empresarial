begin;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values (
  'genesis-private-documents', 'genesis-private-documents', false, 10485760,
  array['application/pdf','image/png','image/jpeg','text/csv']
)
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table public.tenant_storage_quotas (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  max_bytes bigint not null default 1073741824 check (max_bytes between 10485760 and 1099511627776),
  retention_days integer not null default 365 check (retention_days between 1 and 3650),
  updated_at timestamptz not null default now()
);
alter table public.tenant_storage_quotas enable row level security;
revoke all on public.tenant_storage_quotas from anon, authenticated;

alter table public.document_upload_items
  add column if not exists scan_status text not null default 'PENDING'
    check (scan_status in ('PENDING','CLEAN','INFECTED','ERROR')),
  add column if not exists retention_until timestamptz,
  add column if not exists deleted_at timestamptz;

create index if not exists document_upload_items_tenant_status_idx
  on public.document_upload_items(tenant_id, status, created_at desc);

create policy "genesis_documents_insert_own_session"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'genesis-private-documents'
  and (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$'
  and exists (
    select 1 from public.document_upload_sessions s
    where s.tenant_id::text = (storage.foldername(name))[1]
      and s.company_id::text = (storage.foldername(name))[2]
      and s.id::text = (storage.foldername(name))[3]
      and s.user_id = auth.uid() and s.status in ('CREATED','UPLOADING') and s.expires_at > now()
  )
);

create policy "genesis_documents_select_own_session"
on storage.objects for select to authenticated
using (
  bucket_id = 'genesis-private-documents'
  and exists (
    select 1 from public.document_upload_sessions s
    where s.tenant_id::text = (storage.foldername(name))[1]
      and s.company_id::text = (storage.foldername(name))[2]
      and s.id::text = (storage.foldername(name))[3]
      and s.user_id = auth.uid()
  )
);

create policy "genesis_documents_delete_own_session"
on storage.objects for delete to authenticated
using (
  bucket_id = 'genesis-private-documents'
  and exists (
    select 1 from public.document_upload_sessions s
    where s.tenant_id::text = (storage.foldername(name))[1]
      and s.id::text = (storage.foldername(name))[3]
      and s.user_id = auth.uid()
  )
);

commit;
