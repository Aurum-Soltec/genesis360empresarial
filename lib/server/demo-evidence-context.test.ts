import { beforeEach, describe, expect, it, vi } from "vitest";
import { DemoEvidenceTemplates, type DemoEvidenceRecord } from "@/lib/demo-scenario";

const tenantId = "10000000-0000-4000-8000-000000000001";
const userId = "20000000-0000-4000-8000-000000000002";
const companyId = "30000000-0000-4000-8000-000000000003";
const diagnosticId = "40000000-0000-4000-8000-000000000004";
const evidenceIds = [
  "50000000-0000-4000-8000-000000000005",
  "50000000-0000-4000-8000-000000000006",
  "50000000-0000-4000-8000-000000000007",
];
const ctx = { tenantId, userId, role: "owner" };

const rows = DemoEvidenceTemplates.map((template, index) => ({
  id: evidenceIds[index],
  source_ref: template.sourceRef,
  evidence_type: template.evidenceType,
  summary: template.summary,
  payload: template.payload,
  sensitivity: template.sensitivity,
  purpose_codes: ["DEMO_CONTROLLED"],
  verification_status: "unverified",
}));

const membership = { data: { tenant_id: tenantId, user_id: userId, role: "owner" }, error: null };
let company: { data: { id: string; fictional: boolean } | null; error: null } =
  { data: { id: companyId, fictional: true }, error: null };
let diagnostic: { data: { id: string } | null; error: null } =
  { data: { id: diagnosticId }, error: null };
let evidence: { data: Array<DemoEvidenceRecord & { id: string }> | null; error: null } =
  { data: rows, error: null };
const upsert = vi.fn(async () => ({ error: null }));
const from = vi.fn((table: string) => {
  const query = {
    select: () => query,
    eq: () => query,
    in: async () => evidence,
    maybeSingle: async () => table === "memberships" ? membership
      : table === "companies" ? company : diagnostic,
    upsert,
  };
  return query;
});
vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({ from }),
}));

import { linkCanonicalDemoEvidenceContext } from "./trusted-data-access";

describe("canonical demo evidence context link", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    company = { data: { id: companyId, fictional: true }, error: null };
    diagnostic = { data: { id: diagnosticId }, error: null };
    evidence = { data: rows, error: null };
  });

  it("links only reviewed fictional records as context, without claiming support or verification", async () => {
    await linkCanonicalDemoEvidenceContext(ctx, { companyId, diagnosticId, evidenceIds });
    expect(upsert).toHaveBeenCalledWith(
      evidenceIds.map((id) => ({
        tenant_id: tenantId,
        company_id: companyId,
        evidence_id: id,
        subject_type: "diagnostic",
        subject_id: diagnosticId,
        relation: "context_for",
      })),
      { onConflict: "evidence_id,subject_type,subject_id,relation", ignoreDuplicates: true },
    );
  });

  it("fails closed when the diagnostic or source is not the canonical tenant-owned record", async () => {
    company = { data: { id: companyId, fictional: false }, error: null };
    await expect(linkCanonicalDemoEvidenceContext(ctx, { companyId, diagnosticId, evidenceIds }))
      .rejects.toThrow("DEMO_COMPANY_NOT_FOUND");
    expect(upsert).not.toHaveBeenCalled();

    company = { data: { id: companyId, fictional: true }, error: null };
    diagnostic = { data: null, error: null };
    await expect(linkCanonicalDemoEvidenceContext(ctx, { companyId, diagnosticId, evidenceIds }))
      .rejects.toThrow("DEMO_DIAGNOSTIC_NOT_FOUND");
    expect(upsert).not.toHaveBeenCalled();

    diagnostic = { data: { id: diagnosticId }, error: null };
    evidence = { data: [{ ...rows[0], payload: { demo: false } }, ...rows.slice(1)], error: null };
    await expect(linkCanonicalDemoEvidenceContext(ctx, { companyId, diagnosticId, evidenceIds }))
      .rejects.toThrow("DEMO_CONTEXT_SOURCE_MISMATCH");
    expect(upsert).not.toHaveBeenCalled();

    evidence = { data: [{ ...rows[0], id: evidenceIds[1] }, { ...rows[0] }, rows[2]], error: null };
    await expect(linkCanonicalDemoEvidenceContext(ctx, { companyId, diagnosticId, evidenceIds }))
      .rejects.toThrow("DEMO_CONTEXT_SOURCE_MISMATCH");
    expect(upsert).not.toHaveBeenCalled();
  });

  it("rejects a malformed or incomplete package before privileged access", async () => {
    await expect(linkCanonicalDemoEvidenceContext(ctx, {
      companyId, diagnosticId, evidenceIds: evidenceIds.slice(0, 2),
    })).rejects.toThrow("DEMO_CONTEXT_INVALID");
    expect(from).not.toHaveBeenCalled();
  });
});
