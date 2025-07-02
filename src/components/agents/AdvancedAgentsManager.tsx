
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, Users, Activity, Settings, 
  Zap, Brain, TrendingUp, Shield
} from 'lucide-react';

// Import specialized components
import AgentSetupStepper from './AgentSetupStepper';
import AgentStats from './AgentStats';
import TestAgentSidebar from './TestAgentSidebar';
import AgentOrchestrationPanel from './AgentOrchestrationPanel';

const AdvancedAgentsManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agentMetrics = {
    totalAgents: 12,
    activeAgents: 8,
    testingAgents: 2,
    performance: 94.2
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-slate-800/50 border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span>Advanced Agents Manager</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500">
              {agentMetrics.activeAgents} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 p-3 rounded-lg text-center">
              <div className="text-cyan-400 text-xl font-bold">{agentMetrics.totalAgents}</div>
              <div className="text-slate-400 text-sm">Total Agents</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg text-center">
              <div className="text-green-400 text-xl font-bold">{agentMetrics.activeAgents}</div>
              <div className="text-slate-400 text-sm">Active</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg text-center">
              <div className="text-yellow-400 text-xl font-bold">{agentMetrics.testingAgents}</div>
              <div className="text-slate-400 text-sm">Testing</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg text-center">
              <div className="text-purple-400 text-xl font-bold">{agentMetrics.performance}%</div>
              <div className="text-slate-400 text-sm">Performance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-cyan-600">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="setup" className="text-white data-[state=active]:bg-green-600">
            <Settings className="h-4 w-4 mr-2" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-white data-[state=active]:bg-purple-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="testing" className="text-white data-[state-active]:bg-yellow-600">
            <Zap className="h-4 w-4 mr-2" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="orchestration" className="text-white data-[state=active]:bg-blue-600">
            <Brain className="h-4 w-4 mr-2" />
            Orchestration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AgentStats />
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <AgentSetupStepper />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <AgentStats detailed={true} />
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-yellow-800/30">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Agent Testing Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <div className="text-slate-300 mb-2">Testing Environment</div>
                    <div className="text-sm text-slate-500">
                      Safe environment for agent testing and validation
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <TestAgentSidebar />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orchestration" className="space-y-6">
          <AgentOrchestrationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAgentsManager;
