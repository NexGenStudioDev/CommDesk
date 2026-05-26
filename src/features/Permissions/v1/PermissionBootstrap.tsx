import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUserPermissions,
  getCurrentUser,
  getPermissionErrorMessage,
  permissionQueryKeys,
} from "./permissions.service";
import { usePermissionStore } from "./permissions.store";

export function PermissionBootstrap() {
  const startLoading = usePermissionStore((state) => state.startLoading);
  const setPermissions = usePermissionStore((state) => state.setPermissions);
  const setError = usePermissionStore((state) => state.setError);
  const user = getCurrentUser();

  const query = useQuery({
    queryKey: permissionQueryKeys.byRole(user.role),
    queryFn: () => fetchUserPermissions(user),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.isPending) {
      startLoading();
      return;
    }

    if (query.isError) {
      setError(getPermissionErrorMessage(query.error));
      return;
    }

    if (query.data) {
      setPermissions(query.data);
    }
  }, [query.data, query.error, query.isError, query.isPending, setError, setPermissions, startLoading]);

  return null;
}
