
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Eye, Pause, Play, Settings, Activity, Cpu } from 'lucide-react';

const AGIDashboard = () => {
  const agents = [
    { 
      id: 'karol-core', 
      name: 'Karol-Core', 
      status: 'active', 
      mode: 'CEO', 
      performance: 92,
      lastUpdate: '2 min ago'
    },
    { 
      id: 'voice-core', 
      name: 'Voice-Core', 
      status: 'active', 
      mode: 'ECHO', 
      performance: 87,
      lastUpdate: '5 min ago'
    },
    { 
      id: 'strategy-agent', 
      name: 'Strategy Agent', 
      status: 'dormant', 
      mode: 'CREATIVE', 
      performance: 74,
      lastUpdate: '1 hour ago'
    },
    { 
      id: 'guardian-core', 
      name: 'Guardian-Core', 
      status: 'monitoring', 
      mode: 'LIVE', 
      performance: 95,
      lastUpdate: 'Real-time'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400/50';
      case 'dormant': return 'text-yellow-400 border-yellow-400/50';
      case 'monitoring': return 'text-blue-400 border-blue-400/50';
      default: return 'text-gray-400 border-gray-400/50';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Agent Management Panel */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-cyan-400 flex items-center space-x-2">
                  <Cpu className="h-5 w-5" />
                  <span>Agent Management</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Active AGI entities and their operational status
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Brain className="h-5 w-5 text-cyan-400" />
                      <div>
                        <h3 className="font-semibold text-white">{agent.name}</h3>
                        <p className="text-sm text-slate-400">Mode: {agent.mode}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                      {agent.status === 'active' ? (
                        <Button variant="ghost" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Performance</span>
                      <span className="text-white">{agent.performance}%</span>
                    </div>
                    <Progress value={agent.performance} className="h-2" />
                    <p className="text-xs text-slate-500">Last update: {agent.lastUpdate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <div className="space-y-6">
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
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Memory Usage</span>
                <span className="text-white">67%</span>
              </div>
              <Progress value={67} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Decision Queue</span>
                <span className="text-cyan-400">3 pending</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Last Backup</span>
                <span className="text-slate-400">6 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Style Shift
              </Button>
              <Button variant="outline" className="w-full border-cyan-500/50 text-cyan-400">
                Activate Agent
              </Button>
              <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-400">
                Freeze Evolution
              </Button>
              <Button variant="outline" className="w-full border-red-500/50 text-red-400">
                Emergency Stop
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AGIDashboard;
