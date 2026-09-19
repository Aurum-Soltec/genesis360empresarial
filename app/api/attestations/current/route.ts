import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    await requireTenantContext();
    const code =
      new URL(request.url).searchParams.get("code") ??
      "DIAGNOSTIC_EVIDENCE_UPLOAD";

    const db = await createSupabaseServerClient();
    const { data } = await db
      .from("data_submission_attestation_versions")
      .select(
        "id,code,version,purpose_code,title,declaration_text,warning_text,genesis_responsibility_text,content_hash,effective_at",
      )
      .eq("code", code)
      .eq("status", "active")
      .maybeSingle();

    if (!data) {
      return NextResponse.json(
        { error: "ATTESTATION_VERSION_NOT_ACTIVE" },
        { status: 404 },
      );
    }
    return NextResponse.json({ attestationVersion: data });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
