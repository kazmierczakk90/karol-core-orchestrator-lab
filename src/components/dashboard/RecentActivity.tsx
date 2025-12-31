import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Bot, Zap, Shield, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: "chat" | "decision" | "agent" | "safety";
  title: string;
  description: string;
  timestamp: string;
}

const typeConfig = {
  chat: { icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  decision: { icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10" },
  agent: { icon: Bot, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  safety: { icon: Shield, color: "text-violet-400", bg: "bg-violet-400/10" },
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const [chatRes, decisionRes, healthRes] = await Promise.all([
          supabase.from("chat_messages").select("id, content, created_at").order("created_at", { ascending: false }).limit(3),
          supabase.from("meta_decisions").select("id, decision_type, created_at").order("created_at", { ascending: false }).limit(3),
          supabase.from("agent_health_checks").select("id, agent_id, health_status, checked_at").order("checked_at", { ascending: false }).limit(2),
        ]);

        const chatActivities: Activity[] = (chatRes.data || []).map((msg) => ({
          id: `chat-${msg.id}`,
          type: "chat" as const,
          title: "New Chat Message",
          description: msg.content?.substring(0, 50) + (msg.content?.length > 50 ? "..." : "") || "Message received",
          timestamp: msg.created_at,
        }));

        const decisionActivities: Activity[] = (decisionRes.data || []).map((dec) => ({
          id: `decision-${dec.id}`,
          type: "decision" as const,
          title: "Meta Decision",
          description: dec.decision_type || "Decision processed",
          timestamp: dec.created_at,
        }));

        const healthActivities: Activity[] = (healthRes.data || []).map((h) => ({
          id: `health-${h.id}`,
          type: "safety" as const,
          title: "Health Check",
          description: `Agent ${h.agent_id?.substring(0, 8)}... - ${h.health_status}`,
          timestamp: h.checked_at || new Date().toISOString(),
        }));

        const all = [...chatActivities, ...decisionActivities, ...healthActivities]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 8);

        setActivities(all.length ? all : [
          { id: "1", type: "agent", title: "System Started", description: "Karol-Core AGI initialized", timestamp: new Date().toISOString() },
        ]);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Loading activities...
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => {
                const config = typeConfig[activity.type];
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20"
                  >
                    <div className={`p-2 rounded-lg ${config.bg}`}>
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
