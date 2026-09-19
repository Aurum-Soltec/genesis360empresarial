import { createClient } from "@supabase/supabase-js";
import { processClaimedEvent, structuredLog } from "./outbox-runtime.mjs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("WORKER_CONFIGURATION_MISSING");

const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const workerId = process.env.WORKER_ID ?? `outbox-${process.pid}`;
const batchSize = Math.min(100, Math.max(1, Number(process.env.WORKER_BATCH_SIZE ?? 25)));
const leaseSeconds = Math.min(900, Math.max(10, Number(process.env.WORKER_LEASE_SECONDS ?? 60)));
const pollMs = Math.min(60_000, Math.max(250, Number(process.env.WORKER_POLL_MS ?? 1000)));
const once = process.argv.includes("--once");

// Existing domain events currently require durable observation only. A concrete
// external effect must register an explicit handler here before its feature is enabled.
const handlers = new Map([
  ["passport.fact.created", async () => {}],
  ["diagnostic.status.changed", async () => {}],
  ["decision.recorded", async () => {}],
  ["mission.created", async () => {}],
  ["mission.status.changed", async () => {}],
  ["mission.outcome.recorded", async () => {}],
  ["provider.qualification.changed", async () => {}],
  ["solution.contact.requested", async () => {}],
]);

async function cycle() {
  const { data: events, error } = await db.rpc("claim_event_outbox", {
    p_worker_id: workerId, p_batch_size: batchSize, p_lease_seconds: leaseSeconds,
  });
  if (error) throw error;
  for (const event of events ?? []) {
    const handler = handlers.get(event.event_type);
    await processClaimedEvent({
      db, workerId, event,
      handler: handler ?? (async () => { throw new Error("UNSUPPORTED_EVENT_TYPE"); }),
    });
  }
  return events?.length ?? 0;
}

console.log(structuredLog("info", "worker.start", { worker: workerId, batch_size: batchSize }));
do {
  try { await cycle(); }
  catch (error) {
    console.error(structuredLog("error", "worker.cycle", {
      worker: workerId, error: error instanceof Error ? error.name : "WORKER_CYCLE_ERROR",
    }));
    if (once) process.exitCode = 1;
  }
  if (!once) await new Promise((resolve) => setTimeout(resolve, pollMs));
} while (!once);
