
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AGIDashboard from '@/components/AGIDashboard';
import MiniAIDashboard from '@/components/MiniAIDashboard';
import BrowserCore from '@/components/BrowserCore';
import LinkCollector from '@/components/LinkCollector';
import MindMapsCreator from '@/components/MindMapsCreator';
import AgentCommander from '@/components/AgentCommander';
import OpenAIChat from '@/components/OpenAIChat';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import TrainingCallModal from '@/components/TrainingCallModal';
import AgentOrchestrator from '@/components/AgentOrchestrator';
import SystemAgentsTable from '@/components/SystemAgentsTable';
import URLScrapTable from '@/components/URLScrapTable';
import MiniAIInstancesTable from '@/components/MiniAIInstancesTable';
import MemoryEntriesTable from '@/components/MemoryEntriesTable';
import SystemConnectionsTable from '@/components/SystemConnectionsTable';
import FloatingActionKey from '@/components/FloatingActionKey';
import MenuLevelManager from '@/components/MenuLevelManager';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Brain, Bot, Globe, Link, Map, Users, Menu, X, MessageSquare, Workflow, Phone, Network, Database, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

interface ExtractedLink {
  url: string;
  title: string;
  domain: string;
}

const IndexContent = () => {
  const { t } = useTranslation();
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([]);
  const [activeOpenAITab, setActiveOpenAITab] = useState('chat');
  const [activeDataTab, setActiveDataTab] = useState('system-agents');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTrainingCallModal, setShowTrainingCallModal] = useState(false);
  const [menuLevel, setMenuLevel] = useState<1 | 2>(1);
  const [collapsedMenus, setCollapsedMenus] = useState<{[key: string]: boolean}>({});
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);

  const extractCurrentPageLinks = (): ExtractedLink[] => {
    try {
      const allLinks = document.querySelectorAll('a[href]');
      const extractedLinks: ExtractedLink[] = [];
      const seenUrls = new Set<string>();

      allLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) return;

        if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          return;
        }

        let absoluteUrl: string;
        try {
          absoluteUrl = new URL(href, window.location.origin).href;
        } catch (error) {
          return;
        }

        if (seenUrls.has(absoluteUrl)) return;
        seenUrls.add(absoluteUrl);

        const title = link.textContent?.trim() || link.getAttribute('title') || new URL(absoluteUrl).pathname;
        const domain = new URL(absoluteUrl).hostname;

        extractedLinks.push({
          url: absoluteUrl,
          title: title || domain,
          domain
        });
      });

      return extractedLinks;
    } catch (error) {
      console.error('Błąd podczas ekstrakcji linków:', error);
      return [];
    }
  };

  const handleLinksExtracted = (links: ExtractedLink[]) => {
    console.log('Links received from Browser:', links);
    setExtractedLinks(prev => [...links, ...prev]);
    setActiveDataTab('url-scrap');
    setMobileMenuOpen(false);
  };

  const handleExtractLinks = () => {
    console.log('Rozpoczynam ekstrakcję linków z aktualnej strony...');
    
    const currentPageLinks = extractCurrentPageLinks();
    
    if (currentPageLinks.length > 0) {
      handleLinksExtracted(currentPageLinks);
      
      toast.success(`Ekstrakcja zakończona!`, {
        description: `Znaleziono ${currentPageLinks.length} linków na tej stronie`,
        duration: 3000
      });
    } else {
      toast.info('Brak linków', {
        description: 'Nie znaleziono żadnych linków na tej stronie',
        duration: 3000
      });
    }
  };

  const toggleCollapse = (menuKey: string) => {
    setCollapsedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const switchMenuLevel = () => {
    setMenuLevel(prev => prev === 1 ? 2 : 1);
  };

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
      {/* Header z logo */}
      <div className="bg-gradient-dark backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setShowAnalyticsDashboard(true)}
          >
            <Brain className="h-8 w-8 text-cyan-400 animate-pulse-glow" />
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary">Karol Core</h1>
              <p className="text-slate-400 text-sm">AGI Orchestrator Lab</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={switchMenuLevel}
              className="bg-gradient-secondary hover:bg-gradient-primary"
            >
              Switch to Level {menuLevel === 1 ? '2' : '1'}
            </Button>
            <div className="text-right">
              <p className="text-white font-medium">{t('status.active')}</p>
              <p className="text-green-400 text-sm">{t('status.allSystemsOperational')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showAnalyticsDashboard && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-lg p-6 max-w-7xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              <Button
                onClick={() => setShowAnalyticsDashboard(false)}
                variant="outline"
                className="border-slate-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <AnalyticsDashboard />
          </div>
        </div>
      )}

      <MenuLevelManager
        menuLevel={menuLevel}
        collapsedMenus={collapsedMenus}
        toggleCollapse={toggleCollapse}
        activeOpenAITab={activeOpenAITab}
        setActiveOpenAITab={setActiveOpenAITab}
        activeDataTab={activeDataTab}
        setActiveDataTab={setActiveDataTab}
        openAITabs={openAITabs}
        dataTabs={dataTabs}
        extractedLinks={extractedLinks}
        showTrainingCallModal={showTrainingCallModal}
        setShowTrainingCallModal={setShowTrainingCallModal}
      />

      {/* Training Call Modal */}
      <TrainingCallModal 
        isOpen={showTrainingCallModal} 
        onClose={() => setShowTrainingCallModal(false)} 
      />

      {/* Floating Action Key */}
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
