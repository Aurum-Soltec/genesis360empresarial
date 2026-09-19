import { NextResponse } from "next/server";
import { z } from "zod";
import { getFeatureFlags } from "@/lib/feature-flags";
import { requireTenantContext } from "@/lib/tenant-context";
import { loadQualifiedSolutionsForPain } from "@/lib/server/qualified-solutions";

const PainId = z.string().uuid();

export async function GET(request: Request) {
  try {
    const flags = getFeatureFlags();
    if (!flags.qualificationNetwork) {
      return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 404 });
    }

    const ctx = await requireTenantContext();
    const painId = new URL(request.url).searchParams.get("painId");
    const parsed = PainId.safeParse(painId);
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_PAIN_ID" }, { status: 400 });
    }

    const result = await loadQualifiedSolutionsForPain(ctx, parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    return NextResponse.json(
      { error: code },
      {
        status:
          code === "AUTH_REQUIRED"
            ? 401
            : code === "PAIN_NOT_FOUND"
              ? 404
              : 403,
      },
    );
  }
}
