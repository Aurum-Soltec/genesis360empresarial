export const DemoEvidenceTemplates = [
  {
    evidenceType: "user_declaration" as const,
    summary: "Direcionadores estratégicos declarados pela liderança — cenário fictício",
    sourceRef: "DEMO:direcionadores-estrategicos-v1.txt",
    sensitivity: "internal" as const,
    payload: {
      demo: true,
      documentType: "strategic_brief",
      content: "Crescer com previsibilidade, reduzir retrabalho comercial e melhorar a disciplina de caixa.",
      disclaimer: "Dados integralmente fictícios para demonstração controlada.",
    },
  },
  {
    evidenceType: "metric" as const,
    summary: "Indicadores financeiros e operacionais — cenário fictício",
    sourceRef: "DEMO:indicadores-2026-q3.csv",
    sensitivity: "financial" as const,
    payload: {
      demo: true,
      documentType: "management_metrics",
      period: "2026-Q3",
      metrics: { revenueTrend: "stable", cashVisibilityDays: 30, reworkIndex: "moderate" },
      disclaimer: "Dados integralmente fictícios para demonstração controlada.",
    },
  },
  {
    evidenceType: "observation" as const,
    summary: "Mapa de processos e riscos operacionais — cenário fictício",
    sourceRef: "DEMO:mapa-processos-riscos-v1.json",
    sensitivity: "internal" as const,
    payload: {
      demo: true,
      documentType: "process_and_risk_map",
      observations: ["Handoffs manuais", "Indicadores dispersos", "Ritos gerenciais irregulares"],
      disclaimer: "Dados integralmente fictícios para demonstração controlada.",
    },
  },
] as const;

export function demoEvidenceAlreadyLoaded(sourceRefs: Array<string | null>): boolean {
  return demoEvidenceLoadedCount(sourceRefs) === DemoEvidenceTemplates.length;
}

export function demoEvidenceLoadedCount(sourceRefs: Array<string | null>): number {
  const present = new Set(sourceRefs.filter(Boolean));
  return DemoEvidenceTemplates.filter((item) => present.has(item.sourceRef)).length;
}
