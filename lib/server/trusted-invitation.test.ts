import { beforeEach, describe, expect, it, vi } from "vitest";

const maybeSingle = vi.fn();
const upsert = vi.fn();
const insert = vi.fn();
const inviteUserByEmail = vi.fn();
const query = {
  select: vi.fn(() => query),
  eq: vi.fn(() => query),
  maybeSingle,
  upsert,
  insert,
};
const admin = {
  from: vi.fn(() => query),
  auth: { admin: { inviteUserByEmail } },
};

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => admin,
}));

import { inviteTenantMember } from "./trusted-data-access";

const tenantId = "10000000-0000-4000-8000-000000000001";
const userId = "30000000-0000-4000-8000-000000000003";
const invitedId = "40000000-0000-4000-8000-000000000004";
const ctx = { tenantId, userId, role: "owner" };
const input = { email: "secret-invite@example.test", role: "member" as const, redirectTo: "https://example.test/auth/callback" };

function loggedFailure(log: ReturnType<typeof vi.spyOn>) {
  expect(log).toHaveBeenCalledTimes(1);
  const serialized = String(log.mock.calls[0]?.[0]);
  expect(serialized).not.toContain(input.email);
  expect(serialized).not.toContain("sensitive-provider-detail");
  const entry = JSON.parse(serialized);
  expect(entry).toMatchObject({
    level: "error",
    operation: "membership.invite_failed",
    invite_attempt_id: expect.any(String),
  });
  return entry;
}

describe("tenant invitation operational failures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    maybeSingle.mockResolvedValue({ data: { tenant_id: tenantId, user_id: userId, role: "owner" }, error: null });
    inviteUserByEmail.mockResolvedValue({ data: { user: { id: invitedId } }, error: null });
    upsert.mockResolvedValue({ error: null });
    insert.mockResolvedValue({ error: null });
  });

  it("records only the Auth stage when the provider rejects the invite", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    inviteUserByEmail.mockResolvedValue({ data: { user: null }, error: { message: "sensitive-provider-detail" } });
    try {
      await expect(inviteTenantMember(ctx, input)).rejects.toThrow("INVITATION_FAILED");
      expect(loggedFailure(log)).toMatchObject({ stage: "auth", auth_api_accepted: false });
      expect(upsert).not.toHaveBeenCalled();
      expect(insert).not.toHaveBeenCalled();
    } finally { log.mockRestore(); }
  });

  it("distinguishes a membership write failure after Auth accepted the invite", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    upsert.mockResolvedValue({ error: { message: "sensitive-provider-detail" } });
    try {
      await expect(inviteTenantMember(ctx, input)).rejects.toThrow("INVITATION_FAILED");
      expect(loggedFailure(log)).toMatchObject({ stage: "membership", auth_api_accepted: true });
      expect(insert).not.toHaveBeenCalled();
    } finally { log.mockRestore(); }
  });

  it("fails closed and identifies an audit write failure", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    insert.mockResolvedValue({ error: { message: "sensitive-provider-detail" } });
    try {
      await expect(inviteTenantMember(ctx, input)).rejects.toThrow("INVITATION_FAILED");
      expect(loggedFailure(log)).toMatchObject({ stage: "audit", auth_api_accepted: true });
    } finally { log.mockRestore(); }
  });

  it("creates a tenant-scoped membership and audit entry on success", async () => {
    const result = await inviteTenantMember(ctx, input);
    expect(result).toEqual({ userId: invitedId, email: input.email, role: "member" });
    expect(upsert).toHaveBeenCalledWith({ tenant_id: tenantId, user_id: invitedId, role: "member" }, { onConflict: "tenant_id,user_id" });
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      tenant_id: tenantId, actor_id: userId, action: "membership.invited", resource_id: invitedId,
    }));
  });
});
