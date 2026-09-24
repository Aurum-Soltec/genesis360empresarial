const CANONICAL_DEMO_SOURCE_COUNT = 3;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function requestDemoEvidencePackage(apiJson, page, companyId, diagnosticId) {
  const result = await apiJson(page, "POST", "/api/demo/evidence", {
    companyId,
    diagnosticId,
  });
  const ids = result?.evidenceIds;
  if (
    result?.fictional !== true ||
    !Array.isArray(ids) ||
    ids.length !== CANONICAL_DEMO_SOURCE_COUNT ||
    ids.some((id) => typeof id !== "string" || !UUID_PATTERN.test(id)) ||
    new Set(ids).size !== CANONICAL_DEMO_SOURCE_COUNT ||
    !Number.isInteger(result.created) ||
    result.created < 0 ||
    result.created > CANONICAL_DEMO_SOURCE_COUNT
  ) {
    throw new Error("The canonical fictional evidence package was not confirmed");
  }
  return ids;
}
