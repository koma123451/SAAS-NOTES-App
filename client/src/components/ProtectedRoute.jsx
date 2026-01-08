import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/user";

export default function ProtectedRoute({ children }) {
  const { user, initialized } = useUserStore();

  // Authentication status not yet determined, show loading
  if (!initialized) {
    return <div>Loading...</div>;
  }

  // Not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if(user.role==="admin"){
    return <Navigate to="/admin" replace />;
  }
  // Authenticated, allow access
  return children;
}
