import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getFeatureFlags } from "@/lib/feature-flags";
import { isManagementRole } from "@/lib/authz";
import { getEffectiveConsent } from "@/lib/consent";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSolutionContactRequest } from "@/lib/server/trusted-data-access";
import { loadQualifiedSolutionsForPain } from "@/lib/server/qualified-solutions";

const Schema = z.object({
  painId: z.string().uuid(),
  providerCapabilityId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const flags = getFeatureFlags();
    if (!flags.qualificationNetwork || !flags.realContact) {
      return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 404 });
    }

    const ctx = await requireTenantContext();
    assertTenantPermission(ctx.role, "solutions:contact");
    if (!isManagementRole(ctx.role)) {
      return NextResponse.json({ error: "ROLE_NOT_ALLOWED" }, { status: 403 });
    }

    const parsed = Schema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_CONTACT_REQUEST" }, { status: 400 });
    }

    const userDb = await createSupabaseServerClient();
    const { data: pain } = await userDb
      .from("pain_findings")
      .select("id,company_id")
      .eq("tenant_id", ctx.tenantId)
      .eq("id", parsed.data.painId)
      .maybeSingle();

    if (!pain) {
      return NextResponse.json({ error: "PAIN_NOT_FOUND" }, { status: 404 });
    }

    const consent = await getEffectiveConsent(
      ctx,
      "QUALIFIED_MATCHING",
      pain.company_id,
    );

    if (!consent) {
      return NextResponse.json({ error: "CONSENT_REQUIRED" }, { status: 409 });
    }

    // Recalculate eligibility at request time. Never trust a provider ID sent by the browser.
    const search = await loadQualifiedSolutionsForPain(ctx, pain.id);
    const solution =
      search.status === "READY"
        ? search.solutions.find(
            (item) =>
              item.providerCapabilityId === parsed.data.providerCapabilityId,
          )
        : null;

    if (!solution) {
      return NextResponse.json(
        { error: "PROVIDER_NO_LONGER_ELIGIBLE" },
        { status: 409 },
      );
    }

    const { data, error } = await createSolutionContactRequest(ctx, {
        consumerCompanyId: pain.company_id,
        providerCapabilityId: solution.providerCapabilityId,
        painId: pain.id,
        consumerConsentId: consent.id,
        matchSnapshot: {
          rankScore: solution.rankScore,
          qualificationScore: solution.qualificationScore,
          capacityStatus: solution.capacityStatus,
          capabilityCode: solution.capabilityCode,
          explanation: solution.explanation,
        },
      });

    if (error) {
      const status = error.code === "23505" ? 409 : 500;
      return NextResponse.json(
        {
          error:
            status === 409
              ? "CONTACT_REQUEST_ALREADY_OPEN"
              : "CONTACT_REQUEST_FAILED",
        },
        { status },
      );
    }

    return NextResponse.json({ request: data }, { status: 201 });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
