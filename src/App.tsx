import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CEAgentDashboard from "./pages/CEAgentDashboard";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import FillInfo from "./pages/FillInfo.tsx";
import AllLeads from "./pages/AllLeads.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agent" element={<CEAgentDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/agent/fill-info" element={<FillInfo />} />
          <Route path="/agent/all-leads" element={<AllLeads />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/manager" element={<CEAgentDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from '@/pages/Auth/Login';
// import { ProtectedRoute } from '@/routes/ProtectedRoute';

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <div>Dashboard — coming soon</div>
//           </ProtectedRoute>
//         } />
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;