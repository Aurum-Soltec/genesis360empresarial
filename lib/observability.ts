const SAFE_CORRELATION = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export function correlationId(request: Request): string {
  const supplied = request.headers.get("x-correlation-id");
  return supplied && SAFE_CORRELATION.test(supplied) ? supplied : crypto.randomUUID();
}

export function operationalLog(
  level: "info" | "warn" | "error",
  operation: string,
  fields: Record<string, unknown> = {},
) {
  return JSON.stringify({ timestamp: new Date().toISOString(), level, service: "genesis-web", operation, ...fields });
}

export function withObservedApi<T extends unknown[]>(
  operation: string,
  handler: (...args: T) => Promise<Response>,
) {
  return async (...args: T): Promise<Response> => {
    const started = performance.now();
    const request = args[0] instanceof Request ? args[0] : null;
    const requestId = request ? correlationId(request) : crypto.randomUUID();
    try {
      const response = await handler(...args);
      const duration = Math.round(performance.now() - started);
      response.headers.set("x-correlation-id", requestId);
      response.headers.set("server-timing", `app;dur=${duration}`);
      console.log(operationalLog(response.ok ? "info" : "warn", operation, {
        request_id: requestId, correlation_id: requestId, endpoint: request ? new URL(request.url).pathname : null,
        duration_ms: duration, result: response.status,
      }));
      return response;
    } catch (error) {
      console.error(operationalLog("error", operation, {
        request_id: requestId, correlation_id: requestId,
        endpoint: request ? new URL(request.url).pathname : null,
        duration_ms: Math.round(performance.now() - started), result: 500,
        error: error instanceof Error ? error.name : "UNKNOWN_ERROR",
      }));
      throw error;
    }
  };
}
