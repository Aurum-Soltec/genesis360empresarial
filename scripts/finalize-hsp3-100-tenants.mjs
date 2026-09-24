// Merge the load run with independent, operator-observed telemetry. This file
// cannot assert provider metrics or worker completion without those observations.
import fs from "node:fs";
import path from "node:path";
import { evaluateGate } from "./hsp3-load-core.mjs";

const [runFile, observationsFile, finalFile] = process.argv.slice(2);
if (!runFile || !observationsFile || !finalFile) {
  throw new Error("Usage: node scripts/finalize-hsp3-100-tenants.mjs RUN_JSON OBSERVATIONS_JSON FINAL_JSON");
}
const report = JSON.parse(fs.readFileSync(runFile, "utf8"));
const input = JSON.parse(fs.readFileSync(observationsFile, "utf8"));
if (report.wave !== "HSP-3" || report.synthetic !== true || !report.runId) {
  throw new Error("Invalid HSP-3 workload report");
}
// Keep the published evidence limited to operational counts and identifiers.
const fields = ["runId", "deploySha", "deployId", "factRowsMatched", "matchedFactEvents",
  "processedFactEvents", "deadFactEvents", "pendingFactEvents", "workerLatencyP95Ms",
  "workerRetries", "poolConnectionsPeak", "databaseConnectionsPeak", "poolUtilizationPeakPercent",
  "cpuPercentPeak", "memoryPercentPeak", "slowQueries", "quotaDenied", "saturationEvents",
  "costUsd", "errorRatePercent", "observedMinutes", "workerObservationRef",
  "databaseObservationRef", "hostingObservationRef"];
const observations = Object.fromEntries(fields.map((field) => [field, input[field]]));
const finalized = { ...report, operatorObservations: observations,
  gate: evaluateGate(report, observations), finalizedAt: new Date().toISOString() };
const outputPath = path.resolve(finalFile);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(finalized, null, 2));
console.log(JSON.stringify({ outputFile: outputPath, runId: report.runId, gate: finalized.gate }, null, 2));
if (finalized.gate.status !== "PASS_CANDIDATE") process.exitCode = 1;
