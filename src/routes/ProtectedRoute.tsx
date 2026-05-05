import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  user: { role: string } | null;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, user, allowedRoles }: Props) {
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
