import React, { useState, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const OpenAIChat = React.lazy(() => import('./OpenAIChat'));
const AgentCommander = React.lazy(() => import('./AgentCommander'));
const WorkflowBuilder = React.lazy(() => import('./WorkflowBuilder'));
const FUKOConsole = React.lazy(() => import('./FUKOConsole'));
const SystemAgentsTable = React.lazy(() => import('./SystemAgentsTable'));
const MiniAIInstancesTable = React.lazy(() => import('./MiniAIInstancesTable'));
const MemoryEntriesTable = React.lazy(() => import('./MemoryEntriesTable'));
const SystemConnectionsTable = React.lazy(() => import('./SystemConnectionsTable'));
const URLScrapTable = React.lazy(() => import('./URLScrapTable'));

interface MenuLevelManagerProps {
  activeOpenAITab: string;
  setActiveOpenAITab: (tab: string) => void;
  activeDataTab: string;
  setActiveDataTab: (tab: string) => void;
  openAITabs: Array<{value: string, label: string, icon: any}>;
  dataTabs: Array<{value: string, label: string, icon: any}>;
  extractedLinks: Array<{url: string, title: string, domain: string}>;
}

const LoadingFallback = () => (
    <div className="p-4">
        <div className="bg-slate-800/50 rounded-lg p-4 animate-pulse">
            <div className="h-40 bg-slate-700/50 rounded"></div>
        </div>
    </div>
);

const MenuLevelManager = ({
  activeOpenAITab,
  setActiveOpenAITab,
  activeDataTab,
  setActiveDataTab,
  openAITabs,
  dataTabs,
  extractedLinks,
}: MenuLevelManagerProps) => {
  const [menuLevel, setMenuLevel] = useState<1 | 2>(1);

  const toggleMenuLevel = () => {
    setMenuLevel(prev => (prev === 1 ? 2 : 1));
  };

  const renderOpenAISection = (isMain: boolean) => (
    <div 
      className={`${isMain ? 'flex-1 min-h-[30vh]' : 'h-20 cursor-pointer'} bg-slate-800/90 p-4 transition-all duration-300 flex flex-col justify-center border-b border-cyan-800/30`}
      onClick={!isMain ? toggleMenuLevel : undefined}
    >
      <Tabs value={activeOpenAITab} onValueChange={setActiveOpenAITab} className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-4 bg-gradient-dark border border-cyan-800/30 flex-1">
            {openAITabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center space-x-2 hover-gradient-scale data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                  disabled={!isMain}
                >
                  <Icon className="h-4 w-4" />
                  <span className={`${isMain ? 'hidden md:inline' : 'hidden'}`}>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {isMain && (
          <div className="flex-1 overflow-auto mt-4">
            <Suspense fallback={<LoadingFallback />}>
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
                <FUKOConsole />
              </TabsContent>
            </Suspense>
          </div>
        )}
      </Tabs>
    </div>
  );

  const renderDataSection = (isMain: boolean) => (
    <div 
      className={`${isMain ? 'flex-1 min-h-[30vh]' : 'h-20 cursor-pointer'} bg-slate-900/50 p-4 transition-all duration-300 flex flex-col justify-center border-b border-slate-700/50`}
      onClick={!isMain ? toggleMenuLevel : undefined}
    >
      <Tabs value={activeDataTab} onValueChange={setActiveDataTab} className="h-full flex flex-col">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-5 bg-gradient-dark border border-slate-700/50 flex-1">
            {dataTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center space-x-2 hover-gradient-scale data-[state=active]:bg-gradient-secondary data-[state=active]:text-white"
                  disabled={!isMain}
                >
                  <Icon className="h-4 w-4" />
                  <span className={`${isMain ? 'hidden md:inline' : 'hidden'}`}>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {isMain && (
          <div className="flex-1 overflow-auto mt-4">
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
          </div>
        )}
      </Tabs>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col">
      {menuLevel === 1 ? (
        <>
          {renderDataSection(false)}
          {renderOpenAISection(true)}
        </>
      ) : (
        <>
          {renderOpenAISection(false)}
          {renderDataSection(true)}
        </>
      )}
    </div>
  );
};

export default MenuLevelManager;
