import { type Permission } from "@/permissions/constants";
import { type PermissionCheckMode, type PermissionRequirement } from "@/permissions/types";

export function normalizePermissions(requirement: PermissionRequirement): Permission[] {
  if (!requirement) return [];
  return Array.isArray(requirement) ? requirement : [requirement];
}

export function hasRequiredPermissions(
  grantedPermissions: Permission[],
  requiredPermissions: Permission[],
  mode: PermissionCheckMode = "any",
) {
  if (requiredPermissions.length === 0) return true;

  return mode === "all"
    ? requiredPermissions.every((permission) => grantedPermissions.includes(permission))
    : requiredPermissions.some((permission) => grantedPermissions.includes(permission));
}

export function toErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unable to load permissions.";
}
