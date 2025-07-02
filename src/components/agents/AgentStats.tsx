
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Activity, 
  Zap, Brain, Clock, CheckCircle 
} from 'lucide-react';

interface AgentStatsProps {
  detailed?: boolean;
}

const AgentStats = ({ detailed = false }: AgentStatsProps) => {
  const agentData = [
    {
      id: '@ceo',
      name: 'CEO Agent',
      status: 'active',
      performance: 95,
      uptime: 99.2,
      tasks: 143,
      efficiency: 87,
      trend: 'up'
    },
    {
      id: '@router', 
      name: 'Router Core',
      status: 'active',
      performance: 88,
      uptime: 97.5,
      tasks: 89,
      efficiency: 82,
      trend: 'up'
    },
    {
      id: '@guardian',
      name: 'Guardian Core', 
      status: 'monitoring',
      performance: 92,
      uptime: 98.1,
      tasks: 67,
      efficiency: 85,
      trend: 'stable'
    },
    {
      id: '@creative',
      name: 'Creative Agent',
      status: 'dormant',
      performance: 78,
      uptime: 45.2,
      tasks: 23,
      efficiency: 73,
      trend: 'down'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'monitoring': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'dormant': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-yellow-400" />;
    }
  };

  if (!detailed) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agentData.map((agent) => (
          <Card key={agent.id} className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center justify-between">
                <span>{agent.name}</span>
                <Badge className={getStatusColor(agent.status)}>
                  {agent.status}
                </Badge>
              </CardTitle>
              <div className="text-xs text-slate-400 font-mono">{agent.id}</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Performance</span>
                  <span className="text-cyan-400">{agent.performance}%</span>
                </div>
                <Progress value={agent.performance} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-green-400 font-semibold">{agent.uptime}%</div>
                  <div className="text-slate-500">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-semibold">{agent.tasks}</div>
                  <div className="text-slate-500">Tasks</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {getTrendIcon(agent.trend)}
                  <span className="text-xs text-slate-400">Trend</span>
                </div>
                <div className="text-xs text-slate-300">{agent.efficiency}% efficiency</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Detailed Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-cyan-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Overall Performance</span>
                <span className="text-green-400 font-semibold">88.2%</span>
              </div>
              <Progress value={88.2} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-green-400 text-lg font-bold">3</div>
                  <div className="text-slate-400">Active Agents</div>
                </div>
                <div>
                  <div className="text-yellow-400 text-lg font-bold">1</div>
                  <div className="text-slate-400">Monitoring</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-800/30">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Task Processing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Tasks Completed</span>
                <span className="text-purple-400 font-semibold">322</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-green-400 text-lg font-bold">89%</div>
                  <div className="text-slate-400">Success Rate</div>
                </div>
                <div>
                  <div className="text-cyan-400 text-lg font-bold">1.2s</div>
                  <div className="text-slate-400">Avg Response</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-green-800/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Intelligence Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Decision Quality</span>
                <span className="text-green-400 font-semibold">91.5%</span>
              </div>
              <Progress value={91.5} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-400 text-lg font-bold">76</div>
                  <div className="text-slate-400">Learning Events</div>
                </div>
                <div>
                  <div className="text-yellow-400 text-lg font-bold">5</div>
                  <div className="text-slate-400">Adaptations</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Agent Table */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Detailed Agent Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentData.map((agent) => (
              <div key={agent.id} className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-white font-medium">{agent.name}</div>
                    <div className="text-slate-400 text-sm font-mono">{agent.id}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(agent.trend)}
                    <Badge className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Performance</span>
                      <span className="text-cyan-400">{agent.performance}%</span>
                    </div>
                    <Progress value={agent.performance} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Uptime</span>
                      <span className="text-green-400">{agent.uptime}%</span>
                    </div>
                    <Progress value={agent.uptime} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Efficiency</span>
                      <span className="text-purple-400">{agent.efficiency}%</span>
                    </div>
                    <Progress value={agent.efficiency} className="h-2" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-yellow-400 text-lg font-bold">{agent.tasks}</div>
                    <div className="text-slate-400 text-sm">Tasks</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentStats;
