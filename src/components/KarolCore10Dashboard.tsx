import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Brain, Layers, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface CoreSyncMetrics {
  totalMissions: number;
  activeMissions: number;
  completedMissions: number;
  agentUtilization: number;
  syncHealth: 'healthy' | 'degraded' | 'critical';
}

interface UIMetrics {
  activePanels: number;
  visiblePanels: number;
  totalInteractions: number;
  adaptiveScore: number;
}

interface AutonomyMetrics {
  totalDecisions: number;
  successfulDecisions: number;
  averageConfidence: number;
  autonomyLevel: number;
  selfOrganizationScore: number;
}

export default function KarolCore10Dashboard() {
  const [coreSync, setCoreSync] = useState<CoreSyncMetrics>({
    totalMissions: 0,
    activeMissions: 0,
    completedMissions: 0,
    agentUtilization: 0,
    syncHealth: 'healthy'
  });

  const [uiMetrics, setUIMetrics] = useState<UIMetrics>({
    activePanels: 0,
    visiblePanels: 0,
    totalInteractions: 0,
    adaptiveScore: 0
  });

  const [autonomy, setAutonomy] = useState<AutonomyMetrics>({
    totalDecisions: 0,
    successfulDecisions: 0,
    averageConfidence: 0,
    autonomyLevel: 0,
    selfOrganizationScore: 0
  });

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Simulate live data (will be connected to actual services)
    const interval = setInterval(() => {
      setCoreSync(prev => ({
        totalMissions: prev.totalMissions + Math.floor(Math.random() * 2),
        activeMissions: Math.floor(Math.random() * 10),
        completedMissions: prev.completedMissions + Math.floor(Math.random() * 2),
        agentUtilization: 45 + Math.floor(Math.random() * 30),
        syncHealth: Math.random() > 0.8 ? 'degraded' : 'healthy'
      }));

      setUIMetrics(prev => ({
        activePanels: 5,
        visiblePanels: 4,
        totalInteractions: prev.totalInteractions + Math.floor(Math.random() * 5),
        adaptiveScore: 75 + Math.floor(Math.random() * 20)
      }));

      setAutonomy(prev => ({
        totalDecisions: prev.totalDecisions + (Math.random() > 0.7 ? 1 : 0),
        successfulDecisions: prev.successfulDecisions + (Math.random() > 0.8 ? 1 : 0),
        averageConfidence: 0.75 + Math.random() * 0.2,
        autonomyLevel: 60 + Math.floor(Math.random() * 25),
        selfOrganizationScore: 70 + Math.floor(Math.random() * 20)
      }));
    }, 3000);

    setIsLive(true);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Karol-Core 10.0: AGI-Orchestration Live
          </h1>
          <p className="text-muted-foreground mt-1">
            Adaptacyjne podejmowanie decyzji • Pamięć kontekstowa • Dynamiczna reakcja agentów
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isLive ? "default" : "secondary"} className="gap-2">
            <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
            {isLive ? 'LIVE' : 'OFFLINE'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="core-sync">Core Sync</TabsTrigger>
          <TabsTrigger value="meta-ui">Meta UI</TabsTrigger>
          <TabsTrigger value="autonomy">AGI Autonomy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Core Sync Overview */}
            <Card className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Core Sync</h3>
                </div>
                <span className={`text-2xl ${getHealthColor(coreSync.syncHealth)}`}>●</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Agent Utilization</span>
                  <span className="font-medium">{coreSync.agentUtilization}%</span>
                </div>
                <Progress value={coreSync.agentUtilization} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Active</p>
                  <p className="text-xl font-bold">{coreSync.activeMissions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold">{coreSync.completedMissions}</p>
                </div>
              </div>
            </Card>

            {/* Meta UI Overview */}
            <Card className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Meta UI</h3>
                </div>
                <Badge variant="outline">{uiMetrics.adaptiveScore}%</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Adaptive Score</span>
                  <span className="font-medium">{uiMetrics.adaptiveScore}%</span>
                </div>
                <Progress value={uiMetrics.adaptiveScore} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Panels</p>
                  <p className="text-xl font-bold">{uiMetrics.visiblePanels}/{uiMetrics.activePanels}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interactions</p>
                  <p className="text-xl font-bold">{uiMetrics.totalInteractions}</p>
                </div>
              </div>
            </Card>

            {/* AGI Autonomy Overview */}
            <Card className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">AGI Autonomy</h3>
                </div>
                <Badge variant="outline">{autonomy.autonomyLevel}%</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Autonomy Level</span>
                  <span className="font-medium">{autonomy.autonomyLevel}%</span>
                </div>
                <Progress value={autonomy.autonomyLevel} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Decisions</p>
                  <p className="text-xl font-bold">{autonomy.totalDecisions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Success Rate</p>
                  <p className="text-xl font-bold">
                    {autonomy.totalDecisions > 0 
                      ? Math.round((autonomy.successfulDecisions / autonomy.totalDecisions) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* System Status */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Core Sync Orchestrator</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Meta UI Controller</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>AGI Autonomy Engine</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="core-sync">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Core Sync Orchestrator</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Missions</p>
                  <p className="text-2xl font-bold">{coreSync.totalMissions}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-primary">{coreSync.activeMissions}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-500">{coreSync.completedMissions}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Sync Health</p>
                  <p className={`text-2xl font-bold ${getHealthColor(coreSync.syncHealth)}`}>
                    {coreSync.syncHealth.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Agent Utilization</p>
                <Progress value={coreSync.agentUtilization} className="h-3" />
                <p className="text-right text-sm mt-1">{coreSync.agentUtilization}%</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="meta-ui">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Meta UI Controller</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Panels</p>
                  <p className="text-2xl font-bold">{uiMetrics.activePanels}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Visible</p>
                  <p className="text-2xl font-bold text-primary">{uiMetrics.visiblePanels}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Interactions</p>
                  <p className="text-2xl font-bold">{uiMetrics.totalInteractions}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Adaptive Score</p>
                  <p className="text-2xl font-bold text-green-500">{uiMetrics.adaptiveScore}%</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="autonomy">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">AGI Autonomy Engine</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Decisions</p>
                  <p className="text-2xl font-bold">{autonomy.totalDecisions}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Successful</p>
                  <p className="text-2xl font-bold text-green-500">{autonomy.successfulDecisions}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold">{(autonomy.averageConfidence * 100).toFixed(0)}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Self-Org Score</p>
                  <p className="text-2xl font-bold text-primary">{autonomy.selfOrganizationScore}%</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Autonomy Level</p>
                <Progress value={autonomy.autonomyLevel} className="h-3" />
                <p className="text-right text-sm mt-1">{autonomy.autonomyLevel}%</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
