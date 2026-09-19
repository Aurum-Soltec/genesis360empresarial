import { NextResponse } from "next/server";
import { z } from "zod";
import { apiErrorDetails, assertUuid } from "@/lib/api-errors";
import { getFeatureFlags } from "@/lib/feature-flags";
import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { createDocumentUploadTarget } from "@/lib/server/trusted-data-access";
import { requireTenantContext } from "@/lib/tenant-context";

const input = z.object({
  fileName: z.string().min(1).max(255),
  mediaType: z.enum(["application/pdf", "image/png", "image/jpeg", "text/csv"]),
  sizeBytes: z.number().int().positive().max(10_485_760),
  sha256: z.string().regex(/^[a-f0-9]{64}$/i),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    if (!getFeatureFlags().dataUpload) return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 404 });
    const { id } = await params;
    assertUuid(id);
    const parsed = input.safeParse(await readJsonBody(request));
    if (!parsed.success) return NextResponse.json({ error: "INVALID_UPLOAD_FILE" }, { status: 400 });
    const target = await createDocumentUploadTarget(await requireTenantContext("storage.upload_target"), {
      sessionId: id, ...parsed.data,
    });
    return NextResponse.json({ target }, { status: 201 });
  } catch (error) {
    const details = apiErrorDetails(error);
    return NextResponse.json({ error: details.code }, { status: details.status });
  }
}
