import { NextResponse } from "next/server";
import { z } from "zod";
import { apiErrorDetails } from "@/lib/api-errors";
import { assertTenantPermission } from "@/lib/authz";
import { DemoEvidenceTemplates, isCanonicalDemoEvidenceRecord } from "@/lib/demo-scenario";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";
import { requireTenantContext } from "@/lib/tenant-context";

const Schema = z.object({
  companyId: z.string().uuid(),
  diagnosticId: z.string().uuid().nullable().optional(),
}).strict();

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const ctx = await requireTenantContext("api.demo.evidence");
    assertTenantPermission(ctx.role, "evidence:write");
    if (!isDemoTenantAllowed(ctx.tenantId)) {
      return NextResponse.json({ error: "DEMO_WORKSPACE_DISABLED" }, { status: 404 });
    }

    const parsed = Schema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_DEMO_PACKAGE" }, { status: 400 });
    }

    const db = await createSupabaseServerClient();
    const { data: company, error: companyError } = await db
      .from("companies")
      .select("id,fictional")
      .eq("tenant_id", ctx.tenantId)
      .eq("id", parsed.data.companyId)
      .maybeSingle();
    if (companyError) throw new Error("DEMO_COMPANY_READ_FAILED");
    if (!company) return NextResponse.json({ error: "COMPANY_NOT_FOUND" }, { status: 404 });
    if (!company.fictional) {
      return NextResponse.json({ error: "FICTIONAL_COMPANY_REQUIRED" }, { status: 409 });
    }

    let diagnosticId: string | null = null;
    if (parsed.data.diagnosticId) {
      const { data: diagnostic, error: diagnosticError } = await db
        .from("diagnostics")
        .select("id")
        .eq("tenant_id", ctx.tenantId)
        .eq("company_id", company.id)
        .eq("id", parsed.data.diagnosticId)
        .maybeSingle();
      if (diagnosticError) throw new Error("DEMO_DIAGNOSTIC_READ_FAILED");
      if (!diagnostic) {
        return NextResponse.json({ error: "DIAGNOSTIC_NOT_FOUND" }, { status: 404 });
      }
      diagnosticId = diagnostic.id;
    }

    const refs = DemoEvidenceTemplates.map((item) => item.sourceRef);
    const { data: existing, error: existingError } = await db
      .from("evidence_items")
      .select("id,source_ref,evidence_type,summary,payload,sensitivity,purpose_codes,verification_status")
      .eq("tenant_id", ctx.tenantId)
      .eq("company_id", company.id)
      .in("source_ref", refs);
    if (existingError) throw new Error("EVIDENCE_READ_FAILED");
    if ((existing ?? []).some((item) => !isCanonicalDemoEvidenceRecord(item))) {
      return NextResponse.json({ error: "DEMO_SOURCE_CONFLICT" }, { status: 409 });
    }

    const byRef = new Map((existing ?? []).map((item) => [item.source_ref, item.id]));
    const ids: string[] = [];
    let created = 0;

    for (const item of DemoEvidenceTemplates) {
      const existingId = byRef.get(item.sourceRef);
      if (existingId) {
        ids.push(existingId);
        continue;
      }
      const { data: evidenceId, error } = await trustedTenantRpc(ctx, "record_evidence", {
        p_company_id: company.id,
        p_evidence_type: item.evidenceType,
        p_summary: item.summary,
        p_payload: item.payload,
        p_source_ref: item.sourceRef,
        p_confidence: null,
        p_sensitivity: item.sensitivity,
        p_purpose_codes: ["DEMO_CONTROLLED"],
        p_subject_type: diagnosticId ? "diagnostic" : null,
        p_subject_id: diagnosticId,
        p_relation: "supports",
      });
      if (error || !evidenceId) throw new Error("EVIDENCE_WRITE_FAILED");
      ids.push(evidenceId);
      created += 1;
    }

    return NextResponse.json({ evidenceIds: ids, created, fictional: true }, { status: 201 });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
