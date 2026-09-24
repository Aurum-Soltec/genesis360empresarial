export function demoAnswer(questionId, metadata, position) {
  if (!metadata || metadata.id !== questionId) {
    throw new Error(`Missing metadata for ${questionId}`);
  }

  const informationSlots = Object.fromEntries(
    (metadata.informationSlots ?? []).map((slot) => [
      slot.key,
      /date|data|period|período/i.test(`${slot.key} ${slot.label}`)
        ? "2026-09-21"
        : "Informação fictícia do cenário controlado de demonstração",
    ]),
  );
  // Register the demo package on the diagnostic only. None of its three
  // generic sources has a reviewed mapping to an individual question.
  const evidenceRefs = [];

  if (questionId === "TEC-002") {
    const option = metadata.ui?.options?.find(
      (candidate) => typeof candidate === "object" && candidate.maturity === 2,
    ) ?? metadata.ui?.options?.find((candidate) => typeof candidate === "object");
    if (!option || typeof option === "string") throw new Error("TEC-002 option missing");
    return {
      answerState: "ANSWERED",
      response: { choice: option.value },
      maturity: option.maturity ?? null,
      informationSlots,
      evidenceRefs,
    };
  }

  if (metadata.scoreRole === "CORE_ANCHOR") {
    const maturity = position % 5 === 0 ? 3 : 2;
    return {
      answerState: "ANSWERED",
      response: { maturity },
      maturity,
      informationSlots,
      evidenceRefs,
    };
  }

  const firstOption = metadata.ui?.options?.[0];
  const choice = typeof firstOption === "string" ? firstOption : firstOption?.value;
  return {
    answerState: "ANSWERED",
    response: {
      value: "Resposta fictícia do cenário controlado de demonstração",
      choice: choice ?? null,
    },
    maturity: null,
    informationSlots,
    evidenceRefs,
  };
}
