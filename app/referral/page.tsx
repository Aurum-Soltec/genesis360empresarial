import { redirect } from "next/navigation";
import { requirePageTenantContext } from "@/lib/page-tenant-context";

export default async function ReferralPage() {
  await requirePageTenantContext("/referral");
  redirect("/solucoes");
}
