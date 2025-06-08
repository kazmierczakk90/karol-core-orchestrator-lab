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
import KK11Dashboard from '@/components/KK11Dashboard';
import GlobalErrorBoundary from '@/components/enhanced/GlobalErrorBoundary';
import { Brain, Bot, Globe, Link, Map, Users, Menu, X, MessageSquare, Workflow, Phone, Network, Database, Search, Zap, Target, Wrench, BookOpen, TrendingUp, Calendar, Store, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

interface ExtractedLink {
  url: string;
  title: string;
  domain: string;
}

const IndexContent = () => {
  const { t } = useTranslation();
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([]);
  const [activeOpenAITab, setActiveOpenAITab] = useState('browser');
  const [activeDataTab, setActiveDataTab] = useState('url-scrap');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTrainingCallModal, setShowTrainingCallModal] = useState(false);
  const [menuLevel, setMenuLevel] = useState<1 | 2>(1);
  const [collapsedMenus, setCollapsedMenus] = useState<{[key: string]: boolean}>({});
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [showKK11Dashboard, setShowKK11Dashboard] = useState(false);

  // Real-time updates
  const { updates, isConnected } = useRealTimeUpdates();

  // Enhanced keyboard shortcuts with new functions
  useKeyboardShortcuts({
    onMenuSwitch: (level) => setMenuLevel(level),
    onSearch: () => {
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      searchInput?.focus();
    },
    onEscape: () => {
      setShowAnalyticsDashboard(false);
      setShowKK11Dashboard(false);
      setShowTrainingCallModal(false);
    },
    onQuickAction: (action) => {
      switch (action) {
        case 'scraper':
          setActiveDataTab('smart-scraper');
          setMenuLevel(2);
          break;
        case 'templates':
          setActiveDataTab('template-gallery');
          setMenuLevel(2);
          break;
        case 'analytics':
          setActiveDataTab('analytics');
          setMenuLevel(2);
          break;
        case 'visual-template':
          setActiveOpenAITab('browser');
          setMenuLevel(1);
          break;
      }
    }
  });

  // Handle keyboard shortcuts for new functionality
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        if (event.key === 'v' || event.key === 'V') {
          event.preventDefault();
          // Toggle visual inspector in browser
          setActiveOpenAITab('browser');
          setMenuLevel(1);
        } else if (event.key === 't' || event.key === 'T') {
          event.preventDefault();
          // Create new template
          setActiveDataTab('template-gallery');
          setMenuLevel(2);
        }
      }
      
      if (event.ctrlKey) {
        if (event.key === 's' || event.key === 'S') {
          event.preventDefault();
          // Save current template (context-dependent)
          console.log('Save shortcut triggered');
        } else if (event.key === 'e' || event.key === 'E') {
          event.preventDefault();
          // Export current data
          setActiveDataTab('export');
          setMenuLevel(2);
        }
      }
      
      if (event.key === 'Delete') {
        // Delete selected items (context-dependent)
        console.log('Delete shortcut triggered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    setMenuLevel(2); // Switch to data level when links are extracted
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

  const handleMenuLevelChange = (level: 1 | 2) => {
    setMenuLevel(level);
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
    { value: 'browser', label: 'Browser', icon: Globe },
  ];

  const dataTabs = [
    { value: 'system-agents', label: 'Agents', icon: Bot },
    { value: 'mini-ai', label: 'Mini AI', icon: Brain },
    { value: 'memory', label: 'Memory', icon: Database },
    { value: 'connections', label: 'Connections', icon: Zap },
    { value: 'url-scrap', label: 'URL Scrap', icon: Search },
    { value: 'smart-scraper', label: 'Scraper', icon: Wrench },
    { value: 'template-gallery', label: 'Templates', icon: BookOpen },
    { value: 'analytics', label: 'Analytics', icon: TrendingUp },
    { value: 'scheduler', label: 'Scheduler', icon: Calendar },
    { value: 'marketplace', label: 'Market', icon: Store },
    { value: 'export', label: 'Export', icon: Download }
  ];

  return (
    <GlobalErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        {/* Header without Switch Level button */}
        <div className="bg-gradient-dark backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
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
              
              {/* KK1.1 AGI Button */}
              <Button
                onClick={() => setShowKK11Dashboard(true)}
                className="bg-gradient-accent hover:bg-gradient-primary flex items-center space-x-2"
              >
                <Target className="h-5 w-5" />
                <span className="font-bold">KK1.1 AGI</span>
              </Button>

              {/* Menu Level Indicator */}
              <Badge className={`${menuLevel === 1 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'} border-slate-600`}>
                Level {menuLevel} {menuLevel === 1 ? '(OpenAI/Browser)' : '(Data/Tables)'}
              </Badge>

              {/* Real-time status indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-xs text-slate-400">
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-xs text-slate-400">
                Shortcuts: Ctrl+1/2 (Menu) • Alt+V (Visual) • Alt+T (Template) • Alt+F4 (Extract) • Del (Delete)
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{t('status.active')}</p>
                <p className="text-green-400 text-sm">{t('status.allSystemsOperational')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard Modal */}
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

        {/* KK1.1 AGI Dashboard Modal */}
        {showKK11Dashboard && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg p-6 max-w-7xl w-full max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gradient-primary">KK1.1 AGI Control Center</h2>
                <Button
                  onClick={() => setShowKK11Dashboard(false)}
                  variant="outline"
                  className="border-slate-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <KK11Dashboard />
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
          onLinksExtracted={handleLinksExtracted}
          onMenuLevelChange={handleMenuLevelChange}
        />

        {/* Training Call Modal */}
        <TrainingCallModal 
          isOpen={showTrainingCallModal} 
          onClose={() => setShowTrainingCallModal(false)} 
        />

        {/* Enhanced Floating Action Key with context awareness */}
        <FloatingActionKey
          onExtractLinks={handleExtractLinks}
          onOpenBrowser={() => {
            setActiveOpenAITab('browser');
            setMenuLevel(1);
          }}
          onOpenMiniAI={() => {
            setActiveDataTab('mini-ai');
            setMenuLevel(2);
          }}
          onOpenCommander={() => {
            setActiveOpenAITab('commander');
            setMenuLevel(1);
          }}
          onOpenTrainingCall={() => setShowTrainingCallModal(true)}
        />
      </div>
    </GlobalErrorBoundary>
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
