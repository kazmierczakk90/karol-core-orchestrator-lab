
import { Badge } from '@/components/ui/badge';
import { Agent } from '@/types/fuko';

interface AgentListProps {
  agents: Agent[];
}

const AgentList = ({ agents }: AgentListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400/50';
      case 'dormant': return 'text-yellow-400 border-yellow-400/50';
      case 'monitoring': return 'text-blue-400 border-blue-400/50';
      default: return 'text-gray-400 border-gray-400/50';
    }
  };

  return (
    <div className="space-y-2">
      {agents.map((agent) => (
        <div key={agent.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
          <span className="text-white text-sm">{agent.name}</span>
          <Badge variant="outline" className={getStatusColor(agent.status)}>
            {agent.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default AgentList;
