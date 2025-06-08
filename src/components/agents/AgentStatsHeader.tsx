
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Plus } from 'lucide-react';

interface AgentStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  error: number;
}

interface AgentStatsHeaderProps {
  stats: AgentStats;
}

const AgentStatsHeader = ({ stats }: AgentStatsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <span>System Agents</span>
        </CardTitle>
        <CardDescription className="text-slate-300">
          Zarządzanie wszystkimi agentami w systemie Karol Core
        </CardDescription>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2 text-sm">
          <Badge className="bg-green-500/20 text-green-400">
            Active: {stats.active}
          </Badge>
          <Badge className="bg-gray-500/20 text-gray-400">
            Inactive: {stats.inactive}
          </Badge>
          <Badge className="bg-yellow-500/20 text-yellow-400">
            Maintenance: {stats.maintenance}
          </Badge>
          {stats.error > 0 && (
            <Badge className="bg-red-500/20 text-red-400">
              Error: {stats.error}
            </Badge>
          )}
        </div>
        
        <Button className="bg-gradient-primary hover:bg-gradient-secondary">
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>
    </div>
  );
};

export default AgentStatsHeader;
