import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Activity } from "lucide-react";
import { toast } from "sonner";

export function SafetyModulesPanel() {
  const [healthChecks, setHealthChecks] = useState<any[]>([]);
  const [driftCorrections, setDriftCorrections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [healthData, driftData] = await Promise.all([
        supabase.from('agent_health_checks').select('*').order('checked_at', { ascending: false }).limit(5),
        supabase.from('drift_corrections').select('*').order('detected_at', { ascending: false }).limit(5)
      ]);

      setHealthChecks(healthData.data || []);
      setDriftCorrections(driftData.data || []);
    } catch (error) {
      console.error('Error loading safety data:', error);
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

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Health Checks ({healthChecks.length})
        </h3>
        {healthChecks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brak danych o health checks</p>
        ) : (
          <div className="space-y-2">
            {healthChecks.map((check) => (
              <Card key={check.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{check.agent_id}</p>
                    <p className="text-xs text-muted-foreground">
                      Health Score: {check.health_score?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                  <Badge className={getHealthColor(check.health_status)}>
                    {check.health_status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Drift Corrections ({driftCorrections.length})
        </h3>
        {driftCorrections.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brak wykrytych drift corrections</p>
        ) : (
          <div className="space-y-2">
            {driftCorrections.map((drift) => (
              <Card key={drift.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{drift.agent_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {drift.drift_type} - Severity: {drift.drift_severity?.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant={drift.corrected ? 'default' : 'destructive'}>
                    {drift.corrected ? 'Corrected' : 'Pending'}
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
