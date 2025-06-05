
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Zap, Clock } from 'lucide-react';

const SystemOverview = () => {
  const systemStats = {
    status: 'operational',
    activeAgents: 4,
    totalMessages: 127,
    uptime: '24h 15m',
    performance: 94
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-500/20 rounded">
          <Activity className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <p className="text-sm text-slate-400">System Status</p>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            {systemStats.status}
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-500/20 rounded">
          <Database className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Active Agents</p>
          <p className="text-lg font-semibold text-white">{systemStats.activeAgents}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-2 bg-cyan-500/20 rounded">
          <Zap className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Messages</p>
          <p className="text-lg font-semibold text-white">{systemStats.totalMessages}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-2 bg-yellow-500/20 rounded">
          <Clock className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Uptime</p>
          <p className="text-lg font-semibold text-white">{systemStats.uptime}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
