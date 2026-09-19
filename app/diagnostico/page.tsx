import { AppShell } from "@/components/app-shell";
import { GlassCard } from "@/components/glass-card";
import { ProgressBar } from "@/components/progress-bar";
import { QuestionCard } from "@/components/question-card";

export default function DiagnosticoPage() {
  return (
    <AppShell>
      <header>
        <div className="eyebrow">Diagnóstico essencial</div>
        <h1 className="section-title" style={{ marginTop: 8 }}>Conheça sua empresa como um sistema.</h1>
        <p className="muted">24 perguntas • cerca de 12 minutos • salvamento automático</p>
        <div style={{ maxWidth: 560, marginTop: 16 }}><ProgressBar value={4} label="Progresso" /></div>
      </header>

      <div className="question-layout">
        <QuestionCard />
        <aside className="helper-panel">
          <GlassCard>
            <div className="eyebrow">Confiança da análise</div>
            <div className="metric-value">50%</div>
            <p className="muted" style={{ lineHeight: 1.55 }}>
              Resposta declarada, ainda sem evidência documental.
            </p>
          </GlassCard>
          <GlassCard>
            <div className="eyebrow">Documento opcional</div>
            <h2 style={{ margin: "10px 0 8px", fontSize: 19 }}>Planejamento estratégico</h2>
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.55 }}>
              O envio não é obrigatório. Informações atuais e verificáveis aumentam a precisão e personalização.
            </p>
            <div className="upload-zone" aria-disabled="true">
              Upload será ativado no M1
            </div>
          </GlassCard>
          <div className="callout">
            Você pode escolher “Não sei”. O Genesis mostrará quais dados precisam ser organizados antes de recomendar uma ação.
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
