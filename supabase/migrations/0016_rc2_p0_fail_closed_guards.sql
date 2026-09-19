begin;

-- A consent text version is valid for exactly one declared purpose. Existing
-- versions are backfilled only when their historical use is unambiguous.
alter table public.consent_versions
  add column if not exists purpose_code text
  references public.consent_purposes(code);

with unambiguous as (
  select consent_version_id, min(purpose_code) as purpose_code
  from public.consents
  where purpose_code is not null
  group by consent_version_id
  having count(distinct purpose_code) = 1
)
update public.consent_versions cv
set purpose_code = unambiguous.purpose_code
from unambiguous
where cv.id = unambiguous.consent_version_id
  and cv.purpose_code is null;

alter table public.consent_versions
  add constraint consent_active_version_requires_purpose
  check (not active or purpose_code is not null) not valid;

create or replace function private.enforce_consent_version_purpose()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_purpose_code text;
  v_active boolean;
begin
  select purpose_code, active
  into v_purpose_code, v_active
  from public.consent_versions
  where id = new.consent_version_id;

  if v_purpose_code is null or not coalesce(v_active, false) then
    raise exception 'CONSENT_VERSION_NOT_ACTIVE_OR_UNBOUND' using errcode = '23514';
  end if;
  if new.purpose_code is distinct from v_purpose_code then
    raise exception 'CONSENT_VERSION_PURPOSE_MISMATCH' using errcode = '23514';
  end if;
  return new;
end
$$;

revoke all on function private.enforce_consent_version_purpose()
from public, anon, authenticated;

drop trigger if exists consent_version_purpose_guard on public.consents;
create trigger consent_version_purpose_guard
before insert or update of consent_version_id, purpose_code
on public.consents
for each row execute function private.enforce_consent_version_purpose();

-- Provider scores are policy inputs and must have the same finite domain as
-- the application contract. NOT VALID preserves dirty historical rows while
-- enforcing the constraint on all new writes.
alter table public.provider_capabilities
  add constraint provider_qualification_score_range
  check (
    qualification_score is null
    or qualification_score between 0 and 100
  ) not valid;

commit;
