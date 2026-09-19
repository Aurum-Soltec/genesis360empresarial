/** Guards for cookie-authenticated mutations. Non-browser integrations need their own contract. */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  let originUrl: URL;
  try {
    if (!origin || origin === "null") throw new Error();
    originUrl = new URL(origin);
  } catch { throw new Error("ORIGIN_NOT_ALLOWED"); }
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = (forwardedHost ?? request.headers.get("host"))?.trim();
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const protocol = forwardedProtocol ?? new URL(request.url).protocol.slice(0, -1);
  let servedOrigin = new URL(request.url).origin;
  if (host && !host.includes(",") && (protocol === "http" || protocol === "https")) {
    try { servedOrigin = new URL(`${protocol}://${host}`).origin; }
    catch { throw new Error("ORIGIN_NOT_ALLOWED"); }
  }
  if (originUrl.origin !== servedOrigin ||
      origin !== originUrl.origin ||
      request.headers.get("sec-fetch-site") === "cross-site") {
    throw new Error("ORIGIN_NOT_ALLOWED");
  }
}

export async function readJsonBody(request: Request, maxBytes = 65_536): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new Error("JSON_CONTENT_TYPE_REQUIRED");
  }
  const lengthHeader = request.headers.get("content-length");
  if (lengthHeader !== null && (!/^\d+$/.test(lengthHeader) || Number(lengthHeader) > maxBytes)) {
    throw new Error("REQUEST_TOO_LARGE");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new Error("INVALID_JSON");
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new Error("REQUEST_TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new Error("INVALID_JSON"); }
}
