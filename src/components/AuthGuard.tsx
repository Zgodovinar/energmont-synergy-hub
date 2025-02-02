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
  const { session, isLoading, userRole } = useAuth();
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
          console.log('No session, redirecting to auth');
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }

        if (requireAdmin && userRole !== "admin") {
          console.log('User is not admin, redirecting to chat');
          navigate("/chat");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        await supabase.auth.signOut();
        navigate("/auth");
      }
    };

    checkAuthAndRole();
  }, [session, isLoading, userRole, navigate, requireAdmin]);

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