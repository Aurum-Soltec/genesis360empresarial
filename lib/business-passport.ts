import { z } from "zod";

export const BusinessFactInputSchema = z.object({
  companyId: z.string().uuid(),
  factKey: z.string().min(2).max(120).regex(/^[a-z0-9_.-]+$/),
  value: z.unknown().refine((value) => value !== undefined, "VALUE_REQUIRED"),
  source: z.literal("declared").default("declared"),
  sourceRef: z.string().max(240).optional(),
  confidence: z.null().optional(),
  sensitivity: z.enum(["public", "internal", "personal", "financial", "restricted"]).default("internal"),
  purposeCodes: z.array(z.string().min(2).max(80)).min(1).default(["CORE_OPERATION"]),
}).strict();

export type BusinessFactInput = z.infer<typeof BusinessFactInputSchema>;

export function passportCompleteness(factKeys: string[], requiredKeys: string[]) {
  if (!requiredKeys.length) return 1;
  const present = new Set(factKeys);
  return requiredKeys.filter((key) => present.has(key)).length / requiredKeys.length;
}

export const PASSPORT_ESSENTIAL_KEYS = [
  "identity.sector",
  "identity.size",
  "identity.region",
  "business.model",
  "business.primary_goal",
  "technology.crm_adoption",
  "finance.cashflow_forecast",
] as const;
