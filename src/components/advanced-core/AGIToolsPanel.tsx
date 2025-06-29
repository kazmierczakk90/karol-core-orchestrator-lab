
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, Settings, Play, Pause, RotateCcw, Download, Upload,
  Code2, Webhook, Eye, Zap, FileText, Users, Brain, Star
} from 'lucide-react';

interface AGIToolsPanelProps {
  config: any;
  systemStatus: any;
  onAgentExecute: (agentName: string, action: string, data?: any) => void;
  onConfigUpdate: (section: string, key: string, value: any) => void;
}

interface Snapshot {
  id: string;
  name: string;
  timestamp: string;
  type: 'emotional' | 'logical' | 'structural';
  size: string;
}

interface Rule {
  id: string;
  name: string;
  scope: 'Agent' | 'Global' | 'UI' | 'API';
  active: boolean;
  description: string;
}

interface Scenario {
  id: string;
  name: string;
  agents: string[];
  decisions: number;
  status: 'active' | 'paused' | 'completed';
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  trigger: string;
  active: boolean;
}

const AGIToolsPanel: React.FC<AGIToolsPanelProps> = ({ 
  config, 
  systemStatus, 
  onAgentExecute,
  onConfigUpdate 
}) => {
  const { toast } = useToast();
  
  // State management
  const [snapshots, setSnapshots] = useState<Snapshot[]>([
    { id: '1', name: 'Initial State', timestamp: '2024-06-29 10:00', type: 'structural', size: '2.4MB' },
    { id: '2', name: 'Learning Phase', timestamp: '2024-06-29 14:30', type: 'logical', size: '3.1MB' },
    { id: '3', name: 'Emotional Calibration', timestamp: '2024-06-29 18:15', type: 'emotional', size: '1.8MB' }
  ]);

  const [rules, setRules] = useState<Rule[]>([
    { id: '1', name: 'CPU Throttling', scope: 'Global', active: true, description: 'Limit CPU usage during peak hours' },
    { id: '2', name: 'Memory Cleanup', scope: 'Agent', active: true, description: 'Auto-cleanup unused memories' },
    { id: '3', name: 'API Rate Limiting', scope: 'API', active: false, description: 'Prevent API abuse' }
  ]);

  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: '1', name: 'Crisis Management', agents: ['@guardian-core', '@decision-engine'], decisions: 15, status: 'active' },
    { id: '2', name: 'Learning Optimization', agents: ['@adaptive-core', '@memory-core'], decisions: 23, status: 'completed' }
  ]);

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    { id: '1', name: 'Memory Update', url: 'https://api.karol-core.dev/memory', trigger: 'memory-write', active: true },
    { id: '2', name: 'Agent Action', url: 'https://api.karol-core.dev/agent', trigger: 'agent-action', active: false }
  ]);

  const [debugPrompt, setDebugPrompt] = useState('');
  const [debugResult, setDebugResult] = useState('');
  const [currentPersona, setCurrentPersona] = useState('CEO');
  const [insightMode, setInsightMode] = useState('Tygodniowe');
  const [intentInput, setIntentInput] = useState('');
  const [mappedAgent, setMappedAgent] = useState('');

  // Tool functions
  const saveSystemState = async () => {
    const result = await onAgentExecute('@state-keeper', 'create_snapshot', { 
      type: 'manual',
      name: `Manual Snapshot ${Date.now()}`
    });
    
    if (result.success) {
      const newSnapshot: Snapshot = {
        id: Date.now().toString(),
        name: `Manual Snapshot`,
        timestamp: new Date().toLocaleString(),
        type: 'structural',
        size: '2.1MB'
      };
      setSnapshots(prev => [newSnapshot, ...prev]);
      
      toast({
        title: "State Saved",
        description: "System snapshot created successfully",
        duration: 3000,
      });
    }
  };

  const restoreState = async (snapshotId: string) => {
    await onAgentExecute('@state-keeper', 'restore_snapshot', { snapshotId });
    toast({
      title: "State Restored",
      description: `Restored to snapshot ${snapshotId}`,
      duration: 3000,
    });
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    ));
    toast({
      title: "Rule Updated",
      description: `Rule configuration changed`,
      duration: 2000,
    });
  };

  const runSimulation = async (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      await onAgentExecute('@simulation-engine', 'run_scenario', { scenario });
      toast({
        title: "Simulation Started",
        description: `Running scenario: ${scenario.name}`,
        duration: 3000,
      });
    }
  };

  const debugPromptTrace = async () => {
    if (!debugPrompt.trim()) return;
    
    setDebugResult('Processing...');
    
    // Simulate AI processing
    setTimeout(() => {
      setDebugResult(`Prompt: "${debugPrompt}"
      
Agent Flow:
1. @adaptive-core → Input parsing (98% confidence)
2. @memory-core → Context retrieval (15 memories found)
3. @decision-engine → Response generation (94% coherence)
4. @voice-core → Style adaptation (${config.identity.expressionStyle})

Memory Graph:
- Related concepts: 8 active nodes
- Emotional weight: 0.7
- Context relevance: 92%

Status: ✅ Success (response_time: 1.2s)`);
    }, 1500);
  };

  const generateInsights = async () => {
    await onAgentExecute('@insight-generator', 'generate_report', { 
      mode: insightMode,
      style: config.identity.expressionStyle 
    });
    
    toast({
      title: "Insights Generated",
      description: `${insightMode} report created in ${config.identity.expressionStyle} style`,
      duration: 4000,
    });
  };

  const mapIntent = () => {
    if (!intentInput.trim()) return;
    
    // Simple intent mapping logic
    const intentMappings = {
      'analyze data': '@analytics-core → data_analysis',
      'save state': '@state-keeper → create_snapshot',
      'security check': '@guardian-core → threat_scan',
      'optimize performance': '@adaptive-core → system_optimization',
      'generate report': '@insight-generator → create_report'
    };
    
    const mapping = Object.entries(intentMappings).find(([intent]) => 
      intentInput.toLowerCase().includes(intent)
    );
    
    setMappedAgent(mapping ? mapping[1] : '@adaptive-core → general_processing');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Memory & State Manager */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Memory & State Manager</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button onClick={saveSystemState} className="flex-1" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Save State
              </Button>
              <Select onValueChange={restoreState}>
                <SelectTrigger className="flex-1 bg-slate-900/50">
                  <SelectValue placeholder="Restore" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800">
                  {snapshots.map(snapshot => (
                    <SelectItem key={snapshot.id} value={snapshot.id}>
                      {snapshot.name} ({snapshot.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-300">State Filter</label>
              <Select defaultValue="structural">
                <SelectTrigger className="bg-slate-900/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800">
                  <SelectItem value="emotional">Emotional</SelectItem>
                  <SelectItem value="logical">Logical</SelectItem>
                  <SelectItem value="structural">Structural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {snapshots.map(snapshot => (
                <div key={snapshot.id} className="flex items-center justify-between p-2 bg-slate-900/30 rounded text-xs">
                  <span className="text-white">{snapshot.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${
                      snapshot.type === 'emotional' ? 'bg-pink-500/20 text-pink-400' :
                      snapshot.type === 'logical' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {snapshot.type}
                    </Badge>
                    <span className="text-slate-400">{snapshot.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rules & Regulator Composer */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Rules & Regulator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Switch defaultChecked />
              <span className="text-sm text-slate-300">Test Mode</span>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {rules.map(rule => (
                <div key={rule.id} className="p-3 bg-slate-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{rule.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${
                        rule.scope === 'Global' ? 'bg-purple-500/20 text-purple-400' :
                        rule.scope === 'Agent' ? 'bg-green-500/20 text-green-400' :
                        rule.scope === 'API' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {rule.scope}
                      </Badge>
                      <Switch 
                        checked={rule.active}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{rule.description}</p>
                </div>
              ))}
            </div>
            
            <Button className="w-full" size="sm" variant="outline">
              <Code2 className="h-4 w-4 mr-2" />
              Logic Tree Editor
            </Button>
          </CardContent>
        </Card>

        {/* Simulation & Sandbox */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Simulation & Sandbox</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Mode</span>
              <Select defaultValue="auto">
                <SelectTrigger className="w-24 bg-slate-900/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800">
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {scenarios.map(scenario => (
                <div key={scenario.id} className="p-2 bg-slate-900/30 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm">{scenario.name}</span>
                    <Badge className={`text-xs ${
                      scenario.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      scenario.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {scenario.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {scenario.agents.length} agents, {scenario.decisions} decisions
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-6 px-2"
                      onClick={() => runSimulation(scenario.id)}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Add Scenario
            </Button>
          </CardContent>
        </Card>

        {/* Personalization Center */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-pink-400 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Personalization Center</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Communication Style</label>
              <Select value={config.identity.expressionStyle} onValueChange={(value) => onConfigUpdate('identity', 'expressionStyle', value)}>
                <SelectTrigger className="bg-slate-900/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800">
                  <SelectItem value="formal">Formalne</SelectItem>
                  <SelectItem value="introspective">Inspirujące</SelectItem>
                  <SelectItem value="creative">Surowe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Operating Mode</label>
              <Select value={currentPersona} onValueChange={setCurrentPersona}>
                <SelectTrigger className="bg-slate-900/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800">
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="Philosopher">Filozof</SelectItem>
                  <SelectItem value="Builder">Builder</SelectItem>
                  <SelectItem value="Debugger">Debugger</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
              <span className="text-white text-sm">Remember Preferences</span>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-center space-x-1">
              {[1,2,3,4,5].map(i => (
                <Button key={i} variant="ghost" size="sm" className="p-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plugin Manager */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Plugin Manager</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {[
                { name: 'Voice Synthesis', status: 'stable', active: true },
                { name: 'Quantum Decisions', status: 'experimental', active: false },
                { name: 'Memory Compression', status: 'stable', active: true },
                { name: 'Auto-Evolution', status: 'experimental', active: true }
              ].map((plugin, i) => (
                <div key={i} className="p-2 bg-slate-900/30 rounded flex items-center justify-between">
                  <div>
                    <span className="text-white text-sm">{plugin.name}</span>
                    <Badge className={`ml-2 text-xs ${
                      plugin.status === 'stable' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {plugin.status}
                    </Badge>
                  </div>
                  <Switch checked={plugin.active} />
                </div>
              ))}
            </div>
            
            <Button className="w-full" size="sm" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              New Plugin
            </Button>
          </CardContent>
        </Card>

        {/* Prompt Debug & Trace */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Prompt Debug & Trace</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter prompt to debug..."
                value={debugPrompt}
                onChange={(e) => setDebugPrompt(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                rows={3}
              />
              <Button onClick={debugPromptTrace} className="w-full" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                Trace Flow
              </Button>
            </div>
            
            {debugResult && (
              <div className="p-3 bg-slate-900/50 rounded text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                {debugResult}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Bottom Row - Full Width Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Auto-Insights Generator */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Auto-Insights Generator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Mode</label>
                <Select value={insightMode} onValueChange={setInsightMode}>
                  <SelectTrigger className="bg-slate-900/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800">
                    <SelectItem value="Tygodniowe">Tygodniowe</SelectItem>
                    <SelectItem value="Reaktywne">Reaktywne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Style</label>
                <Select defaultValue="narracyjny">
                  <SelectTrigger className="bg-slate-900/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800">
                    <SelectItem value="narracyjny">Narracyjny</SelectItem>
                    <SelectItem value="techniczny">Techniczny</SelectItem>
                    <SelectItem value="decyzyjny">Decyzyjny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={generateInsights} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Generate Insights
            </Button>
            
            <div className="text-sm text-slate-400">
              Last reports: Performance Analysis (2h ago), Memory Usage (1d ago)
            </div>
          </CardContent>
        </Card>

        {/* Intent → Agent Mapper */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Intent → Agent Mapper</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Describe your intention..."
                value={intentInput}
                onChange={(e) => setIntentInput(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
              />
              <Button onClick={mapIntent} className="w-full" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Map to Agent
              </Button>
            </div>
            
            {mappedAgent && (
              <div className="p-3 bg-slate-900/50 rounded">
                <div className="text-sm text-slate-300 mb-1">Mapped Action:</div>
                <code className="text-cyan-400 text-sm">{mappedAgent}</code>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Auto Detection</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Public API & Webhook Manager */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center space-x-2">
            <Webhook className="h-5 w-5" />
            <span>Public API & Webhook Manager</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-medium">Active Webhooks</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {webhooks.map(webhook => (
                  <div key={webhook.id} className="p-3 bg-slate-900/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">{webhook.name}</span>
                      <Switch checked={webhook.active} />
                    </div>
                    <div className="text-xs text-slate-400 mb-1">
                      Trigger: <code className="text-cyan-400">{webhook.trigger}</code>
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      URL: {webhook.url}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-white font-medium">API Configuration</h3>
              <div className="space-y-2">
                <Input
                  placeholder="New endpoint URL..."
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
                <Select>
                  <SelectTrigger className="bg-slate-900/50">
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800">
                    <SelectItem value="memory-write">Memory Write</SelectItem>
                    <SelectItem value="agent-action">Agent Action</SelectItem>
                    <SelectItem value="system-event">System Event</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full" size="sm">
                  <Webhook className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </div>
              
              <div className="p-3 bg-slate-900/30 rounded">
                <div className="text-sm text-slate-300 mb-2">API Key</div>
                <div className="text-xs text-slate-400 font-mono">
                  kc_api_key_xxxxxxxxxxxxxxxxxxxx
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AGIToolsPanel;
