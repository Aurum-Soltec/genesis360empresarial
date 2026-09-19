import { spawnSync } from "node:child_process";
import fs from "node:fs";
const manifest = JSON.parse(fs.readFileSync("package.json","utf8"));
const expectedNode = fs.readFileSync(".nvmrc","utf8").trim();
if (process.versions.node !== expectedNode) {
  console.error(`Use Node ${expectedNode}; encontrado ${process.versions.node}.`);
  process.exit(1);
}
const command=process.platform==="win32"?"pnpm.cmd":"pnpm";
const version=spawnSync(command,["--version"],{encoding:"utf8",shell:process.platform==="win32"});
if(version.error || version.status!==0 || version.stdout.trim()!==manifest.packageManager.split("@").at(-1)){
  console.error(`Instale ${manifest.packageManager} antes de resolver dependências.`);process.exit(1);
}
console.log("Gerando resolução real, sem executar scripts de terceiros.");
const result=spawnSync(command,["install","--lockfile-only","--ignore-scripts"],{
  stdio:"inherit",shell:process.platform==="win32",
});
if(result.error || result.status!==0) process.exit(result.status || 1);
console.log("Revisar pnpm-lock.yaml, executar pnpm audit --audit-level=high, versionar o lock e somente então executar pnpm install --frozen-lockfile / pnpm quality.");
