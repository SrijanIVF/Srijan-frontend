import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import CEAgentDashboard from "./pages/CEAgentDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import FillInfo from "./pages/FillInfo";
import AllLeads from "./pages/AllLeads";

import ProtectedRoute from "./pages/RouteProtection";

const queryClient = new QueryClient();

const App = () => (

  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Login />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/agent"
            element={
              <ProtectedRoute>
                <CEAgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/fill-info"
            element={
              <ProtectedRoute>
                <FillInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/fill-info/:id"
            element={
              <ProtectedRoute>
                <FillInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/all-leads"
            element={
              <ProtectedRoute>
                <AllLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute>
                <CEAgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;