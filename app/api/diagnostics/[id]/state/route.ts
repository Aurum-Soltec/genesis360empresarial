import { NextResponse } from "next/server";
import { requireTenantContext } from "@/lib/tenant-context";
import { loadDiagnosticState } from "@/lib/server/diagnostic-state";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await requireTenantContext();
    const { id } = await params;
    return NextResponse.json(await loadDiagnosticState(ctx, id));
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    return NextResponse.json(
      { error: code },
      {
        status:
          code === "AUTH_REQUIRED"
            ? 401
            : code === "DIAGNOSTIC_NOT_FOUND"
              ? 404
              : 403,
      },
    );
  }
}
