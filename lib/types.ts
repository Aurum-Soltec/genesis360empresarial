export type QuestionPhase = "E" | "C" | "A";
export type QuestionType =
  | "scale"
  | "single"
  | "multiple"
  | "number"
  | "percentage"
  | "text"
  | "consent";

export interface DiagnosticQuestion {
  id: string;
  dimension: string;
  phase: QuestionPhase;
  prompt: string;
  responseType: string;
  evidenceSuggestions: string[];
  weight: 1 | 2 | 3;
  attentionSignal: string;
}

export interface QuestionAnswer {
  questionId: string;
  maturity: 0 | 1 | 2 | 3 | 4 | null;
  confidence: number;
  applicable: boolean;
}

export interface ScoreResult {
  score: number | null;
  coverage: number;
  confidence: number;
  status: "insufficient_data" | "scored";
}
