import { dashboardData } from "@/features/Member/v1/mock/dashboardData";
import { type User } from "@/features/Dashboard/Member/v1/Type/dashboard";
import {
  App_Permissions,
  Contact_Permissions,
  Event_Permissions,
  Member_Permissions,
  Project_Permissions,
  type Permission,
} from "@/permissions/constants";
import { type PermissionQueryUser } from "@/permissions/types";

const ROLE_PERMISSION_MAP: Record<User["role"], Permission[]> = {
  Admin: Object.values(App_Permissions),
  Member: [
    Event_Permissions.VIEW_EVENT,
    Event_Permissions.JOIN_EVENT,
    Event_Permissions.LEAVE_EVENT,
    Member_Permissions.VIEW_MEMBER,
    Contact_Permissions.VIEW_CONTACT_DIRECTORY,
    Contact_Permissions.SUBMIT_SUPPORT_TICKET,
    Project_Permissions.VIEW_PROJECT,
  ],
};

export const permissionQueryKeys = {
  all: ["permissions"] as const,
  byRole: (role: string) => [...permissionQueryKeys.all, role] as const,
};

export async function fetchUserPermissions(user: PermissionQueryUser = getCurrentUser()): Promise<Permission[]> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return ROLE_PERMISSION_MAP[user.role as User["role"]] ?? [];
}

export function getCurrentUser(): PermissionQueryUser {
  return dashboardData.user;
}
