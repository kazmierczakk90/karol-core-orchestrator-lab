import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Lightbulb, Cog, Zap, FlaskConical } from "lucide-react";
import { AutoImprovementPanel } from "@/components/karol-core/AutoImprovementPanel";
import { SafetyModulesPanel } from "@/components/karol-core/SafetyModulesPanel";
import { EmotionalEnginePanel } from "@/components/karol-core/EmotionalEnginePanel";
import { EDICTPanel } from "@/components/karol-core/EDICTPanel";
import { OptimizationPanel } from "@/components/karol-core/OptimizationPanel";
import { QuantumDecisionsPanel } from "@/components/karol-core/QuantumDecisionsPanel";
import { XdGPTPanel } from "@/components/karol-core/XdGPTPanel";
import { XdSPanel } from "@/components/karol-core/XdSPanel";

export default function KarolCoreCommandCenter() {
  const [activeTab, setActiveTab] = useState("p0");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Karol-Core Command Center
          </h1>
          <p className="text-muted-foreground">
            Centrum zarządzania i monitoringu platformy AGI
          </p>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                P0: Foundation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Online</div>
              <p className="text-xs text-muted-foreground">Auto-Improvement + Safety</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-500" />
                P1: Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Emotional + EDICT</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                P2: Reasoning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Running</div>
              <p className="text-xs text-muted-foreground">Optimization + Quantum</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-purple-500" />
                P3: Experimental
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ready</div>
              <p className="text-xs text-muted-foreground">XdGPT + XdS</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Control Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="p0" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              P0: Foundation
            </TabsTrigger>
            <TabsTrigger value="p1" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              P1: Intelligence
            </TabsTrigger>
            <TabsTrigger value="p2" className="flex items-center gap-2">
              <Cog className="h-4 w-4" />
              P2: Reasoning
            </TabsTrigger>
            <TabsTrigger value="p3" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              P3: Experimental
            </TabsTrigger>
          </TabsList>

          {/* P0: Foundation */}
          <TabsContent value="p0" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Auto-Improvement System</CardTitle>
                  <CardDescription>
                    Monitorowanie i zarządzanie automatycznymi ulepszeniami
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AutoImprovementPanel />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Safety Modules</CardTitle>
                  <CardDescription>
                    Drift detection i health monitoring agentów
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SafetyModulesPanel />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* P1: Intelligence */}
          <TabsContent value="p1" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Emotional Intelligence Engine</CardTitle>
                  <CardDescription>
                    Stan emocjonalny i pamięć emocjonalna systemu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmotionalEnginePanel />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>EDICT Prompt Enhancement</CardTitle>
                  <CardDescription>
                    Analiza i wzbogacanie promptów
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EDICTPanel />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* P2: Reasoning */}
          <TabsContent value="p2" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Orchestrator</CardTitle>
                  <CardDescription>
                    Zarządzanie zadaniami optymalizacyjnymi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OptimizationPanel />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quantum Decision Trees</CardTitle>
                  <CardDescription>
                    Symulacja i ewaluacja ścieżek decyzyjnych
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuantumDecisionsPanel />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* P3: Experimental */}
          <TabsContent value="p3" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>XdGPT Multi-Model Manager</CardTitle>
                  <CardDescription>
                    Porównywanie i zarządzanie modelami AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <XdGPTPanel />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>XdS Research Pipeline</CardTitle>
                  <CardDescription>
                    Automatyczny pipeline badawczy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <XdSPanel />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
