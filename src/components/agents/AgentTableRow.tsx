
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Activity, Play, Pause, Settings, Trash2 } from 'lucide-react';

interface SystemAgent {
  id: string;
  name: string;
  type: 'core' | 'karol' | 'integration' | 'utility';
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  description: string;
  tasksCompleted: number;
  lastUsed: Date;
  capabilities: string[];
  version: string;
}

interface AgentTableRowProps {
  agent: SystemAgent;
  onToggleStatus: (agentId: string) => void;
}

const AgentTableRow = ({ agent, onToggleStatus }: AgentTableRowProps) => {
  const typeColors = {
    core: 'bg-blue-500/20 text-blue-400',
    karol: 'bg-purple-500/20 text-purple-400',
    integration: 'bg-green-500/20 text-green-400',
    utility: 'bg-orange-500/20 text-orange-400'
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-gray-500/20 text-gray-400',
    maintenance: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400'
  };

  return (
    <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
      <TableCell>
        <div>
          <div className="font-mono text-cyan-400 font-semibold">{agent.id}</div>
          <div className="text-slate-300 font-medium">{agent.name}</div>
          <div className="text-slate-400 text-sm">{agent.description}</div>
        </div>
      </TableCell>
      
      <TableCell>
        <Badge className={`${typeColors[agent.type]}`}>
          {agent.type}
        </Badge>
      </TableCell>
      
      <TableCell>
        <Badge className={`${statusColors[agent.status]}`}>
          {agent.status}
        </Badge>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-slate-400" />
          <span className="text-white font-semibold">{agent.tasksCompleted}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.slice(0, 3).map((capability) => (
            <Badge key={capability} className="bg-slate-600/50 text-slate-300 text-xs">
              {capability}
            </Badge>
          ))}
          {agent.capabilities.length > 3 && (
            <Badge className="bg-slate-600/50 text-slate-300 text-xs">
              +{agent.capabilities.length - 3}
            </Badge>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <span className="text-slate-300 font-mono text-sm">{agent.version}</span>
      </TableCell>
      
      <TableCell>
        <span className="text-slate-400 text-sm">
          {agent.lastUsed.toLocaleDateString()}
        </span>
      </TableCell>
      
      <TableCell>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="border-slate-600 hover:border-cyan-400"
            onClick={() => onToggleStatus(agent.id)}
          >
            {agent.status === 'active' ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="border-slate-600 hover:border-blue-400"
          >
            <Settings className="h-3 w-3" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="border-slate-600 hover:border-red-400 text-red-400"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AgentTableRow;
