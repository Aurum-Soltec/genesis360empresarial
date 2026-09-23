import { describe, expect, it } from "vitest";
import {
  answersWithEvidence,
  evidenceIdsFromAnswers,
  evidenceSetComplete,
  verifiedEvidenceCount,
} from "./report-provenance";

describe("report provenance", () => {
  it("deduplicates evidence references without counting malformed values", () => {
    expect(evidenceIdsFromAnswers([
      { evidence_refs: ["A", " b ", "A", null] },
      { evidence_refs: "not-an-array" },
    ])).toEqual(["a", "b"]);
  });

  it("does not claim a complete provenance read when a declared source is inaccessible", () => {
    expect(evidenceSetComplete(["a", "b"], [{ id: "a" }])).toBe(false);
    expect(evidenceSetComplete(["a", "b"], [{ id: "a" }, { id: "b" }])).toBe(true);
    expect(answersWithEvidence([{ evidence_refs: [null, " "] }, { evidence_refs: ["a"] }])).toBe(1);
  });

  it("keeps answered coverage separate from verified evidence", () => {
    const answers = [{ evidence_refs: ["a"] }, { evidence_refs: [] }, { evidence_refs: ["b"] }];
    expect(answersWithEvidence(answers)).toBe(2);
    expect(verifiedEvidenceCount([
      { verification_status: "verified" },
      { verification_status: "unverified" },
    ])).toBe(1);
  });
});
