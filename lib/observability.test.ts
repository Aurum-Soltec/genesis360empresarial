import { describe, expect, it, vi } from "vitest";
import { correlationId, withObservedApi } from "./observability";

describe("operational observability", () => {
  it("preserves a safe caller correlation id and rejects unsafe input", () => {
    expect(correlationId(new Request("https://g.test", { headers: { "x-correlation-id": "job:abc-123" } }))).toBe("job:abc-123");
    expect(correlationId(new Request("https://g.test", { headers: { "x-correlation-id": "bad value\n" } }))).toMatch(/^[0-9a-f-]{36}$/);
  });
  it("emits response correlation and duration", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const observed = withObservedApi("test.operation", async (request: Request) => {
      void request;
      return Response.json({ ok: true });
    });
    const response = await observed(new Request("https://g.test/api/test"));
    expect(response.headers.get("x-correlation-id")).toMatch(/^[0-9a-f-]{36}$/);
    expect(response.headers.get("server-timing")).toMatch(/^app;dur=/);
  });
});
