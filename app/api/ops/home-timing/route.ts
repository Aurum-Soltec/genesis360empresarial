import { apiErrorDetails } from "@/lib/api-errors";
import { loadDashboardOverview, type DashboardTimingPhase } from "@/lib/dashboard-overview";
import { requireTenantContext, type TenantContextTimingPhase } from "@/lib/tenant-context";

type TimingPhase = "total" | "tenant_context" | "dashboard" |
  TenantContextTimingPhase | DashboardTimingPhase;
type Timings = Partial<Record<TimingPhase, number>>;

const NO_STORE = "private, no-store, max-age=0";
const SUCCESS_PHASES: readonly TimingPhase[] = [
  "total", "tenant_context", "auth_user", "active_cookie", "membership", "quota",
  "dashboard", "company_selection", "diagnostic", "pains",
];

async function measure<T>(timings: Timings, phase: TimingPhase, run: () => Promise<T>): Promise<T> {
  const started = performance.now();
  try {
    return await run();
  } finally {
    timings[phase] = Math.max(0, performance.now() - started);
  }
}

function successResponse(timings: Timings): Response {
  const exposed: Timings = {};
  for (const phase of SUCCESS_PHASES) {
    const duration = timings[phase];
    if (typeof duration === "number" && Number.isFinite(duration)) {
      exposed[phase] = Math.round(Math.max(0, duration) * 100) / 100;
    }
  }
  const serverTiming = SUCCESS_PHASES
    .filter((phase) => exposed[phase] !== undefined)
    .map((phase) => `${phase};dur=${exposed[phase]!.toFixed(2)}`)
    .join(", ");
  return Response.json({ measured: true, timings_ms: exposed }, {
    headers: { "Cache-Control": NO_STORE, "Server-Timing": serverTiming },
  });
}

/** Short-lived HSP-4 measurement only. The same tenant context and reads as Home run here. */
export async function GET(): Promise<Response> {
  if (process.env.HSP4_PERF_TRACE !== "1") {
    return Response.json({ error: "NOT_FOUND" }, {
      status: 404, headers: { "Cache-Control": NO_STORE },
    });
  }

  const timings: Timings = {};
  const started = performance.now();
  const observe = (phase: TenantContextTimingPhase | DashboardTimingPhase, durationMs: number) => {
    if (Number.isFinite(durationMs)) timings[phase] = Math.max(0, durationMs);
  };
  try {
    const context = await measure(timings, "tenant_context", () =>
      requireTenantContext("api.default", observe));
    await measure(timings, "dashboard", () => loadDashboardOverview(context, observe));
    timings.total = Math.max(0, performance.now() - started);
    return successResponse(timings);
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    // Never expose subphase timings or database/provider details on denied requests.
    return Response.json({ error: code }, {
      status, headers: { "Cache-Control": NO_STORE },
    });
  }
}
