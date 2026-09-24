export function demoAnswer(
  questionId: string,
  metadata: {
    id: string;
    informationSlots?: Array<{ key: string; label: string }>;
    scoreRole?: string;
    ui?: { options?: Array<string | { value: string; maturity?: number }> } | null;
  } | undefined,
  position: number,
): {
  answerState: "ANSWERED";
  response: { choice: string } | { maturity: number } | { value: string; choice: string | null };
  maturity: number | null;
  informationSlots: Record<string, string>;
  evidenceRefs: string[];
};
