import fs from "node:fs";
const required = [
  "00_WORK_START_HERE.md",
  "docs/canonical/v1/00_PROJECT_STATE.md",
  "docs/canonical/v1/product/PRD_GENESIS_360_V1_CANONICO.md",
  "docs/canonical/v1/architecture/ARCHITECTURE_MASTER.md",
  "docs/canonical/v1/ux/DESIGN_SYSTEM_LIGHT.md",
  "docs/canonical/v1/delivery/MASTER_BACKLOG_V1.md",
  "supabase/migrations/0006_v1_missions_qualification_foundation.sql",
  "supabase/migrations/0009_v1_end_to_end_core.sql",
  "supabase/migrations/0011_v1_least_privilege_rbac.sql",
  "supabase/migrations/0012_v1_diagnostic_intelligence_data_governance.sql",
  "docs/canonical/v1/delivery/WAVE7_DIAGNOSTIC_INTELLIGENCE_GOVERNANCE.md",
  "docs/canonical/v1/delivery/WAVE6_END_TO_END_CORE.md",
  "design/tokens.genesis-light.json"
];
let failed = false;
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`MISSING ${file}`);
    failed = true;
  }
}
for (const file of ["design/tokens.genesis-light.json","design/navigation.json"]) {
  JSON.parse(fs.readFileSync(file,"utf8"));
}
if (failed) process.exit(1);
console.log("PASS - Genesis 360 Empresarial Work package structure is complete.");
