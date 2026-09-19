import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ACTIVE_TENANT_COOKIE } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const RequestSchema = z.object({ tenantId: z.string().uuid() });

export async function POST(request: Request) {
  try {
  assertSameOrigin(request);
  const parsed = RequestSchema.safeParse(await readJsonBody(request));
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_TENANT" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("tenant_id")
    .eq("tenant_id", parsed.data.tenantId)
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "TENANT_ACCESS_DENIED" }, { status: 403 });
  }

  const response = NextResponse.json({ tenantId: membership.tenant_id });
  response.cookies.set(ACTIVE_TENANT_COOKIE, membership.tenant_id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
