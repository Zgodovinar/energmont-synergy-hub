import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const { session, isLoading, userRole } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        navigate("/auth");
        setIsAuthorized(false);
      } else if (requireAdmin && userRole !== "admin") {
        navigate("/chat");
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    }
  }, [session, isLoading, userRole, navigate, requireAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;