import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { DemoEvidenceTemplates, demoEvidenceLoadedCount } from "@/lib/demo-scenario";
import DiagnosticJourney from "./journey";

export default async function DiagnosticoV1Page() {
  const ctx = await requirePageTenantContext("/diagnostico-v1");
  const db=await createSupabaseServerClient();
  const { data: company, error: companyError } = await db.from("companies")
    .select("id,trade_name").eq("tenant_id",ctx.tenantId).limit(1).maybeSingle();
  if (companyError) throw new Error("DIAGNOSTIC_COMPANY_READ_FAILED");
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
  const { data: demoEvidence, error: demoEvidenceError } = demoAllowed
    ? await db
        .from("evidence_items")
        .select("source_ref")
        .eq("tenant_id", ctx.tenantId)
        .eq("company_id", company.id)
        .in("source_ref", DemoEvidenceTemplates.map((item) => item.sourceRef))
    : { data: [], error: null };
  if (demoEvidenceError) throw new Error("DIAGNOSTIC_DEMO_EVIDENCE_READ_FAILED");
  return <DiagnosticJourney
    companyId={company.id}
    companyName={company.trade_name}
    demoSourceCount={demoEvidenceLoadedCount((demoEvidence ?? []).map((item) => item.source_ref))}
  />;
}
