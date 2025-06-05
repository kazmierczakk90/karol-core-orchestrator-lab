import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  Send, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  Zap,
  Brain,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { fukoCore } from '@/services/fukoCore';
import { FUKOMessage, Agent, KPIData } from '@/types/fuko';

const FUKOConsole = () => {
  const [messages, setMessages] = useState<FUKOMessage[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [kpiData, setKpiData] = useState<KPIData>({});
  const [activeTab, setActiveTab] = useState('messages');
  
  // FUKO Message Form State
  const [F, setF] = useState('');
  const [U, setU] = useState('');
  const [K, setK] = useState('');
  const [O, setO] = useState('');
  const [P, setP] = useState('');
  const [Z, setZ] = useState('');
  const [K2, setK2] = useState('');
  const [sourceAgent, setSourceAgent] = useState('@user');
  const [targetAgent, setTargetAgent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setMessages(fukoCore.getMessages());
    setAgents(fukoCore.getAgents());
    setKpiData(fukoCore.getKPIData());
  };

  const createFUKOMessage = () => {
    if (!F.trim() || !U.trim()) {
      alert('Funkcja (F) i Uzasadnienie (U) są wymagane');
      return;
    }

    fukoCore.createFUKOMessage(F, U, K, O, P, Z, K2, sourceAgent, priority as 'low' | 'medium' | 'high' | 'urgent');
    
    // Clear form
    setF('');
    setU('');
    setK('');
    setO('');
    setP('');
    setZ('');
    setK2('');
    setTargetAgent('');
    
    refreshData();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 border-red-400/50';
      case 'high': return 'text-orange-400 border-orange-400/50';
      case 'medium': return 'text-blue-400 border-blue-400/50';
      case 'low': return 'text-gray-400 border-gray-400/50';
      default: return 'text-gray-400 border-gray-400/50';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400/50';
      case 'dormant': return 'text-yellow-400 border-yellow-400/50';
      case 'monitoring': return 'text-blue-400 border-blue-400/50';
      default: return 'text-gray-400 border-gray-400/50';
    }
  };

  const executePresetScenario = (scenario: string) => {
    switch (scenario) {
      case 'club-onboarding':
        fukoCore.createFUKOMessage(
          'club_onboarding_initiate',
          'New club registration detected',
          'club_profile_incomplete',
          'Complete club setup and activation',
          'new_club_registered',
          'club_database_access',
          '/onboard_club',
          '@club-manager',
          'high'
        );
        break;
      case 'lead-scoring':
        fukoCore.createFUKOMessage(
          'lead_qualification_analysis',
          'Optimize lead conversion rates',
          'lead_database_active',
          'Update lead scores and priorities',
          'lead_activity_detected',
          'crm_system_online',
          '/score_leads',
          '@sales-agent',
          'medium'
        );
        break;
      case 'system-health':
        fukoCore.createFUKOMessage(
          'system_health_check',
          'Routine system monitoring',
          'all_agents_responsive',
          'Generate health report',
          'scheduled_maintenance',
          'monitoring_tools',
          '/health_check',
          '@system-monitor',
          'low'
        );
        break;
    }
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">FUKO-PZK Console</h2>
          <p className="text-slate-400">System Decyzyjny dla Agentów</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            FUKO Active
          </Badge>
          <Badge variant="outline" className="border-blue-500/50 text-blue-400">
            {messages.length} Messages
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'create', label: 'Create FUKO', icon: Send },
          { id: 'agents', label: 'Agents', icon: Brain },
          { id: 'analytics', label: 'Analytics', icon: Activity }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Recent FUKO Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div key={message.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(message.status)}
                          <span className="font-semibold text-white">{message.F}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getPriorityColor(message.priority)}>
                            {message.priority}
                          </Badge>
                          <Badge variant="outline" className="text-slate-400">
                            {message.sourceAgent}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div><span className="text-cyan-400">U:</span> <span className="text-slate-300">{message.U}</span></div>
                        <div><span className="text-cyan-400">K:</span> <span className="text-slate-300">{message.K}</span></div>
                        <div><span className="text-cyan-400">O:</span> <span className="text-slate-300">{message.O}</span></div>
                        {message.K2 && (
                          <div><span className="text-cyan-400">K2:</span> <span className="text-slate-300">{message.K2}</span></div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.executionResult && (
                          <span className="text-green-400">✓ {message.executionResult}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Quick Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => executePresetScenario('club-onboarding')}
                  >
                    Club Onboarding
                  </Button>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => executePresetScenario('lead-scoring')}
                  >
                    Lead Scoring
                  </Button>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => executePresetScenario('system-health')}
                  >
                    System Health Check
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Create FUKO Tab */}
      {activeTab === 'create' && (
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">Create New FUKO Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="F" className="text-cyan-400">F - Funkcja (wymagane)</Label>
                  <Input
                    id="F"
                    value={F}
                    onChange={(e) => setF(e.target.value)}
                    placeholder="Co agent ma wykonać..."
                    className="bg-slate-900/50 border-slate-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="U" className="text-cyan-400">U - Uzasadnienie (wymagane)</Label>
                  <Textarea
                    id="U"
                    value={U}
                    onChange={(e) => setU(e.target.value)}
                    placeholder="Dlaczego to robi..."
                    className="bg-slate-900/50 border-slate-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="K" className="text-cyan-400">K - Kontekst</Label>
                  <Input
                    id="K"
                    value={K}
                    onChange={(e) => setK(e.target.value)}
                    placeholder="Warunki działania..."
                    className="bg-slate-900/50 border-slate-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="O" className="text-cyan-400">O - Oczekiwany efekt</Label>
                  <Input
                    id="O"
                    value={O}
                    onChange={(e) => setO(e.target.value)}
                    placeholder="Co ma się wydarzyć..."
                    className="bg-slate-900/50 border-slate-600"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="P" className="text-cyan-400">P - Próg aktywacji</Label>
                  <Input
                    id="P"
                    value={P}
                    onChange={(e) => setP(e.target.value)}
                    placeholder="Kiedy uruchomić..."
                    className="bg-slate-900/50 border-slate-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="Z" className="text-cyan-400">Z - Zależność</Label>
                  <Input
                    id="Z"
                    value={Z}
                    onChange={(e) => setZ(e.target.value)}
                    placeholder="Od czego zależy..."
                    className="bg-slate-900/50 border-slate-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="K2" className="text-cyan-400">K - Komenda</Label>
                  <Input
                    id="K2"
                    value={K2}
                    onChange={(e) => setK2(e.target.value)}
                    placeholder="/komenda lub &wyrażenie..."
                    className="bg-slate-900/50 border-slate-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sourceAgent" className="text-cyan-400">Source Agent</Label>
                  <Input
                    id="sourceAgent"
                    value={sourceAgent}
                    onChange={(e) => setSourceAgent(e.target.value)}
                    placeholder="@agent-name"
                    className="bg-slate-900/50 border-slate-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="priority" className="text-cyan-400">Priority</Label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
                    className="w-full p-2 bg-slate-900/50 border border-slate-600 rounded-md text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <Button 
                  onClick={createFUKOMessage}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Create FUKO Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agents Tab */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {['core', 'fuko', 'system', 'project'].map((category) => {
            const categoryAgents = agents.filter(a => a.category === category);
            if (categoryAgents.length === 0) return null;
            
            return (
              <Card key={category} className="bg-slate-800/50 border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400 capitalize">{category} Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryAgents.map((agent) => (
                      <div key={agent.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-white">{agent.name}</span>
                          <Badge variant="outline" className={getAgentStatusColor(agent.status)}>
                            {agent.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-400">
                          Mode: {agent.mode} | Performance: {agent.performance.toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">System KPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(kpiData).map(([key, data]) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 capitalize">{key.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{data.value}%</span>
                        <Badge 
                          variant="outline" 
                          className={
                            data.value >= data.threshold 
                              ? 'text-green-400 border-green-400/50' 
                              : 'text-red-400 border-red-400/50'
                          }
                        >
                          {data.trend}
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={data.value} 
                      className={`h-2 ${data.value >= data.threshold ? 'bg-green-500/20' : 'bg-red-500/20'}`} 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">Message Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {messages.filter(m => m.status === 'completed').length}
                    </div>
                    <div className="text-slate-400">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {messages.filter(m => m.status === 'processing').length}
                    </div>
                    <div className="text-slate-400">Processing</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">
                      {messages.filter(m => m.status === 'failed').length}
                    </div>
                    <div className="text-slate-400">Failed</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">
                      {messages.filter(m => m.status === 'pending').length}
                    </div>
                    <div className="text-slate-400">Pending</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FUKOConsole;
