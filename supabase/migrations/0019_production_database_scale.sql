begin;

-- Indexes below mirror current bounded application reads and worker operations.
create index if not exists diagnostics_tenant_status_created_idx
  on public.diagnostics(tenant_id, status, created_at desc);
create index if not exists diagnostics_tenant_company_profile_draft_idx
  on public.diagnostics(tenant_id, company_id, profile_code, created_at desc)
  where status = 'draft';
create index if not exists missions_tenant_company_created_idx
  on public.missions(tenant_id, company_id, created_at desc);
create index if not exists audit_events_tenant_created_idx
  on public.audit_events(tenant_id, created_at desc);
create index if not exists consents_tenant_user_decision_idx
  on public.consents(tenant_id, user_id, decision_at desc, created_at desc);
create index if not exists score_results_tenant_diagnostic_idx
  on public.score_results(tenant_id, diagnostic_id, score);
create index if not exists pain_findings_tenant_diagnostic_severity_idx
  on public.pain_findings(tenant_id, diagnostic_id, severity desc);
create index if not exists mission_evidence_tenant_mission_idx
  on public.mission_evidence(tenant_id, mission_id);
create index if not exists memberships_tenant_role_idx
  on public.memberships(tenant_id, role);

alter role authenticated set statement_timeout = '15s';
alter role service_role set statement_timeout = '30s';

commit;
