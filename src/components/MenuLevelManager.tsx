
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import OpenAIChat from './OpenAIChat';
import AgentCommander from './AgentCommander';
import WorkflowBuilder from './WorkflowBuilder';
import AgentOrchestrator from './AgentOrchestrator';
import BrowserCore from './BrowserCore';
import SystemAgentsTable from './SystemAgentsTable';
import MiniAIInstancesTable from './MiniAIInstancesTable';
import MemoryEntriesTable from './MemoryEntriesTable';
import SystemConnectionsTable from './SystemConnectionsTable';
import EnhancedURLTable from './EnhancedURLTable';
import SmartScraperBuilder from './scraper/SmartScraperBuilder';
import TemplateGallery from './gallery/TemplateGallery';
import AdvancedAnalytics from './analytics/AdvancedAnalytics';
import ProcessJournal from './analytics/ProcessJournal';
import BulkScheduler from './scheduler/BulkScheduler';
import TemplateMarketplace from './marketplace/TemplateMarketplace';
import AdvancedExporter from './export/AdvancedExporter';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ExtractionTemplate } from '@/types/common';

interface MenuLevelManagerProps {
  menuLevel: 1 | 2;
  collapsedMenus: {
    [key: string]: boolean;
  };
  toggleCollapse: (menuKey: string) => void;
  activeOpenAITab: string;
  setActiveOpenAITab: (tab: string) => void;
  activeDataTab: string;
  setActiveDataTab: (tab: string) => void;
  openAITabs: Array<{
    value: string;
    label: string;
    icon: any;
  }>;
  dataTabs: Array<{
    value: string;
    label: string;
    icon: any;
  }>;
  extractedLinks: Array<{
    url: string;
    title: string;
    domain: string;
  }>;
  showTrainingCallModal: boolean;
  setShowTrainingCallModal: (show: boolean) => void;
  onLinksExtracted?: (links: Array<{
    url: string;
    title: string;
    domain: string;
  }>) => void;
  onMenuLevelChange?: (level: 1 | 2) => void;
}

const MenuLevelManager = ({
  menuLevel,
  collapsedMenus,
  toggleCollapse,
  activeOpenAITab,
  setActiveOpenAITab,
  activeDataTab,
  setActiveDataTab,
  openAITabs,
  dataTabs,
  extractedLinks,
  showTrainingCallModal,
  setShowTrainingCallModal,
  onLinksExtracted,
  onMenuLevelChange
}: MenuLevelManagerProps) => {

  const handleOpenAITabChange = (tab: string) => {
    setActiveOpenAITab(tab);
    if (menuLevel !== 1) {
      onMenuLevelChange?.(1);
    }
  };

  const handleDataTabChange = (tab: string) => {
    setActiveDataTab(tab);
    if (menuLevel !== 2) {
      onMenuLevelChange?.(2);
    }
  };

  const handleCreateVisualTemplate = () => {
    setActiveOpenAITab('browser');
    onMenuLevelChange?.(1);
  };

  const handleTemplateCreated = (template: ExtractionTemplate) => {
    console.log('Template created:', template);
    setActiveDataTab('template-gallery');
    onMenuLevelChange?.(2);
  };

  const handleTemplateExecuted = (template: ExtractionTemplate) => {
    console.log('Template executed:', template);
    setActiveDataTab('url-scrap');
    onMenuLevelChange?.(2);
  };

  const renderOpenAISection = (isMain: boolean) => (
    <div className={`${isMain ? 'flex-1' : 'h-20'} bg-slate-800/90 border-b border-cyan-800/30 p-4 transition-all duration-500`}>
      <Tabs value={activeOpenAITab} onValueChange={handleOpenAITabChange} className="w-full h-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList className="grid grid-cols-5 bg-gradient-dark border border-cyan-800/30 flex-1 mr-4">
            {openAITabs.map(tab => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  onDoubleClick={() => toggleCollapse('openai')} 
                  className="flex items-center space-x-2 hover-gradient-scale data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          <Button onClick={() => toggleCollapse('openai')} variant="outline" size="sm" className="border-cyan-800/30">
            {collapsedMenus.openai ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>

        {!collapsedMenus.openai && isMain && (
          <div className="flex-1 overflow-auto">
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

            <TabsContent value="browser" className="h-full m-0">
              <BrowserCore 
                onLinksExtracted={onLinksExtracted}
                onTemplateCreated={handleTemplateCreated}
                onTemplateExecuted={handleTemplateExecuted}
              />
            </TabsContent>
          </div>
        )}
      </Tabs>
    </div>
  );

  const renderDataSection = (isMain: boolean) => (
    <div className={`${isMain ? 'flex-1' : 'h-20'} bg-slate-900/50 p-4 transition-all duration-500`}>
      <Tabs value={activeDataTab} onValueChange={handleDataTabChange} className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <TabsList className="grid grid-cols-8 bg-gradient-dark border border-slate-700/50 flex-1 mr-4">
            {dataTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  onDoubleClick={() => toggleCollapse('data')} 
                  className="flex items-center space-x-2 hover-gradient-scale data-[state=active]:bg-gradient-secondary data-[state=active]:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline text-xs">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          <Button onClick={() => toggleCollapse('data')} variant="outline" size="sm" className="border-slate-700/50">
            {collapsedMenus.data ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>

        {!collapsedMenus.data && isMain && (
          <div className="flex-1 overflow-auto">
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
              <EnhancedURLTable extractedLinks={extractedLinks} />
            </TabsContent>

            <TabsContent value="smart-scraper" className="h-full m-0">
              <SmartScraperBuilder />
            </TabsContent>

            <TabsContent value="template-gallery" className="h-full m-0">
              <TemplateGallery 
                onCreateVisualTemplate={handleCreateVisualTemplate}
                onTemplateSelect={(template) => {
                  console.log('Template selected:', template);
                }}
                onTemplateExecute={handleTemplateExecuted}
              />
            </TabsContent>

            <TabsContent value="analytics" className="h-full m-0">
              <div className="space-y-6">
                <AdvancedAnalytics />
                <ProcessJournal />
              </div>
            </TabsContent>

            <TabsContent value="scheduler" className="h-full m-0">
              <BulkScheduler />
            </TabsContent>

            <TabsContent value="marketplace" className="h-full m-0">
              <TemplateMarketplace />
            </TabsContent>

            <TabsContent value="export" className="h-full m-0">
              <AdvancedExporter data={extractedLinks} />
            </TabsContent>
          </div>
        )}
      </Tabs>
    </div>
  );

  if (menuLevel === 1) {
    return (
      <div className="flex-1 flex flex-col">
        {renderOpenAISection(true)}
        {renderDataSection(false)}
      </div>
    );
  } else {
    return (
      <div className="flex-1 flex flex-col">
        {renderDataSection(true)}
        {renderOpenAISection(false)}
      </div>
    );
  }
};

export default MenuLevelManager;
