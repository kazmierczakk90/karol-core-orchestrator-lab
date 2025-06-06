
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AGIDashboard from '@/components/AGIDashboard';
import MiniAIDashboard from '@/components/MiniAIDashboard';
import BrowserCore from '@/components/BrowserCore';
import LinkCollector from '@/components/LinkCollector';
import MindMapsCreator from '@/components/MindMapsCreator';
import AgentCommander from '@/components/AgentCommander';
import FloatingActionKey from '@/components/FloatingActionKey';
import { Brain, Bot, Globe, Link, Map, Users, Menu, X } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('agi-core');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setActiveTab('link-collector');
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

  const handleOpenBrowser = () => {
    setActiveTab('browser-core');
    setMobileMenuOpen(false);
  };

  const handleOpenMiniAI = () => {
    setActiveTab('mini-ai');
    setMobileMenuOpen(false);
  };

  const handleOpenCommander = () => {
    setActiveTab('commander');
    setMobileMenuOpen(false);
  };

  const tabs = [
    { value: 'agi-core', label: t('navigation.agiCore'), icon: Brain },
    { value: 'commander', label: t('navigation.commander'), icon: Users },
    { value: 'mini-ai', label: t('navigation.miniAI'), icon: Bot },
    { value: 'browser-core', label: t('navigation.browser'), icon: Globe },
    { value: 'link-collector', label: t('navigation.links'), icon: Link },
    { value: 'mind-maps', label: t('navigation.mindMaps'), icon: Map },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-cyan-400" />
              <h1 className="text-white font-bold text-lg">Karol Core</h1>
            </div>
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              size="sm"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mt-4 space-y-2">
              <TabsList className="grid w-full grid-cols-2 gap-2 bg-gradient-dark">
                {tabs.slice(0, 4).map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger 
                      key={tab.value} 
                      value={tab.value}
                      className="flex items-center space-x-2 text-xs hover-gradient-scale"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              <TabsList className="grid w-full grid-cols-2 bg-gradient-dark">
                {tabs.slice(4).map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger 
                      key={tab.value} 
                      value={tab.value}
                      className="flex items-center space-x-2 text-xs hover-gradient-scale"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          )}
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block bg-gradient-dark backdrop-blur-sm border-b border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
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
          
          <TabsList className="grid w-full grid-cols-6 bg-gradient-dark border border-cyan-800/30">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center space-x-2 hover-gradient-scale data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="agi-core" className="h-full m-0 p-4 md:p-6 overflow-auto">
            <AGIDashboard />
          </TabsContent>
          
          <TabsContent value="commander" className="h-full m-0 p-4 md:p-6 overflow-auto">
            <AgentCommander />
          </TabsContent>
          
          <TabsContent value="mini-ai" className="h-full m-0 p-4 md:p-6 overflow-auto">
            <MiniAIDashboard />
          </TabsContent>
          
          <TabsContent value="browser-core" className="h-full m-0 overflow-auto">
            <BrowserCore onLinksExtracted={handleLinksExtracted} />
          </TabsContent>
          
          <TabsContent value="link-collector" className="h-full m-0 p-4 md:p-6 overflow-auto">
            <LinkCollector extractedLinks={extractedLinks} />
          </TabsContent>
          
          <TabsContent value="mind-maps" className="h-full m-0 p-4 md:p-6 overflow-auto">
            <MindMapsCreator />
          </TabsContent>
        </div>

        {/* Floating Action Key */}
        <FloatingActionKey
          onExtractLinks={handleExtractLinks}
          onOpenBrowser={handleOpenBrowser}
          onOpenMiniAI={handleOpenMiniAI}
          onOpenCommander={handleOpenCommander}
        />
      </Tabs>
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
