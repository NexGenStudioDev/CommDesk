import { type ReactNode, useMemo } from "react";
import { type Permission } from "./constants";
import { usePermissionStore } from "./permissions.store";
import {
  type PermissionAccessResult,
  type PermissionCheckMode,
  type PermissionRequirement,
} from "./types";

type AuthorizationOptions = {
  requireAll?: boolean;
};

function normalizePermissions(requirement: PermissionRequirement): Permission[] {
  if (!requirement) {
    return [];
  }

  return Array.isArray(requirement) ? requirement : [requirement];
}

function hasRequiredPermissions(
  grantedPermissions: Permission[],
  requiredPermissions: Permission[],
  mode: PermissionCheckMode,
) {
  if (requiredPermissions.length === 0) {
    return true;
  }

  if (mode === "all") {
    return requiredPermissions.every((permission) => grantedPermissions.includes(permission));
  }

  return requiredPermissions.some((permission) => grantedPermissions.includes(permission));
}

export function useAuthorization(
  requestedPermissions?: PermissionRequirement,
  options: AuthorizationOptions = {},
): PermissionAccessResult {
  const permissions = usePermissionStore((state) => state.permissions);
  const status = usePermissionStore((state) => state.status);
  const error = usePermissionStore((state) => state.error);

  const requested = useMemo(
    () => normalizePermissions(requestedPermissions),
    [requestedPermissions],
  );
  const mode: PermissionCheckMode = options.requireAll ? "all" : "any";
  const hasPermission = hasRequiredPermissions(permissions, requested, mode);

  return {
    hasPermission,
    permissions,
    requestedPermissions: requested,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "success",
    isError: status === "error",
    status,
    error,
  };
}

export function usePermissionMap<T extends Record<string, Permission | Permission[]>>(config: T) {
  const permissions = usePermissionStore((state) => state.permissions);
  const status = usePermissionStore((state) => state.status);
  const error = usePermissionStore((state) => state.error);

  const accessMap = useMemo(() => {
    return Object.entries(config).reduce(
      (result, [key, requirement]) => {
        result[key as keyof T] = hasRequiredPermissions(
          permissions,
          normalizePermissions(requirement),
          "any",
        );

        return result;
      },
      {} as { [Key in keyof T]: boolean },
    );
  }, [config, permissions]);

  return {
    ...accessMap,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "success",
    isError: status === "error",
    error,
  };
}

type PermissionGateProps = {
  permission?: PermissionRequirement;
  requireAll?: boolean;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  children: ReactNode;
};

export function PermissionGate({
  permission,
  requireAll = false,
  fallback = null,
  loadingFallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, isLoading } = useAuthorization(permission, { requireAll });

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

export const IfAuthorized = PermissionGate;
