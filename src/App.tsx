
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimplifiedAuthProvider } from "@/contexts/SimplifiedAuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GlobalLoadingProvider } from "@/contexts/GlobalLoadingContext";
import { useAutoImprovement } from "@/hooks/useAutoImprovement";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  // Inicjalizacja Auto-Improvement System
  useAutoImprovement();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <SimplifiedAuthProvider>
        <GlobalLoadingProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
          </LanguageProvider>
        </GlobalLoadingProvider>
      </SimplifiedAuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
