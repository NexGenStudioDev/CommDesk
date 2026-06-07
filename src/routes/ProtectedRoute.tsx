import { Navigate } from "react-router-dom";
import useAuthStore from "@/features/Auth/v1/Store/Auth.Store";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const user = useAuthStore((state) => state.user);

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Not authorized
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
