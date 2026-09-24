import { PASSPORT_ESSENTIAL_KEYS } from "./business-passport";

export type EssentialFactKey = (typeof PASSPORT_ESSENTIAL_KEYS)[number];

export const essentialFactLabels: Record<EssentialFactKey, string> = {
  "identity.sector": "Setor de atuação",
  "identity.size": "Porte da empresa",
  "identity.region": "Região de atuação",
  "business.model": "Modelo de negócio",
  "business.primary_goal": "Objetivo principal",
  "technology.crm_adoption": "Uso de CRM",
  "finance.cashflow_forecast": "Previsão de fluxo de caixa",
};

const verificationLabels: Record<string, string> = {
  verified: "Verificado",
  pending: "Em verificação",
  unverified: "Declarado, não verificado",
  rejected: "Rejeitado",
  expired: "Expirado",
};

const sourceLabels: Record<string, string> = {
  declared: "Declarado",
  inferred: "Inferido",
  verified: "Origem verificada",
  imported: "Importado",
};

export function passportVerificationLabel(status: string): string {
  return verificationLabels[status] ?? "Estado não reconhecido";
}

export function passportSourceLabel(source: string): string {
  return sourceLabels[source] ?? "Origem não reconhecida";
}

export function hasPassportValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return false;
}

export function readablePassportValue(value: unknown, sensitivity: string): string {
  if (!hasPassportValue(value)) return "Sem valor informado";
  if (sensitivity !== "public" && sensitivity !== "internal") return "Valor protegido";
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value.length <= 180 ? value : `${value.slice(0, 177)}…`;
  return "Valor estruturado registrado";
}

export function passportDateLabel(value: string | null | undefined): string {
  if (!value) return "Data não registrada";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Data não registrada";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export function timelinePageNumber(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^[1-9]\d{0,3}$/.test(value)) return 1;
  const page = Number(value);
  return page <= 1000 ? page : 1;
}

function payloadFactLabel(payload: unknown): string {
  if (!payload || typeof payload !== "object" || !("factKey" in payload)) return "Informação empresarial";
  const key = (payload as { factKey: unknown }).factKey;
  return typeof key === "string" && PASSPORT_ESSENTIAL_KEYS.includes(key as EssentialFactKey)
    ? essentialFactLabels[key as EssentialFactKey]
    : "Informação empresarial";
}

export function timelineEventPresentation(eventType: string, payload: unknown): {
  title: string;
  detail: string;
  href: string | null;
} {
  switch (eventType) {
    case "passport.fact.created":
      return { title: "Informação adicionada ao Passport", detail: payloadFactLabel(payload), href: "/passaporte" };
    case "passport.fact.updated":
      return { title: "Informação atualizada no Passport", detail: payloadFactLabel(payload), href: "/passaporte" };
    case "mission.suggested":
      return { title: "Missão sugerida", detail: "Uma decisão gerou um próximo passo rastreável.", href: "/missoes" };
    case "mission.outcome.recorded":
      return { title: "Resultado de missão registrado", detail: "O resultado foi preservado no histórico empresarial.", href: "/missoes" };
    default:
      return { title: "Atividade registrada", detail: "Um evento foi preservado na linha do tempo.", href: null };
  }
}
