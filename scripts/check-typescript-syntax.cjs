const fs=require("node:fs"),path=require("node:path"),ts=require("typescript");
const roots=["app","components","lib","tests","scripts"];
const files=[];
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,entry.name);
  if(entry.isDirectory())walk(p);
  else if(/\.(ts|tsx|mts)$/.test(p)&&!p.endsWith(".d.ts"))files.push(p);
 }
}
roots.filter(fs.existsSync).forEach(walk);
for(const p of ["next.config.ts","proxy.ts","vitest.config.mts"])if(fs.existsSync(p))files.push(p);
let failures=0;
for(const file of files){
 const result=ts.transpileModule(fs.readFileSync(file,"utf8"),{
  fileName:file,reportDiagnostics:true,
  compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,
  isolatedModules:true,resolveJsonModule:true,moduleResolution:ts.ModuleResolutionKind.Bundler}
 });
 for(const d of result.diagnostics||[])if(d.category===ts.DiagnosticCategory.Error){
  console.error(file,ts.flattenDiagnosticMessageText(d.messageText,"\n"));failures++;
 }
}
console.log(JSON.stringify({check:"typescript-syntax-transpile-only",compiler:ts.version,files:files.length,errors:failures,semanticTypecheck:false}));
process.exitCode=failures?1:0;
