import { Search, Plus, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XdSPanel } from "@/components/karol-core/XdSPanel";

export default function ResearchToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Search className="h-8 w-8 text-violet-400" />
            Research Pipeline
          </h1>
          <p className="text-muted-foreground mt-1">
            XdS research tools with automated synthesis
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Research
        </Button>
      </div>

      <XdSPanel />
    </div>
  );
}
