import { Workflow, Plus, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WorkflowBuilder from "@/components/WorkflowBuilder";

export default function WorkflowToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Workflow className="h-8 w-8 text-emerald-400" />
            Workflow Builder
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage automation flows
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Workflow
        </Button>
      </div>

      <WorkflowBuilder />
    </div>
  );
}
