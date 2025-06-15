
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useAppMenu } from '@/hooks/useAppMenu';
import { useLinkExtractor } from '@/hooks/useLinkExtractor';
import { useModals } from '@/hooks/useModals';

import Header from '@/components/Header';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import MenuLevelManager from '@/components/MenuLevelManager';
import TrainingCallModal from '@/components/TrainingCallModal';
import FloatingActionKey from '@/components/FloatingActionKey';

import { Brain, Bot, Users, MessageSquare, Workflow, Network, Database, Search, Zap } from 'lucide-react';

const IndexContent = () => {
  const { 
    activeOpenAITab, setActiveOpenAITab,
    activeDataTab, setActiveDataTab
  } = useAppMenu();
  
  const { 
    extractedLinks, handleExtractLinks
  } = useLinkExtractor(setActiveDataTab);

  const {
    showTrainingCallModal, setShowTrainingCallModal,
    showAnalyticsDashboard, setShowAnalyticsDashboard
  } = useModals();

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
      <Header onLogoClick={() => setShowAnalyticsDashboard(true)} />

      <AnalyticsDashboard 
        isOpen={showAnalyticsDashboard} 
        onClose={() => setShowAnalyticsDashboard(false)} 
      />

      <MenuLevelManager
        activeOpenAITab={activeOpenAITab}
        setActiveOpenAITab={setActiveOpenAITab}
        activeDataTab={activeDataTab}
        setActiveDataTab={setActiveDataTab}
        openAITabs={openAITabs}
        dataTabs={dataTabs}
        extractedLinks={extractedLinks}
      />

      <TrainingCallModal 
        isOpen={showTrainingCallModal} 
        onClose={() => setShowTrainingCallModal(false)} 
      />

      <FloatingActionKey
        onExtractLinks={handleExtractLinks}
        onOpenBrowser={() => setActiveDataTab('url-scrap')}
        onOpenMiniAI={() => setActiveDataTab('mini-ai')}
        onOpenCommander={() => setActiveOpenAITab('commander')}
        onOpenTrainingCall={() => setShowTrainingCallModal(true)}
      />
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
