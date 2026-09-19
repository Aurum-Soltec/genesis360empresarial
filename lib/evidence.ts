import { z } from "zod";

export const EvidenceInputSchema = z.object({
  companyId: z.string().uuid(),
  evidenceType: z.enum([
    "user_declaration",
    "metric",
    "observation",
  ]),
  summary: z.string().min(3).max(1000),
  payload: z.record(z.string(), z.unknown()).default({}),
  sourceRef: z.string().max(500).nullable().optional(),
  confidence: z.null().optional(),
  sensitivity: z.enum([
    "public",
    "internal",
    "personal",
    "financial",
    "restricted",
  ]).default("internal"),
  purposeCodes: z.array(z.string().min(2).max(80)).min(1).default(["CORE_OPERATION"]),
  link: z.object({
    subjectType: z.enum([
      "business_fact",
      "diagnostic",
      "pain_finding",
      "cause_hypothesis",
      "decision_record",
      "mission",
      "provider_capability",
    ]),
    subjectId: z.string().uuid(),
    relation: z.enum(["supports", "contradicts", "context_for"]).default("supports"),
  }).strict().nullable().optional(),
}).strict();
