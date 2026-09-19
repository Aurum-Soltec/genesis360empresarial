import fs from "node:fs";
const names = ["development", "staging", "production"];
const profiles = names.map((name) => JSON.parse(fs.readFileSync(`config/environments/${name}.json`, "utf8")));
for (const [index, profile] of profiles.entries()) {
  if (profile.environment !== names[index] || profile.separateSupabaseProject !== true) throw new Error(`INVALID_ENVIRONMENT_PROFILE:${names[index]}`);
  for (const flag of ["agentic","dataUpload","ecosystem","qualificationNetwork","realContact"]) {
    if (profile.featureDefaults?.[flag] !== false) throw new Error(`SENSITIVE_FLAG_MUST_DEFAULT_OFF:${names[index]}:${flag}`);
  }
}
const workflow = fs.readFileSync(".github/workflows/ci.yml", "utf8");
for (const required of ["pnpm quality", "supabase db reset --local", "supabase test db", "pnpm audit --audit-level=high"]) {
  if (!workflow.includes(required)) throw new Error(`CI_GATE_MISSING:${required}`);
}
console.log("PASS - DEV/STAGING/PRODUCTION isolation and CI gate contracts are present.");
