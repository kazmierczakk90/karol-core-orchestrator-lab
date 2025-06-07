
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Play, Pause, Settings, BarChart } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'offline';
  performance: number;
  lastActivity?: string;
  tasks?: number;
}

interface AgentStatusGridProps {
  agents: Agent[];
  onToggleAgent: (agentId: string) => void;
  onViewDetails: (agentId: string) => void;
}

const AgentStatusGrid = ({ agents, onToggleAgent, onViewDetails }: AgentStatusGridProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'standby': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400">Agent Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">{agent.name}</h3>
                <Badge className={getStatusColor(agent.status)}>
                  {agent.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Performance</span>
                    <span className="text-cyan-400">{agent.performance}%</span>
                  </div>
                  <Progress value={agent.performance} className="h-2" />
                </div>
                
                {agent.tasks && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Tasks</span>
                    <span className="text-white">{agent.tasks}</span>
                  </div>
                )}
                
                {agent.lastActivity && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Last Activity</span>
                    <span className="text-slate-400">{agent.lastActivity}</span>
                  </div>
                )}
                
                <div className="flex space-x-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => onToggleAgent(agent.id)}
                    className={agent.status === 'active' ? 
                      "bg-red-500/20 text-red-400 hover:bg-red-500/30" : 
                      "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    }
                  >
                    {agent.status === 'active' ? 
                      <Pause className="h-3 w-3" /> : 
                      <Play className="h-3 w-3" />
                    }
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 flex-1"
                    onClick={() => onViewDetails(agent.id)}
                  >
                    <BarChart className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentStatusGrid;
