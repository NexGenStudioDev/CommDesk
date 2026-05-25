import { type ReactNode, useMemo } from "react";
import { type Permission } from "@/permissions/constants";
import { selectPermissionState } from "@/permissions/selectors";
import { type PermissionAccessResult, type PermissionCheckMode, type PermissionRequirement } from "@/permissions/types";
import { hasRequiredPermissions, normalizePermissions } from "@/permissions/utils";
import { useAppSelector } from "@/store/hooks";

type AuthorizationOptions = {
  requireAll?: boolean;
};

export function useAuthorization(
  requestedPermissions?: PermissionRequirement,
  options: AuthorizationOptions = {},
) : PermissionAccessResult {
  const { permissions, status, error } = useAppSelector(selectPermissionState);
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
    isLoading: status === "loading" || status === "idle",
    isReady: status === "success",
    isError: status === "error",
    status,
    error,
  };
}

export function usePermissionMap<T extends Record<string, Permission | Permission[]>>(config: T) {
  const { permissions, status, error } = useAppSelector(selectPermissionState);

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
      {} as { [K in keyof T]: boolean },
    );
  }, [config, permissions]);

  return {
    ...accessMap,
    isLoading: status === "loading" || status === "idle",
    isReady: status === "success",
    isError: status === "error",
    error,
  };
}

type IfAuthorizedProps = {
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
}: IfAuthorizedProps) {
  const { hasPermission, isLoading } = useAuthorization(permission, { requireAll });

  if (isLoading) return <>{loadingFallback}</>;

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

export const IfAuthorized = PermissionGate;
