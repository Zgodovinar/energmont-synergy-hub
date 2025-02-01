import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const { session, isLoading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        navigate("/auth");
      } else if (requireAdmin && userRole !== "admin") {
        navigate("/");
      }
    }
  }, [session, isLoading, userRole, navigate, requireAdmin]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  if (requireAdmin && userRole !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;