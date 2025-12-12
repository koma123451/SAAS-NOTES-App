import { useUserStore } from "../store/user";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const user = useUserStore((s) => s.user);
  const fetchUser = useUserStore((s) => s.fetchUser);
  const loading = useUserStore((s) => s.loading);

  useEffect(() => {
    if (!user) fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}
