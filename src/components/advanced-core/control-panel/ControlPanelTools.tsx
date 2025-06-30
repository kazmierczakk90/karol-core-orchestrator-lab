
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/hooks/use-toast';
import {
  Save, History, RefreshCw, Settings, Play, Plus, Trash2, 
  Code, Target, Plug, Key, TestTube, BarChart3, ChevronDown
} from 'lucide-react';

const ControlPanelTools = () => {
  const { toast } = useToast();
  const [snapshots] = useState([
    { id: 1, date: '2024-01-15 14:30', author: 'System', type: 'Memory' },
    { id: 2, date: '2024-01-15 12:15', author: 'User', type: 'Agents' },
    { id: 3, date: '2024-01-15 09:45', author: 'Auto', type: 'Decisions' }
  ]);

  const [rules] = useState([
    { id: 1, name: 'Memory Limit Rule', scope: 'Global', active: true },
    { id: 2, name: 'Agent Response Time', scope: 'Agent', active: false },
    { id: 3, name: 'UI Theme Sync', scope: 'UI', active: true }
  ]);

  const [webhooks] = useState([
    { id: 1, name: 'Memory Update Hook', endpoint: '/api/memory', active: true },
    { id: 2, name: 'Decision Trigger', endpoint: '/api/decisions', active: false }
  ]);

  const saveState = () => {
    toast({
      title: "State Saved",
      description: "Current system state has been saved successfully",
    });
  };

  const restoreState = (snapshotId: number) => {
    toast({
      title: "State Restored",
      description: `System restored to snapshot #${snapshotId}`,
    });
  };

  const generateInsights = () => {
    toast({
      title: "Generating Insights",
      description: "Auto-insights are being generated based on recent activity",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory & State Manager */}
        <Card className="bg-slate-800/50 border-green-800/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <Save className="h-5 w-5" />
              <span>Memory & State Manager</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button onClick={saveState} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Zapisz stan
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystko</SelectItem>
                  <SelectItem value="memory">Pamięć</SelectItem>
                  <SelectItem value="agents">Agenci</SelectItem>
                  <SelectItem value="decisions">Decyzje</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white font-medium">Snapshoty</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {snapshots.map((snapshot) => (
                  <div key={snapshot.id} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                    <div className="text-sm">
                      <div className="text-white">{snapshot.date}</div>
                      <div className="text-slate-400">{snapshot.author} • {snapshot.type}</div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => restoreState(snapshot.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rules & Regulator Composer */}
        <Card className="bg-slate-800/50 border-purple-800/30">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Rules & Regulator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Nowa reguła
              </Button>
              <Toggle>
                <TestTube className="h-4 w-4 mr-2" />
                Test Mode
              </Toggle>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                  <div className="flex items-center space-x-2">
                    <Switch checked={rule.active} />
                    <div className="text-sm">
                      <div className="text-white">{rule.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {rule.scope}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Simulation & Sandbox */}
        <Card className="bg-slate-800/50 border-orange-800/30">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Simulation & Sandbox</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Nowy scenariusz
              </Button>
              <Select defaultValue="manual">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-white text-sm font-medium mb-2">Aktywny scenariusz</div>
              <div className="text-slate-400 text-sm">
                Agent Decision Flow • 3 kroki • Status: Running
              </div>
              <div className="flex space-x-2 mt-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="h-3 w-3 mr-1" />
                  Run
                </Button>
                <Button size="sm" variant="outline">
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalization Center */}
        <Card className="bg-slate-800/50 border-cyan-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Personalization Center</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-white text-sm">Styl komunikacji</Label>
                <Select defaultValue="inspiring">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formalne</SelectItem>
                    <SelectItem value="inspiring">Inspirujące</SelectItem>
                    <SelectItem value="harsh">Surowe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-white text-sm">Tryb działania</Label>
                <Select defaultValue="ceo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ceo">CEO</SelectItem>
                    <SelectItem value="philosopher">Filozof</SelectItem>
                    <SelectItem value="builder">Builder</SelectItem>
                    <SelectItem value="debugger">Debugger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch defaultChecked />
                <Label className="text-white text-sm">Zapamiętuj preferencje</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Larger Cards Row */}
      <div className="grid grid-cols-1 gap-6">
        {/* Prompt Debug & Trace */}
        <Card className="bg-slate-800/50 border-yellow-800/30">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Prompt Debug & Trace</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Input Prompt</Label>
                <Textarea 
                  placeholder="Enter prompt to debug..."
                  className="bg-slate-700 text-white min-h-24"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Agent Response</Label>
                <div className="bg-slate-700/50 p-3 rounded min-h-24">
                  <div className="text-slate-400 text-sm">Response will appear here...</div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <Play className="h-4 w-4 mr-2" />
                Test Prompt
              </Button>
              <Badge className="bg-green-500/20 text-green-400">Success</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Manager */}
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center space-x-2">
              <Plug className="h-5 w-5" />
              <span>Public API & Webhook Manager</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nowy endpoint
                </Button>
                <Button variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  API Keys
                </Button>
              </div>
              
              <div className="space-y-2">
                {webhooks.map((webhook) => (
                  <Collapsible key={webhook.id}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full bg-slate-700/50 p-3 rounded hover:bg-slate-700/70">
                      <div className="flex items-center space-x-3">
                        <Switch checked={webhook.active} />
                        <div className="text-left">
                          <div className="text-white font-medium">{webhook.name}</div>
                          <div className="text-slate-400 text-sm">{webhook.endpoint}</div>
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-slate-700/30 p-3 rounded-b">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Trigger</Label>
                        <Select defaultValue="memory-write">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="memory-write">Memory Write</SelectItem>
                            <SelectItem value="agent-action">Agent Action</SelectItem>
                            <SelectItem value="decision-made">Decision Made</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Test Request
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-Insights Generator */}
        <Card className="bg-slate-800/50 border-pink-800/30">
          <CardHeader>
            <CardTitle className="text-pink-400 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Auto-Insights Generator</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Tryb</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Tygodniowe</SelectItem>
                    <SelectItem value="reactive">Reaktywne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Styl</Label>
                <Select defaultValue="narrative">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="narrative">Narracyjny</SelectItem>
                    <SelectItem value="technical">Techniczny</SelectItem>
                    <SelectItem value="decision">Decyzyjny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Akcje</Label>
                <div className="flex space-x-2">
                  <Button onClick={generateInsights} className="bg-pink-600 hover:bg-pink-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-slate-700/50 p-3 rounded">
              <div className="text-white text-sm font-medium mb-2">Ostatni raport</div>
              <div className="text-slate-400 text-sm">
                Weekly Insights • 2024-01-15 • 347 decisions analyzed • 12 key insights generated
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ControlPanelTools;
