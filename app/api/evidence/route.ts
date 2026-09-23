import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { EvidenceInputSchema } from "@/lib/evidence";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";

export async function GET(request: Request) {
  try {
    const ctx = await requireTenantContext();
    const companyId = new URL(request.url).searchParams.get("companyId");
    if (!companyId) {
      return NextResponse.json({ error: "COMPANY_REQUIRED" }, { status: 400 });
    }

    const db = await createSupabaseServerClient();
    const { data, error } = await db
      .from("evidence_items")
      .select(
        "id,evidence_type,source_ref,summary,captured_at,confidence,verification_status,sensitivity,purpose_codes",
      )
      .eq("tenant_id", ctx.tenantId)
      .eq("company_id", companyId)
      .order("captured_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: "EVIDENCE_READ_FAILED" }, { status: 500 });
    }
    return NextResponse.json({ evidence: data ?? [] });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const ctx = await requireTenantContext();
    assertTenantPermission(ctx.role, "evidence:write");
    const parsed = EvidenceInputSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_EVIDENCE" }, { status: 400 });
    }

    const input = parsed.data;
    if (input.sourceRef?.startsWith("DEMO:")) {
      return NextResponse.json({ error: "RESERVED_DEMO_SOURCE_REF" }, { status: 422 });
    }
    const { data: evidenceId, error } = await trustedTenantRpc(ctx, "record_evidence", {
      p_company_id: input.companyId,
      p_evidence_type: input.evidenceType,
      p_summary: input.summary,
      p_payload: input.payload,
      p_source_ref: input.sourceRef ?? null,
      p_confidence: input.confidence ?? null,
      p_sensitivity: input.sensitivity,
      p_purpose_codes: input.purposeCodes,
      p_subject_type: input.link?.subjectType ?? null,
      p_subject_id: input.link?.subjectId ?? null,
      p_relation: input.link?.relation ?? "supports",
    });

    if (error || !evidenceId) {
      return NextResponse.json({ error: "EVIDENCE_WRITE_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ evidence: { id: evidenceId } }, { status: 201 });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
