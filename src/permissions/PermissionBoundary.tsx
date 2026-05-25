import { type ReactNode } from "react";
import { useAuthorization } from "@/permissions/useAuthorization";
import { type PermissionRequirement } from "@/permissions/types";

type PermissionBoundaryProps = {
  permission?: PermissionRequirement;
  requireAll?: boolean;
  loadingFallback?: ReactNode;
  unauthorizedFallback?: ReactNode;
  children: ReactNode;
};

const PermissionBoundary = ({
  permission,
  requireAll = false,
  loadingFallback = null,
  unauthorizedFallback = null,
  children,
}: PermissionBoundaryProps) => {
  const { isLoading, hasPermission } = useAuthorization(permission, { requireAll });

  if (isLoading) return <>{loadingFallback}</>;
  if (!hasPermission) return <>{unauthorizedFallback}</>;

  return <>{children}</>;
};

export default PermissionBoundary;
