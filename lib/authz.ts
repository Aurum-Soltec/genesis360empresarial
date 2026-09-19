export const ManagementRoles = ["owner", "admin", "manager"] as const;
export type ManagementRole = (typeof ManagementRoles)[number];

export function hasAnyRole(
  role: string,
  allowed: readonly string[],
): boolean {
  return allowed.includes(role);
}

export function isManagementRole(role: string): role is ManagementRole {
  return hasAnyRole(role, ManagementRoles);
}

export const KnownTenantRoles = ["owner", "admin", "manager", "member", "specialist", "auditor"] as const;
export type TenantPermission =
  | "diagnostic:write" | "passport:write" | "evidence:write" | "decision:write"
  | "mission:write" | "solutions:contact" | "upload:create"
  | "consent:self" | "attestation:self";

const PermissionRoles: Record<TenantPermission, readonly string[]> = {
  "diagnostic:write": ManagementRoles,
  "passport:write": ManagementRoles,
  "evidence:write": ManagementRoles,
  "decision:write": ManagementRoles,
  "mission:write": ManagementRoles,
  "solutions:contact": ManagementRoles,
  "upload:create": ManagementRoles,
  "consent:self": KnownTenantRoles,
  "attestation:self": KnownTenantRoles,
};

export function hasTenantPermission(role: string, permission: TenantPermission): boolean {
  return PermissionRoles[permission]?.includes(role) === true;
}

export function assertTenantPermission(role: string, permission: TenantPermission): void {
  if (!hasTenantPermission(role, permission)) throw new Error("ROLE_NOT_ALLOWED");
}
