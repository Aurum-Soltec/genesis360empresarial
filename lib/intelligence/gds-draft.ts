import { z } from "zod";

export const GdsDraftSchema = z.object({
  problem: z.string().min(10),
  evidenceRefs: z.array(
    z.object({
      evidenceId: z.string(),
      supports: z.string(),
      confidence: z.number().min(0).max(1),
    }),
  ),
  gaps: z.array(z.string()),
  causeHypotheses: z.array(
    z.object({
      statement: z.string(),
      confidence: z.number().min(0).max(1),
      validationNeeded: z.array(z.string()),
    }),
  ),
  alternatives: z.array(
    z.object({
      code: z.string(),
      title: z.string(),
      tradeoffs: z.array(z.string()),
    }),
  ),
  recommendationCode: z.string().nullable(),
  recommendationRationale: z.string(),
  risks: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  validationPlan: z.array(z.string()),
  proposedMissionCode: z.string().nullable().optional(),
});

export type GdsDraft = z.infer<typeof GdsDraftSchema>;
