import { describe, expect, it } from "vitest";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { auditSpdxDocument, classifyDeclaredLicense, runCli } from "./audit-sbom-licenses.mjs";

const document = (license: string) => ({
  spdxVersion: "SPDX-2.3",
  packages: [
    { SPDXID: "SPDXRef-root", name: "genesis-360", licenseDeclared: "UNLICENSED" },
    { SPDXID: "SPDXRef-dependency", name: "dependency", versionInfo: "1.0.0", licenseDeclared: license },
  ],
  relationships: [{ spdxElementId: "SPDXRef-DOCUMENT", relationshipType: "DESCRIBES", relatedSpdxElement: "SPDXRef-root" }],
});

describe("ADR-015 license declaration precheck", () => {
  it("excludes the private project root and counts preferred third-party declarations", () => {
    const result = auditSpdxDocument(document("MIT"), "example");
    expect(result.counts).toMatchObject({ preferred: 1, review: 0, blocked: 0 });
    expect(result.gate).toBe("INCOMPLETE_ARTIFACT_AND_NOTICES_REVIEW");
  });

  it("distinguishes the CI merge commit from the reviewed PR head", () => {
    const result = auditSpdxDocument(document("MIT"), "example", "merge-sha", "head-sha");
    expect(result.ciEvaluatedSha).toBe("merge-sha");
    expect(result.prHeadSha).toBe("head-sha");
  });

  it("keeps LGPL under legal review without treating sharp's Apache declaration as sufficient", () => {
    const result = auditSpdxDocument(document("LGPL-3.0-or-later"), "example");
    expect(result.counts.review).toBe(1);
    expect(result.gate).toBe("BLOCKED");
    expect(result.dependencies[0].reason).toBe("weak_copyleft_requires_legal_review");
  });

  it.each(["NOASSERTION", "AGPL-3.0-only", "GPL-3.0-only", "SSPL-1.0", "BSL-1.1"])("blocks %s", (license) => {
    expect(classifyDeclaredLicense(license).status).toBe("blocked");
  });

  it("requires manual review of composite expressions and rejects an invalid SBOM", () => {
    expect(classifyDeclaredLicense("MIT OR Apache-2.0").status).toBe("review");
    expect(() => auditSpdxDocument({ packages: [] }, "example")).toThrow("SPDX-2.3");
  });

  it("writes review evidence but fails the enforce step until an exception is approved", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "genesis-license-test-"));
    try {
      const input = path.join(directory, "sbom.json");
      const output = path.join(directory, "report.json");
      const source = JSON.stringify(document("LGPL-3.0-or-later"));
      fs.writeFileSync(input, source);
      expect(runCli([input, output, "--enforce"])).toBe(1);
      const report = JSON.parse(fs.readFileSync(output, "utf8"));
      expect(report.gate).toBe("BLOCKED");
      expect(report.sourceSha256).toBe(crypto.createHash("sha256").update(source).digest("hex"));
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });
});
