import { redirect } from "next/navigation";
import { requirePageTenantContext } from "@/lib/page-tenant-context";

export default async function DiagnosticoPage() {
  await requirePageTenantContext("/diagnostico");
  redirect("/diagnostico-v1");
}
