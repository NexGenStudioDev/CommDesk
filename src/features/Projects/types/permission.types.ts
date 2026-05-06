export type PermissionAction = "create" | "read" | "update" | "delete";

export type PermissionSchemaType = {
  name: string;
  action: PermissionAction;
  resource: string;
  description?: string;
  userId: string | null;
};
