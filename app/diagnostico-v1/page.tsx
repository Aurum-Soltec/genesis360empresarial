import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import DiagnosticJourney from "./journey";

export default async function DiagnosticoV1Page() {
  const ctx = await requirePageTenantContext("/diagnostico-v1");
  const db=await createSupabaseServerClient();
  const {data:company}=await db.from("companies").select("id,trade_name").eq("tenant_id",ctx.tenantId).limit(1).maybeSingle();
  if (!company) return (
    <AppShell>
      <section className="card empty-state" aria-labelledby="diagnostic-company-required">
        <p className="kicker">Diagnóstico</p>
        <h1 id="diagnostic-company-required">A empresa ainda não está vinculada.</h1>
        <p>O diagnóstico só começa depois que o administrador provisiona uma empresa para este tenant. Nenhum dado fictício será criado neste fluxo.</p>
        <Link className="button button-secondary" href="/passaporte">Ver Business Passport</Link>
      </section>
    </AppShell>
  );
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
