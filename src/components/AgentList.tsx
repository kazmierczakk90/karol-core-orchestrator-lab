
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, Clock } from 'lucide-react';

const AgentList = () => {
  const agents = [
    { id: '@ceo', name: 'CEO Agent', status: 'active', performance: 95, mode: 'CEO' },
    { id: '@router', name: 'Router Core', status: 'active', performance: 88, mode: 'ECHO' },
    { id: '@guardian', name: 'Guardian Core', status: 'monitoring', performance: 92, mode: 'MENTOR' },
    { id: '@creative', name: 'Creative Agent', status: 'dormant', performance: 78, mode: 'CREATIVE' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'monitoring': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'dormant': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span>Active Agents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <span className="text-white font-medium">{agent.name}</span>
                  <span className="text-xs text-slate-400">{agent.id}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-300">{agent.performance}%</span>
                <Badge className={getStatusColor(agent.status)}>
                  {agent.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentList;
