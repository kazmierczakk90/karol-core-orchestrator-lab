import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Settings, GitBranch } from "lucide-react";
import { OptimizationPanel } from "@/components/karol-core/OptimizationPanel";
import { QuantumDecisionsPanel } from "@/components/karol-core/QuantumDecisionsPanel";

export default function ReasoningModulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Lightbulb className="h-8 w-8 text-amber-400" />
          P2: Reasoning Modules
        </h1>
        <p className="text-muted-foreground mt-1">
          Optimization Orchestrator & Quantum Decision Trees
        </p>
      </div>

      <Tabs defaultValue="optimization" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Optimization
          </TabsTrigger>
          <TabsTrigger value="quantum" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Quantum Decisions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="optimization" className="mt-6">
          <OptimizationPanel />
        </TabsContent>
        <TabsContent value="quantum" className="mt-6">
          <QuantumDecisionsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
