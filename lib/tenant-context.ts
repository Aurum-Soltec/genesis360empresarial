import { cookies } from "next/headers";
import { createSupabaseServerClient } from "./supabase/server";

export const ACTIVE_TENANT_COOKIE = "genesis_active_tenant";

export interface TenantContext {
  userId: string;
  tenantId: string;
  role: string;
}

export type TenantContextTimingPhase = "auth_user" | "active_cookie" | "membership" | "quota";
export type TenantContextTimingObserver = (phase: TenantContextTimingPhase, durationMs: number) => void;

async function timed<T>(
  phase: TenantContextTimingPhase,
  observer: TenantContextTimingObserver,
  run: () => PromiseLike<T>,
): Promise<T> {
  const started = performance.now();
  try {
    return await run();
  } finally {
    // Telemetry must never change an authorization decision or error mapping.
    try { observer(phase, Math.max(0, performance.now() - started)); } catch { /* best effort */ }
  }
}

export async function requireTenantContext(
  operation = "api.default",
  observeTiming?: TenantContextTimingObserver,
): Promise<TenantContext> {
  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await (observeTiming
    ? timed("auth_user", observeTiming, () => supabase.auth.getUser())
    : supabase.auth.getUser());

  if (authError) {
    // Supabase reports a missing browser session as status 400, while an
    // expired/denied session may return 401 or 403. All are unauthenticated;
    // unrelated provider failures must still surface as availability errors.
    if (authError.name === "AuthSessionMissingError" || authError.code === "session_not_found" ||
        authError.status === 401 || authError.status === 403) throw new Error("AUTH_REQUIRED");
    throw new Error("AUTH_PROVIDER_READ_FAILED");
  }
  if (!authData.user) {
    throw new Error("AUTH_REQUIRED");
  }

  const cookieStore = await (observeTiming
    ? timed("active_cookie", observeTiming, cookies)
    : cookies());
  const tenantId = cookieStore.get(ACTIVE_TENANT_COOKIE)?.value;
  if (!tenantId) {
    throw new Error("ACTIVE_TENANT_REQUIRED");
  }

  const membershipQuery = supabase
    .from("memberships")
    .select("tenant_id, role")
    .eq("tenant_id", tenantId)
    .eq("user_id", authData.user.id)
    .maybeSingle();
  const quotaQuery = supabase.rpc("consume_tenant_quota", {
    p_tenant_id: tenantId,
    p_operation: operation,
    p_default_max_requests: 600,
    p_default_window_seconds: 60,
  });
  const [membershipResult, quotaResult] = await Promise.all([
    observeTiming ? timed("membership", observeTiming, () => membershipQuery) : membershipQuery,
    observeTiming ? timed("quota", observeTiming, () => quotaQuery) : quotaQuery,
  ]);
  const { data: membership, error } = membershipResult;

  if (error) throw new Error("MEMBERSHIP_READ_FAILED");
  if (!membership) {
    throw new Error("TENANT_ACCESS_DENIED");
  }

  const { data: quota, error: quotaError } = quotaResult;
  if (quotaError) throw new Error("RATE_LIMIT_CHECK_FAILED");
  if (quota?.[0]?.allowed === false) throw new Error("RATE_LIMIT_EXCEEDED");

  return {
    userId: authData.user.id,
    tenantId: membership.tenant_id,
    role: membership.role,
  };
}
