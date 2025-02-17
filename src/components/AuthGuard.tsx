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
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session state...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          await signOut();
          navigate("/auth");
          return;
        }

        console.log('Current session:', currentSession ? 'exists' : 'none');
        
        if (!currentSession) {
          console.log('No session found, redirecting to auth...');
          await signOut();
          navigate("/auth");
          return;
        }

        if (requireAdmin && userRole !== "admin") {
          console.log('User is not admin, redirecting...');
          navigate("/chat");
        }
      } catch (error) {
        console.error('Session check failed:', error);
        await signOut();
        navigate("/auth");
      } finally {
        setIsCheckingSession(false);
      }
    };

    if (!isLoading) {
      checkSession();
    }
  }, [session, isLoading, userRole, navigate, requireAdmin, signOut]);

  if (isLoading || isCheckingSession) {
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