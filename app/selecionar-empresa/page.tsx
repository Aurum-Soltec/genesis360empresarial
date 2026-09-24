import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeInternalPath } from "@/lib/safe-navigation";
import TenantChooser from "./tenant-chooser";

export default async function SelectTenantPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const db = await createSupabaseServerClient();
  const { data: auth } = await db.auth.getUser();
  const nextPath = safeInternalPath(next, "/");
  if (!auth.user) redirect(`/entrar?next=${encodeURIComponent(nextPath)}`);
  const { data, error } = await db
    .from("memberships")
    .select("tenant_id,role,tenants(id,name,status)")
    .eq("user_id", auth.user.id);
  if (error) throw new Error("TENANT_LIST_FAILED");
  const memberships = (data ?? []).flatMap((membership) => {
    const tenant = Array.isArray(membership.tenants)
      ? membership.tenants[0]
      : membership.tenants;
    return tenant?.status === "active"
      ? [{ id: tenant.id, name: tenant.name, role: membership.role }]
      : [];
  });
  return <TenantChooser email={auth.user.email ?? ""} memberships={memberships} nextPath={nextPath} />;
}
