import type { PermissionSchemaType } from "../types/permission.types";

/**
 * Checks if a user has a specific permission based on their permission array.
 * @param userPermissions Array of permissions the user possesses
 * @param requiredPermission The resource string to check against
 * @returns boolean
 */
export function hasPermission(
  userPermissions: PermissionSchemaType[] | undefined | null,
  requiredPermission: string
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  
  return userPermissions.some(
    (p) => p.resource === requiredPermission
  );
}
