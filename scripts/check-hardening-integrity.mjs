import fs from "node:fs";
import crypto from "node:crypto";
const digest = value => crypto.createHash("sha256").update(value).digest("hex");
function matchesSha(path, expected) {
  const bytes = fs.readFileSync(path);
  if (digest(bytes) === expected) return true;
  // Git normalizes text files to LF on Linux while some generated evidence was
  // originally hashed with CRLF on Windows. Permit newline normalization only;
  // every other byte still has to match the recorded digest.
  if (bytes.includes(0)) return false;
  const text = bytes.toString("utf8");
  const lf = text.replace(/\r\n/g, "\n");
  return digest(lf) === expected || digest(lf.replace(/\n/g, "\r\n")) === expected;
}
const legacy=JSON.parse(fs.readFileSync("docs/canonical/v1/quality/WAVE8_BACKEND_BASELINE.json","utf8"));
const delta=JSON.parse(fs.readFileSync("docs/hardening-v1.2.1/REVIEWABLE-CODE-DELTA.json","utf8"));
const changes=new Map(delta.files.map(f=>[f.path,f]));
const followupPath="docs/hardening-v1.2.1/NAVIGATION-CODE-DELTA.json";
const followup=fs.existsSync(followupPath)
  ? JSON.parse(fs.readFileSync(followupPath,"utf8"))
  : {files:[]};
const reviewed=new Map(followup.files.map(f=>[f.path,f]));
const failures=[];
if(reviewed.size!==followup.files.length)failures.push("Duplicate follow-up integrity entry");
for(const item of followup.files){
  const prior=changes.get(item.path)?.afterSha256 ?? legacy[item.path] ?? null;
  if(item.beforeSha256!==prior)failures.push(`Follow-up baseline mismatch: ${item.path}`);
  if(item.afterSha256===null || !fs.existsSync(item.path) || !matchesSha(item.path,item.afterSha256))
    failures.push(`Follow-up candidate integrity mismatch: ${item.path}`);
}
for(const [file,original] of Object.entries(legacy)){
  const item=changes.get(file);
  if(item && item.beforeSha256!==original)failures.push(`Legacy baseline mismatch: ${file}`);
  const expected=reviewed.get(file)?.afterSha256 ?? item?.afterSha256 ?? original;
  if(!fs.existsSync(file) || !matchesSha(file,expected))failures.push(`Unrecorded change: ${file}`);
}
for(const item of delta.files){
  const expected=reviewed.get(item.path)?.afterSha256 ?? item.afterSha256;
  if(expected!==null && (!fs.existsSync(item.path) || !matchesSha(item.path,expected)))
    failures.push(`Candidate integrity mismatch: ${item.path}`);
}
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log(`PASS - ${Object.keys(legacy).length} original monitored files accounted for; ${delta.files.length} original changes and ${followup.files.length} follow-up changes recorded. This is integrity evidence, not production approval.`);
