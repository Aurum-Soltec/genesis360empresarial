import fs from "node:fs";
import { spawnSync } from "node:child_process";

// Scan exactly what could be published by Git. The work package deliberately
// contains ignored private dossiers, reference archives and generated evidence;
// walking the whole extraction would inspect files that cannot be committed and
// would also descend into package-manager stores. Tracked plus non-ignored
// untracked files is the conservative publication candidate set.
const git = spawnSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { encoding: "buffer" },
);
if (git.status !== 0) {
  process.stderr.write(git.stderr ?? Buffer.from("Unable to enumerate Git publication candidates.\n"));
  process.exit(git.status ?? 1);
}
const files = git.stdout.toString("utf8").split("\0").filter(Boolean);
const failures=[];
for(const file of files) {
  const normalized=file.replaceAll("\\","/");
  if (fs.lstatSync(file).isSymbolicLink()) {
    failures.push(`Symlink requires manual review: ${normalized}`); continue;
  }
  if (/\.(pdf|docx|zip|pem|key|p12|pfx|dump|sqlite|pyc|woff2?|ttf|otf)$/i.test(file) ||
      /(?:^|\/)\.env(?:\..+)?$/.test(normalized) && normalized!==".env.example") {
    failures.push(`Restricted/binary/secret-prone file: ${normalized}`); continue;
  }
  const text=fs.readFileSync(file,"utf8");
  // Narrow heuristic; it does not replace GitHub secret scanning or a manual review.
  const credentials = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
    /\bAKIA[0-9A-Z]{16}\b/,
  ];
  if(credentials.some(re=>re.test(text)))failures.push(`Potential credential: ${normalized}`);
}
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("PASS - configured public-package denylist and narrow credential heuristics. Not a guarantee of absence of secrets.");
