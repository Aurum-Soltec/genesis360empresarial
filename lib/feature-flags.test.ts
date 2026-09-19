import { describe, expect, it } from "vitest";
import { getFeatureFlags } from "./feature-flags";

describe("feature flags", () => {
  it("uses deny-by-default for V1 capabilities", () => {
    const flags = getFeatureFlags({});
    expect(flags.ecosystem).toBe(false);
    expect(flags.qualificationNetwork).toBe(false);
    expect(flags.agentic).toBe(false);
    expect(flags.realContact).toBe(false);
    expect(flags.dataUpload).toBe(false);
    expect(flags.tax).toBe(true);
  });

  it("accepts explicit boolean environment values", () => {
    const flags = getFeatureFlags({
      FEATURE_ECOSYSTEM: "true",
      FEATURE_QUALIFICATION_NETWORK: "true",
      FEATURE_AGENTIC: "true",
      FEATURE_TAX: "false",
      FEATURE_REAL_CONTACT: "true",
      FEATURE_DATA_UPLOAD: "false",
    });
    expect(flags).toEqual({
      ecosystem: true,
      qualificationNetwork: true,
      agentic: true,
      tax: false,
      realContact: true,
      dataUpload: false,
    });
  });
});
