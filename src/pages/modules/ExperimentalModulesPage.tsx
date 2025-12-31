import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical, Sparkles, Search } from "lucide-react";
import { XdGPTPanel } from "@/components/karol-core/XdGPTPanel";
import { XdSPanel } from "@/components/karol-core/XdSPanel";

export default function ExperimentalModulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FlaskConical className="h-8 w-8 text-cyan-400" />
          P3: Experimental Modules
        </h1>
        <p className="text-muted-foreground mt-1">
          XdGPT Multi-Model Manager & XdS Research Pipeline
        </p>
      </div>

      <Tabs defaultValue="xdgpt" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="xdgpt" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            XdGPT
          </TabsTrigger>
          <TabsTrigger value="xds" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            XdS Research
          </TabsTrigger>
        </TabsList>
        <TabsContent value="xdgpt" className="mt-6">
          <XdGPTPanel />
        </TabsContent>
        <TabsContent value="xds" className="mt-6">
          <XdSPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
