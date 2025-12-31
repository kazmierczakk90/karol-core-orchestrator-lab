
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

// Layout
import { MainLayout } from "@/components/layout/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import LiveChatPage from "./pages/LiveChatPage";
import KarolCoreCommandCenter from "./pages/KarolCoreCommandCenter";
import FoundationModulesPage from "./pages/modules/FoundationModulesPage";
import IntelligenceModulesPage from "./pages/modules/IntelligenceModulesPage";
import ReasoningModulesPage from "./pages/modules/ReasoningModulesPage";
import ExperimentalModulesPage from "./pages/modules/ExperimentalModulesPage";
import AgentToolsPage from "./pages/tools/AgentToolsPage";
import WorkflowToolsPage from "./pages/tools/WorkflowToolsPage";
import ResearchToolsPage from "./pages/tools/ResearchToolsPage";
import RoutingPage from "./pages/RoutingPage";
import PricingPage from "./pages/PricingPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useAutoImprovement();

  return (
    <Router>
      <Routes>
        {/* Main Layout with Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<LiveChatPage />} />
          <Route path="/command-center" element={<KarolCoreCommandCenter />} />
          
          {/* Modules P0-P3 */}
          <Route path="/modules/foundation" element={<FoundationModulesPage />} />
          <Route path="/modules/intelligence" element={<IntelligenceModulesPage />} />
          <Route path="/modules/reasoning" element={<ReasoningModulesPage />} />
          <Route path="/modules/experimental" element={<ExperimentalModulesPage />} />
          
          {/* Tools */}
          <Route path="/tools/agents" element={<AgentToolsPage />} />
          <Route path="/tools/workflows" element={<WorkflowToolsPage />} />
          <Route path="/tools/research" element={<ResearchToolsPage />} />
          
          {/* Admin */}
          <Route path="/routing" element={<RoutingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        
        {/* Auth (no sidebar) */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GlobalLoadingProvider>
          <LanguageProvider>
            <SimplifiedAuthProvider>
              <ErrorBoundary>
                <div className="min-h-screen bg-background dark">
                  <AppContent />
                  <Toaster />
                  <Sonner />
                </div>
              </ErrorBoundary>
            </SimplifiedAuthProvider>
          </LanguageProvider>
        </GlobalLoadingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
