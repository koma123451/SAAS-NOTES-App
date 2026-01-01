import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useUserStore } from "../store/user";

export default function AdminRoute() {
  const { user, initialized } = useUserStore();
  const toast = useToast();

  useEffect(() => {
    if (initialized && user && user.role !== "admin") {
      toast({
        title: "Access denied",
        description: "Admin permission required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [initialized, user, toast]);

  if (!initialized) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
