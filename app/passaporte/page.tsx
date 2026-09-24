import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { hasTenantPermission } from "@/lib/authz";
import { PASSPORT_ESSENTIAL_KEYS, passportCompleteness } from "@/lib/business-passport";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import {
  essentialFactLabels,
  hasPassportValue,
  passportDateLabel,
  passportSourceLabel,
  passportVerificationLabel,
  readablePassportValue,
} from "@/lib/passport-presentation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { selectUniqueTenantCompany } from "@/lib/server/company-selection";
import { PassportFactForm } from "./passport-fact-form";
import styles from "./passport.module.css";

export default async function PassaportePage() {
  const context = await requirePageTenantContext("/passaporte");
  const db = await createSupabaseServerClient();

  const demoTenant = isDemoTenantAllowed(context.tenantId);
  const selection = await selectUniqueTenantCompany(db, context.tenantId, demoTenant);

  if (selection.status !== "ready") {
    return (
      <AppShell>
        <section className="card empty-state">
          <p className="kicker">Business Passport</p>
          <h1>{selection.status === "ambiguous" ? "É preciso escolher uma empresa." : "Empresa ainda não vinculada."}</h1>
          <p>{selection.status === "ambiguous"
            ? "Há mais de uma empresa possível neste contexto. O Genesis não escolherá uma arbitrariamente para exibir ou registrar fatos."
            : demoTenant
              ? "A demonstração requer uma empresa fictícia identificável neste tenant. Nenhum dado de empresa real será usado para completar o roteiro."
              : "Solicite ao administrador o cadastro da empresa antes de iniciar a memória empresarial."}</p>
        </section>
      </AppShell>
    );
  }
  const company = selection.company;

  const { data: facts, error: factsError } = await db
    .from("business_facts")
    .select("fact_key,value,source,captured_at,verification_status,sensitivity")
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
    passportCompleteness(
      [...factsByKey.values()]
        .filter((fact) => hasPassportValue(fact.value) && !["rejected", "expired"].includes(fact.verification_status))
        .map((fact) => fact.fact_key),
      [...PASSPORT_ESSENTIAL_KEYS],
    ) * 100,
  );
  const verifiedCount = currentFacts.filter((fact) => fact.verification_status === "verified").length;
  const latestFactDate = currentFacts[0]?.captured_at;

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
            <div className="kicker">Cadastro essencial visível</div>
            <div className="score-number">{completeness}<small>%</small></div>
          </div>
          <p className="muted">Presença dos campos legíveis ao seu perfil; este percentual não atesta completude global, qualidade ou verificação independente.</p>
        </article>
        <article className="card card-pad">
          <div className="kicker">Base informacional</div>
          <h2 className="section-title">{currentFacts.length} fatos ativos visíveis</h2>
          <p className="page-subtitle">{verifiedCount} verificados. Última atualização: {passportDateLabel(latestFactDate)}.</p>
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
                <div className={styles.factText}>
                  <span>{essentialFactLabels[key]}</span>
                  <p>{fact ? readablePassportValue(fact.value, fact.sensitivity) : "Não informado ou indisponível para seu perfil"}</p>
                </div>
                <div className={styles.factMeta}>
                  <strong>{fact ? passportVerificationLabel(fact.verification_status) : "Estado indisponível"}</strong>
                  {fact ? <small>{passportSourceLabel(fact.source)} · {passportDateLabel(fact.captured_at)}</small> : null}
                </div>
              </li>
            );
          })}
        </ul>
        <p className={styles.disclosure}>Origem, verificação e data são dimensões distintas. Uma declaração não se torna verificada por ter sido preenchida.</p>
      </section>

      {hasTenantPermission(context.role, "passport:write") ? (
        <section className="section" aria-labelledby="passport-edit-title">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">Perfil progressivo</span>
              <h2 id="passport-edit-title">Registrar uma informação</h2>
            </div>
          </div>
          <p className="page-subtitle">Adicione ou atualize um campo essencial. O novo valor será declarado e não verificado; o anterior permanecerá no histórico.</p>
          <PassportFactForm companyId={company.id} />
        </section>
      ) : null}
    </AppShell>
  );
}
