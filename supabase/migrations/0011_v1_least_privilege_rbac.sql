begin;

-- Retire the legacy "first membership wins" helper. Active tenant is an
-- application context; authorization is membership/role based.
drop function if exists public.current_tenant_id();

create or replace function private.has_tenant_role(
  target_tenant_id uuid,
  allowed_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships m
    where m.user_id = (select auth.uid())
      and m.tenant_id = target_tenant_id
      and m.role = any(allowed_roles)
  )
$$;

revoke all on function private.has_tenant_role(uuid, text[]) from public, anon;
grant execute on function private.has_tenant_role(uuid, text[])
to authenticated, service_role;

-- Company: any member may read. Only management roles mutate directly.
drop policy if exists "companies_member_all" on public.companies;
drop policy if exists "companies_member_select" on public.companies;
drop policy if exists "companies_manager_insert" on public.companies;
drop policy if exists "companies_manager_update" on public.companies;

create policy "companies_member_select"
on public.companies for select to authenticated
using ((select private.is_tenant_member(tenant_id)));

create policy "companies_manager_insert"
on public.companies for insert to authenticated
with check (
  (select private.has_tenant_role(
    tenant_id,
    array['owner','admin','manager']::text[]
  ))
);

create policy "companies_manager_update"
on public.companies for update to authenticated
using (
  (select private.has_tenant_role(
    tenant_id,
    array['owner','admin','manager']::text[]
  ))
)
with check (
  (select private.has_tenant_role(
    tenant_id,
    array['owner','admin','manager']::text[]
  ))
);

-- Sensitive Business Passport facts fail closed for non-management roles.
drop policy if exists "business_facts_member_select" on public.business_facts;
create policy "business_facts_sensitivity_select"
on public.business_facts for select to authenticated
using (
  (select private.is_tenant_member(tenant_id))
  and (
    sensitivity in ('public','internal')
    or (
      sensitivity in ('personal','financial','restricted')
      and (select private.has_tenant_role(
        tenant_id,
        array['owner','admin','manager']::text[]
      ))
    )
  )
);

-- Evidence follows the same conservative sensitivity boundary.
drop policy if exists "evidence_items_member_select" on public.evidence_items;
create policy "evidence_items_sensitivity_select"
on public.evidence_items for select to authenticated
using (
  (select private.is_tenant_member(tenant_id))
  and (
    sensitivity in ('public','internal')
    or (
      sensitivity in ('personal','financial','restricted')
      and (select private.has_tenant_role(
        tenant_id,
        array['owner','admin','manager']::text[]
      ))
    )
  )
);

-- Audit logs are not general employee data.
drop policy if exists "audit_member_select" on public.audit_events;
create policy "audit_privileged_select"
on public.audit_events for select to authenticated
using (
  tenant_id is not null
  and (select private.has_tenant_role(
    tenant_id,
    array['owner','admin','auditor']::text[]
  ))
);

-- Tax assessment is restricted; specialist may read for an explicitly
-- authorized tenant membership. More granular assignment ACL is future work.
drop policy if exists "tax_member_select" on public.tax_assessments;
create policy "tax_privileged_select"
on public.tax_assessments for select to authenticated
using (
  (select private.has_tenant_role(
    tenant_id,
    array['owner','admin','manager','specialist']::text[]
  ))
);

drop policy if exists "referrals_member_select" on public.referrals;
create policy "referrals_management_select"
on public.referrals for select to authenticated
using (
  (select private.has_tenant_role(
    tenant_id,
    array['owner','admin','manager']::text[]
  ))
);

commit;
