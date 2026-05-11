import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Permission } from "@/permissions/constants";
import { type PermissionStatus } from "@/permissions/types";

type PermissionState = {
  permissions: Permission[];
  status: PermissionStatus;
  error: string | null;
  lastUpdatedAt: string | null;
};

const initialState: PermissionState = {
  permissions: [],
  status: "idle",
  error: null,
  lastUpdatedAt: null,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissionStatus(state, action: PayloadAction<PermissionState["status"]>) {
      state.status = action.payload;
    },
    setPermissions(
      state,
      action: PayloadAction<{ permissions: Permission[]; syncedAt: string }>,
    ) {
      state.permissions = action.payload.permissions;
      state.status = "success";
      state.error = null;
      state.lastUpdatedAt = action.payload.syncedAt;
    },
    setPermissionError(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
    },
    clearPermissions(state) {
      state.permissions = [];
      state.status = "idle";
      state.error = null;
      state.lastUpdatedAt = null;
    },
  },
});

export const { clearPermissions, setPermissions, setPermissionError, setPermissionStatus } =
  permissionsSlice.actions;
export const permissionsReducer = permissionsSlice.reducer;
