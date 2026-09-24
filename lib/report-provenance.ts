type AnswerEvidenceRow = {
  evidence_refs: unknown;
};

export function evidenceIdsFromAnswers(rows: AnswerEvidenceRow[] | null | undefined) {
  const ids = new Set<string>();
  for (const row of rows ?? []) {
    if (!Array.isArray(row.evidence_refs)) continue;
    for (const value of row.evidence_refs) {
      if (typeof value === "string" && value.trim()) ids.add(value.trim().toLowerCase());
    }
  }
  return [...ids];
}

export function answersWithEvidence(rows: AnswerEvidenceRow[] | null | undefined) {
  return (rows ?? []).filter(
    (row) => Array.isArray(row.evidence_refs) && row.evidence_refs.some(
      (value) => typeof value === "string" && value.trim().length > 0,
    ),
  ).length;
}

export function evidenceSetComplete(
  requestedIds: string[],
  rows: Array<{ id: string }> | null | undefined,
) {
  const requested = new Set(requestedIds.map((id) => id.toLowerCase()));
  const available = new Set((rows ?? []).map((row) => row.id.toLowerCase()));
  return requested.size === available.size && [...requested].every((id) => available.has(id));
}

export function verifiedEvidenceCount(
  rows: Array<{ verification_status: string }> | null | undefined,
) {
  return (rows ?? []).filter((row) => row.verification_status === "verified").length;
}
