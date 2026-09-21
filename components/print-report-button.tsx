"use client";

export function PrintReportButton() {
  return (
    <button className="button button-primary report-print-action" type="button" onClick={() => window.print()}>
      Imprimir ou salvar em PDF
    </button>
  );
}
