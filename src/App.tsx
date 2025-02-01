import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import Layout from "./components/Layout";
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
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route
              index
              element={
                <AuthGuard>
                  <Index />
                </AuthGuard>
              }
            />
            <Route
              path="workers"
              element={
                <AuthGuard>
                  <Workers />
                </AuthGuard>
              }
            />
            <Route
              path="projects"
              element={
                <AuthGuard>
                  <Projects />
                </AuthGuard>
              }
            />
            <Route
              path="analytics"
              element={
                <AuthGuard>
                  <Analytics />
                </AuthGuard>
              }
            />
            <Route
              path="chat"
              element={<Chat />}
            />
            <Route
              path="files"
              element={
                <AuthGuard>
                  <Files />
                </AuthGuard>
              }
            />
            <Route
              path="calendar"
              element={
                <AuthGuard>
                  <Calendar />
                </AuthGuard>
              }
            />
            <Route
              path="items"
              element={
                <AuthGuard>
                  <Items />
                </AuthGuard>
              }
            />
            <Route
              path="notifications"
              element={<Notifications />}
            />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;