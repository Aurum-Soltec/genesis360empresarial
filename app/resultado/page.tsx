import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePageTenantContext } from "@/lib/page-tenant-context";

export default async function ResultadoPage({
  searchParams,
}: {
  searchParams: Promise<{ diagnostic?: string | string[] }>;
}) {
  const diagnostic = (await searchParams).diagnostic;
  const destination =
    typeof diagnostic === "string" && z.string().uuid().safeParse(diagnostic).success
      ? `/resultado-v1?diagnostic=${encodeURIComponent(diagnostic)}`
      : "/resultado-v1";

  await requirePageTenantContext(destination);
  redirect(destination);
}
