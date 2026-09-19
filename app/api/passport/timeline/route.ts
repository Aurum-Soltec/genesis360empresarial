import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const CompanySchema = z.string().uuid();

export async function GET(request: Request) {
  try {
    const context = await requireTenantContext();
    const companyId = new URL(request.url).searchParams.get("companyId");
    if (!CompanySchema.safeParse(companyId).success)
      return NextResponse.json({ error: "INVALID_COMPANY" }, { status: 400 });

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("business_timeline_events")
      .select("id,event_type,occurred_at,actor_type,subject_type,subject_id,payload")
      .eq("tenant_id", context.tenantId)
      .eq("company_id", companyId!)
      .order("occurred_at", { ascending: false })
      .limit(100);

    if (error) return NextResponse.json({ error: "TIMELINE_READ_FAILED" }, { status: 500 });
    return NextResponse.json({ events: data ?? [] });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
