import type { TenantContext } from "@/lib/tenant-context";

export const authoredAgentTools = [
  "passport.read", "diagnostic.summary.read", "pain.evidence.read", "gds.draft.write",
] as const;
export type AuthoredAgentTool = (typeof authoredAgentTools)[number];

export interface AgentExecutionGrant {
  agentId: string;
  tenantId: string;
  companyId: string;
  role: string;
  allowedTools: AuthoredAgentTool[];
  tokenLimit: number;
  budgetCents: number;
  timeoutMs: number;
  concurrencyLimit: number;
  correlationId: string;
}

export function authorizeAgentTool(input: {
  context: TenantContext;
  grant: AgentExecutionGrant;
  requestedTool: string;
  requestedTenantId?: string;
  requestedCompanyId?: string;
}) {
  const { context, grant } = input;
  if (context.tenantId !== grant.tenantId || input.requestedTenantId && input.requestedTenantId !== context.tenantId) {
    throw new Error("AGENT_TENANT_DENIED");
  }
  if (input.requestedCompanyId && input.requestedCompanyId !== grant.companyId) throw new Error("AGENT_COMPANY_DENIED");
  if (!authoredAgentTools.includes(input.requestedTool as AuthoredAgentTool) ||
      !grant.allowedTools.includes(input.requestedTool as AuthoredAgentTool)) throw new Error("AGENT_TOOL_DENIED");
  if (grant.tokenLimit <= 0 || grant.budgetCents < 0 || grant.timeoutMs < 100 || grant.concurrencyLimit < 1) {
    throw new Error("AGENT_BUDGET_DENIED");
  }
  return {
    agentId: grant.agentId, tenantId: context.tenantId, companyId: grant.companyId,
    tool: input.requestedTool as AuthoredAgentTool, correlationId: grant.correlationId,
  };
}
