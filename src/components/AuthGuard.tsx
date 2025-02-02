import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const { session, isLoading, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        // Only proceed if we have both session and role information
        if (isLoading || userRole === null) {
          return;
        }

        console.log('Checking auth state:', { session: !!session, userRole, requireAdmin });

        if (!session) {
          console.log('No session, signing out and redirecting to auth');
          await signOut(); // This will clear cookies and local storage
          navigate("/auth", { replace: true });
          return;
        }

        if (requireAdmin && userRole !== "admin") {
          console.log('User is not admin, redirecting to chat');
          navigate("/chat", { replace: true });
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        await signOut(); // This will clear cookies and local storage
        navigate("/auth", { replace: true });
      }
    };

    checkAuthAndRole();
  }, [session, isLoading, userRole, navigate, requireAdmin, signOut]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;