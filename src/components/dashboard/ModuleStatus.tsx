import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, Brain, Lightbulb, FlaskConical, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Module {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: "operational" | "partial" | "development";
  icon: React.ElementType;
  path: string;
  features: string[];
}

const modules: Module[] = [
  {
    id: "p0",
    name: "P0: Foundation",
    description: "Auto-Improvement & Safety Modules",
    progress: 85,
    status: "operational",
    icon: Shield,
    path: "/modules/foundation",
    features: ["Guardian Core", "Auto-Improvement", "Safety Monitoring"],
  },
  {
    id: "p1",
    name: "P1: Intelligence",
    description: "Emotional Engine & EDICT",
    progress: 70,
    status: "partial",
    icon: Brain,
    path: "/modules/intelligence",
    features: ["Emotional States", "Memory Service", "EDICT Enhancement"],
  },
  {
    id: "p2",
    name: "P2: Reasoning",
    description: "Optimization & Quantum Decisions",
    progress: 75,
    status: "operational",
    icon: Lightbulb,
    path: "/modules/reasoning",
    features: ["Decision Trees", "Monte Carlo", "Optimization"],
  },
  {
    id: "p3",
    name: "P3: Experimental",
    description: "XdGPT & Research Pipeline",
    progress: 90,
    status: "operational",
    icon: FlaskConical,
    path: "/modules/experimental",
    features: ["XdGPT Models", "XdS Research", "Multi-Model Compare"],
  },
];

const statusConfig = {
  operational: { label: "Operational", variant: "default" as const, color: "bg-emerald-500" },
  partial: { label: "Partial", variant: "secondary" as const, color: "bg-amber-500" },
  development: { label: "In Dev", variant: "outline" as const, color: "bg-muted" },
};

export function ModuleStatus() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Module Status P0-P3
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map((module) => {
          const StatusIcon = module.status === "operational" ? CheckCircle2 : AlertCircle;
          const config = statusConfig[module.status];
          
          return (
            <Link
              key={module.id}
              to={module.path}
              className="block p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sidebar-accent">
                    <module.icon className="h-5 w-5 text-sidebar-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{module.name}</h4>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </div>
                <Badge variant={config.variant} className="flex items-center gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Readiness</span>
                  <span className="text-foreground font-medium">{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-2" />
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {module.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
