/**
 * Orchestration Engine V2 - Zintegrowana orkiestracja z nowymi modułami
 * Wykorzystuje: AgentRegistry, LoadBalancer, FailoverManager
 */

import { AgentRegistry, AgentRegistration } from './core/AgentRegistry';
import { LoadBalancer, LoadBalancingAlgorithm } from './core/LoadBalancer';
import { FailoverManager } from './core/FailoverManager';
import { SystemEvent, QuantumState } from '@/types/platformCore';

interface OrchestrationMetrics {
  totalAgents: number;
  onlineAgents: number;
  averagePerformance: number;
  averageLoad: number;
  totalFailovers: number;
  successfulFailovers: number;
  cacheHitRate: number;
}

interface ScalingDecision {
  action: 'scale_up' | 'scale_down' | 'none';
  reason: string;
  recommendedAgents?: number;
}

class OrchestrationEngineV2 {
  private registry: AgentRegistry;
  private loadBalancer: LoadBalancer;
  private failoverManager: FailoverManager;
  private events: SystemEvent[] = [];
  private serviceCache: Map<string, { agents: AgentRegistration[]; timestamp: number }> = new Map();
  
  constructor() {
    this.registry = new AgentRegistry();
    this.loadBalancer = new LoadBalancer('adaptive');
    this.failoverManager = new FailoverManager();

    // Połącz eventy z wszystkich modułów
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Registry events
    this.registry.onEvent((event) => {
      this.events.push(event);
      this.handleSystemEvent(event);
    });

    // Failover events
    this.failoverManager.onEvent((event) => {
      this.events.push(event);
      this.handleSystemEvent(event);
    });
  }

  // === PUBLIC API ===

  // Rejestracja agenta
  registerAgent(agent: Omit<AgentRegistration, 'lastHeartbeat'>): boolean {
    const success = this.registry.registerAgent(agent);
    if (success) {
      this.loadBalancer.setWeight(agent.id, this.calculateInitialWeight(agent));
      this.invalidateServiceCache();
    }
    return success;
  }

  // Usunięcie agenta
  unregisterAgent(agentId: string): boolean {
    const success = this.registry.unregisterAgent(agentId);
    if (success) {
      this.invalidateServiceCache();
    }
    return success;
  }

  // Wybór agenta dla capability
  selectAgent(
    capability: string,
    minLevel: number = 1,
    algorithm?: LoadBalancingAlgorithm
  ): AgentRegistration | null {
    // Sprawdź cache
    const cacheKey = `${capability}_${minLevel}`;
    const cached = this.getFromCache(cacheKey);
    if (cached && cached.length > 0) {
      return this.loadBalancer.selectAgent(cached, algorithm);
    }

    // Discovery
    const candidates = this.registry.discoverAgentsByCapability(capability, minLevel);
    if (candidates.length === 0) return null;

    // Cache wyniki
    this.setCache(cacheKey, candidates);

    return this.loadBalancer.selectAgent(candidates, algorithm);
  }

  // Heartbeat agenta
  heartbeat(agentId: string, metrics?: { performance: number; loadLevel: number }): boolean {
    return this.registry.heartbeat(agentId, metrics);
  }

  // Health check z auto-failover
  async performHealthCheck(): Promise<Record<string, 'healthy' | 'unhealthy' | 'degraded'>> {
    const health = this.registry.healthCheck();
    
    // Auto-failover dla unhealthy agentów
    const unhealthyAgents = Object.entries(health)
      .filter(([_, status]) => status === 'unhealthy')
      .map(([id]) => id);

    for (const agentId of unhealthyAgents) {
      const agent = this.registry.getAgent(agentId);
      if (agent) {
        await this.handleAgentFailure(agent);
      }
    }

    return health;
  }

  // Obsługa awarii
  private async handleAgentFailure(agent: AgentRegistration): Promise<boolean> {
    const availableAgents = this.registry.getOnlineAgents();
    const result = await this.failoverManager.handleFailure(agent, availableAgents);
    
    if (result.success && result.backupAgents.length > 0) {
      // Redistrybucja połączeń
      const connections = this.loadBalancer.getConnections(agent.id);
      const connectionsPerBackup = Math.ceil(connections / result.backupAgents.length);
      
      result.backupAgents.forEach(backup => {
        for (let i = 0; i < connectionsPerBackup; i++) {
          this.loadBalancer.selectAgent([backup]);
        }
      });
      
      this.invalidateServiceCache();
    }
    
    return result.success;
  }

  // Quantum Entanglement (zachowana funkcjonalność)
  createQuantumEntanglement(agentId1: string, agentId2: string): QuantumState<string> {
    const agent1 = this.registry.getAgent(agentId1);
    const agent2 = this.registry.getAgent(agentId2);
    
    if (!agent1 || !agent2) {
      throw new Error('Both agents must exist for entanglement');
    }

    const quantumState: QuantumState<string> = {
      superposition: [
        { state: agentId1, probability: 0.5, coherence: agent1.performance / 100 },
        { state: agentId2, probability: 0.5, coherence: agent2.performance / 100 }
      ],
      collapsed: false,
      entangled: [agentId1, agentId2]
    };

    this.publishEvent('quantum_entanglement_created', 'orchestrator', { 
      agents: [agentId1, agentId2],
      coherence: (agent1.performance + agent2.performance) / 200
    });
    
    return quantumState;
  }

  // Event publishing
  publishEvent(type: string, source: string, data: any): SystemEvent {
    const event: SystemEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      timestamp: new Date(),
      source,
      data,
      correlationId: this.generateCorrelationId()
    };

    this.events.push(event);
    return event;
  }

  // Event replay
  replayEvents(fromTimestamp: Date, toTimestamp?: Date): SystemEvent[] {
    return this.events.filter(event => {
      const eventTime = event.timestamp.getTime();
      const fromTime = fromTimestamp.getTime();
      const toTime = toTimestamp?.getTime() || Date.now();
      
      return eventTime >= fromTime && eventTime <= toTime;
    });
  }

  // Auto-scaling evaluation
  evaluateScaling(): ScalingDecision {
    const metrics = this.collectMetrics();
    const onlineAgents = metrics.onlineAgents;

    // Brak agentów
    if (onlineAgents === 0) {
      return {
        action: 'scale_up',
        reason: 'no_agents_available',
        recommendedAgents: 2
      };
    }

    // Wysokie obciążenie
    if (metrics.averageLoad > 80) {
      const additionalAgents = Math.ceil(onlineAgents * 0.3);
      return {
        action: 'scale_up',
        reason: 'high_load',
        recommendedAgents: additionalAgents
      };
    }

    // Niskie obciążenie
    if (metrics.averageLoad < 20 && onlineAgents > 2) {
      const agentsToRemove = Math.floor(onlineAgents * 0.2);
      return {
        action: 'scale_down',
        reason: 'low_load',
        recommendedAgents: Math.max(1, agentsToRemove)
      };
    }

    // Problemy z wydajnością
    if (metrics.averagePerformance < 60) {
      return {
        action: 'scale_up',
        reason: 'performance_degradation',
        recommendedAgents: 1
      };
    }

    return { action: 'none', reason: 'load_optimal' };
  }

  // Metryki
  collectMetrics(): OrchestrationMetrics {
    const agents = this.registry.getAgents();
    const onlineAgents = agents.filter(a => a.status === 'online');
    const failoverHistory = this.failoverManager.getFailoverHistory();
    const loadBalancerMetrics = this.loadBalancer.getMetrics();

    const avgPerformance = onlineAgents.length > 0
      ? onlineAgents.reduce((sum, a) => sum + a.performance, 0) / onlineAgents.length
      : 0;

    const avgLoad = onlineAgents.length > 0
      ? onlineAgents.reduce((sum, a) => sum + a.loadLevel, 0) / onlineAgents.length
      : 0;

    const successfulFailovers = failoverHistory.filter(f => f.success).length;

    return {
      totalAgents: agents.length,
      onlineAgents: onlineAgents.length,
      averagePerformance: Math.round(avgPerformance),
      averageLoad: Math.round(avgLoad),
      totalFailovers: failoverHistory.length,
      successfulFailovers,
      cacheHitRate: this.calculateCacheHitRate()
    };
  }

  // Gettery
  getAgents(): AgentRegistration[] {
    return this.registry.getAgents();
  }

  getAgent(agentId: string): AgentRegistration | undefined {
    return this.registry.getAgent(agentId);
  }

  getEvents(limit: number = 100): SystemEvent[] {
    return this.events.slice(-limit);
  }

  getFailoverHistory(limit?: number): any[] {
    return this.failoverManager.getFailoverHistory(limit);
  }

  getLoadBalancerMetrics() {
    return this.loadBalancer.getMetrics();
  }

  // === PRIVATE HELPERS ===

  private calculateInitialWeight(agent: Omit<AgentRegistration, 'lastHeartbeat'>): number {
    const perfWeight = agent.performance / 100;
    const capabilityWeight = agent.capabilities.length / 10;
    return Math.min(10, perfWeight * 5 + capabilityWeight * 5);
  }

  private handleSystemEvent(event: SystemEvent): void {
    switch (event.type) {
      case 'agent_registered':
        this.onAgentRegistered(event);
        break;
      case 'agent_unregistered':
        this.onAgentUnregistered(event);
        break;
      case 'agent_status_updated':
        this.onAgentStatusUpdated(event);
        break;
      default:
        // Generic processing
        break;
    }
  }

  private onAgentRegistered(event: SystemEvent): void {
    console.log(`✅ Agent registered: ${event.source}`);
  }

  private onAgentUnregistered(event: SystemEvent): void {
    console.log(`❌ Agent unregistered: ${event.source}`);
    this.loadBalancer.releaseConnection(event.source);
  }

  private onAgentStatusUpdated(event: SystemEvent): void {
    if (event.data.status === 'offline') {
      this.invalidateServiceCache();
    }
  }

  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  // Cache management
  private getFromCache(key: string): AgentRegistration[] | null {
    const cached = this.serviceCache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > 30000) { // 30 sekund TTL
      this.serviceCache.delete(key);
      return null;
    }

    return cached.agents;
  }

  private setCache(key: string, agents: AgentRegistration[]): void {
    this.serviceCache.set(key, {
      agents,
      timestamp: Date.now()
    });
  }

  private invalidateServiceCache(): void {
    this.serviceCache.clear();
  }

  private calculateCacheHitRate(): number {
    // Simplified cache hit rate calculation
    return this.serviceCache.size > 0 ? 75 : 0;
  }

  // Cleanup - zwalnianie zasobów
  cleanup(): void {
    this.registry.cleanup();
    this.loadBalancer.cleanup();
    this.failoverManager.cleanup();
    this.serviceCache.clear();
    this.events = [];
  }
}

// Singleton instance
export const orchestrationEngineV2 = new OrchestrationEngineV2();
export { OrchestrationEngineV2 };
