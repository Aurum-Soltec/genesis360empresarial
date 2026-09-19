import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/tenant-context";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";

const Schema = z.object({
  companyId: z.string().uuid(),
  attestationVersionId: z.string().uuid(),
  scopeKind: z.enum(["diagnostic", "upload_session", "evidence", "integration"]),
  scopeRef: z.string().max(200).nullable().optional(),
  confirmed: z.literal(true),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const ctx = await requireTenantContext();
    assertTenantPermission(ctx.role, "attestation:self");
    const parsed = Schema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return NextResponse.json({ error: "ATTESTATION_CONFIRMATION_REQUIRED" }, { status: 400 });
    }

    const { data: attestationId, error } = await trustedTenantRpc(
      ctx,
      "accept_data_submission_attestation",
      {
        p_company_id: parsed.data.companyId,
        p_attestation_version_id: parsed.data.attestationVersionId,
        p_scope_kind: parsed.data.scopeKind,
        p_scope_ref: parsed.data.scopeRef ?? null,
        p_metadata: {},
      },
    );

    if (error || !attestationId) {
      const status = error?.message.includes("ATTESTATION_VERSION_NOT_ACTIVE") ? 409 : 500;
      return NextResponse.json(
        { error: status === 409 ? "ATTESTATION_VERSION_NOT_ACTIVE" : "ATTESTATION_WRITE_FAILED" },
        { status },
      );
    }

    return NextResponse.json({ attestation: { id: attestationId } }, { status: 201 });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
