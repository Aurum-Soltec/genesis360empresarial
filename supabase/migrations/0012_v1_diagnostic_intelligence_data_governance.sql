begin;

alter table public.diagnostic_versions
  add column if not exists strategy_version text not null default '1.1';

alter table public.diagnostics
  add column if not exists strategy_version text not null default '1.1',
  add column if not exists progress_percent smallint check (progress_percent between 0 and 100),
  add column if not exists confidence_level text
    check (confidence_level is null or confidence_level in ('LOW','MODERATE','GOOD','HIGH')),
  add column if not exists confidence_breakdown jsonb not null default '{}'::jsonb,
  add column if not exists estimated_question_count smallint
    check (estimated_question_count is null or estimated_question_count between 1 and 144),
  add column if not exists active_stage_code text;

alter table public.answers
  add column if not exists answer_state text not null default 'ANSWERED'
    check (answer_state in ('ANSWERED','UNKNOWN','NOT_APPLICABLE','DEFERRED')),
  add column if not exists completeness_score numeric(6,5)
    check (completeness_score is null or completeness_score between 0 and 1),
  add column if not exists evidence_strength numeric(6,5)
    check (evidence_strength is null or evidence_strength between 0 and 1),
  add column if not exists consistency_score numeric(6,5)
    check (consistency_score is null or consistency_score between 0 and 1),
  add column if not exists freshness_score numeric(6,5)
    check (freshness_score is null or freshness_score between 0 and 1),
  add column if not exists information_slots jsonb not null default '{}'::jsonb,
  add column if not exists evidence_refs jsonb not null default '[]'::jsonb,
  add column if not exists quality_version text not null default 'confidence-v1.1';

create unique index if not exists diagnostics_one_draft_profile_uidx
  on public.diagnostics(tenant_id, company_id, profile_code)
  where status = 'draft';

create table public.data_submission_attestation_versions (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  version text not null,
  purpose_code text not null,
  title text not null,
  declaration_text text not null,
  warning_text text not null,
  genesis_responsibility_text text not null,
  content_hash text not null,
  status text not null default 'draft'
    check (status in ('draft','active','retired')),
  effective_at timestamptz,
  created_at timestamptz not null default now(),
  unique(code, version)
);

create unique index data_submission_attestation_one_active_uidx
  on public.data_submission_attestation_versions(code)
  where status = 'active';

insert into public.data_submission_attestation_versions(
  code, version, purpose_code, title, declaration_text, warning_text,
  genesis_responsibility_text, content_hash, status
)
values (
  'DIAGNOSTIC_EVIDENCE_UPLOAD',
  '1.0-draft',
  'CORE_OPERATION',
  'Declaração de autorização e legitimidade',
  $genesis$Declaro que possuo os direitos, poderes, autorizações ou outra legitimidade necessária para disponibilizar à GENESIS as informações, documentos e demais conteúdos enviados para processamento nas finalidades apresentadas. Declaro também que sou responsável pela legitimidade do conteúdo que disponibilizo.$genesis$,
  $genesis$Não envie material cuja divulgação, compartilhamento ou processamento seja proibido ou viole direitos autorais, deveres de confidencialidade, contratos, propriedade intelectual, sigilo ou direitos de terceiros. Envie somente o conteúdo necessário para a finalidade apresentada e não envie senhas, tokens, chaves privadas ou outras credenciais de acesso.$genesis$,
  $genesis$A declaração do usuário não substitui, reduz nem transfere as obrigações independentes da GENESIS relativas à segurança da informação, privacidade, proteção de dados pessoais, LGPD, contratos, propriedade intelectual e demais leis e obrigações aplicáveis. O usuário responde pela legitimidade do conteúdo que disponibiliza; a GENESIS continua respondendo pelas obrigações que lhe forem aplicáveis após receber e processar esse conteúdo.$genesis$,
  'd8cf50507b0f841fe2a923985e7254ceb9e65282524d98a31d779df559646bf5',
  'draft'
)
on conflict (code, version) do nothing;

create table public.data_submission_attestations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  attestation_version_id uuid not null references public.data_submission_attestation_versions(id),
  purpose_code text not null,
  scope_kind text not null
    check (scope_kind in ('diagnostic','upload_session','evidence','integration')),
  scope_ref text,
  accepted boolean not null default true check (accepted = true),
  accepted_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index data_submission_attestations_user_idx
  on public.data_submission_attestations(tenant_id, user_id, accepted_at desc);

create trigger data_submission_attestations_company_tenant_guard
before insert or update on public.data_submission_attestations
for each row execute function public.enforce_company_tenant();

alter table public.data_submission_attestation_versions enable row level security;
alter table public.data_submission_attestations enable row level security;

create policy "attestation_versions_active_select"
on public.data_submission_attestation_versions for select to authenticated
using (status = 'active');

create policy "attestations_own_select"
on public.data_submission_attestations for select to authenticated
using (
  tenant_id is not null
  and (select private.is_tenant_member(tenant_id))
  and user_id = (select auth.uid())
);

revoke all on public.data_submission_attestation_versions,
  public.data_submission_attestations from anon, authenticated;
grant select on public.data_submission_attestation_versions,
  public.data_submission_attestations to authenticated;

create table public.document_upload_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  purpose_code text not null,
  attestation_id uuid not null references public.data_submission_attestations(id),
  status text not null default 'CREATED'
    check (status in ('CREATED','UPLOADING','COMPLETED','CANCELLED','EXPIRED')),
  expires_at timestamptz not null default (now() + interval '2 hours'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.document_upload_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  upload_session_id uuid not null references public.document_upload_sessions(id) on delete cascade,
  storage_ref text,
  file_name text not null,
  media_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  sha256 text,
  status text not null default 'PENDING'
    check (status in ('PENDING','UPLOADED','SCANNED','ACCEPTED','REJECTED','DELETED')),
  created_at timestamptz not null default now()
);

create unique index document_upload_sessions_tenant_company_id_uidx
  on public.document_upload_sessions(tenant_id, company_id, id);

create trigger document_upload_sessions_company_tenant_guard
before insert or update on public.document_upload_sessions
for each row execute function public.enforce_company_tenant();

create trigger document_upload_items_company_tenant_guard
before insert or update on public.document_upload_items
for each row execute function public.enforce_company_tenant();

alter table public.document_upload_sessions enable row level security;
alter table public.document_upload_items enable row level security;

create policy "document_upload_sessions_own_select"
on public.document_upload_sessions for select to authenticated
using (
  (select private.is_tenant_member(tenant_id))
  and user_id = (select auth.uid())
);

create policy "document_upload_items_own_session_select"
on public.document_upload_items for select to authenticated
using (
  (select private.is_tenant_member(tenant_id))
  and exists (
    select 1
    from public.document_upload_sessions s
    where s.id = upload_session_id
      and s.tenant_id = document_upload_items.tenant_id
      and s.user_id = (select auth.uid())
  )
);

revoke all on public.document_upload_sessions, public.document_upload_items
from anon, authenticated;
grant select on public.document_upload_sessions, public.document_upload_items
to authenticated;

create or replace function public.accept_data_submission_attestation(
  p_tenant_id uuid,
  p_company_id uuid,
  p_user_id uuid,
  p_attestation_version_id uuid,
  p_scope_kind text,
  p_scope_ref text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_version public.data_submission_attestation_versions%rowtype;
  v_id uuid;
begin
  if not exists (
    select 1 from public.companies c
    where c.id = p_company_id and c.tenant_id = p_tenant_id
  ) then
    raise exception 'COMPANY_TENANT_MISMATCH' using errcode = '23514';
  end if;

  select * into v_version
  from public.data_submission_attestation_versions v
  where v.id = p_attestation_version_id
    and v.status = 'active';

  if v_version.id is null then
    raise exception 'ATTESTATION_VERSION_NOT_ACTIVE' using errcode = '23514';
  end if;

  insert into public.data_submission_attestations(
    tenant_id, company_id, user_id, attestation_version_id,
    purpose_code, scope_kind, scope_ref, metadata
  )
  values (
    p_tenant_id, p_company_id, p_user_id, v_version.id,
    v_version.purpose_code, p_scope_kind, p_scope_ref, p_metadata
  )
  returning id into v_id;

  insert into public.event_outbox(
    tenant_id, company_id, event_type, aggregate_type,
    aggregate_id, idempotency_key, payload
  )
  values (
    p_tenant_id,
    p_company_id,
    'data_submission.attestation.accepted',
    'data_submission_attestations',
    v_id,
    'data_submission.attestation.accepted:' || v_id::text,
    jsonb_build_object(
      'attestationVersionId', v_version.id,
      'contentHash', v_version.content_hash,
      'scopeKind', p_scope_kind,
      'scopeRef', p_scope_ref,
      'purposeCode', v_version.purpose_code
    )
  );

  return v_id;
end
$$;

revoke all on function public.accept_data_submission_attestation(
  uuid, uuid, uuid, uuid, text, text, jsonb
) from public, anon, authenticated;
grant execute on function public.accept_data_submission_attestation(
  uuid, uuid, uuid, uuid, text, text, jsonb
) to service_role;

create or replace function public.create_document_upload_session(
  p_tenant_id uuid,
  p_company_id uuid,
  p_user_id uuid,
  p_attestation_id uuid,
  p_purpose_code text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attestation public.data_submission_attestations%rowtype;
  v_version public.data_submission_attestation_versions%rowtype;
  v_id uuid;
begin
  select * into v_attestation
  from public.data_submission_attestations a
  where a.id = p_attestation_id
    and a.tenant_id = p_tenant_id
    and a.company_id = p_company_id
    and a.user_id = p_user_id
    and a.accepted = true;

  if v_attestation.id is null then
    raise exception 'VALID_ATTESTATION_REQUIRED' using errcode = '23514';
  end if;

  select * into v_version
  from public.data_submission_attestation_versions v
  where v.id = v_attestation.attestation_version_id;

  if v_version.status <> 'active' then
    raise exception 'ATTESTATION_REFRESH_REQUIRED' using errcode = '23514';
  end if;

  if v_attestation.purpose_code <> p_purpose_code then
    raise exception 'ATTESTATION_PURPOSE_MISMATCH' using errcode = '23514';
  end if;

  insert into public.document_upload_sessions(
    tenant_id, company_id, user_id, purpose_code, attestation_id
  )
  values (
    p_tenant_id, p_company_id, p_user_id, p_purpose_code, p_attestation_id
  )
  returning id into v_id;

  return v_id;
end
$$;

revoke all on function public.create_document_upload_session(
  uuid, uuid, uuid, uuid, text
) from public, anon, authenticated;
grant execute on function public.create_document_upload_session(
  uuid, uuid, uuid, uuid, text
) to service_role;

commit;
