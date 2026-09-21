import { describe, expect, it } from "vitest";
import {
  answersWithEvidence,
  evidenceIdsFromAnswers,
  verifiedEvidenceCount,
} from "./report-provenance";

describe("report provenance", () => {
  it("deduplicates evidence references without counting malformed values", () => {
    expect(evidenceIdsFromAnswers([
      { evidence_refs: ["A", "b", "A", null] },
      { evidence_refs: "not-an-array" },
    ])).toEqual(["a", "b"]);
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
