import { redirect } from "next/navigation";
import { requireTenantContext, type TenantContext, type TenantContextTimingObserver } from "@/lib/tenant-context";

export async function requirePageTenantContext(
  destination: string,
  operation = "api.default",
  observeTiming?: TenantContextTimingObserver,
): Promise<TenantContext> {
  try {
    return await requireTenantContext(operation, observeTiming);
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    const next = encodeURIComponent(destination);

    if (code === "AUTH_REQUIRED") redirect(`/entrar?next=${next}`);
    if (code === "ACTIVE_TENANT_REQUIRED" || code === "TENANT_ACCESS_DENIED") {
      redirect(`/selecionar-empresa?next=${next}`);
    }

    throw error;
  }
}
