
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AGIDashboard from '@/components/AGIDashboard';
import MiniAIDashboard from '@/components/MiniAIDashboard';
import BrowserCore from '@/components/BrowserCore';
import LinkCollector from '@/components/LinkCollector';
import MindMapsCreator from '@/components/MindMapsCreator';
import FloatingActionKey from '@/components/FloatingActionKey';
import { Brain, Bot, Globe, Link, Map, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExtractedLink {
  url: string;
  title: string;
  domain: string;
}

const Index = () => {
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([]);
  const [activeTab, setActiveTab] = useState('agi-core');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinksExtracted = (links: ExtractedLink[]) => {
    console.log('Links received from Browser:', links);
    setExtractedLinks(prev => [...links, ...prev]);
    
    // Auto-switch to Link Collector tab when links are extracted
    setActiveTab('link-collector');
    setMobileMenuOpen(false);
  };

  const handleExtractLinks = () => {
    // Trigger link extraction from browser
    console.log('Extract links triggered from Floating Action Key');
    setActiveTab('browser-core');
  };

  const handleOpenBrowser = () => {
    setActiveTab('browser-core');
    setMobileMenuOpen(false);
  };

  const handleOpenMiniAI = () => {
    setActiveTab('mini-ai');
    setMobileMenuOpen(false);
  };

  const tabs = [
    { value: 'agi-core', label: 'AGI Core', icon: Brain },
    { value: 'mini-ai', label: 'Mini AI', icon: Bot },
    { value: 'browser-core', label: 'Browser', icon: Globe },
    { value: 'link-collector', label: 'Links', icon: Link },
    { value: 'mind-maps', label: 'Mind Maps', icon: Map },
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
              <TabsList className="grid w-full grid-cols-2 gap-2 bg-slate-700/50">
                {tabs.slice(0, 4).map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger 
                      key={tab.value} 
                      value={tab.value}
                      className="flex items-center space-x-2 text-xs"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              <TabsList className="grid w-full grid-cols-1 bg-slate-700/50">
                <TabsTrigger 
                  value="mind-maps"
                  className="flex items-center space-x-2 text-xs"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Map className="h-4 w-4" />
                  <span>Mind Maps</span>
                </TabsTrigger>
              </TabsList>
            </div>
          )}
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Karol Core</h1>
                <p className="text-slate-400 text-sm">AGI Orchestrator Lab</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">Status: Active</p>
              <p className="text-green-400 text-sm">All systems operational</p>
            </div>
          </div>
          
          <TabsList className="grid w-full grid-cols-5 bg-slate-700/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Content Area - naprawione scrollowanie */}
        <div className="flex-1 overflow-auto">
          <TabsContent value="agi-core" className="h-full m-0 p-4 md:p-6 overflow-auto">
            <AGIDashboard />
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
        />
      </Tabs>
    </div>
  );
};

export default Index;
