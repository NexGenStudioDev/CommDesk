import { createContext, useContext, useState } from "react";
import type { Permission } from "../types/task.types";

interface PermissionContextValue {
  permissions: Permission[];
  currentUserId: string;
  currentUserName: string;
  hasPermission: (p: Permission) => boolean;
  grantPermission: (p: Permission) => void;
  revokePermission: (p: Permission) => void;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

// Default: member with organizer-level permissions for demo
const DEFAULT_PERMISSIONS: Permission[] = [
  "CREATE_TASK",
  "ASSIGN_TASK",
  "UPDATE_STATUS",
  "EDIT_TASK",
  "DELETE_TASK",
  "MULTIPLE_SUBMISSION",
  "LATE_SUBMISSION",
  "VIEW_ALL_TASKS",
];

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const [permissions, setPermissions] = useState<Permission[]>(DEFAULT_PERMISSIONS);

  const hasPermission = (p: Permission) => permissions.includes(p);

  const grantPermission = (p: Permission) =>
    setPermissions((prev) => (prev.includes(p) ? prev : [...prev, p]));

  const revokePermission = (p: Permission) =>
    setPermissions((prev) => prev.filter((x) => x !== p));

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        currentUserId: "user-1",
        currentUserName: "Arjun Mehta",
        hasPermission,
        grantPermission,
        revokePermission,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionProvider");
  return ctx;
}
