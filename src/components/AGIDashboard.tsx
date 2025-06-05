
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Eye, Pause, Play, Settings, Activity, Cpu, Command } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fukoCore } from '@/services/fukoCore';
import { Agent } from '@/types/fuko';

const AGIDashboard = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [kpiData, setKpiData] = useState<any>({});

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setAgents(fukoCore.getAgents());
    setKpiData(fukoCore.getKPIData());
  };

  const toggleAgent = (agentId: string, currentStatus: string) => {
    if (currentStatus === 'active') {
      fukoCore.deactivateAgent(agentId);
    } else {
      fukoCore.activateAgent(agentId);
    }
    refreshData();
  };

  const executeQuickAction = (action: string) => {
    switch (action) {
      case 'style-shift':
        fukoCore.createFUKOMessage(
          'modify_decision_style',
          'User requested style modification',
          'current_style_analysis',
          'Apply new decision parameters',
          'user_command_trigger',
          'style_engine',
          '&style-shift',
          '@karol-core',
          'high'
        );
        break;
      case 'activate-agent':
        fukoCore.createFUKOMessage(
          'activate_dormant_agent',
          'System requires additional processing power',
          'agent_availability_check',
          'Bring agent online',
          'manual_activation_request',
          'agent_manager',
          '&activate-agent',
          '@system-admin',
          'medium'
        );
        break;
      case 'freeze-evolution':
        fukoCore.createFUKOMessage(
          'freeze_evolution_process',
          'Preserve current system state',
          'evolution_state_monitoring',
          'Lock current configuration',
          'evolution_freeze_command',
          'evolution_control',
          '&freeze-evolution',
          '@guardian-core',
          'high'
        );
        break;
      case 'emergency-stop':
        fukoCore.createFUKOMessage(
          'emergency_system_halt',
          'Critical situation detected',
          'emergency_protocols',
          'Safe system shutdown',
          'emergency_trigger',
          'safety_systems',
          '/emergency_stop',
          '@guardian-core',
          'urgent'
        );
        break;
    }
    refreshData();
  };

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

  const coreAgents = agents.filter(a => a.category === 'core');
  const fukoAgents = agents.filter(a => a.category === 'fuko');
  const systemAgents = agents.filter(a => a.category === 'system');
  const projectAgents = agents.filter(a => a.category === 'project');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Agent Management Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Core Agents */}
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Core AGI Agents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coreAgents.map((agent) => (
                <div key={agent.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
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
                        onClick={() => toggleAgent(agent.id, agent.status)}
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FUKO & System Agents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center space-x-2">
                <Command className="h-4 w-4" />
                <span>FUKO Agents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {fukoAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                    <span className="text-white text-sm">{agent.name}</span>
                    <Badge variant="outline" className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center space-x-2">
                <Cpu className="h-4 w-4" />
                <span>System Agents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                    <span className="text-white text-sm">{agent.name}</span>
                    <Badge variant="outline" className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
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

        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => executeQuickAction('style-shift')}
              >
                Style Shift
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-cyan-500/50 text-cyan-400"
                onClick={() => executeQuickAction('activate-agent')}
              >
                Activate Agent
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-yellow-500/50 text-yellow-400"
                onClick={() => executeQuickAction('freeze-evolution')}
              >
                Freeze Evolution
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-red-500/50 text-red-400"
                onClick={() => executeQuickAction('emergency-stop')}
              >
                Emergency Stop
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">FUKO Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Messages Today</span>
                <span className="text-white">{fukoCore.getMessages().length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Completed</span>
                <span className="text-green-400">
                  {fukoCore.getMessages().filter(m => m.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Processing</span>
                <span className="text-blue-400">
                  {fukoCore.getMessages().filter(m => m.status === 'processing').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Failed</span>
                <span className="text-red-400">
                  {fukoCore.getMessages().filter(m => m.status === 'failed').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AGIDashboard;
