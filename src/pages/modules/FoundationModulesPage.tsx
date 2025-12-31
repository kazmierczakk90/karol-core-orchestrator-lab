import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Zap, Activity } from "lucide-react";
import { AutoImprovementPanel } from "@/components/karol-core/AutoImprovementPanel";
import { SafetyModulesPanel } from "@/components/karol-core/SafetyModulesPanel";

export default function FoundationModulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Shield className="h-8 w-8 text-emerald-400" />
          P0: Foundation Modules
        </h1>
        <p className="text-muted-foreground mt-1">
          Auto-Improvement System & Safety Monitoring
        </p>
      </div>

      <Tabs defaultValue="auto-improvement" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="auto-improvement" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Auto-Improvement
          </TabsTrigger>
          <TabsTrigger value="safety" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Safety Modules
          </TabsTrigger>
        </TabsList>
        <TabsContent value="auto-improvement" className="mt-6">
          <AutoImprovementPanel />
        </TabsContent>
        <TabsContent value="safety" className="mt-6">
          <SafetyModulesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
