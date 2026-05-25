import { type RootState } from "@/store";

export const selectPermissionState = (state: RootState) => state.permissions;
export const selectGrantedPermissions = (state: RootState) => state.permissions.permissions;
export const selectPermissionStatus = (state: RootState) => state.permissions.status;
export const selectPermissionError = (state: RootState) => state.permissions.error;
