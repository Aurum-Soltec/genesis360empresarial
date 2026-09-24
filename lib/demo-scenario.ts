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

export function isCanonicalDemoEvidence(sourceRef: string | null): boolean {
  return DemoEvidenceTemplates.some((item) => item.sourceRef === sourceRef);
}

export type DemoEvidenceRecord = {
  source_ref: string | null;
  evidence_type: string;
  summary: string;
  payload: unknown;
  sensitivity: string;
  purpose_codes: string[] | null;
  verification_status: string;
};

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function isCanonicalDemoEvidenceRecord(row: DemoEvidenceRecord): boolean {
  const template = DemoEvidenceTemplates.find((item) => item.sourceRef === row.source_ref);
  return Boolean(template &&
    row.evidence_type === template.evidenceType &&
    row.summary === template.summary &&
    row.sensitivity === template.sensitivity &&
    row.purpose_codes?.length === 1 && row.purpose_codes[0] === "DEMO_CONTROLLED" &&
    ["unverified", "pending"].includes(row.verification_status) &&
    stableJson(row.payload) === stableJson(template.payload));
}

export function canonicalDemoEvidenceCount(rows: DemoEvidenceRecord[] | null | undefined): number {
  const refs = (rows ?? []).filter(isCanonicalDemoEvidenceRecord).map((row) => row.source_ref);
  return demoEvidenceLoadedCount(refs);
}
