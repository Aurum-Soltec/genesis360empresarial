import { z } from "zod";

const booleanFlag = z.enum(["true", "false"]).transform((value) => value === "true");

const FeatureFlagSchema = z.object({
  ecosystem: booleanFlag.default(false),
  qualificationNetwork: booleanFlag.default(false),
  agentic: booleanFlag.default(false),
  tax: booleanFlag.default(true),
  realContact: booleanFlag.default(false),
  dataUpload: booleanFlag.default(false),
});

export type FeatureFlags = z.infer<typeof FeatureFlagSchema>;

export function getFeatureFlags(
  env: Readonly<Record<string, string | undefined>> = process.env,
): FeatureFlags {
  return FeatureFlagSchema.parse({
    ecosystem: env.FEATURE_ECOSYSTEM ?? "false",
    qualificationNetwork: env.FEATURE_QUALIFICATION_NETWORK ?? "false",
    agentic: env.FEATURE_AGENTIC ?? "false",
    tax: env.FEATURE_TAX ?? "true",
    realContact: env.FEATURE_REAL_CONTACT ?? "false",
    dataUpload: env.FEATURE_DATA_UPLOAD ?? "false",
  });
}
