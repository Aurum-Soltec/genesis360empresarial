import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { readJsonBody } from "@/lib/http-security";
import { getFeatureFlags } from "@/lib/feature-flags";
import { listTenantMembers } from "@/lib/server/trusted-data-access";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";
import { DemoEvidenceTemplates } from "@/lib/demo-scenario";
import { POST as activateTenant } from "./tenant/active/route";
import { GET as getMembers } from "./tenant/members/route";
import { POST as createGds } from "./pains/[id]/gds/route";
import { POST as createMission } from "./decisions/[id]/missions/route";
import { POST as addMissionEvidence } from "./missions/[id]/evidence/route";
import { POST as addOutcome } from "./missions/[id]/outcome/route";
import { POST as registerDemoEvidence } from "./demo/evidence/route";
import { POST as requestContact } from "./solutions/contact/route";
import { POST as recordEvidence } from "./evidence/route";

vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));
vi.mock("@/lib/tenant-context", () => ({
  ACTIVE_TENANT_COOKIE: "genesis_active_tenant",
  requireTenantContext: vi.fn(async () => ({ tenantId: tenant, userId: actor, role: "owner" })),
}));
vi.mock("@/lib/http-security", () => ({
  assertSameOrigin: vi.fn(),
  readJsonBody: vi.fn(),
}));
vi.mock("@/lib/authz", () => ({
  assertTenantPermission: vi.fn(),
  isManagementRole: vi.fn(() => true),
}));
vi.mock("@/lib/feature-flags", () => ({
  isDemoTenantAllowed: vi.fn(() => true),
  getFeatureFlags: vi.fn(),
}));
vi.mock("@/lib/server/trusted-data-access", () => ({
  trustedTenantRpc: vi.fn(),
  recordDecisionFromPain: vi.fn(),
  createSolutionContactRequest: vi.fn(),
  listTenantMembers: vi.fn(),
  inviteTenantMember: vi.fn(),
  removeTenantMember: vi.fn(),
  updateTenantMemberRole: vi.fn(),
}));

const tenant = "a53d025b-6248-467a-843f-e343b75fd94b";
const actor = "19f0a230-c90c-4c5b-869c-7e272d7c4e1d";
const item = "f1642d30-e853-4ec1-89ac-f1d475bc4eea";
const request = new Request("https://genesis.example/api/test", { method: "POST" });

function fakeDb(
  result: { data: unknown; error: unknown },
  authResult: { data: { user: { id: string } | null }; error: { status?: number } | null } =
    { data: { user: { id: actor } }, error: null },
) {
  const query = {
    eq: vi.fn(() => query),
    maybeSingle: vi.fn(async () => result),
  };
  return {
    from: vi.fn(() => ({ select: vi.fn(() => query) })),
    auth: { getUser: vi.fn(async () => authResult) },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(readJsonBody).mockResolvedValue({
    tenantId: tenant,
    companyId: item,
    painId: item,
    providerCapabilityId: item,
    dueAt: null,
    evidenceType: "declaration",
    summary: "Evidência declarada",
    payload: {},
    outcomeStatus: "unknown",
  });
  vi.mocked(getFeatureFlags).mockReturnValue({
    qualificationNetwork: true,
    realContact: true,
  } as never);
});

describe("API read-failure boundary", () => {
  it("keeps expired credentials distinct from an auth provider outage", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(fakeDb(
      { data: null, error: null },
      { data: { user: null }, error: { status: 401 } },
    ) as never);
    const expired = await activateTenant(request);
    expect(expired.status).toBe(401);
    expect(await expired.json()).toEqual({ error: "AUTH_REQUIRED" });

    vi.mocked(createSupabaseServerClient).mockResolvedValue(fakeDb(
      { data: null, error: null },
      { data: { user: null }, error: { status: 503 } },
    ) as never);
    const outage = await activateTenant(request);
    expect(outage.status).toBe(500);
    expect(await outage.json()).toEqual({ error: "INTERNAL_ERROR" });
  });

  it("does not convert membership storage failure into an access denial", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(fakeDb({ data: null, error: { code: "DB_DOWN" } }) as never);
    const response = await activateTenant(request);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "INTERNAL_ERROR" });
  });

  it("does not convert database failures into missing pain, decision, or mission", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(fakeDb({ data: null, error: { code: "DB_DOWN" } }) as never);
    const paths = [
      createGds(request, { params: Promise.resolve({ id: item }) }),
      createMission(request, { params: Promise.resolve({ id: item }) }),
      addMissionEvidence(request, { params: Promise.resolve({ id: item }) }),
      requestContact(request),
    ];
    for (const response of await Promise.all(paths)) {
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: "INTERNAL_ERROR" });
    }
  });

  it("does not confuse an outcome mission read error with a missing mission", async () => {
    vi.mocked(readJsonBody).mockResolvedValueOnce({ outcomeStatus: "unknown" });
    vi.mocked(createSupabaseServerClient).mockResolvedValue(fakeDb({ data: null, error: { code: "DB_DOWN" } }) as never);
    const response = await addOutcome(request, { params: Promise.resolve({ id: item }) });
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "INTERNAL_ERROR" });
  });

  it("does not confuse a demo company lookup outage with a missing company", async () => {
    vi.mocked(readJsonBody).mockResolvedValueOnce({ companyId: item });
    vi.mocked(createSupabaseServerClient).mockResolvedValue(fakeDb({ data: null, error: { code: "DB_DOWN" } }) as never);
    const response = await registerDemoEvidence(request);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "INTERNAL_ERROR" });
  });

  it("never registers synthetic evidence against a real company", async () => {
    vi.mocked(readJsonBody).mockResolvedValueOnce({ companyId: item });
    vi.mocked(createSupabaseServerClient).mockResolvedValue(fakeDb({
      data: { id: item, fictional: false }, error: null,
    }) as never);
    const response = await registerDemoEvidence(request);
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "FICTIONAL_COMPANY_REQUIRED" });
    expect(trustedTenantRpc).not.toHaveBeenCalled();
  });

  it("rejects a conflicting record that impersonates a canonical demo source", async () => {
    vi.mocked(readJsonBody).mockResolvedValueOnce({ companyId: item });
    const template = DemoEvidenceTemplates[0];
    const companyQuery = {
      eq: vi.fn(() => companyQuery),
      maybeSingle: vi.fn(async () => ({ data: { id: item, fictional: true }, error: null })),
    };
    const evidenceQuery = {
      eq: vi.fn(() => evidenceQuery),
      in: vi.fn(async () => ({ data: [{
        id: item,
        source_ref: template.sourceRef,
        evidence_type: template.evidenceType,
        summary: template.summary,
        payload: { demo: false },
        sensitivity: template.sensitivity,
        purpose_codes: ["CORE_OPERATION"],
        verification_status: "unverified",
      }], error: null })),
    };
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      from: (table: string) => ({ select: () => table === "companies" ? companyQuery : evidenceQuery }),
    } as never);
    const response = await registerDemoEvidence(request);
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "DEMO_SOURCE_CONFLICT" });
    expect(trustedTenantRpc).not.toHaveBeenCalled();
  });

  it("reserves the DEMO source namespace from ordinary evidence writes", async () => {
    vi.mocked(readJsonBody).mockResolvedValueOnce({
      companyId: item, evidenceType: "user_declaration", summary: "Fonte declarada",
      payload: {}, sourceRef: "DEMO:direcionadores-estrategicos-v1.txt",
    });
    const response = await recordEvidence(request);
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ error: "RESERVED_DEMO_SOURCE_REF" });
    expect(trustedTenantRpc).not.toHaveBeenCalled();
  });

  it("still returns not-found when the lookup succeeds and the record is absent", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(fakeDb({ data: null, error: null }) as never);
    const response = await createGds(request, { params: Promise.resolve({ id: item }) });
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "PAIN_NOT_FOUND" });
  });

  it("does not label an operator-facing member listing outage as a missing member", async () => {
    vi.mocked(listTenantMembers).mockResolvedValue({ data: null, error: { code: "DB_DOWN" } } as never);
    const response = await getMembers();
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "INTERNAL_ERROR" });
  });
});
