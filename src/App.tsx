import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import Index from "./pages/Index";
import Workers from "./pages/Workers";
import Projects from "./pages/Projects";
import Analytics from "./pages/Analytics";
import Chat from "./pages/Chat";
import Files from "./pages/Files";
import Calendar from "./pages/Calendar";
import Items from "./pages/Items";
import Notifications from "./pages/Notifications";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <AuthGuard requireAdmin>
                <Index />
              </AuthGuard>
            }
          />
          <Route
            path="/workers"
            element={
              <AuthGuard requireAdmin>
                <Workers />
              </AuthGuard>
            }
          />
          <Route
            path="/projects"
            element={
              <AuthGuard requireAdmin>
                <Projects />
              </AuthGuard>
            }
          />
          <Route
            path="/analytics"
            element={
              <AuthGuard requireAdmin>
                <Analytics />
              </AuthGuard>
            }
          />
          <Route
            path="/chat"
            element={
              <AuthGuard>
                <Chat />
              </AuthGuard>
            }
          />
          <Route
            path="/files"
            element={
              <AuthGuard requireAdmin>
                <Files />
              </AuthGuard>
            }
          />
          <Route
            path="/calendar"
            element={
              <AuthGuard requireAdmin>
                <Calendar />
              </AuthGuard>
            }
          />
          <Route
            path="/items"
            element={
              <AuthGuard requireAdmin>
                <Items />
              </AuthGuard>
            }
          />
          <Route
            path="/notifications"
            element={
              <AuthGuard>
                <Notifications />
              </AuthGuard>
            }
          />
          {/* Redirect workers to chat page by default */}
          <Route
            path="*"
            element={
              <AuthGuard>
                <Navigate to="/chat" replace />
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;