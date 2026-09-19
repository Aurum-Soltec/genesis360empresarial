import fs from "node:fs";
import crypto from "node:crypto";

const baseline = JSON.parse(
  fs.readFileSync("docs/canonical/v1/quality/WAVE8_BACKEND_BASELINE.json", "utf8"),
);

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const drift = [];
for (const [file, expected] of Object.entries(baseline)) {
  if (!fs.existsSync(file)) {
    drift.push(`${file}: missing`);
    continue;
  }
  const actual = sha256(file);
  if (actual !== expected) drift.push(`${file}: changed`);
}

if (drift.length) {
  for (const item of drift) console.error(`BACKEND DRIFT: ${item}`);
  process.exit(1);
}

console.log(`PASS - Wave 7 backend baseline preserved across ${Object.keys(baseline).length} file(s).`);
