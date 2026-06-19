import React from "react";
import usePermissionStore from "../Store/Permission.Store";

type PermissionWrapperProps = {
  requiredPermission: string;
  action: "create" | "read" | "update" | "delete";
  children: React.ReactNode;
};

const PermissionWrapper = ({ requiredPermission, action, children }: PermissionWrapperProps) => {
  const permissions = usePermissionStore((state) => state.permissions);

  const hasPermission = permissions.some(
    (permission) => permission.name === requiredPermission && permission.action === action,
  );

  if (!hasPermission) {
    return null; // or you can return a fallback UI
  }

  return <div>{children}</div>;
};

export default PermissionWrapper;
