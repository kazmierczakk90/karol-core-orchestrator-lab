
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Command, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fukoCore } from '@/services/fukoCore';
import { Agent } from '@/types/fuko';
import AgentCard from './AgentCard';
import AgentList from './AgentList';
import QuickActions from './QuickActions';
import SystemOverview from './SystemOverview';
import FUKOStats from './FUKOStats';

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

  const coreAgents = agents.filter(a => a.category === 'core');
  const fukoAgents = agents.filter(a => a.category === 'fuko');
  const systemAgents = agents.filter(a => a.category === 'system');

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
                <AgentCard key={agent.id} agent={agent} onToggle={toggleAgent} />
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
              <AgentList agents={fukoAgents} />
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
              <AgentList agents={systemAgents} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Overview */}
      <div className="space-y-6">
        <SystemOverview agents={agents} kpiData={kpiData} />
        <QuickActions onExecuteAction={executeQuickAction} />
        <FUKOStats messages={fukoCore.getMessages()} />
      </div>
    </div>
  );
};

export default AGIDashboard;
