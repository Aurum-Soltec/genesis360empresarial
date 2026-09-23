import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { DemoEvidenceTemplates, canonicalDemoEvidenceCount } from "@/lib/demo-scenario";
import { selectUniqueTenantCompany } from "@/lib/server/company-selection";
import DiagnosticJourney from "./journey";

export default async function DiagnosticoV1Page() {
  const ctx = await requirePageTenantContext("/diagnostico-v1");
  const db=await createSupabaseServerClient();
  const demoTenant = isDemoTenantAllowed(ctx.tenantId);
  const selection = await selectUniqueTenantCompany(db, ctx.tenantId, demoTenant);
  if (selection.status !== "ready") return (
    <AppShell>
      <section className="card empty-state" aria-labelledby="diagnostic-company-required">
        <p className="kicker">Diagnóstico</p>
        <h1 id="diagnostic-company-required">{selection.status === "ambiguous" ? "Seleção da empresa necessária" : "A empresa ainda não está vinculada."}</h1>
        <p>{selection.status === "ambiguous" ? "Há mais de uma empresa elegível neste tenant. O diagnóstico não escolhe uma delas automaticamente; a seleção explícita da empresa precisa ser implementada antes de iniciar." : demoTenant ? "O roteiro requer uma empresa fictícia vinculada ao tenant. Nenhum dado de empresa real será convertido em demonstração." : "O diagnóstico só começa depois que o administrador provisiona uma empresa para este tenant. Nenhum dado fictício será criado neste fluxo."}</p>
        <Link className="button button-secondary" href="/passaporte">Ver Business Passport</Link>
      </section>
    </AppShell>
  );
  const company = selection.company;
  const demoAllowed = demoTenant && company.fictional;
  const { data: demoEvidence, error: demoEvidenceError } = demoAllowed
    ? await db
        .from("evidence_items")
        .select("source_ref,evidence_type,summary,payload,sensitivity,purpose_codes,verification_status")
        .eq("tenant_id", ctx.tenantId)
        .eq("company_id", company.id)
        .in("source_ref", DemoEvidenceTemplates.map((item) => item.sourceRef))
    : { data: [], error: null };
  if (demoEvidenceError) throw new Error("DIAGNOSTIC_DEMO_EVIDENCE_READ_FAILED");
  return <DiagnosticJourney
    companyId={company.id}
    companyName={company.trade_name}
    demoSourceCount={canonicalDemoEvidenceCount(demoEvidence)}
  />;
}
