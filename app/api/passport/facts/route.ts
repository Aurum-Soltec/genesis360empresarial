import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { BusinessFactInputSchema } from "@/lib/business-passport";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";

export async function GET(request: Request) {
  try {
    const context = await requireTenantContext();
    const companyId = new URL(request.url).searchParams.get("companyId");
    if (!companyId) {
      return NextResponse.json({ error: "COMPANY_REQUIRED" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("business_facts")
      .select(
        "id,fact_key,value,source,captured_at,confidence,sensitivity,verification_status,purpose_codes",
      )
      .eq("tenant_id", context.tenantId)
      .eq("company_id", companyId)
      .is("valid_to", null)
      .order("fact_key");

    if (error) {
      return NextResponse.json({ error: "PASSPORT_READ_FAILED" }, { status: 500 });
    }
    return NextResponse.json({ facts: data ?? [] });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const context = await requireTenantContext();
    assertTenantPermission(context.role, "passport:write");
    const parsed = BusinessFactInputSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_FACT" }, { status: 400 });
    }

    const input = parsed.data;
    const { data: factId, error } = await trustedTenantRpc(context, "record_business_fact", {
      p_company_id: input.companyId,
      p_fact_key: input.factKey,
      p_value: input.value,
      p_source: input.source,
      p_source_ref: input.sourceRef ?? null,
      p_confidence: input.confidence ?? null,
      p_sensitivity: input.sensitivity,
      p_purpose_codes: input.purposeCodes,
    });

    if (error || !factId) {
      return NextResponse.json({ error: "FACT_WRITE_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ fact: { id: factId } }, { status: 201 });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
