import { describe, expect, it } from "vitest";
import { authorizeAgentTool, type AgentExecutionGrant } from "./tool-authorization";

const tenant = "10000000-0000-4000-8000-000000000001";
const company = "20000000-0000-4000-8000-000000000002";
const context = { tenantId: tenant, userId: "30000000-0000-4000-8000-000000000003", role: "owner" };
const grant: AgentExecutionGrant = { agentId: "gds", tenantId: tenant, companyId: company, role: "draft",
  allowedTools: ["passport.read"], tokenLimit: 2000, budgetCents: 20, timeoutMs: 5000,
  concurrencyLimit: 1, correlationId: "run-1" };

describe("agent tool authorization", () => {
  it("authorizes only an authored tool inside the trusted scope", () => {
    expect(authorizeAgentTool({ context, grant, requestedTool: "passport.read", requestedCompanyId: company }).tenantId).toBe(tenant);
  });
  it.each([
    ["cross tenant", { requestedTool: "passport.read", requestedTenantId: "40000000-0000-4000-8000-000000000004" }, "AGENT_TENANT_DENIED"],
    ["cross company", { requestedTool: "passport.read", requestedCompanyId: "50000000-0000-4000-8000-000000000005" }, "AGENT_COMPANY_DENIED"],
    ["arbitrary SQL", { requestedTool: "sql.execute" }, "AGENT_TOOL_DENIED"],
    ["shell", { requestedTool: "shell.execute" }, "AGENT_TOOL_DENIED"],
  ])("denies %s", (_name, request, code) => {
    expect(() => authorizeAgentTool({ context, grant, ...request })).toThrow(code);
  });
});
