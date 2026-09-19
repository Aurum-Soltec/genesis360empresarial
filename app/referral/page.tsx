import { AppShell } from "@/components/app-shell";
import { GlassCard } from "@/components/glass-card";

export default function ReferralPage() {
  return (
    <AppShell>
      <header>
        <div className="eyebrow">Encaminhamento controlado</div>
        <h1 className="section-title" style={{ marginTop: 8 }}>Você mantém o controle dos seus dados.</h1>
        <p className="muted">Esta tela está em modo de demonstração e não realiza compartilhamento.</p>
      </header>

      <div className="result-grid">
        <GlassCard>
          <h2 style={{ marginTop: 0 }}>Dados mínimos do caso</h2>
          <div className="dimension-list">
            {[
              ["Empresa", "Empresa Aurora"],
              ["Origem", "Tax Check DEMO-001"],
              ["Classificação", "Possível aderência"],
              ["Documentos", "Nenhum anexo"],
              ["Destino", "Rede Genesis — demo"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 18, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <span className="muted">{k}</span><strong>{v}</strong>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <div className="eyebrow">Consentimento específico</div>
          <h2>Antes de continuar</h2>
          <p className="muted" style={{ lineHeight: 1.62 }}>
            A Genesis realizará apenas uma triagem. Uma análise especializada poderá ser feita pela empresa qualificada,
            parceira patrocinadora de lançamento, caso você autorize. Nenhum resultado é garantido.
          </p>
          <label style={{ display: "flex", gap: 12, alignItems: "start", margin: "20px 0" }}>
            <input type="checkbox" disabled />
            <span className="muted">Li e autorizaria o compartilhamento dos dados mínimos listados acima.</span>
          </label>
          <button className="button button-primary" disabled type="button">Registrar intenção de encaminhamento</button>
          <p className="footer-note">Desabilitado no modo demo. FEATURE_REAL_REFERRAL=false.</p>
        </GlassCard>
      </div>
    </AppShell>
  );
}
