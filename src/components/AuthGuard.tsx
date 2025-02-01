import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const { session, isLoading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Clear any stale session data
        await supabase.auth.signOut();
        navigate("/auth");
      }
    };

    if (!isLoading) {
      checkSession();
      if (requireAdmin && userRole !== "admin") {
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