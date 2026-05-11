import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserPermissions, getCurrentUser, permissionQueryKeys } from "@/permissions/permission.service";
import { toErrorMessage } from "@/permissions/utils";
import { useAppDispatch } from "@/store/hooks";
import { setPermissionError, setPermissions, setPermissionStatus } from "@/store/permissionsSlice";

export function PermissionBootstrap() {
  const dispatch = useAppDispatch();
  const user = getCurrentUser();
  const query = useQuery({
    queryKey: permissionQueryKeys.byRole(user.role),
    queryFn: () => fetchUserPermissions(user),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.isPending) {
      dispatch(setPermissionStatus("loading"));
      return;
    }

    if (query.isError) {
      dispatch(setPermissionError(toErrorMessage(query.error)));
      return;
    }

    if (query.data) {
      dispatch(
        setPermissions({
          permissions: query.data,
          syncedAt: new Date().toISOString(),
        }),
      );
    }
  }, [dispatch, query.data, query.error, query.isError, query.isPending]);

  return null;
}
