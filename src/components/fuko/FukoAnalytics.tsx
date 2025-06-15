
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, Loader2 } from 'lucide-react';
import { useFuko } from '@/hooks/useFuko';
import { Skeleton } from '@/components/ui/skeleton';

const FukoAnalytics = () => {
  const { kpiData, isLoadingKpi, messages, isLoadingMessages } = useFuko();

  const alerts = useMemo(() => {
    return messages
      ?.filter(m => m.status === 'failed')
      .map(m => ({
        id: m.id,
        text: `Message "${m.F}" failed for agent ${m.target_agent || 'unassigned'}. Reason: ${m.execution_result || 'No agent found.'}`
      })) || [];
  }, [messages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>KPI Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingKpi && <p className="text-slate-300">Loading KPIs...</p>}
          <div className="space-y-4">
            {Object.entries(kpiData).map(([key, data]) => (
              <div key={key} className="p-3 bg-slate-900/50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white capitalize truncate" title={key}>{key.replace(/_/g, ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white">{data.value}</span>
                    <Badge className={data.value >= data.threshold ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {data.trend}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${data.value >= data.threshold ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (data.value / data.threshold) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>System Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMessages ? (
             <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-slate-400">No active alerts. System is stable.</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                    {alert.text}
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FukoAnalytics;
