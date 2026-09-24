import { describe, expect, it } from "vitest";
import { safeInternalPath } from "./safe-navigation";

describe("safeInternalPath", () => {
  it("preserves an internal route and its query", () => {
    expect(safeInternalPath("/diagnostico-v1?from=menu")).toBe("/diagnostico-v1?from=menu");
  });

  it.each([
    "https://attacker.example/path",
    "//attacker.example/path",
    "/\\attacker.example/path",
    "diagnostico-v1",
    "javascript:alert(1)",
  ])("rejects non-local navigation target %s", (candidate) => {
    expect(safeInternalPath(candidate, "/fallback")).toBe("/fallback");
  });

  it("uses the tenant chooser when the target is absent", () => {
    expect(safeInternalPath(null)).toBe("/selecionar-empresa");
  });
});
