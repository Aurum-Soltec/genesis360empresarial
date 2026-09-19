import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { insertConsentDecision } from "@/lib/server/trusted-data-access";

const ConsentSchema = z.object({
  purposeCode: z.enum([
    "CORE_OPERATION",
    "AI_PROCESSING",
    "QUALIFIED_MATCHING",
    "ECOSYSTEM_ANALYTICS",
    "BENCHMARK_ANALYTICS",
  ]),
  granted: z.boolean(),
  consentVersionId: z.string().uuid(),
  companyId: z.string().uuid().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const context = await requireTenantContext();
    assertTenantPermission(context.role, "consent:self");
    const parsed = ConsentSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_CONSENT" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const userDb = await createSupabaseServerClient();

    const { data: consentVersion, error: consentVersionError } = await userDb
      .from("consent_versions")
      .select("id,active,purpose_code")
      .eq("id", parsed.data.consentVersionId)
      .maybeSingle();

    if (consentVersionError || !consentVersion?.active) {
      return NextResponse.json(
        { error: "CONSENT_VERSION_NOT_ACTIVE" },
        { status: 409 },
      );
    }

    if (consentVersion.purpose_code !== parsed.data.purposeCode) {
      return NextResponse.json(
        { error: "CONSENT_VERSION_PURPOSE_MISMATCH" },
        { status: 409 },
      );
    }

    const { error } = await insertConsentDecision(context, {
      companyId: parsed.data.companyId ?? null,
      consentVersionId: parsed.data.consentVersionId,
      purposeCode: parsed.data.purposeCode,
      granted: parsed.data.granted,
      decisionAt: now,
    });

    if (error) {
      return NextResponse.json({ error: "CONSENT_WRITE_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, decisionAt: now });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
