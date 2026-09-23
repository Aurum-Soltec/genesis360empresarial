import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PASSPORT_ESSENTIAL_KEYS, passportCompleteness } from "@/lib/business-passport";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const essentialLabels: Record<(typeof PASSPORT_ESSENTIAL_KEYS)[number], string> = {
  "identity.sector": "Setor de atuação",
  "identity.size": "Porte da empresa",
  "identity.region": "Região de atuação",
  "business.model": "Modelo de negócio",
  "business.primary_goal": "Objetivo principal",
  "technology.crm_adoption": "Uso de CRM",
  "finance.cashflow_forecast": "Previsão de fluxo de caixa",
};

const verificationLabels: Record<string, string> = {
  verified: "Verificado",
  pending: "Em verificação",
  unverified: "Declarado, não verificado",
  rejected: "Rejeitado",
  expired: "Expirado",
};

export default async function PassaportePage() {
  const context = await requirePageTenantContext("/passaporte");
  const db = await createSupabaseServerClient();

  const { data: company, error: companyError } = await db
    .from("companies")
    .select("id,trade_name")
    .eq("tenant_id", context.tenantId)
    .limit(1)
    .maybeSingle();
  if (companyError) throw new Error("PASSPORT_COMPANY_READ_FAILED");

  if (!company) {
    return (
      <AppShell>
        <section className="card empty-state">
          <p className="kicker">Business Passport</p>
          <h1>Empresa ainda não vinculada.</h1>
          <p>Solicite ao administrador o cadastro da empresa antes de iniciar a memória empresarial.</p>
        </section>
      </AppShell>
    );
  }

  const { data: facts, error: factsError } = await db
    .from("business_facts")
    .select("fact_key,source,captured_at,verification_status")
    .eq("tenant_id", context.tenantId)
    .eq("company_id", company.id)
    .is("valid_to", null)
    .order("captured_at", { ascending: false });
  if (factsError) throw new Error("PASSPORT_FACTS_READ_FAILED");

  const currentFacts = facts ?? [];
  const factsByKey = new Map<string, (typeof currentFacts)[number]>();
  for (const fact of currentFacts) {
    if (!factsByKey.has(fact.fact_key)) factsByKey.set(fact.fact_key, fact);
  }
  const completeness = Math.round(
    passportCompleteness([...factsByKey.keys()], [...PASSPORT_ESSENTIAL_KEYS]) * 100,
  );
  const verifiedCount = currentFacts.filter((fact) => fact.verification_status === "verified").length;

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Genesis Business Passport</div>
          <h1 className="page-title">{company.trade_name}</h1>
          <p className="page-subtitle">Memória empresarial estruturada, temporal e verificável. Dados declarados permanecem distintos dos verificados.</p>
        </div>
      </header>

      <section className="manager-grid" aria-label="Resumo do Business Passport">
        <article className="card score-summary">
          <div>
            <div className="kicker">Cadastro essencial</div>
            <div className="score-number">{completeness}<small>%</small></div>
          </div>
          <p className="muted">Presença dos campos essenciais; este percentual não atesta qualidade ou verificação independente.</p>
        </article>
        <article className="card card-pad">
          <div className="kicker">Base informacional</div>
          <h2 className="section-title">{currentFacts.length} fatos ativos</h2>
          <p className="page-subtitle">{verifiedCount} verificados. Cada atualização preserva origem e histórico.</p>
          <Link className="text-action" href="/historico">Ver histórico da empresa →</Link>
        </article>
      </section>

      <section className="section" aria-labelledby="passport-essential-title">
        <div className="section-heading-row">
          <div>
            <span className="section-eyebrow">Estrutura atual</span>
            <h2 id="passport-essential-title">Informações essenciais</h2>
          </div>
          <Link className="text-action" href="/documentos">Ver documentos →</Link>
        </div>
        <ul className="passport-essential-list">
          {PASSPORT_ESSENTIAL_KEYS.map((key) => {
            const fact = factsByKey.get(key);
            return (
              <li key={key}>
                <span>{essentialLabels[key]}</span>
                <strong>{fact ? verificationLabels[fact.verification_status] ?? "Registrado" : "Pendente"}</strong>
              </li>
            );
          })}
        </ul>
      </section>
    </AppShell>
  );
}
