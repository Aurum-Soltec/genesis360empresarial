"use client";

import { useState } from "react";

const options = [
  "Inexistente ou não sei informar",
  "Existe de forma informal e reativa",
  "Está parcialmente definido",
  "É acompanhado e utilizado na gestão",
  "É integrado, medido e melhorado continuamente",
];

export function QuestionCard() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="glass question-card" aria-labelledby="question-title">
      <div className="question-number">Pergunta 01 de 24 • Estratégia</div>
      <h1 id="question-title" className="question-title">
        A empresa possui prioridades estratégicas claramente definidas para os próximos 12 meses?
      </h1>
      <div className="option-grid" role="radiogroup" aria-label="Selecione uma resposta">
        {options.map((option, index) => (
          <button
            className={`option ${selected === index ? "selected" : ""}`}
            key={option}
            onClick={() => setSelected(index)}
            role="radio"
            aria-checked={selected === index}
            type="button"
          >
            <span className="option-index">{index}</span>
            <span>{option}</span>
          </button>
        ))}
      </div>
      <div className="hero-actions">
        <button className="button button-secondary" type="button">Não sei</button>
        <button className="button button-primary" disabled={selected === null} type="button">
          Continuar
        </button>
      </div>
    </section>
  );
}
