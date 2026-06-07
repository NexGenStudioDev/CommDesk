import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PermissionState } from "../Types/Permission.Type";

const usePermissionStore = create<PermissionState>()(
  persist(
    (set) => ({
      permissions: [],

      setNewPermission: (permission) =>
        set((state) => ({
          permissions: [...state.permissions, permission],
        })),

      setPermissions: (permissions) =>
        set(() => ({
          permissions: permissions,
        })),
    }),
    {
      name: "permission-store",
    },
  ),
);

export default usePermissionStore;
