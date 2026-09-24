const INTERNAL_ORIGIN = "https://genesis.invalid";

/** Accept only same-origin paths when restoring a destination after auth. */
export function safeInternalPath(
  candidate: string | null | undefined,
  fallback = "/selecionar-empresa",
): string {
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//") || candidate.includes("\\")) {
    return fallback;
  }

  try {
    const url = new URL(candidate, INTERNAL_ORIGIN);
    if (url.origin !== INTERNAL_ORIGIN) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
