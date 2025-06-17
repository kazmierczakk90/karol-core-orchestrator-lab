
import React, { Suspense } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useLinkExtractor } from '@/hooks/useLinkExtractor';

const OpenAIChat = React.lazy(() => import('./OpenAIChat'));
const AgentCommander = React.lazy(() => import('./AgentCommander'));
const WorkflowBuilder = React.lazy(() => import('./WorkflowBuilder'));
const FUKOConsole = React.lazy(() => import('./FUKOConsole'));
const SystemAgentsTable = React.lazy(() => import('./SystemAgentsTable'));
const MiniAIInstancesTable = React.lazy(() => import('./MiniAIInstancesTable'));
const MemoryEntriesTable = React.lazy(() => import('./MemoryEntriesTable'));
const SystemConnectionsTable = React.lazy(() => import('./SystemConnectionsTable'));
const URLScrapTable = React.lazy(() => import('./URLScrapTable'));
const MetaDecisionLayer = React.lazy(() => import('./MetaDecisionLayer'));
const FullArmorDashboard = React.lazy(() => import('./FullArmorDashboard'));
const BrowserCore = React.lazy(() => import('./BrowserCore'));

interface MainContentProps {
  activeOpenAITab: string;
  setActiveOpenAITab: (tab: string) => void;
  activeDataTab: string;
  setActiveDataTab: (tab: string) => void;
  activeGroup: 'openai' | 'data';
  extractedLinks: Array<{url: string, title: string, domain: string}>;
}

const LoadingFallback = () => (
    <div>
        <Skeleton className="h-[70vh] w-full bg-slate-800/50" />
    </div>
);

export const MainContent = ({
  activeOpenAITab,
  setActiveOpenAITab,
  activeDataTab,
  setActiveDataTab,
  activeGroup,
  extractedLinks,
}: MainContentProps) => {
  const { extractedLinks: hookExtractedLinks, handleExtractLinks } = useLinkExtractor(setActiveDataTab);

  // Combine extracted links from props and hook
  const allExtractedLinks = [...extractedLinks, ...hookExtractedLinks];

  const handleOpenURLScrap = () => {
    setActiveDataTab('url-scrap');
  };

  if (activeGroup === 'openai') {
    return (
      <Tabs value={activeOpenAITab} onValueChange={setActiveOpenAITab} className="w-full h-full flex flex-col">
        <div className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <TabsContent value="chat" className="h-full m-0">
              <OpenAIChat />
            </TabsContent>
            <TabsContent value="commander" className="h-full m-0">
              <AgentCommander />
            </TabsContent>
            <TabsContent value="workflow" className="h-full m-0">
              <WorkflowBuilder />
            </TabsContent>
            <TabsContent value="orchestrator" className="h-full m-0">
              <FUKOConsole />
            </TabsContent>
            <TabsContent value="browser" className="h-full m-0">
              <BrowserCore onLinksExtracted={handleExtractLinks} onOpenURLScrap={handleOpenURLScrap} />
            </TabsContent>
          </Suspense>
        </div>
      </Tabs>
    );
  }

  if (activeGroup === 'data') {
    return (
      <Tabs value={activeDataTab} onValueChange={setActiveDataTab} className="h-full flex flex-col">
        <div className="flex-1">
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
              <URLScrapTable extractedLinks={allExtractedLinks} />
            </TabsContent>
            <TabsContent value="meta-decisions" className="h-full m-0">
              <MetaDecisionLayer />
            </TabsContent>
            <TabsContent value="full-armor" className="h-full m-0">
              <FullArmorDashboard />
            </TabsContent>
          </Suspense>
        </div>
      </Tabs>
    );
  }

  return null;
};
