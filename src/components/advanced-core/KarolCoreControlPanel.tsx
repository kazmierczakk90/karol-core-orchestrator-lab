
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Wrench, Download, Upload, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ControlPanelSettings from './control-panel/ControlPanelSettings';
import ControlPanelTools from './control-panel/ControlPanelTools';

const KarolCoreControlPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('settings');

  const exportConfig = () => {
    const config = {
      version: "2.0",
      timestamp: new Date().toISOString(),
      core: {
        intelligence: {
          mode: "hybrid",
          analysisDepth: 8,
          cognitiveAdaptation: true,
          semanticCompression: true
        },
        identity: {
          systemName: "Karol-Core AGI",
          expressionStyle: "introspective",
          emotionalMode: true,
          userStyleBehavior: true
        },
        runtime: {
          cpuLimit: 75,
          memoryAllocation: "8GB",
          autoSnapshot: true,
          nightEvolution: true
        }
      }
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'karolconfig.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration Exported",
      description: "karolconfig.json has been downloaded successfully",
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
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target?.result as string);
            console.log('Imported config:', config);
            toast({
              title: "Configuration Imported",
              description: "Settings have been loaded from karolconfig.json",
            });
          } catch (error) {
            toast({
              title: "Import Error",
              description: "Invalid JSON configuration file",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>Karol-Core Control Panel</span>
            <Badge variant="outline" className="text-cyan-400">v2.0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={exportConfig} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={importConfig} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Import JSON
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>SETTINGS</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center space-x-2">
                <Wrench className="h-4 w-4" />
                <span>TOOLS</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="mt-6">
              <ControlPanelSettings />
            </TabsContent>
            
            <TabsContent value="tools" className="mt-6">
              <ControlPanelTools />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KarolCoreControlPanel;
