import { Users, Bot, Cpu, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AgentSimulatorModule from "@/components/advanced-core/AgentSimulatorModule";

export default function AgentToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="h-8 w-8 text-cyan-400" />
          Agent Simulator
        </h1>
        <p className="text-muted-foreground mt-1">
          Test, manage, and monitor AI agents
        </p>
      </div>

      <AgentSimulatorModule />
    </div>
  );
}
