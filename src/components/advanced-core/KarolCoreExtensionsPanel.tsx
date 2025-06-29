
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Download, Activity, Eye, Settings2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import new extension modules
import NarrativeBuilderModule from './extensions/NarrativeBuilderModule';
import ImpactScoreTrackerModule from './extensions/ImpactScoreTrackerModule';
import DecisionHeatmapModule from './extensions/DecisionHeatmapModule';
import TriggerChainDesignerModule from './extensions/TriggerChainDesignerModule';
import LiveAgentUptimeModule from './extensions/LiveAgentUptimeModule';
import CausalityTrackerModule from './extensions/CausalityTrackerModule';
import PresenceIdentityModule from './extensions/PresenceIdentityModule';
import StyleTransferEngineModule from './extensions/StyleTransferEngineModule';
import ToneShifterModule from './extensions/ToneShifterModule';
import AIAvatarMapperModule from './extensions/AIAvatarMapperModule';
import WebhookPlaygroundModule from './extensions/WebhookPlaygroundModule';
import ExternalFeedMonitorModule from './extensions/ExternalFeedMonitorModule';
import RealtimeSyncBusModule from './extensions/RealtimeSyncBusModule';
import MemoryTimelineModule from './extensions/MemoryTimelineModule';
import PromptChainSimulatorModule from './extensions/PromptChainSimulatorModule';
import SystemReflectionGeneratorModule from './extensions/SystemReflectionGeneratorModule';
import PromptInfluenceMapperModule from './extensions/PromptInfluenceMapperModule';
import IntentionDriftDetectorModule from './extensions/IntentionDriftDetectorModule';
import RetrospectiveReflectorModule from './extensions/RetrospectiveReflectorModule';

const KarolCoreExtensionsPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('narrative');
  const [syncBusEnabled, setSyncBusEnabled] = useState(true);

  const exportKarolConfig = () => {
    const config = {
      version: '2.1-extended',
      timestamp: new Date().toISOString(),
      extensions: {
        narrative_builder: { agent: '@voice-core', active: true },
        impact_tracker: { agent: '@evolution-tracker', active: true },
        decision_heatmap: { agent: '@insight-core', active: true },
        trigger_chain: { agent: '@router', active: true },
        agent_uptime: { agent: '@guardian-core', active: true },
        causality_tracker: { agent: '@retrospect-core', active: true },
        presence_identity: { agent: '@presence-core', active: true },
        style_transfer: { agent: '@style-core', active: true },
        tone_shifter: { agent: '@voice-core', active: true },
        avatar_mapper: { agent: '@ceo-core', active: true },
        webhook_playground: { agent: '@api-router', active: true },
        feed_monitor: { agent: '@watcher-core', active: true },
        sync_bus: { agent: '@sync-core', active: syncBusEnabled },
        memory_timeline: { agent: '@state-keeper', active: true },
        prompt_simulator: { agent: '@prompt-forge', active: true },
        system_reflection: { agent: '@feedback-loop', active: true },
        prompt_influence: { agent: '@prompt-forge', active: true },
        intention_drift: { agent: '@router', active: true },
        retrospective: { agent: '@evolution-tracker', active: true }
      },
      sync_bus_enabled: syncBusEnabled,
      live_triggers: [
        'snapshot_update', 'decision_made', 'agent_action', 
        'memory_write', 'style_change', 'prompt_executed'
      ]
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
      description: "karolconfig.json został pobrany z rozszerzeniami",
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
                  <span>Karol-Core Extensions Panel</span>
                </CardTitle>
                <p className="text-slate-400 mt-1">
                  19 Active Extensions | Live Sync Bus | Agent Integration
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`${syncBusEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  <Activity className="h-3 w-3 mr-1" />
                  Sync Bus {syncBusEnabled ? 'ON' : 'OFF'}
                </Badge>
                <Button onClick={exportKarolConfig} variant="outline" size="sm">
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
              <TabsList className="grid w-full grid-cols-5 bg-slate-700/50">
                <TabsTrigger value="narrative" className="data-[state=active]:bg-cyan-600">
                  Narrative & Impact
                </TabsTrigger>
                <TabsTrigger value="decision" className="data-[state=active]:bg-purple-600">
                  Decision & Logic
                </TabsTrigger>
                <TabsTrigger value="identity" className="data-[state=active]:bg-green-600">
                  Identity & Style
                </TabsTrigger>
                <TabsTrigger value="integration" className="data-[state=active]:bg-orange-600">
                  Integration & Sync
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-pink-600">
                  Analysis & Evolution
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <TabsContent value="narrative" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NarrativeBuilderModule />
              <ImpactScoreTrackerModule />
            </div>
          </TabsContent>

          <TabsContent value="decision" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DecisionHeatmapModule />
              <TriggerChainDesignerModule />
              <LiveAgentUptimeModule />
              <CausalityTrackerModule />
            </div>
          </TabsContent>

          <TabsContent value="identity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PresenceIdentityModule />
              <StyleTransferEngineModule />
              <ToneShifterModule />
              <AIAvatarMapperModule />
            </div>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WebhookPlaygroundModule />
              <ExternalFeedMonitorModule />
              <RealtimeSyncBusModule syncEnabled={syncBusEnabled} setSyncEnabled={setSyncBusEnabled} />
              <MemoryTimelineModule />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PromptChainSimulatorModule />
              <SystemReflectionGeneratorModule />
              <PromptInfluenceMapperModule />
              <IntentionDriftDetectorModule />
              <RetrospectiveReflectorModule />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div>
                19 Extension Modules | Live Sync Bus | karolconfig.json Ready
              </div>
              <div className="flex items-center space-x-4">
                <span>Agents: 12 Active</span>
                <Badge variant="outline" className="text-xs">
                  <Settings2 className="h-3 w-3 mr-1" />
                  Auto-Update
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KarolCoreExtensionsPanel;
