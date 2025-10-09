/**
 * React Hook dla OrchestrationEngineV2
 * Zapewnia łatwy dostęp do zoptymalizowanego engine orkiestracji
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { orchestrationEngineV2, OrchestrationEngineV2 } from '@/services/orchestrationEngineV2';
import { AgentRegistration } from '@/services/core/AgentRegistry';
import { LoadBalancingAlgorithm } from '@/services/core/LoadBalancer';

export interface UseOrchestrationV2Options {
  enableAutoHealthCheck?: boolean;
  healthCheckInterval?: number;
  enableAutoScaling?: boolean;
  scalingCheckInterval?: number;
}

export const useOrchestrationV2 = (options: UseOrchestrationV2Options = {}) => {
  const {
    enableAutoHealthCheck = true,
    healthCheckInterval = 30000, // 30 sekund
    enableAutoScaling = false,
    scalingCheckInterval = 60000  // 60 sekund
  } = options;

  const [agents, setAgents] = useState<AgentRegistration[]>([]);
  const [metrics, setMetrics] = useState({
    totalAgents: 0,
    onlineAgents: 0,
    averagePerformance: 0,
    averageLoad: 0,
    totalFailovers: 0,
    successfulFailovers: 0,
    cacheHitRate: 0
  });
  const [health, setHealth] = useState<Record<string, 'healthy' | 'unhealthy' | 'degraded'>>({});
  const [scalingDecision, setScalingDecision] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh agents
  const refreshAgents = useCallback(() => {
    const updatedAgents = orchestrationEngineV2.getAgents();
    setAgents(updatedAgents);
    
    const updatedMetrics = orchestrationEngineV2.collectMetrics();
    setMetrics(updatedMetrics);
  }, []);

  // Refresh health
  const refreshHealth = useCallback(async () => {
    const healthStatus = await orchestrationEngineV2.performHealthCheck();
    setHealth(healthStatus);
  }, []);

  // Register agent
  const registerAgent = useCallback((agent: Omit<AgentRegistration, 'lastHeartbeat'>) => {
    const success = orchestrationEngineV2.registerAgent(agent);
    if (success) {
      refreshAgents();
    }
    return success;
  }, [refreshAgents]);

  // Unregister agent
  const unregisterAgent = useCallback((agentId: string) => {
    const success = orchestrationEngineV2.unregisterAgent(agentId);
    if (success) {
      refreshAgents();
    }
    return success;
  }, [refreshAgents]);

  // Select agent
  const selectAgent = useCallback((
    capability: string,
    minLevel: number = 1,
    algorithm?: LoadBalancingAlgorithm
  ) => {
    return orchestrationEngineV2.selectAgent(capability, minLevel, algorithm);
  }, []);

  // Heartbeat
  const heartbeat = useCallback((
    agentId: string,
    performanceMetrics?: { performance: number; loadLevel: number }
  ) => {
    const success = orchestrationEngineV2.heartbeat(agentId, performanceMetrics);
    if (success) {
      refreshAgents();
    }
    return success;
  }, [refreshAgents]);

  // Check scaling
  const checkScaling = useCallback(() => {
    const decision = orchestrationEngineV2.evaluateScaling();
    setScalingDecision(decision);
    return decision;
  }, []);

  // Auto health check
  useEffect(() => {
    if (!enableAutoHealthCheck) return;

    const interval = setInterval(async () => {
      await refreshHealth();
      refreshAgents();
    }, healthCheckInterval);

    return () => clearInterval(interval);
  }, [enableAutoHealthCheck, healthCheckInterval, refreshHealth, refreshAgents]);

  // Auto scaling check
  useEffect(() => {
    if (!enableAutoScaling) return;

    const interval = setInterval(() => {
      checkScaling();
    }, scalingCheckInterval);

    return () => clearInterval(interval);
  }, [enableAutoScaling, scalingCheckInterval, checkScaling]);

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      refreshAgents();
      await refreshHealth();
      setIsLoading(false);
    };

    initialize();
  }, [refreshAgents, refreshHealth]);

  // Memoized values
  const healthyAgents = useMemo(() => 
    Object.entries(health).filter(([_, status]) => status === 'healthy').map(([id]) => id),
    [health]
  );

  const degradedAgents = useMemo(() => 
    Object.entries(health).filter(([_, status]) => status === 'degraded').map(([id]) => id),
    [health]
  );

  const unhealthyAgents = useMemo(() => 
    Object.entries(health).filter(([_, status]) => status === 'unhealthy').map(([id]) => id),
    [health]
  );

  const loadBalancerMetrics = useMemo(() => 
    orchestrationEngineV2.getLoadBalancerMetrics(),
    [agents]
  );

  const failoverHistory = useMemo(() => 
    orchestrationEngineV2.getFailoverHistory(20),
    [agents]
  );

  return {
    // State
    agents,
    metrics,
    health,
    scalingDecision,
    isLoading,

    // Computed
    healthyAgents,
    degradedAgents,
    unhealthyAgents,
    loadBalancerMetrics,
    failoverHistory,

    // Actions
    registerAgent,
    unregisterAgent,
    selectAgent,
    heartbeat,
    refreshAgents,
    refreshHealth,
    checkScaling
  };
};

// Hook do monitoring wydajności orkiestracji
export const useOrchestrationMetrics = () => {
  const [metrics, setMetrics] = useState(orchestrationEngineV2.collectMetrics());
  const [history, setHistory] = useState<typeof metrics[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = orchestrationEngineV2.collectMetrics();
      setMetrics(newMetrics);
      
      setHistory(prev => {
        const updated = [...prev, newMetrics];
        return updated.slice(-60); // Ostatnie 60 pomiarów
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const trends = useMemo(() => {
    if (history.length < 2) return null;

    const recent = history.slice(-10);
    const avgLoad = recent.reduce((sum, m) => sum + m.averageLoad, 0) / recent.length;
    const avgPerf = recent.reduce((sum, m) => sum + m.averagePerformance, 0) / recent.length;

    return {
      loadTrend: avgLoad > metrics.averageLoad ? 'increasing' : 'decreasing',
      performanceTrend: avgPerf > metrics.averagePerformance ? 'improving' : 'declining',
      recentAverageLoad: Math.round(avgLoad),
      recentAveragePerformance: Math.round(avgPerf)
    };
  }, [history, metrics]);

  return {
    current: metrics,
    history,
    trends
  };
};
