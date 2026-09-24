import { describe, expect, it } from "vitest";
import { auditSpdxDocument, classifyDeclaredLicense } from "./audit-sbom-licenses.mjs";

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
});
