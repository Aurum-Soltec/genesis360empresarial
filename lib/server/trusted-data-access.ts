import type { GdsRecord } from "@/lib/gds";
import type { TenantContext } from "@/lib/tenant-context";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type TrustedRpcName =
  | "accept_data_submission_attestation"
  | "create_document_upload_session"
  | "create_mission_from_decision"
  | "persist_diagnostic_result_v1_2_1"
  | "record_business_fact"
  | "record_evidence"
  | "record_mission_evidence"
  | "record_mission_outcome"
  | "save_diagnostic_answer_v1_2_1";

const rpcIdentity: Record<
  TrustedRpcName,
  { tenant: string; actor?: string }
> = {
  accept_data_submission_attestation: { tenant: "p_tenant_id", actor: "p_user_id" },
  create_document_upload_session: { tenant: "p_tenant_id", actor: "p_user_id" },
  create_mission_from_decision: { tenant: "p_tenant_id" },
  persist_diagnostic_result_v1_2_1: { tenant: "p_tenant_id", actor: "p_actor_id" },
  record_business_fact: { tenant: "p_tenant_id", actor: "p_created_by" },
  record_evidence: { tenant: "p_tenant_id", actor: "p_created_by" },
  record_mission_evidence: { tenant: "p_tenant_id", actor: "p_created_by" },
  record_mission_outcome: { tenant: "p_tenant_id", actor: "p_created_by" },
  save_diagnostic_answer_v1_2_1: { tenant: "p_tenant_id", actor: "p_actor_id" },
};

async function trustedAdmin(ctx: TenantContext) {
  if (!UUID.test(ctx.tenantId) || !UUID.test(ctx.userId)) {
    throw new Error("TRUSTED_CONTEXT_INVALID");
  }
  const admin = createSupabaseAdminClient();
  const { data: membership, error } = await admin
    .from("memberships")
    .select("tenant_id,user_id,role")
    .eq("tenant_id", ctx.tenantId)
    .eq("user_id", ctx.userId)
    .maybeSingle();
  if (error || !membership || membership.role !== ctx.role) {
    throw new Error("TRUSTED_CONTEXT_DENIED");
  }
  return admin;
}

// Cross-tenant platform reads are confined to reviewed server repositories.
// API routes must use domain services and never receive this client directly.
export async function trustedPlatformReadClient(ctx: TenantContext) {
  return trustedAdmin(ctx);
}

export async function trustedTenantRpc(
  ctx: TenantContext,
  name: TrustedRpcName,
  parameters: Record<string, unknown>,
) {
  const admin = await trustedAdmin(ctx);
  const identity = rpcIdentity[name];
  const scoped = { ...parameters, [identity.tenant]: ctx.tenantId };
  if (identity.actor) scoped[identity.actor] = ctx.userId;
  return admin.rpc(name, scoped);
}

export async function insertConsentDecision(
  ctx: TenantContext,
  input: {
    companyId: string | null;
    consentVersionId: string;
    purposeCode: string;
    granted: boolean;
    decisionAt: string;
  },
) {
  const admin = await trustedAdmin(ctx);
  if (input.companyId) {
    const { data: company } = await admin
      .from("companies")
      .select("id")
      .eq("id", input.companyId)
      .eq("tenant_id", ctx.tenantId)
      .maybeSingle();
    if (!company) throw new Error("COMPANY_TENANT_MISMATCH");
  }
  return admin.from("consents").insert({
    tenant_id: ctx.tenantId,
    company_id: input.companyId,
    user_id: ctx.userId,
    consent_version_id: input.consentVersionId,
    purpose_code: input.purposeCode,
    purpose: input.purposeCode,
    granted: input.granted,
    granted_at: input.granted ? input.decisionAt : null,
    revoked_at: input.granted ? null : input.decisionAt,
    decision_at: input.decisionAt,
  });
}

export async function startDiagnostic(
  ctx: TenantContext,
  input: {
    companyId: string;
    diagnosticVersionId: string;
    profileCode: "ESSENTIAL" | "FULL";
    strategyVersion: string;
    contextSnapshot: unknown;
    rulesVersion: string;
    confidenceRuleVersion: string;
    estimatedQuestionCount: number;
  },
) {
  const admin = await trustedAdmin(ctx);
  const { data: company } = await admin
    .from("companies")
    .select("id")
    .eq("id", input.companyId)
    .eq("tenant_id", ctx.tenantId)
    .maybeSingle();
  if (!company) throw new Error("COMPANY_TENANT_MISMATCH");
  return admin
    .from("diagnostics")
    .insert({
      tenant_id: ctx.tenantId,
      company_id: input.companyId,
      diagnostic_version_id: input.diagnosticVersionId,
      profile_code: input.profileCode,
      strategy_version: input.strategyVersion,
      status: "draft",
      context_snapshot: input.contextSnapshot,
      rules_version: input.rulesVersion,
      confidence_rule_version: input.confidenceRuleVersion,
      progress_percent: 0,
      confidence_level: "LOW",
      estimated_question_count: input.estimatedQuestionCount,
    })
    .select("id,profile_code,status,started_at")
    .single();
}

export async function recordDecisionFromPain(
  ctx: TenantContext,
  painId: string,
  gds: GdsRecord,
) {
  const admin = await trustedAdmin(ctx);
  const { data: pain, error: painError } = await admin
    .from("pain_findings")
    .select("id,company_id,diagnostic_id")
    .eq("id", painId)
    .eq("tenant_id", ctx.tenantId)
    .maybeSingle();
  if (painError || !pain) throw new Error("PAIN_NOT_FOUND");
  return admin
    .from("decision_records")
    .insert({
      tenant_id: ctx.tenantId,
      company_id: pain.company_id,
      diagnostic_id: pain.diagnostic_id,
      pain_finding_id: pain.id,
      problem: gds.problem,
      evidence_refs: gds.evidenceRefs,
      gaps: gds.gaps,
      cause_hypotheses: gds.causeHypotheses,
      alternatives: gds.alternatives,
      recommendation: gds.recommendation,
      expected_impact: gds.expectedImpact,
      risks: gds.risks,
      confidence: gds.confidence,
      validation_plan: gds.validationPlan,
      proposed_mission_code: gds.proposedMissionCode ?? null,
      metric: gds.metric,
      source_type: "rule",
      source_version: "gds-v1",
    })
    .select("id,problem,recommendation,confidence,validation_plan")
    .single();
}

export async function transitionMission(
  ctx: TenantContext,
  input: {
    missionId: string;
    expectedStatus: string;
    targetStatus: string;
    changedAt: string;
  },
) {
  const admin = await trustedAdmin(ctx);
  const patch: Record<string, string> = {
    status: input.targetStatus,
    updated_at: input.changedAt,
  };
  if (input.targetStatus === "ACCEPTED") patch.accepted_at = input.changedAt;
  if (input.targetStatus === "COMPLETED") patch.completed_at = input.changedAt;
  return admin
    .from("missions")
    .update(patch)
    .eq("id", input.missionId)
    .eq("tenant_id", ctx.tenantId)
    .eq("status", input.expectedStatus)
    .select("id,status")
    .maybeSingle();
}

export async function createSolutionContactRequest(
  ctx: TenantContext,
  input: {
    consumerCompanyId: string;
    painId: string;
    providerCapabilityId: string;
    consumerConsentId: string;
    matchSnapshot: Record<string, unknown>;
  },
) {
  const admin = await trustedAdmin(ctx);
  const [{ data: pain }, { data: consent }, { data: provider }] = await Promise.all([
    admin.from("pain_findings").select("id").eq("id", input.painId)
      .eq("tenant_id", ctx.tenantId).eq("company_id", input.consumerCompanyId).maybeSingle(),
    admin.from("consents").select("id").eq("id", input.consumerConsentId)
      .eq("tenant_id", ctx.tenantId).eq("company_id", input.consumerCompanyId)
      .eq("user_id", ctx.userId).eq("granted", true).is("revoked_at", null).maybeSingle(),
    admin.from("provider_capabilities").select("tenant_id,company_id,capability_id")
      .eq("id", input.providerCapabilityId).eq("qualification_status", "qualified").maybeSingle(),
  ]);
  if (!pain || !consent) throw new Error("TRUSTED_CONTACT_SCOPE_DENIED");
  if (!provider) throw new Error("PROVIDER_NOT_FOUND");
  return admin
    .from("solution_contact_requests")
    .insert({
      consumer_tenant_id: ctx.tenantId,
      consumer_company_id: input.consumerCompanyId,
      provider_tenant_id: provider.tenant_id,
      provider_company_id: provider.company_id,
      provider_capability_id: input.providerCapabilityId,
      pain_finding_id: input.painId,
      capability_id: provider.capability_id,
      consumer_consent_id: input.consumerConsentId,
      requested_by: ctx.userId,
      match_snapshot: input.matchSnapshot,
    })
    .select("id,status,requested_at")
    .single();
}

export type MembershipRole = "owner" | "admin" | "manager" | "member" | "specialist" | "auditor";

async function managementAdmin(ctx: TenantContext) {
  const admin = await trustedAdmin(ctx);
  if (ctx.role !== "owner" && ctx.role !== "admin") {
    throw new Error("MEMBERSHIP_MANAGEMENT_DENIED");
  }
  return admin;
}

async function assertOwnerContinuity(
  admin: Awaited<ReturnType<typeof managementAdmin>>,
  tenantId: string,
  targetUserId: string,
  replacementRole?: MembershipRole,
) {
  const { data: target } = await admin.from("memberships").select("role")
    .eq("tenant_id", tenantId).eq("user_id", targetUserId).maybeSingle();
  if (!target) throw new Error("MEMBER_NOT_FOUND");
  if (target.role !== "owner" || replacementRole === "owner") return;
  const { count } = await admin.from("memberships").select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId).eq("role", "owner");
  if ((count ?? 0) <= 1) throw new Error("LAST_OWNER_REQUIRED");
}

export async function listTenantMembers(ctx: TenantContext) {
  const admin = await managementAdmin(ctx);
  const { data, error } = await admin.from("memberships")
    .select("user_id,role,created_at").eq("tenant_id", ctx.tenantId)
    .order("created_at", { ascending: true });
  if (error) return { data: null, error };
  const members = await Promise.all((data ?? []).map(async (membership) => {
    const { data: user } = await admin.auth.admin.getUserById(membership.user_id);
    return { ...membership, email: user.user?.email ?? null };
  }));
  return { data: members, error: null };
}

export async function inviteTenantMember(
  ctx: TenantContext,
  input: { email: string; role: Exclude<MembershipRole, "owner">; redirectTo: string },
) {
  const admin = await managementAdmin(ctx);
  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    input.email,
    { redirectTo: input.redirectTo, data: { invited_tenant_id: ctx.tenantId } },
  );
  if (inviteError || !invited.user) throw new Error("INVITATION_FAILED");
  const { error } = await admin.from("memberships").upsert({
    tenant_id: ctx.tenantId,
    user_id: invited.user.id,
    role: input.role,
  }, { onConflict: "tenant_id,user_id" });
  if (error) throw new Error("INVITATION_FAILED");
  await admin.from("audit_events").insert({
    tenant_id: ctx.tenantId, actor_id: ctx.userId, action: "membership.invited",
    resource_type: "membership", resource_id: invited.user.id,
    metadata: { role: input.role },
  });
  return { userId: invited.user.id, email: input.email, role: input.role };
}

export async function updateTenantMemberRole(
  ctx: TenantContext,
  targetUserId: string,
  role: MembershipRole,
) {
  const admin = await managementAdmin(ctx);
  if (role === "owner" && ctx.role !== "owner") throw new Error("MEMBERSHIP_MANAGEMENT_DENIED");
  await assertOwnerContinuity(admin, ctx.tenantId, targetUserId, role);
  const { data, error } = await admin.from("memberships").update({ role })
    .eq("tenant_id", ctx.tenantId).eq("user_id", targetUserId)
    .select("user_id,role").maybeSingle();
  if (error || !data) throw new Error("MEMBER_NOT_FOUND");
  await admin.from("audit_events").insert({
    tenant_id: ctx.tenantId, actor_id: ctx.userId, action: "membership.role_changed",
    resource_type: "membership", resource_id: targetUserId, metadata: { role },
  });
  return data;
}

export async function removeTenantMember(ctx: TenantContext, targetUserId: string) {
  const admin = await managementAdmin(ctx);
  if (targetUserId === ctx.userId) throw new Error("MEMBERSHIP_MANAGEMENT_DENIED");
  await assertOwnerContinuity(admin, ctx.tenantId, targetUserId);
  const { error } = await admin.from("memberships").delete()
    .eq("tenant_id", ctx.tenantId).eq("user_id", targetUserId);
  if (error) throw new Error("MEMBER_NOT_FOUND");
  await admin.from("audit_events").insert({
    tenant_id: ctx.tenantId, actor_id: ctx.userId, action: "membership.removed",
    resource_type: "membership", resource_id: targetUserId,
  });
}

const allowedUploadTypes = new Set(["application/pdf", "image/png", "image/jpeg", "text/csv"]);
const uploadBucket = "genesis-private-documents";

export async function createDocumentUploadTarget(
  ctx: TenantContext,
  input: { sessionId: string; fileName: string; mediaType: string; sizeBytes: number; sha256: string },
) {
  if (!allowedUploadTypes.has(input.mediaType) || input.sizeBytes < 1 || input.sizeBytes > 10_485_760 ||
      !/^[a-f0-9]{64}$/i.test(input.sha256)) throw new Error("UPLOAD_FILE_REJECTED");
  const admin = await trustedAdmin(ctx);
  const { data: session } = await admin.from("document_upload_sessions")
    .select("id,tenant_id,company_id,user_id,status,expires_at")
    .eq("id", input.sessionId).eq("tenant_id", ctx.tenantId).eq("user_id", ctx.userId).maybeSingle();
  if (!session || !["CREATED", "UPLOADING"].includes(session.status) || new Date(session.expires_at) <= new Date()) {
    throw new Error("UPLOAD_SESSION_INVALID");
  }
  const { data: quota } = await admin.from("tenant_storage_quotas").select("max_bytes,retention_days")
    .eq("tenant_id", ctx.tenantId).maybeSingle();
  const { data: items } = await admin.from("document_upload_items").select("size_bytes")
    .eq("tenant_id", ctx.tenantId).neq("status", "DELETED");
  const used = (items ?? []).reduce((sum, item) => sum + Number(item.size_bytes ?? 0), 0);
  if (used + input.sizeBytes > Number(quota?.max_bytes ?? 1_073_741_824)) throw new Error("STORAGE_QUOTA_EXCEEDED");
  const itemId = crypto.randomUUID();
  const safeName = input.fileName.normalize("NFKC").replace(/[^A-Za-z0-9._-]/g, "_").slice(-120) || "document";
  const storageRef = `${ctx.tenantId}/${session.company_id}/${session.id}/${itemId}/${safeName}`;
  const retentionDays = Number(quota?.retention_days ?? 365);
  const retentionUntil = new Date(Date.now() + retentionDays * 86_400_000).toISOString();
  const { error: itemError } = await admin.from("document_upload_items").insert({
    id: itemId, tenant_id: ctx.tenantId, company_id: session.company_id,
    upload_session_id: session.id, storage_ref: storageRef, file_name: safeName,
    media_type: input.mediaType, size_bytes: input.sizeBytes, sha256: input.sha256.toLowerCase(),
    status: "PENDING", scan_status: "PENDING", retention_until: retentionUntil,
  });
  if (itemError) throw new Error("UPLOAD_TARGET_FAILED");
  const { data: signed, error: signedError } = await admin.storage.from(uploadBucket).createSignedUploadUrl(storageRef);
  if (signedError || !signed) throw new Error("UPLOAD_TARGET_FAILED");
  await admin.from("document_upload_sessions").update({ status: "UPLOADING", updated_at: new Date().toISOString() })
    .eq("id", session.id).eq("tenant_id", ctx.tenantId);
  return { itemId, path: storageRef, token: signed.token, signedUrl: signed.signedUrl, scanStatus: "PENDING" };
}
