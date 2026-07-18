import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { ready, isAdmin } = useAuth();

  if (!ready) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
