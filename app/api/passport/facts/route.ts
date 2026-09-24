import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { BusinessFactInputSchema } from "@/lib/business-passport";
import { requireTenantContext, type TenantContextTimingPhase } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";

type TimingPhase = "tenant_context" | "data_access";
type RequestTimings = Partial<Record<TimingPhase | TenantContextTimingPhase, number>>;

async function measure<T>(timings: RequestTimings, phase: TimingPhase, run: () => Promise<T>): Promise<T> {
  const started = performance.now();
  try {
    return await run();
  } finally {
    timings[phase] = performance.now() - started;
  }
}

function jsonWithTiming(body: object, status: number, timings: RequestTimings) {
  const phases: readonly (TimingPhase | TenantContextTimingPhase)[] = status >= 200 && status < 300
    ? ["tenant_context", "auth_user", "active_cookie", "membership", "quota", "data_access"]
    : ["tenant_context", "data_access"];
  const serverTiming = phases
    .filter((phase) => Number.isFinite(timings[phase]))
    .map((phase) => `${phase};dur=${Math.max(0, timings[phase]!).toFixed(2)}`)
    .join(", ");
  return NextResponse.json(body, {
    status,
    ...(serverTiming ? { headers: { "Server-Timing": serverTiming } } : {}),
  });
}

export async function GET(request: Request) {
  const timings: RequestTimings = {};
  try {
    const context = await measure(timings, "tenant_context", () =>
      requireTenantContext("api.default", (phase, durationMs) => { timings[phase] = durationMs; }),
    );
    const companyId = new URL(request.url).searchParams.get("companyId");
    if (!companyId) {
      return jsonWithTiming({ error: "COMPANY_REQUIRED" }, 400, timings);
    }

    const { data, error } = await measure(timings, "data_access", async () => {
      const supabase = await createSupabaseServerClient();
      return supabase
        .from("business_facts")
        .select(
          "id,fact_key,value,source,captured_at,confidence,sensitivity,verification_status,purpose_codes",
        )
        .eq("tenant_id", context.tenantId)
        .eq("company_id", companyId)
        .is("valid_to", null)
        .order("fact_key");
    });

    if (error) {
      return jsonWithTiming({ error: "PASSPORT_READ_FAILED" }, 500, timings);
    }
    return jsonWithTiming({ facts: data ?? [] }, 200, timings);
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return jsonWithTiming({ error: code }, status, timings);
  }
}

export async function POST(request: Request) {
  const timings: RequestTimings = {};
  try {
    assertSameOrigin(request);
    const context = await measure(timings, "tenant_context", () =>
      requireTenantContext("api.default", (phase, durationMs) => { timings[phase] = durationMs; }),
    );
    assertTenantPermission(context.role, "passport:write");
    const parsed = BusinessFactInputSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return jsonWithTiming({ error: "INVALID_FACT" }, 400, timings);
    }

    const input = parsed.data;
    const { data: factId, error } = await measure(timings, "data_access", () =>
      trustedTenantRpc(context, "record_business_fact", {
        p_company_id: input.companyId,
        p_fact_key: input.factKey,
        p_value: input.value,
        p_source: input.source,
        p_source_ref: input.sourceRef ?? null,
        p_confidence: input.confidence ?? null,
        p_sensitivity: input.sensitivity,
        p_purpose_codes: input.purposeCodes,
      }),
    );

    if (error || !factId) {
      return jsonWithTiming({ error: "FACT_WRITE_FAILED" }, 500, timings);
    }

    return jsonWithTiming({ fact: { id: factId } }, 201, timings);
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return jsonWithTiming({ error: code }, status, timings);
  }
}
