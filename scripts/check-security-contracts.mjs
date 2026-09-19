import fs from "node:fs";

const migration = fs.readFileSync("supabase/migrations/0007_v1_security_evidence_outbox.sql", "utf8");
const integrity = fs.readFileSync("supabase/migrations/0008_v1_tenant_reference_integrity.sql", "utf8");
const flow = fs.readFileSync("supabase/migrations/0009_v1_end_to_end_core.sql", "utf8");
const rbac = fs.readFileSync("supabase/migrations/0011_v1_least_privilege_rbac.sql", "utf8");
const governance = fs.readFileSync("supabase/migrations/0012_v1_diagnostic_intelligence_data_governance.sql", "utf8");


const required = [
  "create schema if not exists private",
  "private.is_tenant_member",
  "memberships_user_tenant_idx",
  "create table public.evidence_items",
  "create table public.event_outbox",
  "claim_event_outbox",
  "enforce_mission_transition",
  "record_business_fact",
  "persist_diagnostic_result",
];

for (const token of required) {
  if (!migration.includes(token)) {
    console.error(`MISSING SECURITY CONTRACT: ${token}`);
    process.exit(1);
  }
}

if (!integrity.includes("answers_diagnostic_same_tenant_fk") || !integrity.includes("mission_outcome_same_company_fk")) {
  console.error("MISSING TENANT REFERENCE INTEGRITY CONTRACTS");
  process.exit(1);
}

for (const token of [
  "create_mission_from_decision",
  "record_mission_evidence",
  "record_mission_outcome",
  "solution_contact_requests",
  "provider_network_policies",
  "complete_event_outbox",
  "fail_event_outbox",
]) {
  if (!flow.includes(token)) {
    console.error(`MISSING END-TO-END CORE CONTRACT: ${token}`);
    process.exit(1);
  }
}


for (const token of [
  "private.has_tenant_role",
  "business_facts_sensitivity_select",
  "evidence_items_sensitivity_select",
  "audit_privileged_select",
  "drop function if exists public.current_tenant_id",
]) {
  if (!rbac.includes(token)) {
    console.error(`MISSING RBAC CONTRACT: ${token}`);
    process.exit(1);
  }
}


for (const token of [
  "data_submission_attestation_versions",
  "data_submission_attestations",
  "document_upload_sessions",
  "accept_data_submission_attestation",
  "create_document_upload_session",
  "answer_state",
  "confidence_breakdown",
]) {
  if (!governance.includes(token)) {
    console.error(`MISSING WAVE7 GOVERNANCE CONTRACT: ${token}`);
    process.exit(1);
  }
}

for (const file of [
  "supabase/tests/001_schema_rls.test.sql",
  "supabase/tests/002_cross_tenant_rls.test.sql",
  "supabase/tests/003_mission_state_machine.test.sql",
  "supabase/tests/004_tenant_reference_integrity.test.sql",
  "supabase/tests/005_end_to_end_core.test.sql",
  "supabase/tests/006_consent_privacy.test.sql",
  "supabase/tests/008_role_access.test.sql",
  "supabase/tests/009_data_submission_governance.test.sql",
]) {
  if (!fs.existsSync(file)) {
    console.error(`MISSING DB TEST: ${file}`);
    process.exit(1);
  }
}

console.log("PASS - Wave 6 security/end-to-end contracts and database test harness are present.");
