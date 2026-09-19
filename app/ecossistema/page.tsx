import { AppShell } from "@/components/app-shell";

export default function Page() {
  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Genesis 360 Empresarial</div>
          <h1 className="page-title">Ecossistema</h1>
          <p className="page-subtitle">Visão institucional agregada, governada e sem exposição indevida de dados individuais.</p>
        </div>
      </header>
      <section className="card empty-state">
        <h3>Fundação de produto preparada.</h3>
        <p>Esta superfície não exibe dados de demonstração. O próximo passo é conectar o fluxo real e provar os gates correspondentes.</p>
      </section>
    </AppShell>
  );
}
