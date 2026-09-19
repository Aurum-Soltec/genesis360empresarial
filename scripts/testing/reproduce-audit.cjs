const {root}=require("./register-typescript.cjs");
const path=require("node:path");
const {scoreDimensions}=require(path.join(root,"lib/diagnostic-rules.ts"));
const {scoreAnchorQuestions}=require(path.join(root,"lib/diagnostic-strategy.ts"));
const {normalizeDiagnosticAnswer}=require(path.join(root,"lib/diagnostic-answer-quality.ts"));
const {calculateDiagnosticConfidence}=require(path.join(root,"lib/diagnostic-confidence.ts"));
const qs=scoreAnchorQuestions(), two=qs.filter(q=>q.dimension==="EST");
const make=q=>({questionId:q.id,answerState:"ANSWERED",maturity:4,response:{maturity:4},informationSlots:{},evidenceRefs:[]});
const plain=normalizeDiagnosticAnswer(two[0],make(two[0]));
const referenced=normalizeDiagnosticAnswer(two[0],{...make(two[0]),evidenceRefs:["unresolved-reference"]});
const partial=scoreDimensions(two,[make(two[0]),{questionId:two[1].id,maturity:null,answerState:"UNKNOWN",applicable:true}])[0];
console.log(JSON.stringify({
  codeRoot:root, unknownCase:partial,
  referenceConfidence:{without:plain.confidence,withUnresolvedReference:referenced.confidence},
  emptyConfidence:calculateDiagnosticConfidence([]).percent,
},null,2));
