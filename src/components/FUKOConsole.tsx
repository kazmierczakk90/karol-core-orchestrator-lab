import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Command, AlertTriangle, Activity, Zap, MessageSquare } from 'lucide-react';
import { fukoCore } from '@/services/fukoCore';
import { FUKOMessage, Agent } from '@/types/fuko';

const FUKOConsole = () => {
  const [messages, setMessages] = useState<FUKOMessage[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [kpiData, setKpiData] = useState<Record<string, { value: number; threshold: number; trend: string }>>({});
  
  // FUKO Message creation form
  const [newMessage, setNewMessage] = useState({
    F: '',
    U: '',
    K: '',
    O: '',
    P: '',
    Z: '',
    K2: '',
    sourceAgent: '@ceo',
    priority: 'medium' as const
  });

  useEffect(() => {
    refreshData();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setMessages(fukoCore.getMessages());
    setAgents(fukoCore.getAgents());
    setAlerts(fukoCore.getAlerts());
    setKpiData(fukoCore.getKPIData());
  };

  const createFUKOMessage = () => {
    if (!newMessage.F || !newMessage.U || !newMessage.K2) {
      alert('Funkcja (F), Uzasadnienie (U) i Komenda (K2) są wymagane');
      return;
    }

    fukoCore.createFUKOMessage(
      newMessage.F,
      newMessage.U,
      newMessage.K,
      newMessage.O,
      newMessage.P,
      newMessage.Z,
      newMessage.K2,
      newMessage.sourceAgent,
      newMessage.priority
    );

    // Reset form
    setNewMessage({
      F: '',
      U: '',
      K: '',
      O: '',
      P: '',
      Z: '',
      K2: '',
      sourceAgent: '@ceo',
      priority: 'medium'
    });

    refreshData();
  };

  const executeScenario = (scenarioName: string) => {
    const scenarios = {
      'senior_health_check': { userId: 'senior_001' },
      'lead_nurturing': { leadId: 'lead_12345', score: 85 },
      'system_optimization': { currentLoad: 85 },
      'emergency_response': { alertType: 'system_critical' }
    };

    fukoCore.executeScenario(scenarioName, scenarios[scenarioName]);
    refreshData();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>FUKO-PZK Decision System</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Advanced agent decision framework with automated routing and execution
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-blue-800/30">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="create">Create FUKO</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>FUKO Messages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <Card key={message.id} className="bg-slate-900/50 border-slate-700/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(message.priority)}>
                            {message.priority}
                          </Badge>
                          <Badge className={getStatusColor(message.status)}>
                            {message.status}
                          </Badge>
                          <span className="text-sm text-slate-400">
                            {message.sourceAgent} → {message.targetAgent || 'routing...'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-cyan-400 font-semibold">F (Funkcja):</p>
                          <p className="text-white">{message.F}</p>
                        </div>
                        <div>
                          <p className="text-cyan-400 font-semibold">U (Uzasadnienie):</p>
                          <p className="text-white">{message.U}</p>
                        </div>
                        <div>
                          <p className="text-cyan-400 font-semibold">K (Kontekst):</p>
                          <p className="text-white">{message.K}</p>
                        </div>
                        <div>
                          <p className="text-cyan-400 font-semibold">O (Oczekiwany efekt):</p>
                          <p className="text-white">{message.O}</p>
                        </div>
                        <div>
                          <p className="text-cyan-400 font-semibold">P (Próg aktywacji):</p>
                          <p className="text-white">{message.P}</p>
                        </div>
                        <div>
                          <p className="text-cyan-400 font-semibold">Z (Zależność):</p>
                          <p className="text-white">{message.Z}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-cyan-400 font-semibold">K2 (Komenda):</p>
                          <p className="text-white font-mono">{message.K2}</p>
                        </div>
                        {message.executionResult && (
                          <div className="col-span-2">
                            <p className="text-green-400 font-semibold">Wynik wykonania:</p>
                            <p className="text-green-300">{message.executionResult}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">Create FUKO Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="F" className="text-slate-300">F - Funkcja (Function)</Label>
                  <Input
                    id="F"
                    value={newMessage.F}
                    onChange={(e) => setNewMessage({...newMessage, F: e.target.value})}
                    placeholder="Co agent ma wykonać"
                    className="bg-slate-900/50 border-slate-700/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="U" className="text-slate-300">U - Uzasadnienie (Justification)</Label>
                  <Input
                    id="U"
                    value={newMessage.U}
                    onChange={(e) => setNewMessage({...newMessage, U: e.target.value})}
                    placeholder="Dlaczego to robi"
                    className="bg-slate-900/50 border-slate-700/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="K" className="text-slate-300">K - Kontekst (Context)</Label>
                  <Input
                    id="K"
                    value={newMessage.K}
                    onChange={(e) => setNewMessage({...newMessage, K: e.target.value})}
                    placeholder="Warunki działania"
                    className="bg-slate-900/50 border-slate-700/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="O" className="text-slate-300">O - Oczekiwany efekt (Expected outcome)</Label>
                  <Input
                    id="O"
                    value={newMessage.O}
                    onChange={(e) => setNewMessage({...newMessage, O: e.target.value})}
                    placeholder="Co ma się wydarzyć"
                    className="bg-slate-900/50 border-slate-700/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="P" className="text-slate-300">P - Próg aktywacji (Activation trigger)</Label>
                  <Input
                    id="P"
                    value={newMessage.P}
                    onChange={(e) => setNewMessage({...newMessage, P: e.target.value})}
                    placeholder="Kiedy to uruchomić"
                    className="bg-slate-900/50 border-slate-700/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="Z" className="text-slate-300">Z - Zależność (Dependencies)</Label>
                  <Input
                    id="Z"
                    value={newMessage.Z}
                    onChange={(e) => setNewMessage({...newMessage, Z: e.target.value})}
                    placeholder="Od czego zależy wykonanie"
                    className="bg-slate-900/50 border-slate-700/50 text-white"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="K2" className="text-slate-300">K2 - Komenda (Command)</Label>
                  <Input
                    id="K2"
                    value={newMessage.K2}
                    onChange={(e) => setNewMessage({...newMessage, K2: e.target.value})}
                    placeholder="/command lub &agent-command"
                    className="bg-slate-900/50 border-slate-700/50 text-white font-mono"
                  />
                </div>
                <div className="flex space-x-4 col-span-2">
                  <Button onClick={createFUKOMessage} className="bg-blue-600 hover:bg-blue-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Create FUKO Message
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fukoCore.checkKPIThresholds()}
                    className="border-yellow-500/50 text-yellow-400"
                  >
                    Check KPI Thresholds
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <Card key={agent.id} className="bg-slate-900/50 border-slate-700/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-sm">{agent.name}</CardTitle>
                        <Badge className={agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                          {agent.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-400">Mode:</span>
                          <span className="text-cyan-400 ml-2">{agent.mode}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Performance:</span>
                          <span className="text-white ml-2">{agent.performance.toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Capabilities:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {agent.capabilities.slice(0, 3).map(cap => (
                              <Badge key={cap} variant="outline" className="text-xs">
                                {cap}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios">
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">FUKO Scenarios</CardTitle>
              <CardDescription className="text-slate-300">
                Pre-configured decision scenarios for common use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => executeScenario('senior_health_check')}
                  className="bg-green-600 hover:bg-green-700 h-auto p-4"
                >
                  <div className="text-left">
                    <p className="font-semibold">Senior Health Check</p>
                    <p className="text-sm opacity-80">Monitor senior activity and health metrics</p>
                  </div>
                </Button>
                <Button 
                  onClick={() => executeScenario('lead_nurturing')}
                  className="bg-blue-600 hover:bg-blue-700 h-auto p-4"
                >
                  <div className="text-left">
                    <p className="font-semibold">Lead Nurturing</p>
                    <p className="text-sm opacity-80">Convert high-scoring leads to customers</p>
                  </div>
                </Button>
                <Button 
                  onClick={() => executeScenario('system_optimization')}
                  className="bg-purple-600 hover:bg-purple-700 h-auto p-4"
                >
                  <div className="text-left">
                    <p className="font-semibold">System Optimization</p>
                    <p className="text-sm opacity-80">Optimize system performance and resources</p>
                  </div>
                </Button>
                <Button 
                  onClick={() => executeScenario('emergency_response')}
                  className="bg-red-600 hover:bg-red-700 h-auto p-4"
                >
                  <div className="text-left">
                    <p className="font-semibold">Emergency Response</p>
                    <p className="text-sm opacity-80">Handle critical system alerts</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>KPI Monitoring</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(kpiData).map(([key, data]) => (
                    <div key={key} className="p-3 bg-slate-900/50 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white capitalize">{key.replace('_', ' ')}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white">{data.value}</span>
                          <Badge className={data.value >= data.threshold ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {data.trend}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${data.value >= data.threshold ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, (data.value / data.threshold) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>System Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alerts.length === 0 ? (
                    <p className="text-slate-400">No active alerts</p>
                  ) : (
                    alerts.map((alert, index) => (
                      <div key={index} className="p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                        {alert}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FUKOConsole;
