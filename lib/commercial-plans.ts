import catalog from "@/data/commercial-plans.json";
export const CommercialPlans = catalog.plans;
export const CommercialVersion = catalog.version;
export function formatMonthlyPrice(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new Error("INVALID_MONEY");
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
