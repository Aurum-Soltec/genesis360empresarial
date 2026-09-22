export type DemoSolutionScore = {
  dimension: string;
  score: number | null;
};

export type DemoSolutionPreview = {
  dimension: string;
  dimensionLabel: string;
  score: number;
  service: string;
  outcome: string;
  providerName: string;
  providerSpecialty: string;
  compatibility: "Alta" | "Moderada";
  explanation: string;
  fictional: true;
  contactEnabled: false;
};

const catalog: Record<string, Omit<DemoSolutionPreview, "score" | "compatibility" | "explanation">> = {
  EST: { dimension: "EST", dimensionLabel: "Estratégia", service: "Arquitetura estratégica e gestão de metas", outcome: "Prioridades trimestrais com responsáveis, indicadores e rito de revisão.", providerName: "Norte Claro Estratégia", providerSpecialty: "Estratégia e governança de execução", fictional: true, contactEnabled: false },
  INO: { dimension: "INO", dimensionLabel: "Inovação", service: "Sistema de experimentação e portfólio", outcome: "Hipóteses priorizadas, critérios de teste e aprendizagem registrada.", providerName: "Vértice Inovação Aplicada", providerSpecialty: "Portfólio e experimentação empresarial", fictional: true, contactEnabled: false },
  MKT: { dimension: "MKT", dimensionLabel: "Marketing", service: "Estratégia de aquisição e mensuração", outcome: "Canais, proposta de valor e custo de aquisição em uma leitura comum.", providerName: "Aurora Growth Lab", providerSpecialty: "Marketing orientado a dados", fictional: true, contactEnabled: false },
  VEN: { dimension: "VEN", dimensionLabel: "Vendas", service: "Arquitetura comercial e previsibilidade", outcome: "Pipeline padronizado, critérios de avanço e previsão comercial confiável.", providerName: "Nexo Receita Consultoria", providerSpecialty: "Operações de receita e vendas B2B", fictional: true, contactEnabled: false },
  CLI: { dimension: "CLI", dimensionLabel: "Cliente", service: "Experiência, retenção e voz do cliente", outcome: "Escuta estruturada, causas priorizadas e ciclo de melhoria acompanhado.", providerName: "Ponte Experiência do Cliente", providerSpecialty: "CX, retenção e jornada", fictional: true, contactEnabled: false },
  OPE: { dimension: "OPE", dimensionLabel: "Operações", service: "Eficiência operacional e desenho de processos", outcome: "Fluxo crítico mapeado, retrabalho medido e gargalos tratados.", providerName: "Fluxo Uno Operações", providerSpecialty: "Processos, qualidade e produtividade", fictional: true, contactEnabled: false },
  FIN: { dimension: "FIN", dimensionLabel: "Financeiro", service: "Gestão financeira e inteligência de caixa", outcome: "Visibilidade de caixa, margem, desvios e cadência de decisão.", providerName: "Prisma Finanças Empresariais", providerSpecialty: "Controladoria e planejamento financeiro", fictional: true, contactEnabled: false },
  TAX: { dimension: "TAX", dimensionLabel: "Tributário", service: "Governança tributária preventiva", outcome: "Obrigações, responsáveis e calendário de controles formalizados.", providerName: "Atlas Fiscal Advisory", providerSpecialty: "Conformidade e planejamento tributário", fictional: true, contactEnabled: false },
  PES: { dimension: "PES", dimensionLabel: "Pessoas", service: "Desenho organizacional e gestão de desempenho", outcome: "Papéis críticos, metas e ritos de acompanhamento claros.", providerName: "Humana Estrutura Organizacional", providerSpecialty: "Pessoas, liderança e desempenho", fictional: true, contactEnabled: false },
  TEC: { dimension: "TEC", dimensionLabel: "Tecnologia", service: "Arquitetura, integração e continuidade digital", outcome: "Sistemas críticos inventariados, riscos priorizados e integrações planejadas.", providerName: "Órbita Tecnologia Confiável", providerSpecialty: "Arquitetura e confiabilidade de sistemas", fictional: true, contactEnabled: false },
  JUR: { dimension: "JUR", dimensionLabel: "Jurídico", service: "Governança contratual e prevenção jurídica", outcome: "Contratos e exposições críticas organizados por responsável e prazo.", providerName: "Marco Legal Empresarial", providerSpecialty: "Contratos e governança jurídica", fictional: true, contactEnabled: false },
  RSC: { dimension: "RSC", dimensionLabel: "Riscos", service: "Gestão integrada de riscos e controles", outcome: "Riscos prioritários, controles e sinais de alerta formalizados.", providerName: "Sentinela Riscos & Controles", providerSpecialty: "Riscos, controles internos e continuidade", fictional: true, contactEnabled: false },
};

export function buildDemoSolutionPreview(scores: DemoSolutionScore[]): DemoSolutionPreview[] {
  return scores
    .filter((item): item is DemoSolutionScore & { score: number } =>
      item.score !== null && Number.isFinite(item.score) && Boolean(catalog[item.dimension]))
    .sort((left, right) => left.score - right.score || left.dimension.localeCompare(right.dimension))
    .slice(0, 3)
    .map((item) => ({
      ...catalog[item.dimension],
      score: item.score,
      compatibility: item.score < 55 ? "Alta" : "Moderada",
      explanation: `${catalog[item.dimension].dimensionLabel} está entre as menores leituras válidas do diagnóstico (${Math.round(item.score)}/100). A solução aparece por aderência temática determinística; a empresa é fictícia e não passou por qualificação real.`,
    }));
}

export function canAccessDemoAdministration(role: string): boolean {
  return role === "owner" || role === "admin";
}
