
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, Shield, Activity, Cpu, Eye, Settings, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PlatformSettingsTab = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    coreIntelligence: {
      engineMode: 'hybrid',
      analysisDepth: [10],
      cognitiveAdaptation: true,
      memoryCompression: false
    },
    identity: {
      systemName: 'Karol-Core AGI v3.0',
      expressionStyle: 'introspective',
      emotionalMode: true,
      userStyleBehavior: true
    },
    runtime: {
      cpuLimit: [80],
      memoryAllocation: [8192],
      autoSnapshot: true,
      nightEvolution: false
    },
    security: {
      authentication: 'simplified',
      threatScanner: true,
      agentLockdown: false,
      memoryEncryption: true
    },
    monitoring: {
      heartbeat: true,
      realtimeLogs: true,
      errorExport: true,
      maxLogSize: '1024'
    },
    integrations: {
      openaiAPI: true,
      supabaseFunctions: true,
      googleMaps: false,
      customAPIKey: ''
    },
    metaEvolution: {
      evolutionLevel: [75],
      transcendence: true,
      agentSelfModulation: false,
      developmentMode: 'adaptive'
    }
  });

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));

    toast({
      title: "Ustawienie zaktualizowane",
      description: `${section}.${key} → @adaptive-core`,
    });
  };

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["core", "identity"]} className="space-y-4">
        
        {/* Core Intelligence */}
        <AccordionItem value="core">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-cyan-400 flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>1. Core Intelligence</span>
              </CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Tryb silnika</Label>
                    <Select
                      value={settings.coreIntelligence.engineMode}
                      onValueChange={(value) => updateSetting('coreIntelligence', 'engineMode', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="heuristic">Heuristic</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="quantum">Quantum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300">Głębokość analizy</Label>
                      <span className="text-cyan-400">{settings.coreIntelligence.analysisDepth[0]}</span>
                    </div>
                    <Slider
                      value={settings.coreIntelligence.analysisDepth}
                      onValueChange={(value) => updateSetting('coreIntelligence', 'analysisDepth', value)}
                      max={15}
                      min={1}
                      step={1}
                    />
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={settings.coreIntelligence.cognitiveAdaptation}
                            onCheckedChange={(checked) => updateSetting('coreIntelligence', 'cognitiveAdaptation', checked)}
                          />
                          <Label className="text-slate-300">Autoadaptacja poznawcza</Label>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Automatyczne dostosowywanie strategii poznawczych</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={settings.coreIntelligence.memoryCompression}
                            onCheckedChange={(checked) => updateSetting('coreIntelligence', 'memoryCompression', checked)}
                          />
                          <Label className="text-slate-300">Kompresja pamięci semantycznej</Label>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Optymalizacja wykorzystania pamięci przez kompresję</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Identity & Behavior */}
        <AccordionItem value="identity">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-purple-400 flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>2. Identity & Behavior</span>
              </CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Nazwa systemu</Label>
                    <Input
                      value={settings.identity.systemName}
                      onChange={(e) => updateSetting('identity', 'systemName', e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Styl ekspresji</Label>
                    <Select
                      value={settings.identity.expressionStyle}
                      onValueChange={(value) => updateSetting('identity', 'expressionStyle', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="introspective">Introspective</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.identity.emotionalMode}
                      onCheckedChange={(checked) => updateSetting('identity', 'emotionalMode', checked)}
                    />
                    <Label className="text-slate-300">Tryb emocjonalny</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.identity.userStyleBehavior}
                      onCheckedChange={(checked) => updateSetting('identity', 'userStyleBehavior', checked)}
                    />
                    <Label className="text-slate-300">Zachowanie stylu użytkownika</Label>
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Runtime & Performance */}
        <AccordionItem value="runtime">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-green-400 flex items-center space-x-2">
                <Cpu className="h-5 w-5" />
                <span>3. Runtime & Performance</span>
              </CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300">CPU Limit</Label>
                      <span className="text-green-400">{settings.runtime.cpuLimit[0]}%</span>
                    </div>
                    <Slider
                      value={settings.runtime.cpuLimit}
                      onValueChange={(value) => updateSetting('runtime', 'cpuLimit', value)}
                      max={100}
                      min={10}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300">Memory Allocation</Label>
                      <span className="text-green-400">{settings.runtime.memoryAllocation[0]}MB</span>
                    </div>
                    <Slider
                      value={settings.runtime.memoryAllocation}
                      onValueChange={(value) => updateSetting('runtime', 'memoryAllocation', value)}
                      max={16384}
                      min={512}
                      step={512}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.runtime.autoSnapshot}
                      onCheckedChange={(checked) => updateSetting('runtime', 'autoSnapshot', checked)}
                    />
                    <Label className="text-slate-300">Snapshot co 10 min</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.runtime.nightEvolution}
                      onCheckedChange={(checked) => updateSetting('runtime', 'nightEvolution', checked)}
                    />
                    <Label className="text-slate-300">Nocna autoewolucja</Label>
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Remaining sections with similar structure */}
        <AccordionItem value="security">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-red-400 flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>4. Security & Access</span>
              </CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Uwierzytelnianie</Label>
                    <Select
                      value={settings.security.authentication}
                      onValueChange={(value) => updateSetting('security', 'authentication', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="simplified">Simplified</SelectItem>
                        <SelectItem value="RBAC">RBAC</SelectItem>
                        <SelectItem value="OAuth2">OAuth2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.threatScanner}
                      onCheckedChange={(checked) => updateSetting('security', 'threatScanner', checked)}
                    />
                    <Label className="text-slate-300">Skaner zagrożeń co 15 min</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.agentLockdown}
                      onCheckedChange={(checked) => updateSetting('security', 'agentLockdown', checked)}
                    />
                    <Label className="text-slate-300">Agent lockdown</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.memoryEncryption}
                      onCheckedChange={(checked) => updateSetting('security', 'memoryEncryption', checked)}
                    />
                    <Label className="text-slate-300">Szyfrowanie pamięci</Label>
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Continue with remaining sections... */}
        <AccordionItem value="evolution">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-yellow-400 flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>7. Meta-Evolution</span>
              </CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300">Poziom ewolucji</Label>
                      <span className="text-yellow-400">{settings.metaEvolution.evolutionLevel[0]}</span>
                    </div>
                    <Slider
                      value={settings.metaEvolution.evolutionLevel}
                      onValueChange={(value) => updateSetting('metaEvolution', 'evolutionLevel', value)}
                      max={100}
                      min={1}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Tryb rozwoju</Label>
                    <Select
                      value={settings.metaEvolution.developmentMode}
                      onValueChange={(value) => updateSetting('metaEvolution', 'developmentMode', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="adaptive">Adaptive</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.metaEvolution.transcendence}
                      onCheckedChange={(checked) => updateSetting('metaEvolution', 'transcendence', checked)}
                    />
                    <Label className="text-slate-300">Transcendencja</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.metaEvolution.agentSelfModulation}
                      onCheckedChange={(checked) => updateSetting('metaEvolution', 'agentSelfModulation', checked)}
                    />
                    <Label className="text-slate-300">Samomodulacja agentów</Label>
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

      </Accordion>
    </div>
  );
};

export default PlatformSettingsTab;
