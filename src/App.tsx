import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SimplifiedAuthProvider } from "@/contexts/SimplifiedAuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GlobalLoadingProvider } from "@/contexts/GlobalLoadingContext";
import { useAutoImprovement } from "@/hooks/useAutoImprovement";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ChatTest from '@/pages/ChatTest';

const queryClient = new QueryClient();

const AppContent = () => {
  // Inicjalizacja Auto-Improvement System
  useAutoImprovement();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/chat-test" element={<ChatTest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/chat-test" element={<ChatTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
