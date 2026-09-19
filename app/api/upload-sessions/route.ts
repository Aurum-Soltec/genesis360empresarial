import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getFeatureFlags } from "@/lib/feature-flags";
import { requireTenantContext } from "@/lib/tenant-context";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";

const Schema = z.object({
  companyId: z.string().uuid(),
  attestationId: z.string().uuid(),
  purposeCode: z.string().min(2).max(80).default("CORE_OPERATION"),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const flags = getFeatureFlags();
    if (!flags.dataUpload) {
      return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 404 });
    }

    const ctx = await requireTenantContext();
    assertTenantPermission(ctx.role, "upload:create");
    const parsed = Schema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_UPLOAD_SESSION" }, { status: 400 });
    }

    const { data: sessionId, error } = await trustedTenantRpc(
      ctx,
      "create_document_upload_session",
      {
        p_company_id: parsed.data.companyId,
        p_attestation_id: parsed.data.attestationId,
        p_purpose_code: parsed.data.purposeCode,
      },
    );

    if (error || !sessionId) {
      return NextResponse.json({ error: "UPLOAD_SESSION_CREATE_FAILED" }, { status: 409 });
    }

    return NextResponse.json(
      {
        uploadSession: {
          id: sessionId,
          note: "Metadata session created. Binary upload endpoint remains separately gated.",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
