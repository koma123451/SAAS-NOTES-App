import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/user";

export default function ProtectedRoute({ children }) {
  const { user, initialized } = useUserStore();

  // 还没判定完登录态，什么都不做
  if (!initialized) {
    return <div>Loading...</div>;
  }

  // 已判定，但没登录
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 已登录，放行
  return children;
}
