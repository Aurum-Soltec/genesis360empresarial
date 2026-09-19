begin;

-- Historical entry point retained for compatibility. The full two-tenant
-- behavior is exercised by 002_cross_tenant_rls.test.sql.
select plan(1);

select ok(
  to_regprocedure('private.is_tenant_member(uuid)') is not null,
  'Tenant RLS membership helper exists'
);

select * from finish();
rollback;
