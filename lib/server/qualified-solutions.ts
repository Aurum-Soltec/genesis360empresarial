import { trustedPlatformReadClient } from "@/lib/server/trusted-data-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TenantContext } from "@/lib/tenant-context";
import {
  capacityScore,
  eligibleProvider,
  rankingScore,
} from "@/lib/qualification-engine";

type PainRow = { id: string; pain_code: string; company_id: string };
type PolicyRow = {
  id: string;
  minimum_qualification_score: number | string | null;
  require_compliance: boolean;
  require_capacity: boolean;
};
type MappingRow = { capability_id: string; fit_weight: number | string };
type ProviderRow = {
  id: string;
  tenant_id: string;
  company_id: string;
  capability_id: string;
  qualification_status: string;
  qualification_score: number | string | null;
  valid_until: string | null;
  capacity_status: string;
  compliance_status: string;
};
type SubscriptionRow = { tenant_id: string; plan_id: string; status: string };
type PlanRow = { id: string; code: string; provider_network_eligible: boolean };
type CompanyRow = {
  id: string;
  tenant_id: string;
  trade_name: string;
  sector: string | null;
};
type CapabilityRow = { id: string; code: string; title: string };

export type QualifiedSolution = {
  providerCapabilityId: string;
  providerCompanyId: string;
  providerName: string;
  providerSector: string | null;
  capabilityId: string;
  capabilityCode: string;
  capabilityTitle: string;
  qualificationScore: number;
  capacityStatus: string;
  rankScore: number;
  explanation: {
    fit: number;
    qualification: number;
    capacity: number | null;
    outcomes: null;
    note: string;
  };
};

export type QualifiedSolutionSearch =
  | { status: "POLICY_PENDING"; painId: string; painCode: string; solutions: [] }
  | { status: "NO_CAPABILITY_MAPPING"; painId: string; painCode: string; solutions: [] }
  | { status: "NO_ELIGIBLE_PROVIDERS"; painId: string; painCode: string; solutions: [] }
  | { status: "READY"; painId: string; painCode: string; solutions: QualifiedSolution[] };

export async function loadQualifiedSolutionsForPain(
  ctx: TenantContext,
  painId: string,
): Promise<QualifiedSolutionSearch> {
  const userDb = await createSupabaseServerClient();

  const { data: pain } = await userDb
    .from("pain_findings")
    .select("id,pain_code,company_id")
    .eq("id", painId)
    .eq("tenant_id", ctx.tenantId)
    .maybeSingle();

  const painRow = pain as PainRow | null;
  if (!painRow) throw new Error("PAIN_NOT_FOUND");

  const admin = await trustedPlatformReadClient(ctx);

  const { data: policy } = await admin
    .from("provider_network_policies")
    .select("id,minimum_qualification_score,require_compliance,require_capacity")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const policyRow = policy as PolicyRow | null;
  if (!policyRow || policyRow.minimum_qualification_score === null) {
    return {
      status: "POLICY_PENDING",
      painId: painRow.id,
      painCode: painRow.pain_code,
      solutions: [],
    };
  }

  const { data: mappings } = await admin
    .from("pain_capability_rules")
    .select("capability_id,fit_weight")
    .eq("pain_code", painRow.pain_code)
    .eq("status", "published");

  const mappingRows = (mappings ?? []) as MappingRow[];
  if (!mappingRows.length) {
    return {
      status: "NO_CAPABILITY_MAPPING",
      painId: painRow.id,
      painCode: painRow.pain_code,
      solutions: [],
    };
  }

  const fitByCapability = new Map<string, number>(
    mappingRows.map((row) => [row.capability_id, Number(row.fit_weight)]),
  );
  const capabilityIds = [...fitByCapability.keys()];

  const { data: providerRows } = await admin
    .from("provider_capabilities")
    .select(
      "id,tenant_id,company_id,capability_id,qualification_status,qualification_score,valid_until,capacity_status,compliance_status",
    )
    .in("capability_id", capabilityIds)
    .eq("qualification_status", "qualified");

  const now = Date.now();
  const candidates = ((providerRows ?? []) as ProviderRow[]).filter((row) => {
    if (
      row.tenant_id === ctx.tenantId &&
      row.company_id === painRow.company_id
    ) {
      return false;
    }
    if (!row.valid_until) return true;
    return new Date(row.valid_until).getTime() > now;
  });

  if (!candidates.length) {
    return {
      status: "NO_ELIGIBLE_PROVIDERS",
      painId: painRow.id,
      painCode: painRow.pain_code,
      solutions: [],
    };
  }

  const providerTenantIds = [...new Set(candidates.map((row) => row.tenant_id))];
  const providerCompanyIds = [...new Set(candidates.map((row) => row.company_id))];

  const { data: subscriptions } = await admin
    .from("tenant_subscriptions")
    .select("tenant_id,plan_id,status")
    .in("tenant_id", providerTenantIds)
    .in("status", ["trialing", "active"]);

  const subscriptionRows = (subscriptions ?? []) as SubscriptionRow[];
  const planIds = [...new Set(subscriptionRows.map((row) => row.plan_id))];
  const { data: plans } = planIds.length
    ? await admin
        .from("plan_catalog")
        .select("id,code,provider_network_eligible")
        .in("id", planIds)
    : { data: [] as PlanRow[] };

  const planRows = (plans ?? []) as PlanRow[];
  const eligiblePlanIds = new Set(
    planRows
      .filter((plan) => plan.provider_network_eligible)
      .map((plan) => plan.id),
  );
  const eligibleProviderTenants = new Set(
    subscriptionRows
      .filter((sub) => eligiblePlanIds.has(sub.plan_id))
      .map((sub) => sub.tenant_id),
  );

  const { data: companies } = await admin
    .from("companies")
    .select("id,tenant_id,trade_name,sector")
    .in("id", providerCompanyIds);

  const companyRows = (companies ?? []) as CompanyRow[];
  const companyById = new Map<string, CompanyRow>(
    companyRows.map((company) => [company.id, company]),
  );

  const { data: capabilities } = await admin
    .from("capabilities")
    .select("id,code,title")
    .in("id", capabilityIds);

  const capabilityRows = (capabilities ?? []) as CapabilityRow[];
  const capabilityById = new Map<string, CapabilityRow>(
    capabilityRows.map((capability) => [capability.id, capability]),
  );

  const solutions: QualifiedSolution[] = [];

  for (const provider of candidates) {
    const fit = fitByCapability.get(provider.capability_id) ?? 0;
    const planEligible = eligibleProviderTenants.has(provider.tenant_id);
    const decision = eligibleProvider({
      qualificationStatus: provider.qualification_status,
      qualificationScore:
        provider.qualification_score === null
          ? null
          : Number(provider.qualification_score),
      minimumScore: Number(policyRow.minimum_qualification_score),
      planEligible,
      capabilityFit: fit,
      complianceStatus: provider.compliance_status,
      capacityStatus: provider.capacity_status,
      requireCompliance: policyRow.require_compliance,
      requireCapacity: policyRow.require_capacity,
    });

    if (!decision.eligible) continue;

    const company = companyById.get(provider.company_id);
    const capability = capabilityById.get(provider.capability_id);
    if (!company || !capability) continue;

    const qualification = Math.min(
      1,
      Math.max(0, Number(provider.qualification_score ?? 0) / 100),
    );
    const capacity = capacityScore(provider.capacity_status);

    solutions.push({
      providerCapabilityId: provider.id,
      providerCompanyId: provider.company_id,
      providerName: company.trade_name,
      providerSector: company.sector,
      capabilityId: capability.id,
      capabilityCode: capability.code,
      capabilityTitle: capability.title,
      qualificationScore: Number(provider.qualification_score ?? 0),
      capacityStatus: provider.capacity_status,
      rankScore: rankingScore({
        fit,
        qualification,
        outcomes: null,
        capacity,
      }),
      explanation: {
        fit,
        qualification,
        capacity,
        outcomes: null,
        note:
          "Plano foi usado somente como gate de elegibilidade e não participa do ranking.",
      },
    });
  }

  solutions.sort(
    (a, b) =>
      b.rankScore - a.rankScore ||
      b.qualificationScore - a.qualificationScore ||
      a.providerName.localeCompare(b.providerName, "pt-BR"),
  );

  return solutions.length
    ? {
        status: "READY",
        painId: painRow.id,
        painCode: painRow.pain_code,
        solutions,
      }
    : {
        status: "NO_ELIGIBLE_PROVIDERS",
        painId: painRow.id,
        painCode: painRow.pain_code,
        solutions: [],
      };
}
