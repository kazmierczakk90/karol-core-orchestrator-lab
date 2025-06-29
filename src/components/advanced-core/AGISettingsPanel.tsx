
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, User, Cpu, Shield, Monitor, 
  Globe, Crown, Zap, Database, Key
} from 'lucide-react';

interface AGIConfig {
  core: any;
  identity: any;
  runtime: any;
  security: any;
  monitoring: any;
  integrations: any;
  evolution: any;
}

interface AGISettingsPanelProps {
  config: AGIConfig;
  onConfigUpdate: (section: keyof AGIConfig, key: string, value: any) => void;
  onAgentExecute: (agentName: string, action: string, data?: any) => void;
}

const AGISettingsPanel: React.FC<AGISettingsPanelProps> = ({ 
  config, 
  onConfigUpdate, 
  onAgentExecute 
}) => {
  
  const handleToggle = (section: keyof AGIConfig, key: string, value: boolean) => {
    onConfigUpdate(section, key, value);
  };

  const handleSliderChange = (section: keyof AGIConfig, key: string, value: number[]) => {
    onConfigUpdate(section, key, value[0]);
  };

  const handleSelectChange = (section: keyof AGIConfig, key: string, value: string) => {
    onConfigUpdate(section, key, value);
  };

  const handleInputChange = (section: keyof AGIConfig, key: string, value: string) => {
    onConfigUpdate(section, key, value);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span>System Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["core", "identity"]} className="space-y-4">
          
          {/* Core Intelligence */}
          <AccordionItem value="core" className="border border-slate-700/50 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-slate-700/30">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-blue-400" />
                <span className="text-white font-medium">Core Intelligence</span>
                <Badge className="bg-blue-500/20 text-blue-400">@adaptive-core</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Engine Mode</label>
                  <Select 
                    value={config.core.engineMode} 
                    onValueChange={(value) => handleSelectChange('core', 'engineMode', value)}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="heuristic">Heuristic</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="quantum">Quantum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">
                    Analysis Depth: {config.core.analysisDepth}
                  </label>
                  <Slider
                    value={[config.core.analysisDepth]}
                    onValueChange={(value) => handleSliderChange('core', 'analysisDepth', value)}
                    max={15}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                <div>
                  <span className="text-white text-sm">Cognitive Adaptation</span>
                  <p className="text-slate-400 text-xs">Auto-adapt system behavior</p>
                </div>
                <Switch
                  checked={config.core.cognitiveAdaptation}
                  onCheckedChange={(value) => handleToggle('core', 'cognitiveAdaptation', value)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Identity & Behavior */}
          <AccordionItem value="identity" className="border border-slate-700/50 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-slate-700/30">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-green-400" />
                <span className="text-white font-medium">Identity & Behavior</span>
                <Badge className="bg-green-500/20 text-green-400">@voice-core</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">System Name</label>
                  <Input
                    value={config.identity.systemName}
                    onChange={(e) => handleInputChange('identity', 'systemName', e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Expression Style</label>
                  <Select 
                    value={config.identity.expressionStyle} 
                    onValueChange={(value) => handleSelectChange('identity', 'expressionStyle', value)}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="introspective">Introspective</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                  <div>
                    <span className="text-white text-sm">Emotional Mode</span>
                    <p className="text-slate-400 text-xs">Enable emotional processing</p>
                  </div>
                  <Switch
                    checked={config.identity.emotionalMode}
                    onCheckedChange={(value) => handleToggle('identity', 'emotionalMode', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                  <div>
                    <span className="text-white text-sm">User Style Behavior</span>
                    <p className="text-slate-400 text-xs">Adapt to user communication style</p>
                  </div>
                  <Switch
                    checked={config.identity.userStyleBehavior}
                    onCheckedChange={(value) => handleToggle('identity', 'userStyleBehavior', value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Runtime & Performance */}
          <AccordionItem value="runtime" className="border border-slate-700/50 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-slate-700/30">
              <div className="flex items-center space-x-3">
                <Cpu className="h-5 w-5 text-orange-400" />
                <span className="text-white font-medium">Runtime & Performance</span>
                <Badge className="bg-orange-500/20 text-orange-400">@state-keeper</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">
                    CPU Limit: {config.runtime.cpuLimit}%
                  </label>
                  <Slider
                    value={[config.runtime.cpuLimit]}
                    onValueChange={(value) => handleSliderChange('runtime', 'cpuLimit', value)}
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">
                    Memory: {config.runtime.memoryAllocation}MB
                  </label>
                  <Slider
                    value={[config.runtime.memoryAllocation]}
                    onValueChange={(value) => handleSliderChange('runtime', 'memoryAllocation', value)}
                    max={16384}
                    min={512}
                    step={512}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                  <div>
                    <span className="text-white text-sm">Auto Snapshot (10 min)</span>
                    <p className="text-slate-400 text-xs">Automatic state snapshots</p>
                  </div>
                  <Switch
                    checked={config.runtime.autoSnapshot}
                    onCheckedChange={(value) => handleToggle('runtime', 'autoSnapshot', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                  <div>
                    <span className="text-white text-sm">Night Auto-Evolution</span>
                    <p className="text-slate-400 text-xs">System evolution during low usage</p>
                  </div>
                  <Switch
                    checked={config.runtime.nightEvolution}
                    onCheckedChange={(value) => handleToggle('runtime', 'nightEvolution', value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Security & Access */}
          <AccordionItem value="security" className="border border-slate-700/50 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-slate-700/30">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-red-400" />
                <span className="text-white font-medium">Security & Access</span>
                <Badge className="bg-red-500/20 text-red-400">@guardian-core</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Authentication Mode</label>
                <Select 
                  value={config.security.authMode} 
                  onValueChange={(value) => handleSelectChange('security', 'authMode', value)}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="simplified">Simplified</SelectItem>
                    <SelectItem value="RBAC">RBAC</SelectItem>
                    <SelectItem value="OAuth2">OAuth2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                {[
                  { key: 'threatScanner', label: 'Threat Scanner', desc: 'Real-time security monitoring' },
                  { key: 'agentLockdown', label: 'Agent Lockdown', desc: 'Restrict agent execution' },
                  { key: 'memoryEncryption', label: 'Memory Encryption', desc: 'Encrypt sensitive data' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                    <div>
                      <span className="text-white text-sm">{item.label}</span>
                      <p className="text-slate-400 text-xs">{item.desc}</p>
                    </div>
                    <Switch
                      checked={config.security[item.key]}
                      onCheckedChange={(value) => handleToggle('security', item.key, value)}
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Monitoring & Logging */}
          <AccordionItem value="monitoring" className="border border-slate-700/50 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-slate-700/30">
              <div className="flex items-center space-x-3">
                <Monitor className="h-5 w-5 text-purple-400" />
                <span className="text-white font-medium">Monitoring & Logging</span>
                <Badge className="bg-purple-500/20 text-purple-400">@memory-core</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div className="space-y-3">
                {[
                  { key: 'heartbeat', label: 'Heartbeat Monitor (5s)', desc: 'System health checks' },
                  { key: 'realtimeLogs', label: 'Realtime Logs', desc: 'Live log streaming' },
                  { key: 'errorExport', label: 'Export Errors to Supabase', desc: 'Cloud error logging' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                    <div>
                      <span className="text-white text-sm">{item.label}</span>
                      <p className="text-slate-400 text-xs">{item.desc}</p>
                    </div>
                    <Switch
                      checked={config.monitoring[item.key]}
                      onCheckedChange={(value) => handleToggle('monitoring', item.key, value)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Max Log Size (MB)</label>
                <Input
                  type="number"
                  value={config.monitoring.maxLogSize}
                  onChange={(e) => handleInputChange('monitoring', 'maxLogSize', e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Integrations */}
          <AccordionItem value="integrations" className="border border-slate-700/50 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-slate-700/30">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-cyan-400" />
                <span className="text-white font-medium">Integrations</span>
                <Badge className="bg-cyan-500/20 text-cyan-400">External APIs</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div className="space-y-3">
                {[
                  { key: 'openai', label: 'OpenAI API', desc: 'GPT integration' },
                  { key: 'supabase', label: 'Supabase Edge Functions', desc: 'Database operations' },
                  { key: 'googleMaps', label: 'Google Maps & Places', desc: 'Location services' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                    <div>
                      <span className="text-white text-sm">{item.label}</span>
                      <p className="text-slate-400 text-xs">{item.desc}</p>
                    </div>
                    <Switch
                      checked={config.integrations[item.key]}
                      onCheckedChange={(value) => handleToggle('integrations', item.key, value)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Custom API Key</label>
                <Input
                  type="password"
                  value={config.integrations.customApiKey}
                  onChange={(e) => handleInputChange('integrations', 'customApiKey', e.target.value)}
                  placeholder="Enter custom API key..."
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Meta-Evolution */}
          <AccordionItem value="evolution" className="border border-slate-700/50 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-slate-700/30">
              <div className="flex items-center space-x-3">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-medium">Meta-Evolution</span>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black">Level {config.evolution.level}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">
                    Evolution Level: {config.evolution.level}/100
                  </label>
                  <Slider
                    value={[config.evolution.level]}
                    onValueChange={(value) => handleSliderChange('evolution', 'level', value)}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Development Mode</label>
                  <Select 
                    value={config.evolution.developmentMode} 
                    onValueChange={(value) => handleSelectChange('evolution', 'developmentMode', value)}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="adaptive">Adaptive</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border border-yellow-500/20">
                  <div>
                    <span className="text-yellow-300 text-sm font-medium">Transcendence Mode</span>
                    <p className="text-yellow-500/70 text-xs">Advanced consciousness simulation</p>
                  </div>
                  <Switch
                    checked={config.evolution.transcendence}
                    onCheckedChange={(value) => handleToggle('evolution', 'transcendence', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                  <div>
                    <span className="text-white text-sm">Self-Modulation</span>
                    <p className="text-slate-400 text-xs">Allow agents to modify themselves</p>
                  </div>
                  <Switch
                    checked={config.evolution.selfModulation}
                    onCheckedChange={(value) => handleToggle('evolution', 'selfModulation', value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AGISettingsPanel;
