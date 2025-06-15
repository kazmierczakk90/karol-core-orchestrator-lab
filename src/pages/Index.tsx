
import React, { Suspense, useCallback } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useAppMenu } from '@/hooks/useAppMenu';
import { useLinkExtractor } from '@/hooks/useLinkExtractor';
import { useModals } from '@/hooks/useModals';
import { Toaster } from "@/components/ui/sonner"

import Header from '@/components/Header';
import FloatingActionKey from '@/components/FloatingActionKey';

import { Brain, Bot, Users, MessageSquare, Workflow, Network, Database, Search, Zap, Loader } from 'lucide-react';
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
    extractedLinks, handleExtractLinks
  } = useLinkExtractor(setActiveDataTab);

  const {
    showTrainingCallModal, setShowTrainingCallModal,
    showAnalyticsDashboard, setShowAnalyticsDashboard
  } = useModals();

  const handleLogoClick = useCallback(() => {
    setShowAnalyticsDashboard(true);
  }, [setShowAnalyticsDashboard]);

  const openAITabs = [
    { value: 'chat', label: 'Chat', icon: MessageSquare },
    { value: 'commander', label: 'Commander', icon: Users },
    { value: 'workflow', label: 'Workflow', icon: Workflow },
    { value: 'orchestrator', label: 'Orchestrator', icon: Network },
  ];

  const dataTabs = [
    { value: 'system-agents', label: 'System Agents', icon: Bot },
    { value: 'mini-ai', label: 'Mini AI Instances', icon: Brain },
    { value: 'memory', label: 'Memory Entries', icon: Database },
    { value: 'connections', label: 'System Connections', icon: Zap },
    { value: 'url-scrap', label: 'URL Scrap', icon: Search },
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
          <header className="p-2 md:p-4 flex items-center border-b border-slate-700/50">
            <SidebarTrigger className="text-slate-400 hover:text-white" />
            <h1 className="ml-4 text-lg font-semibold text-white">
              {activeGroup === 'openai' 
                ? openAITabs.find(t => t.value === activeOpenAITab)?.label 
                : dataTabs.find(t => t.value === activeDataTab)?.label}
            </h1>
          </header>
          <main className="flex-1 overflow-y-auto p-4">
            <MainContent
              activeOpenAITab={activeOpenAITab}
              setActiveOpenAITab={setActiveOpenAITab}
              activeDataTab={activeDataTab}
              setActiveDataTab={setActiveDataTab}
              activeGroup={activeGroup}
              extractedLinks={extractedLinks}
            />
          </main>
        </SidebarInset>
      </div>


      <TrainingCallModal 
        isOpen={showTrainingCallModal} 
        onClose={() => setShowTrainingCallModal(false)} 
      />

      <FloatingActionKey
        onExtractLinks={handleExtractLinks}
        onOpenBrowser={() => {
            setActiveDataTab('url-scrap');
            setActiveGroup('data');
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
      <p className="text-slate-300">Loading Karol Core Interface...</p>
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
