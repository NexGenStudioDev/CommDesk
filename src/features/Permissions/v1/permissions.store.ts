import { create } from "zustand";
import { type Permission } from "./constants";
import { type PermissionStatus } from "./types";

type PermissionStore = {
  permissions: Permission[];
  status: PermissionStatus;
  error: string | null;
  lastLoadedAt: string | null;
  startLoading: () => void;
  setPermissions: (permissions: Permission[]) => void;
  setError: (message: string) => void;
  reset: () => void;
};

const initialState = {
  permissions: [] as Permission[],
  status: "idle" as PermissionStatus,
  error: null as string | null,
  lastLoadedAt: null as string | null,
};

export const usePermissionStore = create<PermissionStore>((set) => ({
  ...initialState,
  startLoading: () =>
    set((state) => ({
      status: state.permissions.length > 0 ? "success" : "loading",
      error: null,
    })),
  setPermissions: (permissions) =>
    set({
      permissions,
      status: "success",
      error: null,
      lastLoadedAt: new Date().toISOString(),
    }),
  setError: (message) =>
    set({
      status: "error",
      error: message,
    }),
  reset: () => set(initialState),
}));
