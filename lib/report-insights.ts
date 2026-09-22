export type ReportScore = { dimension: string; score: number | null };

const playbook: Record<string, { label: string; action: string; evidence: string }> = {
  EST: { label: "Estratégia", action: "Traduzir prioridades em três objetivos trimestrais com dono e métrica.", evidence: "Plano vigente, metas e atas de revisão." },
  INO: { label: "Inovação", action: "Criar um funil pequeno de hipóteses com critérios de teste e descarte.", evidence: "Backlog de experimentos e resultados." },
  MKT: { label: "Marketing", action: "Conectar canais, proposta de valor e custo de aquisição em uma leitura mensal.", evidence: "Funil por canal e custos de aquisição." },
  VEN: { label: "Vendas", action: "Padronizar etapas, critérios de avanço e previsão comercial.", evidence: "Pipeline, conversões e motivos de perda." },
  CLI: { label: "Cliente", action: "Fechar o ciclo de escuta, causa e ação sobre retenção e experiência.", evidence: "Pesquisa, churn e plano de ação." },
  OPE: { label: "Operações", action: "Mapear o fluxo crítico e remover o principal ponto de retrabalho.", evidence: "Mapa do processo, lead time e retrabalho." },
  FIN: { label: "Financeiro", action: "Implantar visão de caixa, margem e desvios com cadência definida.", evidence: "Fluxo de caixa, DRE gerencial e conciliações." },
  TAX: { label: "Tributário", action: "Revisar obrigações, responsáveis e calendário de controles.", evidence: "Calendário fiscal e validações recentes." },
  PES: { label: "Pessoas", action: "Clarificar papéis críticos, metas e ritos de acompanhamento.", evidence: "Organograma, metas e registros de feedback." },
  TEC: { label: "Tecnologia", action: "Priorizar confiabilidade, integração e governança dos sistemas críticos.", evidence: "Inventário, incidentes e plano de continuidade." },
  JUR: { label: "Jurídico", action: "Mapear contratos e exposições críticas com responsáveis e prazos.", evidence: "Matriz contratual e registro de riscos." },
  RSC: { label: "Riscos", action: "Formalizar riscos prioritários, controles e sinais de alerta.", evidence: "Matriz de riscos, controles e incidentes." },
};

export function buildExecutivePlan(scores: ReportScore[]) {
  const ranked = scores
    .filter((item): item is ReportScore & { score: number } => item.score !== null)
    .sort((a, b) => a.score - b.score || a.dimension.localeCompare(b.dimension));
  return ranked.slice(0, 3).map((item, index) => ({
    horizon: ["0–30 dias", "31–60 dias", "61–90 dias"][index],
    dimension: playbook[item.dimension]?.label ?? item.dimension,
    score: item.score,
    action: playbook[item.dimension]?.action ?? "Definir a ação prioritária, o responsável e o indicador.",
    evidence: playbook[item.dimension]?.evidence ?? "Evidência operacional e indicador de resultado.",
  }));
}

export function evidenceQualityMessage(evidenceCount: number, verifiedCount: number) {
  if (!evidenceCount) return "Leitura baseada apenas em respostas declaradas. Vincule documentos antes de tratar recomendações como fatos validados.";
  if (!verifiedCount) return `${evidenceCount} fonte(s) estão vinculadas, mas ainda não verificadas. A leitura é útil para priorização e requer validação antes de decisões irreversíveis.`;
  return `${verifiedCount} de ${evidenceCount} fonte(s) vinculadas estão verificadas. Confirme as fontes restantes para elevar a robustez da leitura.`;
}
