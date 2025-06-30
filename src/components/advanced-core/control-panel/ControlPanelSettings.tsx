
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, User, Zap, Shield, Activity, Plug, TrendingUp } from 'lucide-react';

const ControlPanelSettings = () => {
  const [settings, setSettings] = useState({
    engineMode: 'hybrid',
    analysisDepth: [8],
    cognitiveAdaptation: true,
    semanticCompression: true,
    systemName: 'Karol-Core AGI',
    expressionStyle: 'introspective',
    emotionalMode: true,
    userStyleBehavior: true,
    cpuLimit: [75],
    memoryAllocation: [8],
    autoSnapshot: true,
    nightEvolution: true,
    authMode: 'simplified',
    threatScan: true,
    agentLockdown: false,
    memoryEncryption: true,
    heartbeatMonitor: true,
    realtimeLogs: true,
    exportToSupabase: false,
    maxLogSize: '100',
    openaiAPI: true,
    supabaseEdge: true,
    googleMaps: false,
    customApiKey: '',
    evolutionLevel: [42],
    transcendence: false,
    agentSelfModulation: true,
    developmentMode: 'adaptive'
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <TooltipProvider>
      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="core-intelligence" className="bg-slate-700/30 rounded-lg px-4">
          <AccordionTrigger className="text-cyan-400 hover:text-cyan-300">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Core Intelligence</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Tryb silnika</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select value={settings.engineMode} onValueChange={(value) => updateSetting('engineMode', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heuristic">Heuristic</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="quantum">Quantum</SelectItem>
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Wybierz tryb pracy silnika decyzyjnego</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Głębokość analizy: {settings.analysisDepth[0]}</Label>
                <Slider
                  value={settings.analysisDepth}
                  onValueChange={(value) => updateSetting('analysisDepth', value)}
                  min={1}
                  max={15}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.cognitiveAdaptation}
                  onCheckedChange={(checked) => updateSetting('cognitiveAdaptation', checked)}
                />
                <Label className="text-white">Autoadaptacja poznawcza</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.semanticCompression}
                  onCheckedChange={(checked) => updateSetting('semanticCompression', checked)}
                />
                <Label className="text-white">Kompresja pamięci semantycznej</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="identity-behavior" className="bg-slate-700/30 rounded-lg px-4">
          <AccordionTrigger className="text-purple-400 hover:text-purple-300">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Identity & Behavior</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Nazwa systemu</Label>
                <Input
                  value={settings.systemName}
                  onChange={(e) => updateSetting('systemName', e.target.value)}
                  className="bg-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Styl ekspresji</Label>
                <Select value={settings.expressionStyle} onValueChange={(value) => updateSetting('expressionStyle', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="introspective">Introspective</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.emotionalMode}
                  onCheckedChange={(checked) => updateSetting('emotionalMode', checked)}
                />
                <Label className="text-white">Tryb emocjonalny</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.userStyleBehavior}
                  onCheckedChange={(checked) => updateSetting('userStyleBehavior', checked)}
                />
                <Label className="text-white">Zachowanie stylu użytkownika</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="runtime-performance" className="bg-slate-700/30 rounded-lg px-4">
          <AccordionTrigger className="text-green-400 hover:text-green-300">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Runtime & Performance</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">CPU Limit: {settings.cpuLimit[0]}%</Label>
                <Slider
                  value={settings.cpuLimit}
                  onValueChange={(value) => updateSetting('cpuLimit', value)}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Memory Allocation: {settings.memoryAllocation[0]}GB</Label>
                <Slider
                  value={settings.memoryAllocation}
                  onValueChange={(value) => updateSetting('memoryAllocation', value)}
                  min={1}
                  max={16}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.autoSnapshot}
                  onCheckedChange={(checked) => updateSetting('autoSnapshot', checked)}
                />
                <Label className="text-white">Snapshot co 10 min</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.nightEvolution}
                  onCheckedChange={(checked) => updateSetting('nightEvolution', checked)}
                />
                <Label className="text-white">Nocna autoewolucja</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security-access" className="bg-slate-700/30 rounded-lg px-4">
          <AccordionTrigger className="text-red-400 hover:text-red-300">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security & Access</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Uwierzytelnianie</Label>
                <Select value={settings.authMode} onValueChange={(value) => updateSetting('authMode', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simplified">Simplified</SelectItem>
                    <SelectItem value="rbac">RBAC</SelectItem>
                    <SelectItem value="oauth2">OAuth2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.threatScan}
                  onCheckedChange={(checked) => updateSetting('threatScan', checked)}
                />
                <Label className="text-white">Skaner zagrożeń co 15 min</Label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.agentLockdown}
                  onCheckedChange={(checked) => updateSetting('agentLockdown', checked)}
                />
                <Label className="text-white">Agent lockdown</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.memoryEncryption}
                  onCheckedChange={(checked) => updateSetting('memoryEncryption', checked)}
                />
                <Label className="text-white">Szyfrowanie pamięci</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="monitoring-logging" className="bg-slate-700/30 rounded-lg px-4">
          <AccordionTrigger className="text-yellow-400 hover:text-yellow-300">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Monitoring & Logging</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.heartbeatMonitor}
                  onCheckedChange={(checked) => updateSetting('heartbeatMonitor', checked)}
                />
                <Label className="text-white">Heartbeat monitor (co 5s)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.realtimeLogs}
                  onCheckedChange={(checked) => updateSetting('realtimeLogs', checked)}
                />
                <Label className="text-white">Realtime logs</Label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.exportToSupabase}
                  onCheckedChange={(checked) => updateSetting('exportToSupabase', checked)}
                />
                <Label className="text-white">Export błędów do Supabase</Label>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Max log size (MB)</Label>
                <Input
                  value={settings.maxLogSize}
                  onChange={(e) => updateSetting('maxLogSize', e.target.value)}
                  className="bg-slate-600 text-white"
                  type="number"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="integrations" className="bg-slate-700/30 rounded-lg px-4">
          <AccordionTrigger className="text-blue-400 hover:text-blue-300">
            <div className="flex items-center space-x-2">
              <Plug className="h-5 w-5" />
              <span>Integrations</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.openaiAPI}
                  onCheckedChange={(checked) => updateSetting('openaiAPI', checked)}
                />
                <Label className="text-white">OpenAI API</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.supabaseEdge}
                  onCheckedChange={(checked) => updateSetting('supabaseEdge', checked)}
                />
                <Label className="text-white">Supabase Edge Functions</Label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.googleMaps}
                  onCheckedChange={(checked) => updateSetting('googleMaps', checked)}
                />
                <Label className="text-white">Google Maps & Places</Label>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Custom API Key</Label>
                <Input
                  value={settings.customApiKey}
                  onChange={(e) => updateSetting('customApiKey', e.target.value)}
                  className="bg-slate-600 text-white"
                  type="password"
                  placeholder="Enter API key..."
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="meta-evolution" className="bg-slate-700/30 rounded-lg px-4">
          <AccordionTrigger className="text-pink-400 hover:text-pink-300">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Meta-Evolution</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Poziom ewolucji: {settings.evolutionLevel[0]}/100</Label>
                <Slider
                  value={settings.evolutionLevel}
                  onValueChange={(value) => updateSetting('evolutionLevel', value)}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Tryb rozwoju</Label>
                <Select value={settings.developmentMode} onValueChange={(value) => updateSetting('developmentMode', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="adaptive">Adaptive</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.transcendence}
                  onCheckedChange={(checked) => updateSetting('transcendence', checked)}
                />
                <Label className="text-white">Transcendencja</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.agentSelfModulation}
                  onCheckedChange={(checked) => updateSetting('agentSelfModulation', checked)}
                />
                <Label className="text-white">Samomodulacja agentów</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  );
};

export default ControlPanelSettings;
