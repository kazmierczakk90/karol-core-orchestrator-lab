
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AgentList from './AgentList';
import QuickActions from './QuickActions';
import SystemOverview from './SystemOverview';
import FUKOStats from './FUKOStats';

const AGIDashboard = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400">Karol Core AGI Dashboard</CardTitle>
          <CardDescription className="text-slate-300">
            Multi-agent system with FUKO-PZK decision framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SystemOverview />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentList />
        <div className="space-y-6">
          <QuickActions />
          <FUKOStats />
        </div>
      </div>
    </div>
  );
};

export default AGIDashboard;
