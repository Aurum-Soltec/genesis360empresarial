begin;

-- A Passport fact event can reveal its factKey and source_ref even when the
-- referenced business_facts row is hidden by sensitivity RLS. Match the
-- timeline read boundary to the referenced fact without hiding unrelated
-- company events from ordinary members.
drop policy if exists "business_timeline_member_select"
  on public.business_timeline_events;

create policy "business_timeline_sensitivity_select"
on public.business_timeline_events for select to authenticated
using (
  (select private.is_tenant_member(tenant_id))
  and (
    subject_type <> 'business_fact'
    or exists (
      select 1
      from public.business_facts fact
      where fact.id = case
        when business_timeline_events.subject_id ~*
          '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        then business_timeline_events.subject_id::uuid
        else null::uuid
      end
        and fact.tenant_id = business_timeline_events.tenant_id
        and fact.company_id = business_timeline_events.company_id
        and (
          fact.sensitivity in ('public', 'internal')
          or (select private.has_tenant_role(
            business_timeline_events.tenant_id,
            array['owner','admin','manager']::text[]
          ))
        )
    )
  )
);

commit;
