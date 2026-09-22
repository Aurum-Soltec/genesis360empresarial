import { describe, expect, it } from "vitest";
import { getFeatureFlags, isDemoTenantAllowed } from "./feature-flags";

describe("feature flags", () => {
  it("uses deny-by-default for V1 capabilities", () => {
    const flags = getFeatureFlags({});
    expect(flags.ecosystem).toBe(false);
    expect(flags.qualificationNetwork).toBe(false);
    expect(flags.agentic).toBe(false);
    expect(flags.realContact).toBe(false);
    expect(flags.dataUpload).toBe(false);
    expect(flags.demoWorkspace).toBe(false);
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
      FEATURE_DEMO_WORKSPACE: "true",
    });
    expect(flags).toEqual({
      ecosystem: true,
      qualificationNetwork: true,
      agentic: true,
      tax: false,
      realContact: true,
      dataUpload: false,
      demoWorkspace: true,
    });
  });

  it("allows the demo workspace only for an explicitly listed tenant", () => {
    const env = {
      FEATURE_DEMO_WORKSPACE: "true",
      DEMO_TENANT_IDS: "tenant-a, tenant-b",
    };
    expect(isDemoTenantAllowed("tenant-a", env)).toBe(true);
    expect(isDemoTenantAllowed("tenant-c", env)).toBe(false);
    expect(isDemoTenantAllowed("tenant-a", { DEMO_TENANT_IDS: "tenant-a" })).toBe(false);
  });
});
