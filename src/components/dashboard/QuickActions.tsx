import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Sparkles, 
  FlaskConical, 
  FileText, 
  Bot,
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  variant: "default" | "secondary" | "outline";
}

const actions: QuickAction[] = [
  {
    title: "Start Chat",
    description: "Talk to AI agents",
    icon: MessageSquare,
    path: "/chat",
    variant: "default",
  },
  {
    title: "Compare Models",
    description: "XdGPT multi-model",
    icon: Sparkles,
    path: "/modules/experimental",
    variant: "secondary",
  },
  {
    title: "New Research",
    description: "XdS pipeline",
    icon: FlaskConical,
    path: "/tools/research",
    variant: "secondary",
  },
  {
    title: "View Reports",
    description: "Analytics dashboard",
    icon: FileText,
    path: "/command-center",
    variant: "outline",
  },
  {
    title: "Manage Agents",
    description: "Agent simulator",
    icon: Bot,
    path: "/tools/agents",
    variant: "outline",
  },
];

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="w-full justify-between h-auto py-3"
            asChild
          >
            <Link to={action.path}>
              <div className="flex items-center gap-3">
                <action.icon className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs opacity-70">{action.description}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 opacity-50" />
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
