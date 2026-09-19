begin;

-- The immutable diagnostic summary records the exact scoring rule used.
-- Historical rows remain NULL until they are reassessed; no silent backfill.
alter table public.diagnostics
  add column if not exists rules_version text;

-- Consent decisions are readable only through the own-user RLS policy created
-- in migration 0009. Direct writes remain revoked and go through the API.
grant select on public.consents to authenticated;

commit;
