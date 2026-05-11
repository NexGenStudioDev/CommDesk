import { type Permission } from "@/permissions/constants";

export type PermissionStatus = "idle" | "loading" | "success" | "error";
export type PermissionRequirement = Permission | Permission[] | undefined;
export type PermissionCheckMode = "any" | "all";

export type PermissionQueryUser = {
  name: string;
  role: string;
};

export type PermissionAccessResult = {
  hasPermission: boolean;
  permissions: Permission[];
  requestedPermissions: Permission[];
  isLoading: boolean;
  isReady: boolean;
  isError: boolean;
  status: PermissionStatus;
  error: string | null;
};
