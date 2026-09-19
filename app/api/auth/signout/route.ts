import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/http-security";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ACTIVE_TENANT_COOKIE } from "@/lib/tenant-context";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(ACTIVE_TENANT_COOKIE);
    return response;
  } catch {
    return NextResponse.json({ error: "SIGNOUT_FAILED" }, { status: 400 });
  }
}
