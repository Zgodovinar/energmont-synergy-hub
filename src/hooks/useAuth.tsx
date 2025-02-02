import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'worker' | null>(() => {
    // Initialize from localStorage if available
    const storedRole = localStorage.getItem('userRole');
    return (storedRole as 'admin' | 'worker' | null) || null;
  });

  const fetchUserRole = useCallback(async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      console.log('User role fetched:', data.role);
      setUserRole(data.role);
      localStorage.setItem('userRole', data.role);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', currentSession?.user?.id);
        
        if (mounted) {
          setSession(currentSession);
          
          if (currentSession?.user) {
            await fetchUserRole(currentSession.user.id);
          } else {
            setUserRole(null);
            localStorage.removeItem('userRole');
          }
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', session?.user?.id);
      
      if (mounted) {
        setSession(session);
        
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
          localStorage.removeItem('userRole');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  const clearAllCookies = () => {
    const cookies = document.cookie.split(";");
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  };

  const signOut = async () => {
    try {
      localStorage.clear(); // Clear all localStorage
      clearAllCookies(); // Clear all cookies
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  return {
    session,
    isLoading,
    userRole,
    signOut,
    isAdmin: userRole === 'admin',
    isWorker: userRole === 'worker',
  };
};