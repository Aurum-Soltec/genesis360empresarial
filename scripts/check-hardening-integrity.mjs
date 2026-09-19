import fs from "node:fs";
import crypto from "node:crypto";
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const legacy=JSON.parse(fs.readFileSync("docs/canonical/v1/quality/WAVE8_BACKEND_BASELINE.json","utf8"));
const delta=JSON.parse(fs.readFileSync("docs/hardening-v1.2.1/REVIEWABLE-CODE-DELTA.json","utf8"));
const changes=new Map(delta.files.map(f=>[f.path,f]));
const failures=[];
for(const [file,original] of Object.entries(legacy)){
  const item=changes.get(file);
  if(item && item.beforeSha256!==original)failures.push(`Legacy baseline mismatch: ${file}`);
  const expected=item?.afterSha256 || original;
  if(!fs.existsSync(file) || sha(file)!==expected)failures.push(`Unrecorded change: ${file}`);
}
for(const item of delta.files){
  if(item.afterSha256!==null && (!fs.existsSync(item.path) || sha(item.path)!==item.afterSha256))
    failures.push(`Candidate integrity mismatch: ${item.path}`);
}
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log(`PASS - ${Object.keys(legacy).length} original monitored files accounted for; ${delta.files.length} code/config changes recorded. This is integrity evidence, not production approval.`);
