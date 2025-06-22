
import React, { Suspense } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
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
const MetaDecisionLayer = React.lazy(() => import('./MetaDecisionLayer'));
const FullArmorDashboard = React.lazy(() => import('./FullArmorDashboard'));
const BrowserCore = React.lazy(() => import('./BrowserCore'));
const ErrorReportGenerator = React.lazy(() => import('./ErrorReportGenerator'));
const PlatformAuditReport = React.lazy(() => import('./PlatformAuditReport'));

// New unified components
const UnifiedIntelligenceCore = React.lazy(() => import('./unified/UnifiedIntelligenceCore'));
const CognitiveResearchHub = React.lazy(() => import('./research/CognitiveResearchHub'));
const SystemDiagnostics = React.lazy(() => import('./diagnostics/SystemDiagnostics'));

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
  const handleOpenURLScrap = () => {
    setActiveDataTab('url-scrap');
  };

  // Funkcja adapter dla BrowserCore
  const handleBrowserLinksExtracted = (links: Array<{url: string, title: string, domain: string}>) => {
    // Ta funkcja zostanie wywołana przez BrowserCore z wynikami scrapingu
    console.log('Links extracted from browser:', links);
    // Przekieruj do URL Scrap tab
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
              <BrowserCore 
                onLinksExtracted={handleBrowserLinksExtracted} 
                onOpenURLScrap={handleOpenURLScrap} 
              />
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
              <URLScrapTable extractedLinks={extractedLinks} />
            </TabsContent>
            <TabsContent value="meta-decisions" className="h-full m-0">
              <MetaDecisionLayer />
            </TabsContent>
            <TabsContent value="full-armor" className="h-full m-0">
              <FullArmorDashboard />
            </TabsContent>
            <TabsContent value="unified-intelligence" className="h-full m-0">
              <UnifiedIntelligenceCore />
            </TabsContent>
            <TabsContent value="cognitive-research" className="h-full m-0">
              <CognitiveResearchHub />
            </TabsContent>
            <TabsContent value="system-diagnostics" className="h-full m-0">
              <SystemDiagnostics />
            </TabsContent>
            <TabsContent value="platform-audit" className="h-full m-0">
              <PlatformAuditReport />
            </TabsContent>
            <TabsContent value="error-report" className="h-full m-0">
              <ErrorReportGenerator />
            </TabsContent>
          </Suspense>
        </div>
      </Tabs>
    );
  }

  return null;
};
