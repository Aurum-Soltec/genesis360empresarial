import { describe, expect, it, vi } from "vitest";
import { processClaimedEvent, retryDelaySeconds } from "./outbox-runtime.mjs";

const event = {
  id: "10000000-0000-4000-8000-000000000001", tenant_id: "20000000-0000-4000-8000-000000000002",
  company_id: null, event_type: "test", payload: {}, attempts: 1, max_attempts: 3,
};

function database() {
  const insert = vi.fn().mockResolvedValue({ error: null });
  return { rpc: vi.fn().mockResolvedValue({ error: null }), from: vi.fn(() => ({ insert })), insert };
}

describe("outbox runtime", () => {
  it("uses bounded exponential backoff", () => {
    expect([1, 2, 3, 20].map((attempt) => retryDelaySeconds(attempt))).toEqual([5, 10, 20, 3600]);
  });
  it("completes and records a successful event", async () => {
    const db = database();
    const result = await processClaimedEvent({ db, workerId: "worker-a", event, handler: vi.fn(), log: vi.fn() });
    expect(result.result).toBe("processed");
    expect(db.rpc).toHaveBeenCalledWith("complete_event_outbox", expect.any(Object));
    expect(db.insert).toHaveBeenCalledWith(expect.objectContaining({ result: "processed", tenant_id: event.tenant_id }));
  });
  it("fails safely and records retry metadata", async () => {
    const db = database();
    const handler = vi.fn().mockRejectedValue(new Error("provider unavailable"));
    const result = await processClaimedEvent({ db, workerId: "worker-a", event, handler, log: vi.fn() });
    expect(result.result).toBe("failed");
    expect(db.rpc).toHaveBeenCalledWith("fail_event_outbox", expect.objectContaining({ p_retry_seconds: 5 }));
  });
});
