export type PermissionState = {
  permissions: PermissionType[] | [];
  setNewPermission: (permission: PermissionType) => void;
  setPermissions: (permissions: PermissionType[]) => void;
};

export type PermissionType = {
  name: string;
  action: "create" | "read" | "update" | "delete"; // create, read, update, delete
  resource: string; // create event , read event, update event, delete event
  description?: string;
  userId: string | null; // Reference to the user who created the permission
};
