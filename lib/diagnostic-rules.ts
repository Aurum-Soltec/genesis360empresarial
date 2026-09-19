import { scoreDimensions, type DimensionScore } from "./diagnostic-scoring";
export { scoreDimensions } from "./diagnostic-scoring";
export type { ScoringAnswer as StoredAnswer } from "./diagnostic-scoring";

export function derivePainFindings(scores: ReturnType<typeof scoreDimensions>) {
  return scores
    .filter((dimension): dimension is DimensionScore & { score: number } =>
      dimension.status === "scored" && dimension.score !== null)
    .map((dimension) => ({
      dimension: dimension.dimension,
      painCode: `MATURITY_GAP_${dimension.dimension}`,
      title: `Gap de maturidade — ${dimension.dimension}`,
      severity: 1 - dimension.score,
      confidence: Math.min(dimension.confidence, dimension.coverage),
      gapSummary: `Score ${Math.round(dimension.score * 100)}/100 com cobertura ${Math.round(dimension.coverage * 100)}%.`,
    }))
    .filter((pain) => pain.severity >= 0.35)
    .sort((a, b) => b.severity - a.severity || a.dimension.localeCompare(b.dimension))
    .slice(0, 3);
}
