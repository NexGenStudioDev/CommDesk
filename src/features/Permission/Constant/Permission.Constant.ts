export type PermissionConstantItem = {
  name: string;
  action: "create" | "read" | "update" | "delete";
  resource: string;
  description?: string;
  level: number;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const MemberPermissionConstant = {
  create: "member:create",
  read: "member:read",
  update: "member:update",
  delete: "member:delete",
};
