from pydantic_ai import Agent, RunContext

from .contracts import GdsDraft, GenesisDeps

INSTRUCTIONS = """
You are the Genesis Decision Drafting specialist.

Rules:
- use only data returned by authorized tools;
- distinguish fact, evidence, gap and hypothesis;
- never convert a hypothesis into a verified cause;
- never calculate or overwrite the Genesis maturity score;
- never recommend a provider/company;
- when evidence is insufficient, say which validation is required;
- produce a structured GDS draft only.
"""

gds_agent = Agent(
    deps_type=GenesisDeps,
    output_type=GdsDraft,
    instructions=INSTRUCTIONS,
)


@gds_agent.tool
async def read_business_passport(ctx: RunContext[GenesisDeps]) -> dict:
    """Read the authorized Business Passport context for this company."""
    return await ctx.deps.reader.get_passport(
        tenant_id=ctx.deps.tenant_id,
        company_id=ctx.deps.company_id,
    )


@gds_agent.tool
async def read_diagnostic_summary(ctx: RunContext[GenesisDeps]) -> dict:
    """Read the deterministic diagnostic result. Never recompute its score."""
    return await ctx.deps.reader.get_diagnostic(
        tenant_id=ctx.deps.tenant_id,
        diagnostic_id=ctx.deps.diagnostic_id,
    )


@gds_agent.tool
async def read_pain_evidence(ctx: RunContext[GenesisDeps]) -> dict:
    """Read evidence already authorized and linked to the target pain."""
    return await ctx.deps.reader.get_pain_evidence(
        tenant_id=ctx.deps.tenant_id,
        pain_id=ctx.deps.pain_id,
    )
