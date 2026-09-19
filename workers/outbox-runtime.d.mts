export function retryDelaySeconds(attempt: number, base?: number, ceiling?: number): number;
export function structuredLog(level: string, operation: string, fields?: Record<string, unknown>): string;
export interface OutboxRuntimeEvent extends Record<string, unknown> {
  id: string; tenant_id: string; company_id: string | null; event_type: string;
  payload: Record<string, unknown>; attempts: number; max_attempts: number;
}
export function processClaimedEvent(input: {
  db: { rpc: (...args: unknown[]) => Promise<{ error: unknown }>; from: (table: string) => { insert: (row: unknown) => Promise<{ error: unknown }> } };
  workerId: string;
  event: OutboxRuntimeEvent;
  handler: (event: OutboxRuntimeEvent, context: Record<string, unknown>) => Promise<void>;
  log?: (message: string) => void;
}): Promise<{ result: string; durationMs: number; correlationId: string }>;
