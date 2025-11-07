import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function AutoImprovementPanel() {
  const [patterns, setPatterns] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patternsData, decisionsData] = await Promise.all([
        supabase.from('improvement_patterns').select('*').order('detected_at', { ascending: false }).limit(5),
        supabase.from('improvement_decisions').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setPatterns(patternsData.data || []);
      setDecisions(decisionsData.data || []);
    } catch (error) {
      console.error('Error loading improvement data:', error);
      toast.error('Błąd ładowania danych');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Wykryte wzorce ({patterns.length})
        </h3>
        {patterns.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brak wykrytych wzorców</p>
        ) : (
          <div className="space-y-2">
            {patterns.map((pattern) => (
              <Card key={pattern.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{pattern.pattern_type}</p>
                    <p className="text-xs text-muted-foreground">
                      Częstotliwość: {pattern.frequency}
                    </p>
                  </div>
                  <Badge variant={pattern.severity === 'high' ? 'destructive' : 'secondary'}>
                    {pattern.severity}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Decyzje o ulepszeniach ({decisions.length})
        </h3>
        {decisions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brak oczekujących decyzji</p>
        ) : (
          <div className="space-y-2">
            {decisions.map((decision) => (
              <Card key={decision.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{decision.action_type}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {decision.action_description}
                    </p>
                  </div>
                  <Badge variant={
                    decision.status === 'approved' ? 'default' :
                    decision.status === 'voting' ? 'secondary' : 'outline'
                  }>
                    {decision.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button onClick={loadData} className="w-full" variant="outline" size="sm">
        Odśwież dane
      </Button>
    </div>
  );
}
