import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildInstalledLicenseEvidence, copyLicenseTexts } from "./inventory-license-files.mjs";
import type { InstalledLicenseEvidenceInput } from "./inventory-license-files.mjs";

describe("ADR-015 installed-file evidence", () => {
  it("hashes notice and native bytes, detects changes, and exposes absent packages", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "genesis-license-files-"));
    try {
      const packageRoot = path.join(root, "node_modules", ".pnpm", "@img+example@1.0.0", "node_modules", "@img", "example");
      fs.mkdirSync(path.join(packageRoot, "lib"), { recursive: true });
      fs.writeFileSync(path.join(packageRoot, "package.json"), JSON.stringify({ name: "@img/example", version: "1.0.0" }));
      fs.writeFileSync(path.join(packageRoot, "LICENSE.txt"), "license text");
      fs.writeFileSync(path.join(packageRoot, "lib", "example.so.1"), "original bytes");
      const report = {
        sourceSha256: "sbom-hash",
        dependencies: [
          { name: "@img/example", version: "1.0.0", declaredLicense: "LGPL-3.0-or-later", status: "review" },
          { name: "absent", version: "1.0.0", declaredLicense: "MPL-2.0", status: "review" },
          { name: "preferred", version: "1.0.0", declaredLicense: "MIT", status: "preferred" },
        ],
      } satisfies InstalledLicenseEvidenceInput;
      const before = buildInstalledLicenseEvidence(root, report);
      expect(before.reviewPackageCount).toBe(2);
      expect(before.missingInstalledPackages).toEqual(["absent@1.0.0"]);
      expect(before.entries[0].installedVariants[0].licenseOrNoticeFiles[0].path).toBe("LICENSE.txt");
      expect(before.entries[0].installedVariants[0].nativeFiles[0].path).toBe("lib/example.so.1");
      const copied = copyLicenseTexts(root, before, path.join(root, "notice-archive"));
      expect(copied).toBe(1);
      const archived = before.entries[0].installedVariants[0].licenseOrNoticeFiles[0].archivedNoticePath;
      expect(fs.readFileSync(path.join(root, "notice-archive", archived!), "utf8")).toBe("license text");
      fs.writeFileSync(path.join(packageRoot, "lib", "example.so.1"), "changed bytes");
      const after = buildInstalledLicenseEvidence(root, report);
      expect(after.entries[0].installedVariants[0].contentSha256).not.toBe(before.entries[0].installedVariants[0].contentSha256);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
