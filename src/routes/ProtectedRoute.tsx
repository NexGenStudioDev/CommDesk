import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  user: { role: string } | null;
}

export default function ProtectedRoute({ children, user }: Props) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Member") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
