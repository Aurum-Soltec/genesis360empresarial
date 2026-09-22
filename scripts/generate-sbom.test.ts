import { describe, expect, it } from "vitest";
import { collectInstalledPackages, createSpdx } from "./generate-sbom.mjs";

describe("SPDX SBOM generator", () => {
  it("describes the complete installed dependency closure with stable package identities", () => {
    const packages = collectInstalledPackages();
    const sbom = createSpdx(packages, new Date("2026-09-22T00:00:00.000Z"));

    expect(packages.length).toBeGreaterThan(400);
    expect(new Set(packages.map((item) => `${item.name}@${item.version}`)).size).toBe(packages.length);
    expect(sbom.spdxVersion).toBe("SPDX-2.3");
    expect(sbom.packages).toHaveLength(packages.length + 1);
    expect(sbom.relationships).toHaveLength(packages.length + 1);
    expect(sbom.packages.some((item) => item.name === "next")).toBe(true);
    expect(sbom.packages.some((item) => item.name === "@supabase/supabase-js")).toBe(true);
  });

  it("excludes platform-incompatible optional binaries from the Linux deployment inventory", () => {
    const packages = collectInstalledPackages(undefined, { platform: "linux", arch: "x64" });

    expect(packages.some((item) => item.name === "next")).toBe(true);
    expect(packages.some((item) => item.name === "@img/sharp-win32-x64")).toBe(false);
  });
});
