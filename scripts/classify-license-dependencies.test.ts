import { describe, expect, it } from "vitest";
import { classifyLicenseDependencies, productionIdentities } from "./classify-license-dependencies.mjs";

describe("HSP-4 production-license reachability", () => {
  const tree = [{ dependencies: { next: { version: "16.3.3", optionalDependencies: {
    sharp: { version: "0.35.4", optionalDependencies: {
      "@img/sharp-libvips-linux-x64": { version: "1.3.3" },
    } },
  } } } }];

  it("includes optional production dependencies without calling them deployed bytes", () => {
    expect(productionIdentities(tree).has("@img/sharp-libvips-linux-x64@1.3.3")).toBe(true);
    const result = classifyLicenseDependencies({ sourceSha256: "sbom", dependencies: [
      { name: "@img/sharp-libvips-linux-x64", version: "1.3.3", declaredLicense: "LGPL-3.0-or-later", status: "review" },
      { name: "eslint-plugin-example", version: "1.0.0", declaredLicense: "MPL-2.0", status: "review" },
    ] }, tree);
    expect(result.reviewedProductionDependencyCount).toBe(1);
    expect(result.reviewedNonProductionDependencyCount).toBe(1);
    expect(result.gate).toContain("BLOCKED");
  });

  it("fails closed on malformed pnpm tree", () => {
    expect(() => productionIdentities([])).toThrow("INVALID_PNPM_PRODUCTION_TREE");
    expect(() => productionIdentities([{ dependencies: { broken: {} } }])).toThrow("INVALID_PNPM_DEPENDENCY");
  });

  it("walks distinct peer variants even when package identity repeats", () => {
    const variants = [{ dependencies: {
      first: { version: "1", dependencies: { shared: { version: "2" } } },
      second: { version: "1", dependencies: { shared: { version: "2", dependencies: { extra: { version: "3" } } } } },
    } }];
    expect(productionIdentities(variants).has("extra@3")).toBe(true);
  });
});
