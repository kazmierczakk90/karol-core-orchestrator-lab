
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Command, Cpu, Activity, Pause, Play } from 'lucide-react';
import { Agent } from '@/types/fuko';

interface AgentCardProps {
  agent: Agent;
  onToggle: (agentId: string, currentStatus: string) => void;
}

const AgentCard = ({ agent, onToggle }: AgentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400/50';
      case 'dormant': return 'text-yellow-400 border-yellow-400/50';
      case 'monitoring': return 'text-blue-400 border-blue-400/50';
      default: return 'text-gray-400 border-gray-400/50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <Brain className="h-4 w-4" />;
      case 'fuko': return <Command className="h-4 w-4" />;
      case 'system': return <Cpu className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {getCategoryIcon(agent.category)}
          <div>
            <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
            <p className="text-xs text-slate-400">Mode: {agent.mode}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={getStatusColor(agent.status)}>
            {agent.status}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onToggle(agent.id, agent.status)}
          >
            {agent.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Performance</span>
          <span className="text-white">{agent.performance.toFixed(0)}%</span>
        </div>
        <Progress value={agent.performance} className="h-1" />
      </div>
    </div>
  );
};

export default AgentCard;
