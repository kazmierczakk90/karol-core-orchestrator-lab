
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentList from './AgentList';
import QuickActions from './QuickActions';
import SystemOverview from './SystemOverview';
import FUKOStats from './FUKOStats';
import SafetyCore from './advanced-core/SafetyCore';
import ComprehensiveOptimizationManager from './optimization/ComprehensiveOptimizationManager';
import AdvancedAgentsManager from './agents/AdvancedAgentsManager';
import AgentUptimeTable from './AgentUptimeTable';

const AGIDashboard = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400">Karol Core AGI Dashboard</CardTitle>
          <CardDescription className="text-slate-300">
            Multi-agent system with FUKO-PZK decision framework + Level 20+ Safety Protocols + 12-Area Optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SystemOverview />
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="agents">Advanced Agents</TabsTrigger>
          <TabsTrigger value="safety">Safety Core</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="monitoring">P0 Monitoring</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AgentList />
            <div className="space-y-6">
              <QuickActions />
              <FUKOStats />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="agents" className="space-y-6">
          <AdvancedAgentsManager />
        </TabsContent>
        
        <TabsContent value="safety" className="space-y-6">
          <SafetyCore />
        </TabsContent>
        
        <TabsContent value="optimization" className="space-y-6">
          <ComprehensiveOptimizationManager />
        </TabsContent>
        
        <TabsContent value="monitoring" className="space-y-6">
          <AgentUptimeTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AGIDashboard;
