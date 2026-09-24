"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import master from "@/data/diagnostic-master.json";
import metadataSource from "@/data/diagnostic-question-metadata-v1.1.json";
import strategy from "@/data/diagnostic-strategy-v1.1.json";
import { BrandMark } from "@/components/brand-mark";

type SlotSpec = {
  key: string;
  label: string;
  required: boolean;
};

type UiOption =
  | string
  | { value: string; label: string; maturity?: number };

type Metadata = {
  id: string;
  stageCode: string;
  stageOrder: number;
  primaryPurpose: string;
  scoreRole: string;
  allowsNotApplicable: boolean;
  informationSlots: SlotSpec[];
  ui:
    | {
        kind: string;
        options?: UiOption[];
        urgency?: string[];
      }
    | null;
};

type DiagnosticState = {
  diagnosticId: string;
  answerRevision: number;
  unresolvedQuestionIds: string[];
  progressPercent: number;
  confidencePercent: number;
  confidenceLevel: "LOW" | "MODERATE" | "GOOD" | "HIGH";
  recommendations: string[];
  nextQuestionId: string | null;
  stageCode: string | null;
  stageOrder: number | null;
  stageName: string | null;
  answeredCount: number;
  seenCount: number;
  currentQueueCount: number;
  typicalRange: number[];
  adaptiveCount: number;
  unresolvedCount: number;
  canSubmit: boolean;
};

const questionById = new Map(
  master.questions.map((question) => [question.id, question]),
);
const metadataById = new Map(
  metadataSource.questions.map((metadata) => [metadata.id, metadata]),
);

const confidenceLabel = {
  LOW: "Baixa",
  MODERATE: "Moderada",
  GOOD: "Boa",
  HIGH: "Alta",
} as const;

function DiagnosticMeter({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  tone: "progress" | "confidence";
}) {
  return (
    <div className="precision-diagnostic-meter">
      <div className="meter-head">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div
        className={`precision-meter ${tone}`}
        role="progressbar"
        aria-label={`${label}: ${value}%`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <span style={{ width: `${value}%` }} />
      </div>
      <p>{detail}</p>
    </div>
  );
}

function StageRail({ currentStage }: { currentStage: number | null }) {
  return (
    <ol className="diagnostic-stage-rail" aria-label="Etapas do diagnóstico">
      {strategy.stages.map((stage) => {
        const state =
          currentStage === null
            ? "future"
            : stage.order < currentStage
              ? "done"
              : stage.order === currentStage
                ? "current"
                : "future";
        return (
          <li className={state} key={stage.code}>
            <span className="stage-marker" aria-hidden="true" />
            <span className="stage-copy">
              <small>Etapa {stage.order}</small>
              <strong>{stage.name}</strong>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function DiagnosticJourney({
  companyId,
  companyName,
  demoSourceCount,
}: {
  companyId: string;
  companyName: string;
  demoSourceCount: number;
}) {
  const router = useRouter();
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [state, setState] = useState<DiagnosticState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maturity, setMaturity] = useState<number | null>(null);
  const [choice, setChoice] = useState("");
  const [details, setDetails] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [profile, setProfile] = useState<"ESSENTIAL" | "FULL">("FULL");

  const question = state?.nextQuestionId
    ? questionById.get(state.nextQuestionId)
    : undefined;
  const metadata = question
    ? (metadataById.get(question.id) as unknown as Metadata | undefined)
    : undefined;

  async function fetchState(id: string) {
    const response = await fetch(`/api/diagnostics/${id}/state`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "STATE_FAILED");
    setState(data);
    setMaturity(null);
    setChoice("");
    setDetails({});
  }

  async function start() {
    if (saving) return;
    setSaving(true); setError(null);
    try {
      const response = await fetch("/api/diagnostics", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ companyId, profile }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "START_FAILED");
      setDiagnosticId(data.diagnostic.id);
      await fetchState(data.diagnostic.id);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Não foi possível iniciar. Tente novamente.");
    } finally { setSaving(false); }
  }

  async function saveAnswer(input: {
    answerState: "ANSWERED" | "UNKNOWN" | "NOT_APPLICABLE" | "DEFERRED";
    response?: unknown; maturity?: number | null;
    informationSlots?: Record<string, unknown>;
  }) {
    if (!diagnosticId || !question || !state || saving) return;
    setSaving(true); setError(null);
    try {
      const response = await fetch(`/api/diagnostics/${diagnosticId}/answers`, {
        method: "PUT", headers: { "content-type": "application/json" },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          questionId: question.id, expectedRevision: state.answerRevision,
          answerState: input.answerState,
          response: input.response ?? { state: input.answerState },
          maturity: input.maturity ?? null,
          informationSlots: input.informationSlots ?? {},
          // The demo package is linked to the diagnostic, not to every answer.
          // A source needs a reviewed question-level relevance rule before linking.
          evidenceRefs: [],
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.error === "DIAGNOSTIC_CHANGED") await fetchState(diagnosticId);
        throw new Error(data.error ?? "Não foi possível salvar sua resposta.");
      }
      setLastSaved("Salvo agora");
      if (data.refreshRequired) await fetchState(diagnosticId);
      else {
        setState(data.state); setMaturity(null); setChoice(""); setDetails({});
      }
    } catch (failure) {
      // Never automatically retry a write after a timeout; it may have committed.
      setError(failure instanceof Error ? failure.message :
        "Gravação não confirmada. Recarregue o estado antes de tentar novamente.");
    } finally { setSaving(false); }
  }

  async function submit() {
    if (!diagnosticId || saving) return;
    setSaving(true); setError(null);
    try {
      const response = await fetch(`/api/diagnostics/${diagnosticId}/submit`, {
        method: "POST", signal: AbortSignal.timeout(20000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Não foi possível concluir a análise.");
      router.push(`/resultado-v1?diagnostic=${diagnosticId}`);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Conclusão não confirmada. Tente novamente.");
    } finally { setSaving(false); }
  }

  function slotFields() {
    if (!metadata?.informationSlots?.length) return null;
    return (
      <div className="precision-detail-grid">
        {metadata.informationSlots.map((slot) => (
          <label key={slot.key}>
            <span>{slot.label}</span>
            <input
              type={slot.key.includes("date") ? "date" : "text"}
              value={details[slot.key] ?? ""}
              required={slot.required}
              onChange={(event) =>
                setDetails((current) => ({
                  ...current,
                  [slot.key]: event.target.value,
                }))
              }
            />
          </label>
        ))}
      </div>
    );
  }

  function answerControls() {
    if (!question || !metadata) return null;

    const isScale = question.responseType.startsWith("Escala");

    if (isScale) {
      return (
        <>
          <div className="precision-scale" role="group" aria-label="Nível de maturidade">
            {[0, 1, 2, 3, 4].map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={maturity === value}
                className={maturity === value ? "selected" : ""}
                onClick={() => setMaturity(value)}
              >
                <strong>{value}</strong>
                <span>
                  {
                    [
                      "Inexistente",
                      "Inicial",
                      "Parcial",
                      "Consistente",
                      "Avançado",
                    ][value]
                  }
                </span>
              </button>
            ))}
          </div>

          {slotFields()}

          <div className="diagnostic-primary-action">
            <button
              className="button button-primary"
              disabled={saving || maturity === null}
              onClick={() =>
                saveAnswer({
                  answerState: "ANSWERED",
                  response: { maturity },
                  maturity,
                  informationSlots: details,
                })
              }
            >
              {saving ? "Salvando…" : "Salvar e continuar"}
            </button>
          </div>
        </>
      );
    }

    if (question.id === "TEC-002" && metadata.ui?.options) {
      return (
        <>
          <div className="precision-choice-list">
            {metadata.ui.options
              .filter(
                (option): option is Exclude<UiOption, string> =>
                  typeof option !== "string",
              )
              .map((option) => (
                <button
                  type="button"
                  aria-pressed={choice === option.value}
                  className={choice === option.value ? "selected" : ""}
                  key={option.value}
                  onClick={() => setChoice(option.value)}
                >
                  {option.label}
                </button>
              ))}
          </div>

          {slotFields()}

          <div className="diagnostic-primary-action">
            <button
              className="button button-primary"
              disabled={saving || !choice}
              onClick={() =>
                saveAnswer({
                  answerState: "ANSWERED",
                  response: { choice },
                  informationSlots: details,
                })
              }
            >
              {saving ? "Salvando…" : "Salvar e continuar"}
            </button>
          </div>
        </>
      );
    }

    return (
      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const freeText = String(form.get("freeText") ?? "").trim();
          saveAnswer({
            answerState: "ANSWERED",
            response: { value: freeText, choice: choice || null },
            informationSlots: details,
          });
        }}
      >
        {metadata.ui?.options ? (
          <label className="precision-field">
            <span>Selecione a opção principal</span>
            <select
              value={choice}
              onChange={(event) => setChoice(event.target.value)}
            >
              <option value="">Selecione</option>
              {metadata.ui.options.map((option) => (
                <option
                  key={typeof option === "string" ? option : option.value}
                  value={typeof option === "string" ? option : option.value}
                >
                  {typeof option === "string" ? option : option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {slotFields()}

        {!metadata.informationSlots?.length ? (
          <label className="precision-field">
            <span>Sua resposta</span>
            <textarea
              name="freeText"
              rows={5}
              placeholder="Responda com o que você realmente sabe. O Genesis valoriza informação útil, não textos longos."
              required
            />
          </label>
        ) : null}

        <div className="diagnostic-primary-action">
          <button className="button button-primary" disabled={saving}>
            {saving ? "Salvando…" : "Salvar e continuar"}
          </button>
        </div>
      </form>
    );
  }

  if (!diagnosticId || !state) {
    return (
      <div className="diagnostic-experience">
        <header className="diagnostic-topbar">
          <Link href="/" aria-label="Genesis 360 Empresarial — início">
            <BrandMark />
          </Link>
          <Link className="diagnostic-exit" href="/">
            Voltar à visão executiva
          </Link>
        </header>

        <main className="diagnostic-intro">
          <div className="section-eyebrow">Diagnóstico Genesis 360</div>
          <h1>Uma leitura empresarial profunda, sem formulário inflado.</h1>
          <p>
            Começamos pelo que é essencial para {companyName} e aprofundamos
            somente quando suas respostas indicarem que vale a pena.
          </p>

          <fieldset className="diagnostic-profile-choice">
            <legend>Escolha a profundidade desta leitura</legend>
            <button
              type="button"
              className={profile === "FULL" ? "is-selected" : ""}
              aria-pressed={profile === "FULL"}
              onClick={() => setProfile("FULL")}
            >
              <strong>Diagnóstico completo</strong>
              <span>24 âncoras em 31 interações iniciais, com aprofundamentos adaptativos até 60 interações típicas.</span>
            </button>
            <button
              type="button"
              className={profile === "ESSENTIAL" ? "is-selected" : ""}
              aria-pressed={profile === "ESSENTIAL"}
              onClick={() => setProfile("ESSENTIAL")}
            >
              <strong>Leitura essencial</strong>
              <span>Visão executiva mais curta, com 31–42 interações típicas.</span>
            </button>
          </fieldset>

          <div className="diagnostic-intro-facts">
            <div>
              <strong>{profile === "FULL" ? "31–60" : "31–42"}</strong>
              <span>interações típicas</span>
            </div>
            <div>
              <strong>6</strong>
              <span>etapas de negócio</span>
            </div>
            <div>
              <strong>2</strong>
              <span>leituras ao vivo: progresso + confiança</span>
            </div>
          </div>

          <div className="action-row">
            <button className="button button-primary" disabled={saving} onClick={start}>
              Iniciar ou continuar diagnóstico {profile === "FULL" ? "completo" : "essencial"}
            </button>
            <span className="diagnostic-intro-note">
              Autosave e retomada fazem parte da jornada.
            </span>
          </div>

          {error ? <div role="alert"><p className="form-error">{error}</p>
              {diagnosticId ? <button type="button" className="button button-quiet" disabled={saving}
                onClick={() => fetchState(diagnosticId).catch(() => setError("Não foi possível atualizar o estado."))}>
                Atualizar estado sem reenviar resposta
              </button> : null}</div> : null}
          </main>
          {demoSourceCount ? (
            <p className="diagnostic-evidence-note">
              {demoSourceCount} fonte(s) fictícia(s) registrada(s) para consulta. Elas não comprovam nem são vinculadas automaticamente às respostas.
            </p>
          ) : null}
      </div>
    );
  }

  return (
    <div className="diagnostic-experience">
      <header className="diagnostic-topbar">
        <Link href="/" aria-label="Genesis 360 Empresarial — início">
          <BrandMark />
        </Link>
        <div className="diagnostic-topbar-status">
          <span>{lastSaved ?? "Autosave ativo"}</span>
          <Link className="diagnostic-exit" href="/">
            Sair
          </Link>
        </div>
      </header>

      <div className="diagnostic-workspace">
        <aside className="diagnostic-stage-panel">
          <div className="diagnostic-company">
            <span className="section-eyebrow">Empresa</span>
            <strong>{companyName}</strong>
          </div>
          <StageRail currentStage={state.stageOrder} />
        </aside>

        <main className="diagnostic-main">
          <section className="diagnostic-meters">
            <DiagnosticMeter
              label="Progresso"
              value={state.progressPercent}
              detail={`${state.seenCount} interações percorridas · faixa esperada ${state.typicalRange[0]}–${state.typicalRange[1]}`}
              tone="progress"
            />
            <DiagnosticMeter
              label="Confiabilidade"
              value={state.confidencePercent}
              detail={`${confidenceLabel[state.confidenceLevel]} · ${state.recommendations[0] ?? "A análise está consistente para o estágio atual."}`}
              tone="confidence"
            />
          </section>

          {!question || !metadata ? (
            <section className="precision-question-surface finish">
              <div className="section-eyebrow">Caminho diagnóstico percorrido</div>
              <h1>{state.canSubmit ? "Seu caminho está pronto para análise." : "Revise as informações essenciais ainda pendentes."}</h1>
              <p>
                {state.unresolvedCount
                  ? `Existem ${state.unresolvedCount} resposta(s) marcadas como “Não sei” ou “Responder depois”. Isso permanece explícito na confiança.`
                  : "As informações necessárias deste caminho foram percorridas."}
              </p>
              <button
                className="button button-primary"
                disabled={saving || !state.canSubmit}
                onClick={submit}
              >
                Concluir e analisar
              </button>
              {state.unresolvedQuestionIds.length ? (
                <div className="action-row" aria-label="Revisar respostas pendentes">
                  {state.unresolvedQuestionIds.map((id) => (
                    <button type="button" className="button button-quiet" key={id} disabled={saving}
                      onClick={() => {
                        setState({ ...state, nextQuestionId: id });
                        setMaturity(null); setChoice(""); setDetails({});
                      }}>
                      Revisar {id}
                    </button>
                  ))}
                </div>
              ) : null}
              {!state.canSubmit ? (
                <p className="form-hint">
                  A conclusão será liberada quando a cobertura crítica mínima
                  estiver presente.
                </p>
              ) : null}
            </section>
          ) : (
            <section className="precision-question-surface">
              <div className="question-meta">
                <span>
                  Etapa {metadata.stageOrder} de 6 · {state.stageName}
                </span>
                <span>
                  Interação {state.seenCount + 1}
                </span>
              </div>

              <h1>{question.prompt}</h1>
              <p className="question-guidance">
                Responda com o que você realmente sabe. “Não sei” não é tratado
                como baixa maturidade, e textos longos não recebem pontos extras.
              </p>

              <div className="question-answer-area">{answerControls()}</div>

              <div className="diagnostic-secondary-actions">
                <button
                  type="button"
                  className="button button-quiet"
                  disabled={saving}
                  onClick={() => saveAnswer({ answerState: "UNKNOWN" })}
                >
                  Não sei
                </button>

                {metadata.allowsNotApplicable ? (
                  <button
                    type="button"
                    className="button button-quiet"
                    disabled={saving}
                    onClick={() =>
                      saveAnswer({ answerState: "NOT_APPLICABLE" })
                    }
                  >
                    Não se aplica
                  </button>
                ) : null}

                <button
                  type="button"
                  className="button button-quiet"
                  disabled={saving}
                  onClick={() => saveAnswer({ answerState: "DEFERRED" })}
                >
                  Responder depois
                </button>
              </div>

              {error ? <div role="alert"><p className="form-error">{error}</p>
              {diagnosticId ? <button type="button" className="button button-quiet" disabled={saving}
                onClick={() => fetchState(diagnosticId).catch(() => setError("Não foi possível atualizar o estado."))}>
                Atualizar estado sem reenviar resposta
              </button> : null}</div> : null}
            </section>
          )}

          {state.recommendations.length > 1 ? (
            <aside className="confidence-guidance">
              <span className="section-eyebrow">
                Como aumentar a confiabilidade
              </span>
              <ul>
                {state.recommendations.slice(0, 3).map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ul>
            </aside>
          ) : null}
        </main>
      </div>
    </div>
  );
}
