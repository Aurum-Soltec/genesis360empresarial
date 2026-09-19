begin;

-- Parent lookup indexes for composite tenant/company foreign keys.
create unique index if not exists diagnostics_tenant_company_id_uidx
  on public.diagnostics(tenant_id, company_id, id);
create unique index if not exists diagnostics_tenant_id_uidx
  on public.diagnostics(tenant_id, id);

create unique index if not exists pain_findings_tenant_company_id_uidx
  on public.pain_findings(tenant_id, company_id, id);

create unique index if not exists decision_records_tenant_company_id_uidx
  on public.decision_records(tenant_id, company_id, id);

create unique index if not exists missions_tenant_company_id_uidx
  on public.missions(tenant_id, company_id, id);

create unique index if not exists tax_assessments_tenant_company_id_uidx
  on public.tax_assessments(tenant_id, company_id, id);

create unique index if not exists consents_tenant_id_uidx
  on public.consents(tenant_id, id);

create unique index if not exists evidence_items_tenant_company_id_uidx
  on public.evidence_items(tenant_id, company_id, id);

create unique index if not exists business_facts_tenant_company_id_uidx
  on public.business_facts(tenant_id, company_id, id);

-- A child cannot point to a parent owned by another tenant.
alter table public.answers
  add constraint answers_diagnostic_same_tenant_fk
  foreign key (tenant_id, diagnostic_id)
  references public.diagnostics(tenant_id, id)
  on delete cascade;

alter table public.score_results
  add constraint score_results_diagnostic_same_tenant_fk
  foreign key (tenant_id, diagnostic_id)
  references public.diagnostics(tenant_id, id)
  on delete cascade;

-- Company-scoped children must also refer to the same company.
alter table public.pain_findings
  add constraint pain_findings_diagnostic_same_company_fk
  foreign key (tenant_id, company_id, diagnostic_id)
  references public.diagnostics(tenant_id, company_id, id)
  on delete cascade;

alter table public.tax_assessments
  add constraint tax_diagnostic_same_company_fk
  foreign key (tenant_id, company_id, diagnostic_id)
  references public.diagnostics(tenant_id, company_id, id)
  on delete set null (diagnostic_id);

alter table public.cause_hypotheses
  add constraint cause_pain_same_company_fk
  foreign key (tenant_id, company_id, pain_finding_id)
  references public.pain_findings(tenant_id, company_id, id)
  on delete cascade;

alter table public.decision_records
  add constraint decision_diagnostic_same_company_fk
  foreign key (tenant_id, company_id, diagnostic_id)
  references public.diagnostics(tenant_id, company_id, id)
  on delete set null (diagnostic_id);

alter table public.decision_records
  add constraint decision_pain_same_company_fk
  foreign key (tenant_id, company_id, pain_finding_id)
  references public.pain_findings(tenant_id, company_id, id)
  on delete set null (pain_finding_id);

alter table public.missions
  add constraint mission_decision_same_company_fk
  foreign key (tenant_id, company_id, decision_record_id)
  references public.decision_records(tenant_id, company_id, id)
  on delete set null (decision_record_id);

alter table public.mission_evidence
  add constraint mission_evidence_same_company_fk
  foreign key (tenant_id, company_id, mission_id)
  references public.missions(tenant_id, company_id, id)
  on delete cascade;

alter table public.mission_outcomes
  add constraint mission_outcome_same_company_fk
  foreign key (tenant_id, company_id, mission_id)
  references public.missions(tenant_id, company_id, id)
  on delete cascade;

alter table public.referrals
  add constraint referral_tax_same_company_fk
  foreign key (tenant_id, company_id, tax_assessment_id)
  references public.tax_assessments(tenant_id, company_id, id)
  on delete set null (tax_assessment_id);

alter table public.referrals
  add constraint referral_consent_same_tenant_fk
  foreign key (tenant_id, consent_id)
  references public.consents(tenant_id, id)
  on delete set null (consent_id);

alter table public.evidence_links
  add constraint evidence_link_same_company_fk
  foreign key (tenant_id, company_id, evidence_id)
  references public.evidence_items(tenant_id, company_id, id)
  on delete cascade;

alter table public.business_facts
  add constraint business_fact_supersedes_same_company_fk
  foreign key (tenant_id, company_id, supersedes_fact_id)
  references public.business_facts(tenant_id, company_id, id);

commit;
