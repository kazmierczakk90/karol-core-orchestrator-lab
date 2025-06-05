
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity } from 'lucide-react';
import { Agent, KPIData } from '@/types/fuko';

interface SystemOverviewProps {
  agents: Agent[];
  kpiData: KPIData;
}

const SystemOverview = ({ agents, kpiData }: SystemOverviewProps) => {
  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>System Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">AGI Core Health</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              Optimal
            </Badge>
          </div>
          
          {Object.entries(kpiData).map(([key, data]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 capitalize text-sm">{key.replace('_', ' ')}</span>
                <span className="text-white text-sm">{data.value}%</span>
              </div>
              <Progress value={data.value} className="h-1" />
            </div>
          ))}
          
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Active Agents</span>
            <span className="text-cyan-400">{agents.filter(a => a.status === 'active').length}/{agents.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Last Update</span>
            <span className="text-slate-400">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemOverview;
