
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Download, Upload, Cog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PlatformSettingsTab from './PlatformSettingsTab';
import PlatformToolsTab from './PlatformToolsTab';

const PlatformSettingsPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('settings');

  const exportConfig = () => {
    const config = {
      version: '3.0-platform',
      timestamp: new Date().toISOString(),
      settings: {
        coreIntelligence: {
          engineMode: 'hybrid',
          analysisDepth: 10,
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
          cpuLimit: 80,
          memoryAllocation: 8192,
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
          maxLogSize: 1024
        },
        integrations: {
          openaiAPI: true,
          supabaseFunctions: true,
          googleMaps: false,
          customAPIKey: ''
        },
        metaEvolution: {
          evolutionLevel: 75,
          transcendence: true,
          agentSelfModulation: false,
          developmentMode: 'adaptive'
        }
      },
      tools: {
        memoryManager: { autoSave: true, snapshotCount: 15 },
        rulesComposer: { activeRules: 8, testMode: false },
        simulation: { mode: 'auto', scenarios: 3 },
        personalization: { style: 'inspirujące', mode: 'CEO' },
        pluginManager: { activePlugins: 12, experimental: 2 },
        debugTrace: { traceDepth: 5, errorTracking: true },
        apiManager: { webhooks: 4, endpoints: 6 },
        insightsGenerator: { mode: 'reaktywne', reports: 8 },
        intentMapper: { accuracy: 0.87, autoMode: true }
      }
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'karolconfig.json';
    link.click();

    toast({
      title: "Konfiguracja wyeksportowana",
      description: "karolconfig.json został pobrany pomyślnie",
    });
  };

  const importConfig = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const config = JSON.parse(event.target?.result as string);
            console.log('Imported config:', config);
            toast({
              title: "Konfiguracja zaimportowana",
              description: `Wczytano ustawienia wersji ${config.version || 'nieznana'}`,
            });
          } catch (error) {
            toast({
              title: "Błąd importu",
              description: "Nieprawidłowy format pliku JSON",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-slate-800/50 border-cyan-800/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-cyan-400 flex items-center space-x-2">
                  <Settings className="h-6 w-6" />
                  <span>Platform Settings</span>
                </CardTitle>
                <p className="text-slate-400 mt-1">
                  Zaawansowane ustawienia systemowe i narzędzia zarządzania AGI
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-500/20 text-blue-400">
                  <Cog className="h-3 w-3 mr-1" />
                  Platform v3.0
                </Badge>
                <Button onClick={exportConfig} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button onClick={importConfig} variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import JSON
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                >
                  🧠 Settings
                </TabsTrigger>
                <TabsTrigger 
                  value="tools"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  🧪 Tools
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <TabsContent value="settings" className="space-y-6">
            <PlatformSettingsTab />
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <PlatformToolsTab />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div>
                7 Settings Modules | 9 Tools Modules | Real-time Sync
              </div>
              <div className="flex items-center space-x-4">
                <span>Config: karolconfig.json</span>
                <Badge variant="outline" className="text-xs">
                  <Settings className="h-3 w-3 mr-1" />
                  Auto-Save
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformSettingsPanel;
