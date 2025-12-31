import { QuickStats } from "@/components/dashboard/QuickStats";
import { ModuleStatus } from "@/components/dashboard/ModuleStatus";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Brain } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            Karol-Core AGI Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Multi-Agent Orchestration Platform • Version 10.0
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Module Status - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ModuleStatus />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
