export type CouncilScore = { dimension: string; score: number | null; confidence: number | null };
export type CouncilPain = { title: string; gapSummary: string | null };

const labels: Record<string, string> = {
  EST: "Estratégia", INO: "Inovação", MKT: "Marketing", VEN: "Vendas",
  CLI: "Cliente", OPE: "Operações", FIN: "Financeiro", TAX: "Tributário",
  PES: "Pessoas", TEC: "Tecnologia", JUR: "Jurídico", RSC: "Riscos",
};

export function buildCouncilBrief(input: {
  companyName: string;
  growthScore: number | null;
  confidence: number | null;
  scores: CouncilScore[];
  pains: CouncilPain[];
  evidenceCount: number;
  verifiedEvidenceCount: number;
}) {
  const scored = input.scores
    .filter((item): item is CouncilScore & { score: number } => item.score !== null)
    .sort((a, b) => a.score - b.score);
  const weakest = scored.slice(0, 2).map((item) => labels[item.dimension] ?? item.dimension);
  const strongest = [...scored].reverse().slice(0, 1).map((item) => labels[item.dimension] ?? item.dimension);
  const primaryPain = input.pains[0];
  const trustNote = input.verifiedEvidenceCount > 0
    ? `${input.verifiedEvidenceCount} fonte(s) já estão verificadas.`
    : "As fontes vinculadas ainda não foram verificadas; as recomendações permanecem hipóteses orientadas pelos dados declarados.";

  return [
    {
      id: "next-90-days",
      question: "O que atacar nos próximos 90 dias?",
      role: "Síntese de estratégia e execução",
      answer: [
        `Para ${input.companyName}, concentre o primeiro ciclo em ${weakest.join(" e ") || "completar a base informacional"}.`,
        primaryPain
          ? `O sinal prioritário é “${primaryPain.title}”. Trate-o primeiro como hipótese e valide a causa antes de investir.`
          : "Ainda não há uma dor com força suficiente para recomendar intervenção.",
        strongest.length ? `Use ${strongest[0]} como capacidade de apoio para sustentar a execução.` : "Defina um responsável e um indicador de resultado para cada iniciativa.",
      ].join(" "),
      citations: ["score_results", "pain_findings"],
    },
    {
      id: "confidence",
      question: "O que falta para elevar a confiança?",
      role: "Síntese de dados e risco",
      answer: `A leitura atual tem confiança de ${input.confidence ?? "nível indisponível"}${input.confidence === null ? "" : "%"} e ${input.evidenceCount} fonte(s) vinculada(s). ${trustNote} O próximo passo é validar indicadores financeiros, responsáveis pelos processos críticos e a periodicidade dos ritos de gestão.`,
      citations: ["diagnostics.confidence", "evidence_items"],
    },
    {
      id: "board-story",
      question: "Como explicar este resultado aos líderes?",
      role: "Síntese executiva",
      answer: `Apresente o Growth Score ${input.growthScore ?? "ainda indisponível"}${input.growthScore === null ? "" : "/100"} como uma fotografia orientadora, acompanhada de cobertura e confiança. Mostre primeiro os dois pontos de atenção, depois as evidências que sustentam a leitura e encerre com três decisões de 30, 60 e 90 dias. ${trustNote}`,
      citations: ["diagnostics", "score_results", "evidence_items"],
    },
  ];
}
