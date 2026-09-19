begin;
alter table public.plan_catalog add column commercial_version text;
update public.plan_catalog set monthly_price_brl = case code
  when 'FREE' then 0 when 'START' then 99 when 'PRO' then 297 end,
  commercial_version='commercial-v1.2.1',updated_at=now()
where code in ('FREE','START','PRO');
-- No subscription activation, checkout, AI quotas or network eligibility changes.
commit;
