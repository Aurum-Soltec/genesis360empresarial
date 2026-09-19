// Audit-only contract tests against the current RC2 modules.
// Database/auth adapters are doubles: this is NOT an authenticated HTTP/SQL E2E suite.
const path = require('node:path');
const Module = require('node:module');
const test = require('node:test');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const req = Module.createRequire(path.join(root, 'package.json'));
req('./scripts/testing/register-typescript.cjs');
const ts = req('typescript');
const fs = require('node:fs');
require.extensions['.tsx'] = function(mod, filename) {
  mod._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'), {
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,
      esModuleInterop:true,jsx:ts.JsxEmit.ReactJSX,resolveJsonModule:true}
  }).outputText,filename);
};
const ctx = {userId:'10000000-0000-4000-8000-000000000001',
  tenantId:'20000000-0000-4000-8000-000000000001',role:'owner'};
const ID='30000000-0000-4000-8000-000000000001';
let role='owner', authError=null, tables={}, writes=[], rpc=[];
function db() {
  return {from(table) {
    let operation='read';
    const query={
      select(){return query;},eq(){return query;},in(){return query;},is(){return query;},
      order(){return query;},limit(){return query;},
      insert(value){operation='write';writes.push({table,value});return query;},
      update(value){operation='write';writes.push({table,value});return query;},
      single(){return Promise.resolve(result());},maybeSingle(){return Promise.resolve(result());},
      then(resolve,reject){return Promise.resolve(result()).then(resolve,reject);}
    };
    function result(){return operation==='write'?(tables[table+':write']??{data:{id:ID,status:'UPDATED'},error:null,count:1}):
      tables[table]??{data:{id:ID,company_id:ID,status:'IN_PROGRESS',template_id:ID},error:null,count:1};}
    return query;
  },rpc(name,input){rpc.push({name,input});return Promise.resolve({data:ID,error:null});},
  auth:{getUser(){return Promise.resolve({data:{user:{id:ctx.userId}},error:null});}}};
}
const originalLoad=Module._load;
Module._load=function(name,...loadArguments) {
  if(name==='@/lib/tenant-context') return {ACTIVE_TENANT_COOKIE:'genesis_active_tenant',
    requireTenantContext:async()=>{if(authError)throw new Error(authError);return {...ctx,role};}};
  if(name==='@/lib/supabase/server')return {createSupabaseServerClient:async()=>db()};
  if(name==='@/lib/supabase/admin')return {createSupabaseAdminClient:()=>db()};
  if(name==='@/components/app-shell')return {AppShell:({children})=>children};
  return originalLoad.call(this,name,...loadArguments);
};
function reset(){role='owner';authError=null;tables={};writes=[];rpc=[];}
function route(name){return req('./app/api/'+name+'/route.ts');}
function request(body,headers={}){return new Request('http://localhost:55400/api/audit',{
  method:'POST',headers:{origin:'http://localhost:55400','content-type':'application/json',...headers},
  body:typeof body==='string'?body:JSON.stringify(body)});}
function params(){return {params:Promise.resolve({id:ID})};}

const names=['consents','attestations','diagnostics','passport/facts','evidence',
  'pains/[id]/gds','decisions/[id]/missions','missions/[id]/transition',
  'missions/[id]/evidence','missions/[id]/outcome','solutions/contact','upload-sessions'];
for(const name of names) test('reject cross-origin mutation: '+name,async()=>{
  reset();const response=await route(name).POST(request({}, {origin:'https://attacker.invalid'}),params());
  assert.equal(response.status,403);assert.equal(writes.length+rpc.length,0);
});
for(const name of names.filter(n=>!['consents','attestations','solutions/contact','upload-sessions'].includes(n)))
  test('deny ordinary member write: '+name,async()=>{
    reset();role='member';const response=await route(name).POST(request({}),params());
    assert.equal(response.status,403);assert.equal(writes.length+rpc.length,0);
  });
for(const [label,body,headers,status] of [
  ['invalid JSON','{',{},400],['incorrect content-type','{}',{'content-type':'text/plain'},415],
  ['oversized JSON',JSON.stringify({padding:'x'.repeat(66000)}),{},413]])
  test('mission creation must reject '+label,async()=>{
    reset();const response=await route('decisions/[id]/missions').POST(request(body,headers),params());
    assert.equal(response.status,status);assert.equal(rpc.length,0);
  });
test('mission completion must fail closed if template lookup fails',async()=>{
  reset();tables.mission_templates={data:null,error:{message:'synthetic outage'}};
  const response=await route('missions/[id]/transition').POST(request({to:'COMPLETED'}),params());
  assert.equal(response.status,500);assert.equal(writes.length,0);
});
test('mission transition must not report success when zero rows changed',async()=>{
  reset();tables['missions:write']={data:null,error:null,count:0};
  const response=await route('missions/[id]/transition').POST(request({to:'PAUSED'}),params());
  assert.equal(response.status,409);
});
test('consent version for another purpose must not authorize matching',async()=>{
  reset();tables.consent_versions={data:{id:ID,active:true,purpose_code:'AI_PROCESSING'},error:null};
  const response=await route('consents').POST(request({purposeCode:'QUALIFIED_MATCHING',granted:true,consentVersionId:ID}),params());
  assert.equal(response.status,409);assert.equal(writes.length,0);
});
test('unknown capacity must not satisfy an explicitly required capacity gate',()=>{
  const {eligibleProvider}=req('./lib/qualification-engine.ts');
  const decision=eligibleProvider({qualificationStatus:'qualified',qualificationScore:80,minimumScore:70,
    planEligible:true,capabilityFit:1,complianceStatus:'valid',capacityStatus:'unknown',requireCapacity:true});
  assert.equal(decision.eligible,false);
});
test('non-finite qualification cannot pass eligibility',()=>{
  const {eligibleProvider}=req('./lib/qualification-engine.ts');
  const decision=eligibleProvider({qualificationStatus:'qualified',qualificationScore:NaN,minimumScore:70,
    planEligible:true,capabilityFit:1,complianceStatus:'valid',capacityStatus:'available'});
  assert.equal(decision.eligible,false);
});
test('non-finite capability fit cannot pass eligibility',()=>{
  const {eligibleProvider}=req('./lib/qualification-engine.ts');
  const decision=eligibleProvider({qualificationStatus:'qualified',qualificationScore:80,minimumScore:70,
    planEligible:true,capabilityFit:NaN,complianceStatus:'valid',capacityStatus:'available'});
  assert.equal(decision.eligible,false);
});
test('Indicadores must preserve canonical missing global score',async()=>{
  reset();tables.diagnostics={data:{id:ID,coverage:67,confidence:50,growth_score:null,growth_score_status:'insufficient_data'},error:null};
  tables.score_results={data:Array.from({length:12},(_,i)=>({dimension:'D'+i,score:i<8?80:null,coverage:i<8?100:0,confidence:50,rule_version:'growth-v1.2.1'})),error:null};
  const Component=req('./app/indicadores/page.tsx').default;
  const {renderToStaticMarkup}=req('react-dom/server');
  const html=renderToStaticMarkup(await Component());
  assert.ok(!html.includes('53<small>'),'Missing global score was rendered as 53/100');
});
test('all legal maturity values complete both diagnostic paths deterministically',()=>{
  const {evaluateDiagnostic}=req('./lib/diagnostic-evaluation.ts');
  const {questionMetadata}=req('./lib/diagnostic-strategy.ts');
  const {normalizeDiagnosticAnswer}=req('./lib/diagnostic-answer-quality.ts');
  const {scoreAnchorQuestions}=req('./lib/diagnostic-strategy.ts');
  const {scoreDimensions,aggregateDimensionScores}=req('./lib/diagnostic-scoring.ts');
  for(const profile of ['ESSENTIAL','FULL'])for(let maturity=0;maturity<=4;maturity++) {
    let answers=[],evaluation;
    for(let step=0;step<100;step++) {
      evaluation=evaluateDiagnostic({profile,status:'draft',answers,asOf:Date.parse('2026-09-18T12:00:00Z')});
      const id=evaluation.state.nextQuestionId;if(!id)break;
      const m=questionMetadata(id);
      let response={maturity};
      if(id==='TEC-002'){
        const options=m.ui.options.filter(o=>typeof o==='object');
        const option=options.find(o=>o.maturity===maturity)??options[0];
        response={choice:option.value};
      }
      answers.push({questionId:id,answerState:'ANSWERED',response,maturity,informationSlots:{},evidenceRefs:[]});
    }
    assert.equal(evaluation.state.canSubmit,true,profile+':'+maturity);
    const normalized=answers.map(a=>({questionId:a.questionId,...normalizeDiagnosticAnswer(
      req('./lib/diagnostic-strategy.ts').questionBank().find(q=>q.id===a.questionId),a,Date.parse('2026-09-18T12:00:00Z'))}));
    const expected=Math.round(aggregateDimensionScores(scoreDimensions(scoreAnchorQuestions(),normalized)).score*100);
    assert.equal(evaluation.state.growthScore,expected);
    assert.ok(answers.length<=60);
    assert.equal(new Set(answers.map(a=>a.questionId)).size,answers.length);
  }
});
