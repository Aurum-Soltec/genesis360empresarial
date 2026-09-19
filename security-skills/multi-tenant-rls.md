# Multi-Tenant / RLS Review

## Must prove
- RLS enabled on every exposed tenant-owned table.
- membership helper is outside exposed schema.
- `security definer` has pinned empty search_path and schema-qualified names.
- membership lookup has user-leading index.
- Tenant A sees zero rows from Tenant B.
- A cannot insert B.
- A cannot update/delete B.
- `company_id` cannot disagree with `tenant_id`.
- service-role usage exists only behind trusted server boundaries.
- derived records cannot be directly client-written.

## Evidence
Attach pgTAP output from `supabase test db`.
