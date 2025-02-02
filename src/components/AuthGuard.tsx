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
        console.log('Checking session and role...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }

        if (!currentSession) {
          console.log('No session found, redirecting to auth...');
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }

        // Wait for userRole to be available
        if (userRole === null) {
          console.log('Waiting for user role...');
          return;
        }

        console.log('User role available:', userRole, 'requireAdmin:', requireAdmin);
        if (requireAdmin && userRole !== "admin") {
          console.log('User is not admin, redirecting to chat...');
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

    if (!isLoading) {
      checkAuthAndRole();
    }
  }, [session, isLoading, userRole, navigate, requireAdmin]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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