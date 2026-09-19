import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
const require=createRequire(import.meta.url);
const root=process.cwd(), tmp=fs.mkdtempSync(path.join(os.tmpdir(),"genesis-domain-types-"));
const modules=[
  "lib/diagnostic-scoring.ts","lib/diagnostic-rules.ts","lib/diagnostic-strategy.ts",
  "lib/diagnostic-confidence.ts","lib/diagnostic-answer-quality.ts","lib/diagnostic-evaluation.ts",
  "lib/authz.ts","lib/http-security.ts","lib/api-errors.ts","lib/commercial-plans.ts"
];
try {
  const config={compilerOptions:{strict:true,target:"ES2022",module:"CommonJS",
    moduleResolution:"Node",resolveJsonModule:true,esModuleInterop:true,skipLibCheck:true,
    noEmit:true,baseUrl:root,paths:{"@/*":["./*"]},types:[],
    ignoreDeprecations:"6.0"},
    files:modules.map(p=>path.join(root,p))};
  // TypeScript5 diagnostic subset is also usable in the authoring sandbox.
  const version=require("typescript").version;
  if(Number(version.split(".")[0])<6)delete config.compilerOptions.ignoreDeprecations;
  const filename=path.join(tmp,"tsconfig.json");
  fs.writeFileSync(filename,JSON.stringify(config));
  const result=spawnSync(process.execPath,[require.resolve("typescript/bin/tsc"),"--project",filename],{stdio:"inherit"});
  console.log(JSON.stringify({check:"domain-semantic-subset",compiler:version,rootModules:modules.length,fullProject:false,exitCode:result.status}));
  process.exitCode=result.status || (result.error?1:0);
} finally { fs.rmSync(tmp,{recursive:true,force:true}); }
