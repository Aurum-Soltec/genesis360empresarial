begin;

select plan(2);

select tests.rls_enabled('public');

select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'memberships'
      and indexname = 'memberships_user_tenant_idx'
  ),
  'memberships has user-leading index required by tenant RLS helper'
);

select * from finish();
rollback;
