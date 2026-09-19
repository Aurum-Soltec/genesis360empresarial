import { describe, expect, it } from "vitest";
import {
  capacityScore,
  eligibleProvider,
  rankingScore,
} from "./qualification-engine";

describe("Qualification engine", () => {
  it("requires every configured eligibility gate", () => {
    expect(
      eligibleProvider({
        qualificationStatus: "qualified",
        qualificationScore: 80,
        minimumScore: 70,
        planEligible: true,
        capabilityFit: 1,
        complianceStatus: "valid",
        capacityStatus: "available",
      }).eligible,
    ).toBe(true);
  });

  it("plan cannot buy ranking", () => {
    const base = {
      fit: 0.8,
      qualification: 0.8,
      outcomes: 0.5,
      capacity: 1,
    };
    expect(rankingScore({ ...base, planTier: 1 })).toBe(
      rankingScore({ ...base, planTier: 99 }),
    );
  });

  it("does not penalize missing outcome data as if it were a bad outcome", () => {
    const withoutOutcome = rankingScore({
      fit: 0.8,
      qualification: 0.8,
      outcomes: null,
      capacity: 1,
    });
    const explicitBadOutcome = rankingScore({
      fit: 0.8,
      qualification: 0.8,
      outcomes: 0,
      capacity: 1,
    });
    expect(withoutOutcome).toBeGreaterThan(explicitBadOutcome);
  });

  it("treats unknown capacity as missing evidence, not zero capacity", () => {
    expect(capacityScore("unknown")).toBeNull();
    expect(capacityScore("available")).toBe(1);
    expect(capacityScore("limited")).toBe(0.5);
  });

  it("fails closed when required capacity is unknown", () => {
    const decision = eligibleProvider({
      qualificationStatus: "qualified",
      qualificationScore: 80,
      minimumScore: 70,
      planEligible: true,
      capabilityFit: 1,
      complianceStatus: "valid",
      capacityStatus: "unknown",
      requireCapacity: true,
    });
    expect(decision.eligible).toBe(false);
    expect(decision.reasons).toContain("NO_CAPACITY");
  });

  it("rejects non-finite or out-of-range policy values", () => {
    const base = {
      qualificationStatus: "qualified",
      qualificationScore: 80,
      minimumScore: 70,
      planEligible: true,
      capabilityFit: 1,
      complianceStatus: "valid",
      capacityStatus: "available",
    };
    expect(eligibleProvider({ ...base, qualificationScore: Number.NaN }).eligible).toBe(false);
    expect(eligibleProvider({ ...base, minimumScore: Number.POSITIVE_INFINITY }).eligible).toBe(false);
    expect(eligibleProvider({ ...base, capabilityFit: Number.NaN }).eligible).toBe(false);
    expect(eligibleProvider({ ...base, qualificationScore: 101 }).eligible).toBe(false);
  });
});
