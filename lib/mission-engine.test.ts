import {describe,it,expect} from "vitest";
import {canTransition,gamificationEvent} from "./mission-engine";
describe("Mission engine",()=>{
 it("allows canonical progress",()=>expect(canTransition("SUGGESTED","ACCEPTED")).toBe(true));
 it("blocks invalid jumps",()=>expect(canTransition("SUGGESTED","OUTCOME_RECORDED")).toBe(false));
 it("does not gamify clicks",()=>expect(gamificationEvent("IN_PROGRESS")).toBeNull());
 it("weights verified outcome above completion",()=>expect(gamificationEvent("OUTCOME_RECORDED",true,true)?.weight).toBe(5));
});
