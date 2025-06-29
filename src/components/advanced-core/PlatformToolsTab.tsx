
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Database, 
  Settings, 
  Play, 
  User, 
  Puzzle, 
  Bug, 
  Webhook, 
  BarChart3, 
  ArrowRight,
  Save,
  Filter,
  Plus,
  Download,
  Upload,
  TreePine,
  Map,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PlatformToolsTab = () => {
  const { toast } = useToast();
  const [activeToolTab, setActiveToolTab] = useState('memory');

  const handleToolAction = (tool: string, action: string, agent: string) => {
    toast({
      title: `${tool} - ${action}`,
      description: `Akcja wykonana przez ${agent}`,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeToolTab} onValueChange={setActiveToolTab} className="space-y-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
              <TabsTrigger value="memory">Data & Memory</TabsTrigger>
              <TabsTrigger value="dev">Development</TabsTrigger>
              <TabsTrigger value="analytics">Analytics & API</TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        {/* Data & Memory Tools */}
        <TabsContent value="memory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Memory & State Manager */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>1. Memory & State Manager</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleToolAction('Memory Manager', 'Zapisz stan', '@state-keeper')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Zapisz stan
                  </Button>
                  <Button 
                    onClick={() => handleToolAction('Memory Manager', 'Przywróć stan', '@state-keeper')}
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Przywróć
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Snapshoty</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {['2024-06-29 14:30 - Memory', '2024-06-29 14:20 - Agents', '2024-06-29 14:10 - Decisions'].map((snapshot, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                        <span className="text-sm text-slate-300">{snapshot}</span>
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Select defaultValue="emocjonalny">
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Typ stanu" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="emocjonalny">Emocjonalny</SelectItem>
                    <SelectItem value="logiczny">Logiczny</SelectItem>
                    <SelectItem value="strukturalny">Strukturalny</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Rules & Regulator Composer */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>2. Rules & Regulator Composer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Reguły aktywne</Label>
                    <Badge variant="outline">8/12</Badge>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {['Cognitive Override Rule', 'Memory Compression Rule', 'Agent Interaction Rule'].map((rule, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                        <span className="text-sm text-slate-300">{rule}</span>
                        <Switch defaultChecked={i < 2} />
                      </div>
                    ))}
                  </div>
                </div>

                <Select defaultValue="Global">
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Zakres reguły" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Global">Global</SelectItem>
                    <SelectItem value="UI">UI</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Switch />
                  <Label className="text-slate-300">Tryb testowania</Label>
                </div>
              </CardContent>
            </Card>

            {/* Simulation & Sandbox */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>3. Simulation & Sandbox</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="simMode" id="manual" defaultChecked />
                    <Label htmlFor="manual" className="text-slate-300">Manual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="simMode" id="auto" />
                    <Label htmlFor="auto" className="text-slate-300">Auto</Label>
                  </div>
                </div>

                <Button 
                  onClick={() => handleToolAction('Simulation', 'Dodaj scenariusz', '@router')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj scenariusz
                </Button>

                <div className="space-y-2">
                  <Label className="text-slate-300">Scenariusze</Label>
                  <div className="space-y-2">
                    {['Cognitive Analysis → Decision', 'Memory Update → Agent Response'].map((scenario, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                        <div className="flex items-center space-x-2">
                          <TreePine className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-slate-300">{scenario}</span>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Map className="h-4 w-4 mr-2" />
                  Pokaż Heatmapę
                </Button>
              </CardContent>
            </Card>

            {/* Personalization Center */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>4. Personalization Center</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Styl komunikacji</Label>
                  <Select defaultValue="inspirujące">
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="formalne">Formalne</SelectItem>
                      <SelectItem value="inspirujące">Inspirujące</SelectItem>
                      <SelectItem value="surowe">Surowe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Tryb działania</Label>
                  <Select defaultValue="CEO">
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="CEO">CEO</SelectItem>
                      <SelectItem value="Filozof">Filozof</SelectItem>
                      <SelectItem value="Builder">Builder</SelectItem>
                      <SelectItem value="Debugger">Debugger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label className="text-slate-300">Zapamiętuj preferencje</Label>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Feedback Loop</Label>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* Development Tools */}
        <TabsContent value="dev" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Plugin / Feature Manager */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center space-x-2">
                  <Puzzle className="h-5 w-5" />
                  <span>5. Plugin / Feature Manager</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-300">Aktywne pluginy</Label>
                  <Badge variant="outline">12/15</Badge>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {[
                    { name: 'Cognitive Enhancement', status: 'stabilne', active: true },
                    { name: 'Memory Optimizer', status: 'stabilne', active: true },
                    { name: 'Quantum Decision Beta', status: 'eksperymentalne', active: false },
                    { name: 'Voice Emotion Engine', status: 'stabilne', active: true }
                  ].map((plugin, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                      <div className="flex items-center space-x-2">
                        <Switch checked={plugin.active} />
                        <span className="text-sm text-slate-300">{plugin.name}</span>
                        <Badge variant={plugin.status === 'stabilne' ? 'default' : 'destructive'} className="text-xs">
                          {plugin.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Plugin
                </Button>
              </CardContent>
            </Card>

            {/* Prompt Debug & Trace */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center space-x-2">
                  <Bug className="h-5 w-5" />
                  <span>6. Prompt Debug & Trace</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Test Prompt</Label>
                  <Textarea
                    placeholder="Wprowadź prompt do testowania..."
                    className="bg-slate-700 border-slate-600 min-h-20"
                  />
                </div>

                <Button 
                  onClick={() => handleToolAction('Debug Trace', 'Analiza prompt', '@prompt-forge')}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Analyze Flow
                </Button>

                <div className="space-y-2">
                  <Label className="text-slate-300">Ścieżka agentów</Label>
                  <div className="text-sm text-slate-400 font-mono p-2 bg-slate-900/50 rounded">
                    @user → @router → @adaptive-core → @voice-core → @response
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-slate-300">Status: Success</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* Analytics & API Tools */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Auto-Insights Generator */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>8. Auto-Insights Generator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Tryb</Label>
                    <Select defaultValue="reaktywne">
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="tygodniowe">Tygodniowe</SelectItem>
                        <SelectItem value="reaktywne">Reaktywne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Styl</Label>
                    <Select defaultValue="techniczny">
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="narracyjny">Narracyjny</SelectItem>
                        <SelectItem value="techniczny">Techniczny</SelectItem>
                        <SelectItem value="decyzyjny">Decyzyjny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={() => handleToolAction('Insights Generator', 'Wygeneruj wnioski', '@feedback-loop')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Wygeneruj wnioski
                </Button>

                <div className="space-y-2">
                  <Label className="text-slate-300">Historia raportów (8)</Label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {['Tygodniowy - 2024-06-23', 'Reaktywny - 2024-06-29', 'Decyzyjny - 2024-06-28'].map((report, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-700/50 rounded text-sm">
                        <span className="text-slate-300">{report}</span>
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intent → Agent Mapper */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-pink-400 flex items-center space-x-2">
                  <ArrowRight className="h-5 w-5" />
                  <span>9. Intent → Agent Mapper</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Intencja</Label>
                  <Input
                    placeholder="np. 'Zanalizuj ten dokument pod kątem emocji'"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <Button 
                  onClick={() => handleToolAction('Intent Mapper', 'Mapowanie intencji', '@meta-analyst')}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Mapuj Agent
                </Button>

                <div className="space-y-2">
                  <Label className="text-slate-300">Wynik mapowania</Label>
                  <div className="p-3 bg-slate-900/50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Agent: @voice-core</span>
                      <Badge variant="outline">87% trafność</Badge>
                    </div>
                    <div className="text-xs text-slate-400">
                      Akcja: emotion_analysis + document_processing
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="mapMode" id="manual-map" />
                    <Label htmlFor="manual-map" className="text-slate-300 text-sm">Manual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="mapMode" id="auto-map" defaultChecked />
                    <Label htmlFor="auto-map" className="text-slate-300 text-sm">Auto Detection</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default PlatformToolsTab;
