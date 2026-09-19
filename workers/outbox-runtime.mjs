export function retryDelaySeconds(attempt, base = 5, ceiling = 3600) {
  const exponent = Math.max(0, Math.min(16, attempt - 1));
  return Math.min(ceiling, base * (2 ** exponent));
}

export function structuredLog(level, operation, fields = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(), level, service: "genesis-outbox-worker", operation, ...fields,
  });
}

export async function processClaimedEvent({ db, workerId, event, handler, log = console.log }) {
  const started = performance.now();
  const correlationId = String(event.payload?.correlation_id ?? event.id);
  let result = "processed";
  let errorCode = null;
  try {
    await handler(event, { correlationId, tenantId: event.tenant_id });
    const completion = await db.rpc("complete_event_outbox", {
      p_worker_id: workerId, p_event_id: event.id,
    });
    if (completion.error) throw completion.error;
  } catch (error) {
    errorCode = error instanceof Error ? error.name || "WORKER_ERROR" : "WORKER_ERROR";
    const delay = retryDelaySeconds(event.attempts);
    const failure = await db.rpc("fail_event_outbox", {
      p_worker_id: workerId, p_event_id: event.id,
      p_error: errorCode, p_retry_seconds: delay,
    });
    if (failure.error) throw failure.error;
    result = event.attempts >= event.max_attempts ? "dead" : "failed";
  }
  const durationMs = Math.round(performance.now() - started);
  const attemptRecord = await db.from("outbox_attempts").insert({
    event_id: event.id, tenant_id: event.tenant_id, worker_id: workerId,
    correlation_id: correlationId, attempt: event.attempts, result,
    duration_ms: durationMs, error_code: errorCode,
  });
  if (attemptRecord.error) throw attemptRecord.error;
  log(structuredLog(result === "processed" ? "info" : "warn", "event.process", {
    tenant_id: event.tenant_id, company_id: event.company_id,
    worker: workerId, event_id: event.id, event_type: event.event_type,
    correlation_id: correlationId, duration_ms: durationMs, result, error: errorCode,
  }));
  return { result, durationMs, correlationId };
}
