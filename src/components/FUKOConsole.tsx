
import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const FukoMessages = React.lazy(() => import('./fuko/FukoMessages'));
const FukoCreateMessage = React.lazy(() => import('./fuko/FukoCreateMessage'));
const FukoAgents = React.lazy(() => import('./fuko/FukoAgents'));
const FukoScenarios = React.lazy(() => import('./fuko/FukoScenarios'));
const FukoAnalytics = React.lazy(() => import('./fuko/FukoAnalytics'));

const LoadingFallback = () => (
    <div className="p-4">
        <Skeleton className="h-40 w-full bg-slate-700/50" />
    </div>
);

const FUKOConsole = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>FUKO-PZK Decision System</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Advanced agent decision framework with automated routing and execution
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-blue-800/30">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="create">Create FUKO</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <Suspense fallback={<LoadingFallback />}>
          <TabsContent value="messages">
            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>FUKO Messages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FukoMessages />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Create FUKO Message</CardTitle>
              </CardHeader>
              <CardContent>
                <FukoCreateMessage />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents">
            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Active Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <FukoAgents />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios">
            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">FUKO Scenarios</CardTitle>
                <CardDescription className="text-slate-300">
                  Pre-configured decision scenarios for common use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FukoScenarios />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <FukoAnalytics />
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  );
};

export default FUKOConsole;
