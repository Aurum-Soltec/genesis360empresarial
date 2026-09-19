export const MissionStates=["SUGGESTED","ACCEPTED","IN_PROGRESS","EVIDENCE_PENDING","COMPLETED","OUTCOME_PENDING","OUTCOME_RECORDED","PAUSED","BLOCKED","CANCELLED","EXPIRED"] as const;
export type MissionState=(typeof MissionStates)[number];

const transitions:Record<MissionState,MissionState[]>={
 SUGGESTED:["ACCEPTED","CANCELLED","EXPIRED"],
 ACCEPTED:["IN_PROGRESS","PAUSED","CANCELLED"],
 IN_PROGRESS:["EVIDENCE_PENDING","COMPLETED","PAUSED","BLOCKED","CANCELLED"],
 EVIDENCE_PENDING:["COMPLETED","IN_PROGRESS","BLOCKED"],
 COMPLETED:["OUTCOME_PENDING"],
 OUTCOME_PENDING:["OUTCOME_RECORDED"],
 OUTCOME_RECORDED:[],
 PAUSED:["IN_PROGRESS","CANCELLED","EXPIRED"],
 BLOCKED:["IN_PROGRESS","CANCELLED","EXPIRED"],
 CANCELLED:[], EXPIRED:[]
};
export function canTransition(from:MissionState,to:MissionState){return transitions[from].includes(to)}
export function assertTransition(from:MissionState,to:MissionState){
 if(!canTransition(from,to)) throw new Error(`INVALID_MISSION_TRANSITION:${from}->${to}`);
}
export function gamificationEvent(state:MissionState,evidenceVerified=false,outcomeImproved=false){
 if(outcomeImproved)return {code:"OUTCOME_IMPROVED",weight:5};
 if(state==="COMPLETED"&&evidenceVerified)return {code:"MISSION_VERIFIED",weight:3};
 if(state==="COMPLETED")return {code:"MISSION_COMPLETED",weight:1};
 return null; // clicks/logins/AI consumption never score
}
