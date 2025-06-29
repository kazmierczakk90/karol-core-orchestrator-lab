
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Download, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import new modules
import ScenarioMapModule from './ScenarioMapModule';
import AgentSimulatorModule from './AgentSimulatorModule';
import MultiAgentFlowModule from './MultiAgentFlowModule';
import TimelineExplorerModule from './TimelineExplorerModule';
import EmotionalEngineModule from './EmotionalEngineModule';
import DynamicInsightsModule from './DynamicInsightsModule';
import PDFExporterModule from './PDFExporterModule';
import MetaStylesModule from './MetaStylesModule';

const KarolCoreExtendedPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('development');

  const exportExtendedConfig = () => {
    const config = {
      version: '2.0-extended',
      timestamp: new Date().toISOString(),
      modules: [
        'scenario-map',
        'agent-simulator', 
        'multi-agent-flow',
        'timeline-explorer',
        'emotional-engine-v2',
        'dynamic-insights',
        'pdf-exporter',
        'meta-styles'
      ],
      agents: [
        '@evolution-tracker',
        '@prompt-forge',
        '@router',
        '@state-keeper',
        '@voice-core',
        '@feedback-loop',
        '@guardian-core',
        '@meta-analyst'
      ]
    };

    // Simulate export
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'karolconfig_extended.json';
    link.click();

    toast({
      title: "Configuration Exported",
      description: "karolconfig_extended.json has been downloaded",
    });
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
                  <Brain className="h-6 w-6" />
                  <span>Karol-Core AGI Extended Panel</span>
                </CardTitle>
                <p className="text-slate-400 mt-1">
                  Advanced Development Modules & Meta-Intelligence Extensions
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500/20 text-green-400">
                  <Zap className="h-3 w-3 mr-1" />
                  Extended v2.0
                </Badge>
                <Button onClick={exportExtendedConfig} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Config
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-700/50">
                <TabsTrigger 
                  value="development" 
                  className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                >
                  Development
                </TabsTrigger>
                <TabsTrigger 
                  value="intelligence"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Intelligence
                </TabsTrigger>
                <TabsTrigger 
                  value="analysis"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="export"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Export & Meta
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <TabsContent value="development" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <ScenarioMapModule />
              <MultiAgentFlowModule />
            </div>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <AgentSimulatorModule />
              <EmotionalEngineModule />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <TimelineExplorerModule />
              <DynamicInsightsModule />
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <PDFExporterModule />
              <MetaStylesModule />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div>
                8 Extended Modules | 8 Active Agents | Real-time Processing
              </div>
              <div className="flex items-center space-x-4">
                <span>Config: karolconfig_extended.json</span>
                <Badge variant="outline" className="text-xs">
                  <Settings className="h-3 w-3 mr-1" />
                  Auto-Sync
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KarolCoreExtendedPanel;
