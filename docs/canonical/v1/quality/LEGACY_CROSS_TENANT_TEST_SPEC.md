# Legacy cross-tenant test specification

This historical specification was previously stored as an executable `.sql`
file in the pgTAP directory, although it had no TAP plan or assertions. It is
superseded by `supabase/tests/002_cross_tenant_rls.test.sql` and the later
tenant/reference/RBAC suites.

The required assertions remain:

1. user A can access permitted rows in tenant A;
2. user A receives no rows from tenant B;
3. user A cannot write a row for tenant B;
4. the same negative checks cover consent, diagnostic, answer, score, tax,
   referral, audit, facts, timeline, pain, decision, mission, evidence,
   outcome and provider capability records;
5. company and tenant references cannot disagree;
6. service role is used only by the local fixture setup and server boundaries.
