import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { demoAnswer } from "./demo-answer.mjs";

const metadataSource = JSON.parse(
  fs.readFileSync("data/diagnostic-question-metadata-v1.1.json", "utf8"),
) as { questions: Array<Parameters<typeof demoAnswer>[1] & { id: string }> };

describe("controlled demo answer provenance", () => {
  it("never presents the three generic fictional sources as support for an individual answer", () => {
    expect(metadataSource.questions).toHaveLength(144);
    for (const [position, metadata] of metadataSource.questions.entries()) {
      const answer = demoAnswer(metadata.id, metadata, position);
      expect(answer.answerState).toBe("ANSWERED");
      expect(answer.evidenceRefs).toEqual([]);
    }
  });

  it("preserves the special technology choice without inventing an evidence link", () => {
    const metadata = metadataSource.questions.find((question) => question.id === "TEC-002");
    const answer = demoAnswer("TEC-002", metadata, 0);
    expect(answer.response).toEqual({ choice: "PARTIAL_TEST" });
    expect(answer.maturity).toBe(2);
    expect(answer.evidenceRefs).toEqual([]);
  });

  it("fails closed if metadata is absent or belongs to another question", () => {
    expect(() => demoAnswer("EST-001", undefined, 0)).toThrow("Missing metadata");
    expect(() => demoAnswer("EST-001", metadataSource.questions[1], 0)).toThrow("Missing metadata");
  });
});
