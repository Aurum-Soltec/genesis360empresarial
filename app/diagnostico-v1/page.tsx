import { redirect } from "next/navigation";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import DiagnosticJourney from "./journey";

export default async function DiagnosticoV1Page() {
  let ctx; try { ctx=await requireTenantContext(); } catch { redirect("/"); }
  const db=await createSupabaseServerClient();
  const {data:company}=await db.from("companies").select("id,trade_name").eq("tenant_id",ctx.tenantId).limit(1).maybeSingle();
  if(!company) return <main className="p-6">Cadastre uma empresa antes de iniciar o diagnóstico.</main>;
  const demoAllowed = isDemoTenantAllowed(ctx.tenantId);
  const { data: demoEvidence } = demoAllowed
    ? await db
        .from("evidence_items")
        .select("id")
        .eq("tenant_id", ctx.tenantId)
        .eq("company_id", company.id)
        .like("source_ref", "DEMO:%")
        .limit(3)
    : { data: [] };
  return <DiagnosticJourney
    companyId={company.id}
    companyName={company.trade_name}
    demoEvidenceIds={(demoEvidence ?? []).map((item) => item.id)}
  />;
}
