import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getFeatureFlags } from "@/lib/feature-flags";
import { requirePageTenantContext } from "@/lib/page-tenant-context";

export default async function EcossistemaPage() {
  if (!getFeatureFlags().ecosystem) notFound();
  await requirePageTenantContext("/ecossistema");

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Genesis 360 Empresarial</div>
          <h1 className="page-title">Ecossistema</h1>
          <p className="page-subtitle">
            A visão institucional exige autorização, agregação segura e critérios
            mínimos de qualidade antes de exibir qualquer informação.
          </p>
        </div>
      </header>
      <section className="card empty-state">
        <h2>Visão institucional ainda indisponível.</h2>
        <p>
          Nenhum dado individual ou agregado é apresentado enquanto associação,
          finalidade, supressão e privacidade não estiverem implementadas e testadas.
        </p>
        <Link className="button button-secondary" href="/">Voltar à visão executiva</Link>
      </section>
    </AppShell>
  );
}
