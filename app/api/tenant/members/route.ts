import { NextResponse } from "next/server";
import { z } from "zod";
import { apiErrorDetails } from "@/lib/api-errors";
import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { requireTenantContext } from "@/lib/tenant-context";
import {
  inviteTenantMember, listTenantMembers, removeTenantMember, updateTenantMemberRole,
} from "@/lib/server/trusted-data-access";

const role = z.enum(["owner", "admin", "manager", "member", "specialist", "auditor"]);
const invite = z.object({ email: z.string().email().max(254), role: role.exclude(["owner"]) });
const update = z.object({ userId: z.string().uuid(), role });
const remove = z.object({ userId: z.string().uuid() });

function failure(error: unknown) {
  const details = apiErrorDetails(error);
  return NextResponse.json({ error: details.code }, { status: details.status });
}

export async function GET() {
  try {
    const result = await listTenantMembers(await requireTenantContext());
    if (result.error) throw new Error("MEMBERSHIP_READ_FAILED");
    return NextResponse.json({ members: result.data });
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const parsed = invite.safeParse(await readJsonBody(request));
    if (!parsed.success) return NextResponse.json({ error: "INVALID_MEMBER" }, { status: 400 });
    const member = await inviteTenantMember(await requireTenantContext(), {
      ...parsed.data, redirectTo: `${new URL(request.url).origin}/auth/callback?next=/nova-senha`,
    });
    return NextResponse.json({ member }, { status: 201 });
  } catch (error) { return failure(error); }
}

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const parsed = update.safeParse(await readJsonBody(request));
    if (!parsed.success) return NextResponse.json({ error: "INVALID_MEMBER" }, { status: 400 });
    const member = await updateTenantMemberRole(await requireTenantContext(), parsed.data.userId, parsed.data.role);
    return NextResponse.json({ member });
  } catch (error) { return failure(error); }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const parsed = remove.safeParse(await readJsonBody(request));
    if (!parsed.success) return NextResponse.json({ error: "INVALID_MEMBER" }, { status: 400 });
    await removeTenantMember(await requireTenantContext(), parsed.data.userId);
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}
