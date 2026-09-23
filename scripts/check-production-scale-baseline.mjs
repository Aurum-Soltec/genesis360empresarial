import fs from "node:fs";
import path from "node:path";

function fail(message) {
  console.error(`BLOCKED: ${message}`);
  process.exit(1);
}

const migrations = fs
  .readdirSync("supabase/migrations")
  .filter((name) => name.endsWith(".sql"))
  .sort();
const dbTests = fs
  .readdirSync("supabase/tests")
  .filter((name) => name.endsWith(".sql"))
  .sort();
const apiRoutes = [];
function collectRoutes(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) collectRoutes(location);
    else if (entry.name === "route.ts") apiRoutes.push(location);
  }
}
collectRoutes("app/api");

if (migrations.length !== 23) fail(`expected 23 migrations, found ${migrations.length}`);
if (dbTests.length !== 13) fail(`expected 13 database test files, found ${dbTests.length}`);
if (apiRoutes.length !== 23) fail(`expected 23 API routes, found ${apiRoutes.length}`);
if (!apiRoutes.some((route) => route.replaceAll("\\", "/") === "app/api/demo/evidence/route.ts")) {
  fail("controlled demo evidence API route is missing from the reconciled baseline");
}

const stories = fs.readFileSync(
  "docs/canonical/v1/delivery/STORIES_CATALOG.csv",
  "utf8",
);
const expectedStories = [
  ["V1-ST-004", "implemented-runtime-verified"],
  ["V1-ST-066", "implemented-runtime-verified"],
  ["V1-ST-105", "completed-hosted-runtime"],
  ["V1-ST-106", "completed-hosted-runtime"],
  ["V1-ST-107", "completed-remote-ci"],
];
for (const [story, status] of expectedStories) {
  const line = stories.split(/\r?\n/).find((candidate) => candidate.startsWith(`${story},`));
  if (!line || !line.includes(`,${status},`)) fail(`${story} is not reconciled to ${status}`);
}

const flags = fs.readFileSync("lib/feature-flags.ts", "utf8");
for (const variable of [
  "FEATURE_ECOSYSTEM",
  "FEATURE_QUALIFICATION_NETWORK",
  "FEATURE_AGENTIC",
  "FEATURE_REAL_CONTACT",
  "FEATURE_DATA_UPLOAD",
]) {
  const line = flags.split(/\r?\n/).find((candidate) => candidate.includes(variable));
  if (!line?.includes('?? "false"')) fail(`${variable} must remain fail-closed`);
}

const validation = JSON.parse(
  fs.readFileSync("docs/audit-2026-09-18/RC2_VALIDATION_RESULTS.json", "utf8"),
);
if (validation.gates.migrations !== migrations.length) fail("validation migration count drift");
if (validation.gates.pgtap.passed !== 95) fail("expected 95 passing pgTAP assertions");
if (validation.gates.adversarial.passed !== 31) fail("expected 31 adversarial passes");

console.log(
  `PASS - production/scale HSP-4 baseline reconciled: ${migrations.length} migrations, ${dbTests.length} DB test files, ${apiRoutes.length} API routes.`,
);
