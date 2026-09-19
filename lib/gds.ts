import { z } from "zod";

export const GdsRecordSchema = z.object({
  problem: z.string().min(10),
  evidenceRefs: z.array(z.string()).min(1),
  gaps: z.array(z.string()),
  causeHypotheses: z.array(z.object({
    statement: z.string(),
    confidence: z.number().min(0).max(1),
    status: z.enum(["hypothesis","supported","rejected","unknown"]),
  })),
  alternatives: z.array(z.object({
    code: z.string(),
    title: z.string(),
    tradeoffs: z.array(z.string()),
  })).min(1),
  recommendation: z.object({
    alternativeCode: z.string(),
    rationale: z.string(),
  }),
  expectedImpact: z.record(z.string(), z.unknown()),
  risks: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  validationPlan: z.array(z.string()).min(1),
  proposedMissionCode: z.string().optional(),
  metric: z.record(z.string(), z.unknown()),
});

export type GdsRecord = z.infer<typeof GdsRecordSchema>;

// Deterministic fallback: never fabricates root cause.
// It converts a verified pain finding into a decision shell requiring validation.
export function buildDeterministicGds(input: {
  painId: string;
  title: string;
  dimension: string;
  severity: number;
  confidence: number;
  gapSummary?: string | null;
}): GdsRecord {
  return {
    problem: `${input.title}. ${input.gapSummary ?? "Gap identificado pelo diagnóstico."}`,
    evidenceRefs: [`pain_finding:${input.painId}`],
    gaps: ["Causa-raiz ainda não validada."],
    causeHypotheses: [],
    alternatives: [{
      code: `INVESTIGATE_${input.dimension}`,
      title: `Validar causas e priorizar intervenção em ${input.dimension}`,
      tradeoffs: ["Exige coleta adicional antes de recomendar solução específica."],
    }],
    recommendation: {
      alternativeCode: `INVESTIGATE_${input.dimension}`,
      rationale: "A evidência atual suporta o problema, mas não uma causa-raiz específica.",
    },
    expectedImpact: { direction: "reduce_gap", severity: input.severity },
    risks: ["Agir sobre causa incorreta pode desperdiçar recursos."],
    confidence: input.confidence,
    validationPlan: ["Coletar evidências adicionais e validar a causa antes de selecionar solução."],
    metric: { type: "dimension_score", dimension: input.dimension },
  };
}
