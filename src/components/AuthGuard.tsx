import { useEffect } from "react";
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

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        navigate("/auth");
      } else if (requireAdmin && userRole !== "admin") {
        navigate("/chat");
      }
    }
  }, [session, isLoading, userRole, navigate, requireAdmin]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!session) {
    return null;
  }

  // Don't render if admin access is required but user is not admin
  if (requireAdmin && userRole !== "admin") {
    return null;
  }

  // Only render children when all checks pass
  return <>{children}</>;
};

export default AuthGuard;