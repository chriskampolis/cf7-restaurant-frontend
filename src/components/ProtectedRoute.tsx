import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);

  if (!auth) return null; // context not loaded

  return auth.isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;