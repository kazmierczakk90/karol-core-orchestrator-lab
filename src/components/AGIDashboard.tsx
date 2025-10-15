
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
import InfluenceGraphView from './InfluenceGraphView';
import StyleConsistencyChart from './StyleConsistencyChart';
import KarolCore10Dashboard from './KarolCore10Dashboard';

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
        <TabsList className="grid w-full grid-cols-7 bg-slate-800/50 text-xs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="monitoring">P0 Monitor</TabsTrigger>
          <TabsTrigger value="cognitive">P3 Cognitive</TabsTrigger>
          <TabsTrigger value="agi10">AGI 10.0</TabsTrigger>
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
        
        <TabsContent value="cognitive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-purple-800/30">
              <CardHeader>
                <CardTitle className="text-purple-400">🧠 Influence Graph</CardTitle>
                <CardDescription>Decision influence mapping & agent interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <InfluenceGraphView />
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-pink-800/30">
              <CardHeader>
                <CardTitle className="text-pink-400">🎨 Style Consistency</CardTitle>
                <CardDescription>Agent style coherence & characteristics tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <StyleConsistencyChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="agi10" className="space-y-6">
          <Card className="bg-slate-800/50 border-cyan-800/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">🚀 Karol-Core 10.0 Orchestration</CardTitle>
              <CardDescription>
                Adaptive decision making • Contextual memory • Dynamic agent response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KarolCore10Dashboard />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AGIDashboard;
