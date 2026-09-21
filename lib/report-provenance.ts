type AnswerEvidenceRow = {
  evidence_refs: unknown;
};

export function evidenceIdsFromAnswers(rows: AnswerEvidenceRow[] | null | undefined) {
  const ids = new Set<string>();
  for (const row of rows ?? []) {
    if (!Array.isArray(row.evidence_refs)) continue;
    for (const value of row.evidence_refs) {
      if (typeof value === "string" && value.trim()) ids.add(value.toLowerCase());
    }
  }
  return [...ids];
}

export function answersWithEvidence(rows: AnswerEvidenceRow[] | null | undefined) {
  return (rows ?? []).filter(
    (row) => Array.isArray(row.evidence_refs) && row.evidence_refs.length > 0,
  ).length;
}

export function verifiedEvidenceCount(
  rows: Array<{ verification_status: string }> | null | undefined,
) {
  return (rows ?? []).filter((row) => row.verification_status === "verified").length;
}
