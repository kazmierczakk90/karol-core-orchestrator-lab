import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Heart, Sparkles } from "lucide-react";
import { EmotionalEnginePanel } from "@/components/karol-core/EmotionalEnginePanel";
import { EDICTPanel } from "@/components/karol-core/EDICTPanel";

export default function IntelligenceModulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Brain className="h-8 w-8 text-violet-400" />
          P1: Intelligence Modules
        </h1>
        <p className="text-muted-foreground mt-1">
          Emotional Intelligence Engine & EDICT Prompt Enhancement
        </p>
      </div>

      <Tabs defaultValue="emotional" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="emotional" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Emotional Engine
          </TabsTrigger>
          <TabsTrigger value="edict" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            EDICT
          </TabsTrigger>
        </TabsList>
        <TabsContent value="emotional" className="mt-6">
          <EmotionalEnginePanel />
        </TabsContent>
        <TabsContent value="edict" className="mt-6">
          <EDICTPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
