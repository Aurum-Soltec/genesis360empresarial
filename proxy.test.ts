import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const createServerClient = vi.fn();

vi.mock("@supabase/ssr", () => ({ createServerClient }));

describe("request proxy", () => {
  beforeEach(() => {
    createServerClient.mockReset();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "public-anon-key";
  });

  it("preserves correlation without duplicating hosted auth for API routes", async () => {
    const { proxy } = await import("./proxy");
    const response = await proxy(new NextRequest("https://genesis.test/api/tenant/active", {
      headers: { "x-correlation-id": "hsp4-performance-proof" },
    }));

    expect(response.headers.get("x-correlation-id")).toBe("hsp4-performance-proof");
    expect(createServerClient).not.toHaveBeenCalled();
  });

  it("verifies claims for the page guard without a duplicate Auth user lookup", async () => {
    const getUser = vi.fn();
    const getClaims = vi.fn().mockResolvedValue({ data: { claims: null } });
    createServerClient.mockReturnValue({
      auth: { getClaims, getUser },
    });
    const { proxy } = await import("./proxy");
    const response = await proxy(new NextRequest("https://genesis.test/missoes"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://genesis.test/entrar?next=%2Fmissoes");
    expect(createServerClient).toHaveBeenCalledOnce();
    expect(getClaims).toHaveBeenCalledOnce();
    expect(getUser).not.toHaveBeenCalled();
  });

  it("passes a verified user to the page's independent tenant authorization", async () => {
    const getUser = vi.fn();
    const getClaims = vi.fn().mockResolvedValue({ data: { claims: { sub: "user-id" } } });
    createServerClient.mockReturnValue({ auth: { getClaims, getUser } });
    const { proxy } = await import("./proxy");
    const response = await proxy(new NextRequest("https://genesis.test/missoes"));

    expect(response.status).toBe(200);
    expect(getClaims).toHaveBeenCalledOnce();
    expect(getUser).not.toHaveBeenCalled();
  });
});
