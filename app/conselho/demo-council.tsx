"use client";

import { useState } from "react";

type Prompt = { id: string; question: string; role: string; answer: string; citations: string[] };

export function DemoCouncil({ prompts }: { prompts: Prompt[] }) {
  const [activeId, setActiveId] = useState(prompts[0]?.id ?? "");
  const active = prompts.find((prompt) => prompt.id === activeId) ?? prompts[0];
  if (!active) return null;
  return (
    <div className="council-console">
      <aside className="council-prompts" aria-label="Perguntas sugeridas ao Conselho">
        <span className="section-eyebrow">Perguntas para a reunião</span>
        {prompts.map((prompt) => (
          <button type="button" key={prompt.id}
            className={prompt.id === active.id ? "is-active" : ""}
            aria-pressed={prompt.id === active.id}
            onClick={() => setActiveId(prompt.id)}>
            {prompt.question}
          </button>
        ))}
      </aside>
      <section className="council-response" aria-live="polite">
        <div className="council-response-head">
          <span className="council-orbit" aria-hidden="true">G</span>
          <div><span>Conselho Genesis</span><strong>{active.role}</strong></div>
        </div>
        <h2>{active.question}</h2>
        <p>{active.answer}</p>
        <div className="council-citations" aria-label="Fontes da resposta">
          <span>Base consultada</span>
          {active.citations.map((citation) => <code key={citation}>{citation}</code>)}
        </div>
      </section>
    </div>
  );
}
