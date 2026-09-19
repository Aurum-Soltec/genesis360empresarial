import { describe, expect, it } from "vitest";
import { isManagementRole } from "./authz";

describe("authorization role helpers", () => {
  it("allows management roles", () => {
    expect(isManagementRole("owner")).toBe(true);
    expect(isManagementRole("admin")).toBe(true);
    expect(isManagementRole("manager")).toBe(true);
  });

  it("does not treat non-management roles as management", () => {
    expect(isManagementRole("member")).toBe(false);
    expect(isManagementRole("specialist")).toBe(false);
    expect(isManagementRole("auditor")).toBe(false);
  });
});
