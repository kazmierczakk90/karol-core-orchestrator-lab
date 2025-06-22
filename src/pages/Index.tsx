
import React, { Suspense, useCallback } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useAppMenu } from '@/hooks/useAppMenu';
import { useLinkExtractor } from '@/hooks/useLinkExtractor';
import { useModals } from '@/hooks/useModals';
import { Toaster } from "@/components/ui/sonner"

import Header from '@/components/Header';
import FloatingActionKey from '@/components/FloatingActionKey';

import { Brain, Bot, Users, MessageSquare, Workflow, Network, Database, Search, Zap, Loader, Layers, Globe, Monitor, Shield, FileText, Crown, Microscope } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MainContent } from '@/components/MainContent';

const AnalyticsDashboard = React.lazy(() => import('@/components/AnalyticsDashboard'));
const TrainingCallModal = React.lazy(() => import('@/components/TrainingCallModal'));

const IndexContent = () => {
  const { 
    activeOpenAITab, setActiveOpenAITab,
    activeDataTab, setActiveDataTab,
    activeGroup, setActiveGroup
  } = useAppMenu();
  
  const { 
    extractedLinks, handleExtractLinks, addManualLink
  } = useLinkExtractor(setActiveDataTab);

  const {
    showTrainingCallModal, setShowTrainingCallModal,
    showAnalyticsDashboard, setShowAnalyticsDashboard
  } = useModals();

  const handleLogoClick = useCallback(() => {
    setShowAnalyticsDashboard(true);
  }, [setShowAnalyticsDashboard]);

  // Create adapter function for FloatingActionKey onExtractLinks prop
  const handleFloatingActionExtractLinks = useCallback(() => {
    // Call handleExtractLinks without parameters to extract from current page
    handleExtractLinks();
  }, [handleExtractLinks]);

  const openAITabs = [
    { value: 'chat', label: 'Chat', icon: MessageSquare },
    { value: 'commander', label: 'Commander', icon: Users },
    { value: 'workflow', label: 'Workflow', icon: Workflow },
    { value: 'orchestrator', label: 'Orchestrator', icon: Network },
    { value: 'browser', label: 'Browser', icon: Globe },
  ];

  const dataTabs = [
    { value: 'system-agents', label: 'System Agents', icon: Bot },
    { value: 'mini-ai', label: 'Mini AI Instances', icon: Brain },
    { value: 'memory', label: 'Memory Entries', icon: Database },
    { value: 'connections', label: 'System Connections', icon: Zap },
    { value: 'url-scrap', label: 'URL Scrap', icon: Search },
    { value: 'meta-decisions', label: 'Meta Decisions', icon: Layers },
    { value: 'full-armor', label: 'Full Armor', icon: Layers },
    { value: 'unified-intelligence', label: 'Unified Intelligence', icon: Crown },
    { value: 'cognitive-research', label: 'Cognitive Research', icon: Microscope },
    { value: 'system-diagnostics', label: 'System Diagnostics', icon: Shield },
    { value: 'platform-audit', label: 'Platform Audit', icon: Shield },
    { value: 'error-report', label: 'Error Report', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header onLogoClick={handleLogoClick} />

      <AnalyticsDashboard 
        isOpen={showAnalyticsDashboard} 
        onClose={() => setShowAnalyticsDashboard(false)} 
      />

      <div className="flex-1 flex w-full">
         <AppSidebar
            activeOpenAITab={activeOpenAITab}
            setActiveOpenAITab={setActiveOpenAITab}
            activeDataTab={activeDataTab}
            setActiveDataTab={setActiveDataTab}
            openAITabs={openAITabs}
            dataTabs={dataTabs}
            activeGroup={activeGroup}
            setActiveGroup={setActiveGroup}
          />
        <SidebarInset className="flex-1 flex flex-col bg-transparent">
          <header className="p-2 md:p-4 flex items-center border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
            <SidebarTrigger className="text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-600/50" />
            <h1 className="ml-4 text-lg font-semibold text-white">
              {activeGroup === 'openai' 
                ? openAITabs.find(t => t.value === activeOpenAITab)?.label 
                : dataTabs.find(t => t.value === activeDataTab)?.label}
            </h1>
          </header>
          <main className="flex-1 overflow-y-auto p-2 md:p-4 max-w-full">
            <div className="h-full max-w-full">
              <MainContent
                activeOpenAITab={activeOpenAITab}
                setActiveOpenAITab={setActiveOpenAITab}
                activeDataTab={activeDataTab}
                setActiveDataTab={setActiveDataTab}
                activeGroup={activeGroup}
                extractedLinks={extractedLinks}
              />
            </div>
          </main>
        </SidebarInset>
      </div>

      <TrainingCallModal 
        isOpen={showTrainingCallModal} 
        onClose={() => setShowTrainingCallModal(false)} 
      />

      <FloatingActionKey
        onExtractLinks={handleFloatingActionExtractLinks}
        onOpenBrowser={() => {
            setActiveOpenAITab('browser');
            setActiveGroup('openai');
        }}
        onOpenMiniAI={() => {
            setActiveDataTab('mini-ai');
            setActiveGroup('data');
        }}
        onOpenCommander={() => {
            setActiveOpenAITab('commander');
            setActiveGroup('openai');
        }}
        onOpenTrainingCall={() => setShowTrainingCallModal(true)}
      />
      <Toaster richColors theme="dark" position="bottom-right" />
    </div>
  );
};

const LoadingFallback = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <Loader className="h-12 w-12 text-cyan-400 animate-spin" />
      <p className="text-slate-200 font-medium">Loading Karol Core Interface...</p>
    </div>
  </div>
);

const Index = () => {
  return (
    <LanguageProvider>
      <Suspense fallback={<LoadingFallback />}>
        <SidebarProvider>
          <IndexContent />
        </SidebarProvider>
      </Suspense>
    </LanguageProvider>
  );
};

export default Index;
