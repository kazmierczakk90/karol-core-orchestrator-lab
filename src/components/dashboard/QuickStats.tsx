import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, MessageSquare, Activity, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/db";

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: string;
}

export function QuickStats() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: "Active Agents", value: "...", icon: Bot, color: "text-cyan-400" },
    { label: "Chat Sessions", value: "...", icon: MessageSquare, color: "text-emerald-400" },
    { label: "Decisions Today", value: "...", icon: Activity, color: "text-amber-400" },
    { label: "System Health", value: "...", icon: Zap, color: "text-violet-400" },
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [agentsRes, sessionsRes, decisionsRes, healthRes] = await Promise.all([
          supabase.from("agents").select("id", { count: "exact" }).eq("is_active", true),
          supabase.from("chat_sessions").select("id", { count: "exact" }),
          supabase.from("meta_decisions").select("id", { count: "exact" }).gte("created_at", new Date().toISOString().split("T")[0]),
          supabase.from("agent_health_checks").select("health_score").order("checked_at", { ascending: false }).limit(10),
        ]);

        const avgHealth = healthRes.data?.length 
          ? Math.round(healthRes.data.reduce((a, b) => a + (b.health_score || 0), 0) / healthRes.data.length)
          : 95;

        setStats([
          { label: "Active Agents", value: agentsRes.count || 0, icon: Bot, trend: "+2", color: "text-cyan-400" },
          { label: "Chat Sessions", value: sessionsRes.count || 0, icon: MessageSquare, trend: "+5", color: "text-emerald-400" },
          { label: "Decisions Today", value: decisionsRes.count || 0, icon: Activity, trend: "+12", color: "text-amber-400" },
          { label: "System Health", value: `${avgHealth}%`, icon: Zap, color: "text-violet-400" },
        ]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                {stat.trend && (
                  <p className="text-xs text-emerald-400">{stat.trend} this week</p>
                )}
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
