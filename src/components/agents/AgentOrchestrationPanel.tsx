
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, Workflow, Settings, Activity,
  ArrowRight, Zap, Shield
} from 'lucide-react';

const AgentOrchestrationPanel = () => {
  const [orchestrationMode, setOrchestrationMode] = useState('automatic');
  const [priority, setPriority] = useState([50]);
  
  const agentFlows = [
    {
      id: 'decision-flow-1',
      name: 'Strategic Decision Flow',
      agents: ['@ceo', '@router', '@guardian'],
      status: 'active',
      throughput: 142
    },
    {
      id: 'creative-flow-1', 
      name: 'Creative Processing Flow',
      agents: ['@creative', '@router'],
      status: 'paused',
      throughput: 67
    },
    {
      id: 'monitoring-flow-1',
      name: 'System Monitoring Flow', 
      agents: ['@guardian', '@router'],
      status: 'active',
      throughput: 203
    }
  ];

  const coordinationRules = [
    {
      id: 'rule-1',
      name: 'Priority Escalation',
      condition: 'High priority tasks',
      action: 'Route to CEO Agent',
      enabled: true
    },
    {
      id: 'rule-2',
      name: 'Load Balancing',
      condition: 'Agent overload detected',
      action: 'Redistribute tasks',
      enabled: true
    },
    {
      id: 'rule-3',
      name: 'Error Recovery',
      condition: 'Agent failure',
      action: 'Activate backup agent',
      enabled: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Orchestration Controls */}
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>Orchestration Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Orchestration Mode</label>
              <Select value={orchestrationMode} onValueChange={setOrchestrationMode}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">System Priority: {priority[0]}%</label>
              <Slider
                value={priority}
                onValueChange={setPriority}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">Quick Actions</label>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-green-600 text-green-400">
                  <Zap className="h-3 w-3 mr-1" />
                  Optimize
                </Button>
                <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                  <Shield className="h-3 w-3 mr-1" />
                  Safety
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Flows */}
      <Card className="bg-slate-800/50 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center space-x-2">
            <Workflow className="h-6 w-6" />
            <span>Agent Flows</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentFlows.map((flow) => (
              <div key={flow.id} className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-white font-medium">{flow.name}</div>
                    <div className="text-slate-400 text-sm">
                      Throughput: {flow.throughput} ops/min
                    </div>
                  </div>
                  <Badge className={
                    flow.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }>
                    {flow.status}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  {flow.agents.map((agent, index) => (
                    <React.Fragment key={agent}>
                      <div className="bg-slate-600/50 px-2 py-1 rounded text-xs text-cyan-400 font-mono">
                        {agent}
                      </div>
                      {index < flow.agents.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                <div className="flex justify-end mt-3 space-x-2">
                  <Button size="sm" variant="outline" className="border-slate-600">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={
                      flow.status === 'active' 
                        ? 'border-red-600 text-red-400' 
                        : 'border-green-600 text-green-400'
                    }
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    {flow.status === 'active' ? 'Pause' : 'Resume'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coordination Rules */}
      <Card className="bg-slate-800/50 border-green-800/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span>Coordination Rules</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {coordinationRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{rule.name}</div>
                  <div className="text-slate-400 text-xs">
                    If: {rule.condition} → Then: {rule.action}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={
                    rule.enabled 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }>
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 border-slate-600"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <Button variant="outline" className="w-full border-green-600 text-green-400">
              Add New Rule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentOrchestrationPanel;
