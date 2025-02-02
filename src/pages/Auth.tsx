import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Email not confirmed")) {
          toast({
            variant: "destructive",
            title: "Email Not Confirmed",
            description: "Please check your email to confirm your account.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: signInError.message,
          });
        }
        return;
      }

      // Wait a moment for the auth state to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get user role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .maybeSingle();

      console.log('Profile query result:', { profileData, profileError });

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user profile",
        });
        return;
      }

      if (!profileData) {
        console.error('No profile found for email:', email);
        toast({
          variant: "destructive",
          title: "Error",
          description: "User profile not found",
        });
        return;
      }

      // Store the role in localStorage to prevent flicker
      localStorage.setItem('userRole', profileData.role);

      // Redirect based on role
      if (profileData.role === 'worker') {
        console.log('Redirecting worker to chat');
        navigate("/chat");
      } else {
        console.log('Redirecting admin to dashboard');
        navigate("/");
      }

      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });

    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;