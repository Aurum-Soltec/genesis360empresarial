require("../../scripts/testing/register-typescript.cjs");
const test = require("node:test");
const assert = require("node:assert/strict");
const { scoreDimensions, aggregateDimensionScores, unitInterval } = require("../../lib/diagnostic-scoring.ts");
const { questionBank, questionMetadata, scoreAnchorQuestions } = require("../../lib/diagnostic-strategy.ts");
const { normalizeDiagnosticAnswer } = require("../../lib/diagnostic-answer-quality.ts");
const { evaluateDiagnostic } = require("../../lib/diagnostic-evaluation.ts");
const { calculateDiagnosticConfidence } = require("../../lib/diagnostic-confidence.ts");
const { derivePainFindings } = require("../../lib/diagnostic-rules.ts");
const { hasTenantPermission, assertTenantPermission } = require("../../lib/authz.ts");
const { assertSameOrigin, readJsonBody } = require("../../lib/http-security.ts");
const { apiErrorDetails } = require("../../lib/api-errors.ts");
const now = Date.parse("2026-09-10T12:00:00Z");
const anchors = scoreAnchorQuestions();
const two = anchors.filter((q) => q.dimension === "EST");
const answer = (q, maturity=4) => ({
  questionId:q.id,answerState:"ANSWERED",maturity,
  response:q.id === "TEC-002" ? {choice:questionMetadata(q.id).ui.options.find((o) => o.maturity===maturity).value} : {maturity},
  informationSlots:{},evidenceRefs:[],
});
test("UNKNOWN nunca representa maturidade zero: uma de duas âncoras não tem nota suficiente", () => {
  const result=scoreDimensions(two,[answer(two[0]),{questionId:two[1].id,maturity:null,answerState:"UNKNOWN"}])[0];
  assert.equal(result.score,null);assert.equal(result.coverage,.5);assert.equal(result.status,"insufficient_data");
});
test("maturidade zero respondida continua zero válido", () => {
  const result=scoreDimensions(two,two.map((q)=>answer(q,0)))[0];
  assert.equal(result.score,0);assert.equal(result.coverage,1);assert.equal(result.status,"scored");
});
test("maturidade máxima respondida preserva score100", () => {
  assert.equal(scoreDimensions(two,two.map((q)=>answer(q)))[0].score,1);
});
test("resposta ausente não pode criar uma dor de maturidade", () => {
  const scores=scoreDimensions(anchors,[]);
  assert.ok(scores.every((s)=>s.score===null));
  assert.deepEqual(derivePainFindings(scores),[]);
});
test("média usa peso apenas das respostas observadas, com cobertura separada", () => {
  const q=[{id:"a",dimension:"D",weight:2},{id:"b",dimension:"D",weight:1}];
  const s=scoreDimensions(q,[{questionId:"a",maturity:4},{questionId:"b",maturity:null,answerState:"UNKNOWN"}])[0];
  assert.equal(s.score,1);assert.equal(s.coverage,2/3);
});
test("16 âncoras máximas não mascaram quatro dimensões sem informação", () => {
  const evaluation=evaluateDiagnostic({profile:"ESSENTIAL",status:"draft",answers:anchors.slice(0,16).map(q=>answer(q)),asOf:now});
  assert.equal(evaluation.overall.score,null);assert.equal(evaluation.overall.missingDimensions.length,4);
  assert.equal(evaluation.confidence.breakdown.criticalCoverage,16/24);
});
test("apenas dimensões completas produzem índice global", () => {
  const r=aggregateDimensionScores(scoreDimensions(anchors,anchors.map(q=>answer(q))));
  assert.equal(r.score,1);assert.equal(r.status,"scored");assert.equal(r.coverage,1);
});
test("duplicação de resposta e de pergunta é rejeitada", () => {
  assert.throws(()=>scoreDimensions(two,[answer(two[0]),answer(two[0])]),/DUPLICATE_ANSWER/);
  assert.throws(()=>scoreDimensions([two[0],two[0]],[]),/DUPLICATE_QUESTION/);
});
test("NaN, infinito, fração e valores fora da escala são rejeitados", () => {
  for(const n of [NaN,Infinity,-1,5,1.5]) assert.throws(()=>scoreDimensions(two,[answer(two[0],n)]),/INVALID_MATURITY/);
});
test("pesos inválidos e confidence NaN não contaminam cálculo", () => {
  for(const weight of [0,-1,NaN,Infinity]) assert.throws(()=>scoreDimensions([{id:"a",dimension:"D",weight}],[]),/INVALID_QUESTION_WEIGHT/);
  assert.equal(unitInterval(NaN),0);assert.equal(unitInterval(Infinity),0);
});
test("normalização rejeita maturidade fracionária de âncora", () => {
  assert.throws(()=>normalizeDiagnosticAnswer(two[0],answer(two[0],1.5),now),/MATURITY_REQUIRED/);
});
test("UNKNOWN e DEFERRED descartam maturidade forjada", () => {
  for(const state of ["UNKNOWN","DEFERRED"]) {
    const r=normalizeDiagnosticAnswer(two[0],{...answer(two[0]),answerState:state},now);
    assert.equal(r.maturity,null);
  }
});
test("Não se aplica é rejeitado nas 24 âncoras universais", () => {
  for(const q of anchors) assert.throws(()=>normalizeDiagnosticAnswer(q,{answerState:"NOT_APPLICABLE",response:null},now),/NOT_APPLICABLE_NOT_ALLOWED/);
});
test("texto de referência inventada nunca eleva confiabilidade", () => {
  const plain=normalizeDiagnosticAnswer(two[0],answer(two[0]),now);
  const forged=normalizeDiagnosticAnswer(two[0],{...answer(two[0]),evidenceRefs:["inventado"]},now);
  assert.equal(plain.confidence,forged.confidence);assert.equal(plain.evidenceStrength,forged.evidenceStrength);
});
test("data futura não vale evidência de atualidade", () => {
  const r=normalizeDiagnosticAnswer(two[0],{...answer(two[0]),informationSlots:{date:"2099-01-01"}},now);
  assert.equal(r.freshnessScore,0);
});
test("sem respostas a confiança total é zero", () => {
  assert.equal(calculateDiagnosticConfidence([]).percent,0);
});
test("um único avaliador retorna confiança, percentual e decomposição consistentes", () => {
  const r=evaluateDiagnostic({profile:"ESSENTIAL",status:"draft",answers:anchors.map(q=>answer(q)),asOf:now});
  assert.equal(r.confidence.percent,r.state.confidencePercent);
  assert.equal(r.confidence.level,r.state.confidenceLevel);
  assert.deepEqual(r.confidence.breakdown,r.state.confidenceBreakdown);
  assert.ok(r.state.submissionBlockers.includes("DIAGNOSTIC_PATH_INCOMPLETE"));
});
test("mesmo snapshot e instante produzem resultado determinístico", () => {
  const input={profile:"ESSENTIAL",status:"draft",answers:anchors.map(q=>answer(q,2)),asOf:now};
  assert.deepEqual(evaluateDiagnostic(input),evaluateDiagnostic(input));
});
test("núcleo mantém 144 perguntas, 12 dimensões e 24 âncoras", () => {
  assert.equal(questionBank().length,144);assert.equal(anchors.length,24);
  assert.equal(new Set(anchors.map(q=>q.dimension)).size,12);
});
test("caminho completo preserva fórmula e libera conclusão, sem LLM", () => {
  const answers=[];
  for(let i=0;i<100;i++) {
    const r=evaluateDiagnostic({profile:"ESSENTIAL",status:"draft",answers,asOf:now});
    if(!r.state.nextQuestionId) {
      assert.equal(r.state.canSubmit,true);
      assert.equal(r.state.growthScore,100);
      assert.equal(r.confidence.percent,r.state.confidencePercent);
      assert.equal(r.state.progressPercent,100);
      return;
    }
    answers.push(answer(questionBank().find(q=>q.id===r.state.nextQuestionId)));
  }
  assert.fail("A jornada não terminou dentro do limite");
});
test("propriedades: bounded, monotonicidade e invariância à ordem em 625 combinações", () => {
  for(let a=0;a<5;a++)for(let b=0;b<5;b++)for(let c=0;c<5;c++)for(let d=0;d<5;d++){
    const q=anchors.slice(0,4),v=[a,b,c,d],ans=q.map((x,i)=>answer(x,v[i]));
    const scores=scoreDimensions(q,ans);
    assert.ok(scores.every(s=>s.score>=0&&s.score<=1&&s.coverage===1));
    assert.deepEqual(scores,scoreDimensions(q,[...ans].reverse()));
    const improved=scoreDimensions(q,q.map((x,i)=>answer(x,Math.min(4,v[i]+1))));
    assert.ok(improved.every((s,i)=>s.score>=scores[i].score));
  }
});
for (const role of ["owner","admin","manager"]) test(`RBAC: ${role} pode escrever diagnóstico e passaporte`,()=>{
  assert.equal(hasTenantPermission(role,"diagnostic:write"),true);
  assert.equal(hasTenantPermission(role,"passport:write"),true);
});
for (const role of ["member","specialist","auditor","unknown"]) test(`RBAC: ${role} não pode promover dados por escrita privilegiada`,()=>{
  for(const p of ["passport:write","diagnostic:write","evidence:write","mission:write"]) {
    assert.equal(hasTenantPermission(role,p),false);assert.throws(()=>assertTenantPermission(role,p),/ROLE_NOT_ALLOWED/);
  }
});
test("RBAC desconhecido é negado; consentimento próprio não dá escrita no negócio",()=>{
  assert.equal(hasTenantPermission("member","consent:self"),true);
  assert.equal(hasTenantPermission("alien","consent:self"),false);
});
test("mesma origem é aceita, origem externa, null, porta diferente ou ausente é negada",()=>{
  assert.doesNotThrow(()=>assertSameOrigin(new Request("https://app.test/api",{headers:{origin:"https://app.test"}})));
  assert.doesNotThrow(()=>assertSameOrigin(new Request("http://internal:3000/api",{headers:{origin:"https://app.test",host:"app.test","x-forwarded-proto":"https"}})));
  for(const origin of [null,"null","https://evil.test","https://app.test:444"])
    assert.throws(()=>assertSameOrigin(new Request("https://app.test/api",{headers:origin?{origin}:{}})),/ORIGIN_NOT_ALLOWED/);
});
test("JSON válido é lido com limite real de bytes",async()=>{
  assert.deepEqual(await readJsonBody(new Request("https://app.test",{method:"POST",headers:{"content-type":"application/json"},body:'{"x":1}'})),{x:1});
});
test("JSON inválido, corpo excessivo e mídia inadequada falham com código estável",async()=>{
  await assert.rejects(()=>readJsonBody(new Request("https://app.test",{method:"POST",headers:{"content-type":"application/json"},body:"{"})),/INVALID_JSON/);
  await assert.rejects(()=>readJsonBody(new Request("https://app.test",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify("x".repeat(70000))})),/REQUEST_TOO_LARGE/);
  await assert.rejects(()=>readJsonBody(new Request("https://app.test",{method:"POST",body:"{}"})),/JSON_CONTENT_TYPE_REQUIRED/);
});
test("erro de infraestrutura não vaza mensagem nem vira falso403",()=>{
  assert.deepEqual(apiErrorDetails(new Error("database secret internal endpoint")),{code:"INTERNAL_ERROR",status:500});
  assert.deepEqual(apiErrorDetails(new Error("ROLE_NOT_ALLOWED")),{code:"ROLE_NOT_ALLOWED",status:403});
});

test("preços aprovados são centavos inteiros; catálogo não ativa serviços",()=>{
  const catalog=require("../../data/commercial-plans.json");
  assert.deepEqual(catalog.plans.map(p=>[p.code,p.monthlyPriceCents]),[["FREE",0],["START",9900],["PRO",29700]]);
  assert.equal(catalog.checkoutEnabled,false);
  assert.equal(catalog.providerNetworkEligibilityApproved,false);
  assert.equal(catalog.humanAccompanimentIncluded,false);
});
