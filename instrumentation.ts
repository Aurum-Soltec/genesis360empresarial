import { operationalLog } from "@/lib/observability";

export async function register() {}

export function onRequestError(
  error: { digest?: string } & Error,
  request: { path: string; method: string; headers: Record<string, string> },
  context: { routerKind: string; routePath: string; routeType: string; renderSource: string },
) {
  console.error(operationalLog("error", "request.unhandled", {
    request_id: request.headers["x-correlation-id"] ?? null,
    correlation_id: request.headers["x-correlation-id"] ?? null,
    endpoint: request.path, method: request.method, route: context.routePath,
    error: error.digest ?? error.name,
  }));
}
