
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
import { Brain, Bot, Globe, Link, Map, Users, Menu, X, MessageSquare, Workflow, Phone, Network, Database, Search, Memory, Zap } from 'lucide-react';
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

  const openAITabs = [
    { value: 'chat', label: 'Chat', icon: MessageSquare },
    { value: 'commander', label: 'Commander', icon: Users },
    { value: 'workflow', label: 'Workflow', icon: Workflow },
    { value: 'orchestrator', label: 'Orchestrator', icon: Network },
  ];

  const dataTabs = [
    { value: 'system-agents', label: 'System Agents', icon: Bot },
    { value: 'mini-ai', label: 'Mini AI Instances', icon: Brain },
    { value: 'memory', label: 'Memory Entries', icon: Memory },
    { value: 'connections', label: 'System Connections', icon: Zap },
    { value: 'url-scrap', label: 'URL Scrap', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header z logo */}
      <div className="bg-gradient-dark backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-cyan-400 animate-pulse-glow" />
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary">Karol Core</h1>
              <p className="text-slate-400 text-sm">AGI Orchestrator Lab</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">{t('status.active')}</p>
            <p className="text-green-400 text-sm">{t('status.allSystemsOperational')}</p>
          </div>
        </div>
      </div>

      {/* Górna belka - OpenAI */}
      <div className="bg-slate-800/90 border-b border-cyan-800/30 p-4">
        <Tabs value={activeOpenAITab} onValueChange={setActiveOpenAITab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-dark border border-cyan-800/30">
            {openAITabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center space-x-2 hover-gradient-scale data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="mt-4 h-[400px]">
            <TabsContent value="chat" className="h-full m-0">
              <OpenAIChat />
            </TabsContent>
            
            <TabsContent value="commander" className="h-full m-0 overflow-auto">
              <AgentCommander />
            </TabsContent>
            
            <TabsContent value="workflow" className="h-full m-0">
              <WorkflowBuilder />
            </TabsContent>
            
            <TabsContent value="orchestrator" className="h-full m-0">
              <AgentOrchestrator />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Dolna belka - Data */}
      <div className="flex-1 bg-slate-900/50 p-4">
        <Tabs value={activeDataTab} onValueChange={setActiveDataTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5 bg-gradient-dark border border-slate-700/50">
            {dataTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center space-x-2 hover-gradient-scale data-[state=active]:bg-gradient-secondary data-[state=active]:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="flex-1 mt-4 overflow-auto">
            <TabsContent value="system-agents" className="h-full m-0">
              <SystemAgentsTable />
            </TabsContent>
            
            <TabsContent value="mini-ai" className="h-full m-0">
              <MiniAIInstancesTable />
            </TabsContent>
            
            <TabsContent value="memory" className="h-full m-0">
              <MemoryEntriesTable />
            </TabsContent>
            
            <TabsContent value="connections" className="h-full m-0">
              <SystemConnectionsTable />
            </TabsContent>
            
            <TabsContent value="url-scrap" className="h-full m-0">
              <URLScrapTable extractedLinks={extractedLinks} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

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
