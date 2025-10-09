/**
 * Orchestration Monitor - Dashboard dla OrchestrationEngineV2
 * Wyświetla zaawansowane metryki, health status i failover history
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  Shield
} from 'lucide-react';
import { useOrchestrationV2, useOrchestrationMetrics } from '@/hooks/useOrchestrationV2';
import { LoadingState } from './LoadingState';

export const OrchestrationMonitor = React.memo(() => {
  const {
    metrics,
    health,
    healthyAgents,
    degradedAgents,
    unhealthyAgents,
    loadBalancerMetrics,
    failoverHistory,
    isLoading
  } = useOrchestrationV2({
    enableAutoHealthCheck: true,
    enableAutoScaling: false
  });

  const { current: metricsHistory, trends } = useOrchestrationMetrics();

  const healthPercentage = useMemo(() => {
    if (metrics.totalAgents === 0) return 0;
    return Math.round((healthyAgents.length / metrics.totalAgents) * 100);
  }, [healthyAgents, metrics.totalAgents]);

  const failoverSuccessRate = useMemo(() => {
    if (metrics.totalFailovers === 0) return 100;
    return Math.round((metrics.successfulFailovers / metrics.totalFailovers) * 100);
  }, [metrics]);

  if (isLoading) {
    return <LoadingState variant="card" message="Loading orchestration metrics..." />;
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-cyan-400">{metrics.totalAgents}</div>
              <Activity className="h-8 w-8 text-cyan-400/50" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {metrics.onlineAgents} online
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-green-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-400">{healthPercentage}%</div>
              <Shield className="h-8 w-8 text-green-400/50" />
            </div>
            <Progress value={healthPercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Avg Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-purple-400">{metrics.averagePerformance}%</div>
              {trends && (
                trends.performanceTrend === 'improving' 
                  ? <TrendingUp className="h-8 w-8 text-green-400" />
                  : <TrendingDown className="h-8 w-8 text-red-400" />
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {trends ? `${trends.recentAveragePerformance}% recent avg` : 'Calculating...'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-orange-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Avg Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-400">{metrics.averageLoad}%</div>
              <Zap className="h-8 w-8 text-orange-400/50" />
            </div>
            <Progress value={metrics.averageLoad} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Agent Health Status</span>
            </CardTitle>
            <CardDescription>Real-time health monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300">Healthy</span>
                </div>
                <Badge variant="outline" className="bg-green-900/20 border-green-700">
                  {healthyAgents.length}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <span className="text-slate-300">Degraded</span>
                </div>
                <Badge variant="outline" className="bg-yellow-900/20 border-yellow-700">
                  {degradedAgents.length}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="text-slate-300">Unhealthy</span>
                </div>
                <Badge variant="outline" className="bg-red-900/20 border-red-700">
                  {unhealthyAgents.length}
                </Badge>
              </div>

              {degradedAgents.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-900/10 border border-yellow-800/30 rounded">
                  <p className="text-xs text-yellow-300">
                    ⚠️ {degradedAgents.length} agent(s) showing degraded performance
                  </p>
                </div>
              )}

              {unhealthyAgents.length > 0 && (
                <div className="mt-4 p-3 bg-red-900/10 border border-red-800/30 rounded">
                  <p className="text-xs text-red-300">
                    🚨 {unhealthyAgents.length} agent(s) offline or failed
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Load Balancer Metrics */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Load Balancer Stats</span>
            </CardTitle>
            <CardDescription>Connection distribution & performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Total Connections</span>
                <span className="text-cyan-400 font-bold">
                  {loadBalancerMetrics.totalConnections}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Avg Connections/Agent</span>
                <span className="text-cyan-400 font-bold">
                  {loadBalancerMetrics.avgConnectionsPerAgent.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Cache Hit Rate</span>
                <span className="text-green-400 font-bold">
                  {metrics.cacheHitRate}%
                </span>
              </div>

              {loadBalancerMetrics.mostLoadedAgent && (
                <div className="mt-4 p-3 bg-blue-900/10 border border-blue-800/30 rounded">
                  <p className="text-xs text-blue-300">
                    📊 Most loaded: {loadBalancerMetrics.mostLoadedAgent.slice(0, 8)}...
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Failover History */}
      {failoverHistory.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Failover History</span>
            </CardTitle>
            <CardDescription>
              Recent failover events - Success rate: {failoverSuccessRate}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {failoverHistory.map((event: any) => (
                <div 
                  key={event.id}
                  className={`p-3 rounded border ${
                    event.success 
                      ? 'bg-green-900/10 border-green-800/30' 
                      : 'bg-red-900/10 border-red-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {event.success ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-sm text-slate-300">
                        Agent: {event.failedAgentId.slice(0, 8)}...
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.strategy}
                    </Badge>
                  </div>
                  {event.backupAgentIds.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                      Backup: {event.backupAgentIds.length} agent(s)
                    </p>
                  )}
                  {event.reason && (
                    <p className="text-xs text-red-300 mt-1">
                      Reason: {event.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

OrchestrationMonitor.displayName = 'OrchestrationMonitor';
