
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentList from './AgentList';
import QuickActions from './QuickActions';
import SystemOverview from './SystemOverview';
import FUKOStats from './FUKOStats';
import SafetyCore from './advanced-core/SafetyCore';

const AGIDashboard = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400">Karol Core AGI Dashboard</CardTitle>
          <CardDescription className="text-slate-300">
            Multi-agent system with FUKO-PZK decision framework + Level 20+ Safety Protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SystemOverview />
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="safety">Safety Core</TabsTrigger>
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
        
        <TabsContent value="safety" className="space-y-6">
          <SafetyCore />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AGIDashboard;
