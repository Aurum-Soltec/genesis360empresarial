import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getFeatureFlags } from "@/lib/feature-flags";
import { requirePageTenantContext } from "@/lib/page-tenant-context";

export default async function TaxPage() {
  if (!getFeatureFlags().tax) notFound();
  await requirePageTenantContext("/cto-tax");

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">CTO-Tax · simulação didática</div>
          <h1 className="page-title">Como funciona uma triagem fiscal responsável</h1>
          <p className="page-subtitle">
            Esta tela ilustra critérios de revisão. Ela não analisa o diagnóstico
            ou os documentos da sua empresa e não identifica crédito, direito
            ou valor tributário.
          </p>
        </div>
      </header>

      <section className="card card-pad" aria-labelledby="tax-simulation-title">
        <div className="kicker">Exemplo hipotético</div>
        <h2 id="tax-simulation-title" className="section-title" style={{ marginTop: 10 }}>
          Sinais que poderiam justificar uma revisão especializada
        </h2>
        <p className="page-subtitle">
          Regime tributário, alterações operacionais, obrigações recentes e
          documentação disponível são avaliados em conjunto. Nenhum desses
          sinais foi constatado para sua empresa nesta simulação.
        </p>
        <p className="metric-note">
          Uma conclusão exigiria dados pertinentes, autorização específica e
          validação por profissional habilitado. O Genesis não realiza ato
          tributário nem encaminha dados por esta página.
        </p>
        <div className="action-row" style={{ marginTop: 20 }}>
          <Link className="button button-primary" href="/diagnostico-v1">
            Abrir diagnóstico atual
          </Link>
          <Link className="button button-secondary" href="/solucoes">
            Entender soluções qualificadas
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
