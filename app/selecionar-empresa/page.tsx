import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import TenantChooser from "./tenant-chooser";

export default async function SelectTenantPage() {
  const db = await createSupabaseServerClient();
  const { data: auth } = await db.auth.getUser();
  if (!auth.user) redirect("/entrar");
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
  return <TenantChooser email={auth.user.email ?? ""} memberships={memberships} />;
}
