
import { AgentCapability, SystemEvent, QuantumState } from '@/types/platformCore';

interface AgentRegistration {
  id: string;
  name: string;
  capabilities: AgentCapability[];
  status: 'online' | 'offline' | 'busy' | 'error';
  lastHeartbeat: Date;
  performance: number;
  loadLevel: number;
  version: string;
}

interface LoadBalancer {
  algorithm: 'round_robin' | 'least_connections' | 'weighted' | 'random' | 'performance';
  weights: Record<string, number>;
  connections: Record<string, number>;
}

class OrchestrationEngine {
  private agents: Map<string, AgentRegistration> = new Map();
  private events: SystemEvent[] = [];
  private loadBalancer: LoadBalancer = {
    algorithm: 'performance',
    weights: {},
    connections: {}
  };
  private serviceDiscovery: Map<string, string[]> = new Map();

  // POZIOM 3.1: Agent Registry & Discovery - 10 kroków

  // Krok 1: Dynamic Agent Registration
  registerAgent(agent: Omit<AgentRegistration, 'lastHeartbeat'>): boolean {
    try {
      const registration: AgentRegistration = {
        ...agent,
        lastHeartbeat: new Date()
      };
      
      this.agents.set(agent.id, registration);
      this.updateServiceDiscovery(agent.id, agent.capabilities);
      this.logEvent('agent_registered', agent.id, { capabilities: agent.capabilities });
      
      return true;
    } catch (error) {
      this.logEvent('agent_registration_failed', agent.id, { error: error.message });
      return false;
    }
  }

  // Krok 2: Capability-based Discovery
  discoverAgentsByCapability(requiredCapability: string, minLevel: number = 1): AgentRegistration[] {
    return Array.from(this.agents.values())
      .filter(agent => 
        agent.status === 'online' &&
        agent.capabilities.some(cap => 
          cap.name === requiredCapability && cap.level >= minLevel
        )
      )
      .sort((a, b) => {
        const capA = a.capabilities.find(c => c.name === requiredCapability);
        const capB = b.capabilities.find(c => c.name === requiredCapability);
        return (capB?.level || 0) - (capA?.level || 0);
      });
  }

  // Krok 3: Load Balancing Algorithms
  selectAgent(requiredCapability: string, algorithm?: LoadBalancer['algorithm']): AgentRegistration | null {
    const candidates = this.discoverAgentsByCapability(requiredCapability);
    if (candidates.length === 0) return null;

    const selectedAlgorithm = algorithm || this.loadBalancer.algorithm;

    switch (selectedAlgorithm) {
      case 'round_robin':
        return this.roundRobinSelect(candidates);
      case 'least_connections':
        return this.leastConnectionsSelect(candidates);
      case 'weighted':
        return this.weightedSelect(candidates);
      case 'performance':
        return this.performanceBasedSelect(candidates);
      case 'random':
        return candidates[Math.floor(Math.random() * candidates.length)];
      default:
        return candidates[0];
    }
  }

  // Krok 4: Health Monitoring System
  healthCheck(): Record<string, 'healthy' | 'unhealthy' | 'degraded'> {
    const health: Record<string, 'healthy' | 'unhealthy' | 'degraded'> = {};
    const now = new Date();

    this.agents.forEach((agent, id) => {
      const timeSinceHeartbeat = now.getTime() - agent.lastHeartbeat.getTime();
      
      if (timeSinceHeartbeat > 60000) { // 1 minute
        health[id] = 'unhealthy';
        this.updateAgentStatus(id, 'offline');
      } else if (timeSinceHeartbeat > 30000 || agent.performance < 70) { // 30 seconds
        health[id] = 'degraded';
      } else {
        health[id] = 'healthy';
      }
    });

    return health;
  }

  // Krok 5: Failover Mechanisms
  handleAgentFailure(agentId: string): boolean {
    const failedAgent = this.agents.get(agentId);
    if (!failedAgent) return false;

    // Mark as failed
    this.updateAgentStatus(agentId, 'error');
    
    // Find backup agents
    const backupAgents = this.findBackupAgents(failedAgent.capabilities);
    
    if (backupAgents.length > 0) {
      // Redistribute load
      this.redistributeLoad(agentId, backupAgents);
      this.logEvent('failover_completed', agentId, { backups: backupAgents.map(a => a.id) });
      return true;
    }

    this.logEvent('failover_failed', agentId, { reason: 'no_backup_agents' });
    return false;
  }

  // Krok 6: Service Mesh Integration
  createServiceMesh(): Map<string, string[]> {
    const mesh = new Map<string, string[]>();
    
    this.agents.forEach((agent, id) => {
      const connections: string[] = [];
      
      // Find agents with complementary capabilities
      this.agents.forEach((otherAgent, otherId) => {
        if (id !== otherId && this.hasComplementaryCapabilities(agent, otherAgent)) {
          connections.push(otherId);
        }
      });
      
      mesh.set(id, connections);
    });

    return mesh;
  }

  // Krok 7: Real-time Status Updates
  updateAgentStatus(agentId: string, status: AgentRegistration['status']): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.lastHeartbeat = new Date();
      this.logEvent('agent_status_updated', agentId, { status });
    }
  }

  heartbeat(agentId: string, performanceMetrics?: { performance: number; loadLevel: number }): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.lastHeartbeat = new Date();
    if (performanceMetrics) {
      agent.performance = performanceMetrics.performance;
      agent.loadLevel = performanceMetrics.loadLevel;
    }

    return true;
  }

  // Krok 8: Performance Metrics Collection
  collectMetrics(): Record<string, any> {
    const metrics = {
      totalAgents: this.agents.size,
      onlineAgents: Array.from(this.agents.values()).filter(a => a.status === 'online').length,
      averagePerformance: 0,
      averageLoad: 0,
      capabilityDistribution: {},
      eventCount: this.events.length
    };

    const onlineAgents = Array.from(this.agents.values()).filter(a => a.status === 'online');
    
    if (onlineAgents.length > 0) {
      metrics.averagePerformance = onlineAgents.reduce((sum, a) => sum + a.performance, 0) / onlineAgents.length;
      metrics.averageLoad = onlineAgents.reduce((sum, a) => sum + a.loadLevel, 0) / onlineAgents.length;
    }

    // Capability distribution
    const capabilityCount: Record<string, number> = {};
    this.agents.forEach(agent => {
      agent.capabilities.forEach(cap => {
        capabilityCount[cap.name] = (capabilityCount[cap.name] || 0) + 1;
      });
    });
    metrics.capabilityDistribution = capabilityCount;

    return metrics;
  }

  // Krok 9: Auto-scaling Triggers
  evaluateScaling(): { action: 'scale_up' | 'scale_down' | 'none'; reason: string } {
    const metrics = this.collectMetrics();
    const averageLoad = metrics.averageLoad;
    const onlineAgents = metrics.onlineAgents;

    if (averageLoad > 80 && onlineAgents > 0) {
      return { action: 'scale_up', reason: 'high_load' };
    }
    
    if (averageLoad < 20 && onlineAgents > 2) {
      return { action: 'scale_down', reason: 'low_load' };
    }

    return { action: 'none', reason: 'load_optimal' };
  }

  // Krok 10: Quantum Entanglement Protocols
  createQuantumEntanglement(agentId1: string, agentId2: string): QuantumState<string> {
    const entanglementId = `entanglement_${agentId1}_${agentId2}_${Date.now()}`;
    
    const quantumState: QuantumState<string> = {
      superposition: [
        { state: agentId1, probability: 0.5, coherence: 0.9 },
        { state: agentId2, probability: 0.5, coherence: 0.9 }
      ],
      collapsed: false,
      entangled: [agentId1, agentId2]
    };

    this.logEvent('quantum_entanglement_created', entanglementId, { agents: [agentId1, agentId2] });
    return quantumState;
  }

  // POZIOM 3.2: Event-Driven Architecture - 10 kroków

  // Krok 1: Event Sourcing Implementation
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
    this.processEvent(event);
    
    return event;
  }

  // Krok 2: CQRS Pattern Integration
  separateReadWrite(operation: 'read' | 'write', data: any): any {
    if (operation === 'write') {
      // Command side - generate events
      return this.publishEvent('command_executed', 'cqrs_system', data);
    } else {
      // Query side - read projections
      return this.queryProjection(data.query, data.filters);
    }
  }

  // Krok 3: Event Replay Capabilities
  replayEvents(fromTimestamp: Date, toTimestamp?: Date): SystemEvent[] {
    const filteredEvents = this.events.filter(event => {
      const eventTime = event.timestamp.getTime();
      const fromTime = fromTimestamp.getTime();
      const toTime = toTimestamp?.getTime() || Date.now();
      
      return eventTime >= fromTime && eventTime <= toTime;
    });

    // Replay events in order
    filteredEvents.forEach(event => this.processEvent(event));
    
    return filteredEvents;
  }

  // Helper methods
  private updateServiceDiscovery(agentId: string, capabilities: AgentCapability[]): void {
    capabilities.forEach(cap => {
      if (!this.serviceDiscovery.has(cap.name)) {
        this.serviceDiscovery.set(cap.name, []);
      }
      this.serviceDiscovery.get(cap.name)!.push(agentId);
    });
  }

  private roundRobinSelect(candidates: AgentRegistration[]): AgentRegistration {
    // Simple round-robin implementation
    const index = Date.now() % candidates.length;
    return candidates[index];
  }

  private leastConnectionsSelect(candidates: AgentRegistration[]): AgentRegistration {
    return candidates.reduce((min, agent) => 
      (this.loadBalancer.connections[agent.id] || 0) < (this.loadBalancer.connections[min.id] || 0) ? agent : min
    );
  }

  private weightedSelect(candidates: AgentRegistration[]): AgentRegistration {
    const weights = candidates.map(agent => this.loadBalancer.weights[agent.id] || 1);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const random = Math.random() * totalWeight;
    
    let currentWeight = 0;
    for (let i = 0; i < candidates.length; i++) {
      currentWeight += weights[i];
      if (random <= currentWeight) {
        return candidates[i];
      }
    }
    
    return candidates[0];
  }

  private performanceBasedSelect(candidates: AgentRegistration[]): AgentRegistration {
    return candidates.reduce((best, agent) => 
      agent.performance > best.performance ? agent : best
    );
  }

  private findBackupAgents(capabilities: AgentCapability[]): AgentRegistration[] {
    return Array.from(this.agents.values()).filter(agent => 
      agent.status === 'online' &&
      capabilities.some(reqCap => 
        agent.capabilities.some(agentCap => 
          agentCap.name === reqCap.name && agentCap.level >= reqCap.level
        )
      )
    );
  }

  private redistributeLoad(failedAgentId: string, backupAgents: AgentRegistration[]): void {
    const failedConnections = this.loadBalancer.connections[failedAgentId] || 0;
    const connectionsPerBackup = Math.ceil(failedConnections / backupAgents.length);
    
    backupAgents.forEach(agent => {
      this.loadBalancer.connections[agent.id] = 
        (this.loadBalancer.connections[agent.id] || 0) + connectionsPerBackup;
    });
    
    delete this.loadBalancer.connections[failedAgentId];
  }

  private hasComplementaryCapabilities(agent1: AgentRegistration, agent2: AgentRegistration): boolean {
    return agent1.capabilities.some(cap1 => 
      agent2.capabilities.some(cap2 => 
        cap1.domain === cap2.domain && cap1.name !== cap2.name
      )
    );
  }

  private logEvent(type: string, source: string, data: any): void {
    this.events.push({
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      timestamp: new Date(),
      source,
      data
    });
  }

  private processEvent(event: SystemEvent): void {
    // Event processing logic
    switch (event.type) {
      case 'agent_registered':
        this.onAgentRegistered(event);
        break;
      case 'agent_status_updated':
        this.onAgentStatusUpdated(event);
        break;
      case 'failover_completed':
        this.onFailoverCompleted(event);
        break;
      default:
        // Generic event processing
        break;
    }
  }

  private onAgentRegistered(event: SystemEvent): void {
    // Auto-configure load balancer weights
    const agentId = event.source;
    this.loadBalancer.weights[agentId] = 1.0;
    this.loadBalancer.connections[agentId] = 0;
  }

  private onAgentStatusUpdated(event: SystemEvent): void {
    // Adjust routing based on status
    if (event.data.status === 'offline') {
      delete this.loadBalancer.connections[event.source];
    }
  }

  private onFailoverCompleted(event: SystemEvent): void {
    // Update monitoring metrics
    this.logEvent('metrics_updated', 'orchestration_engine', {
      failover: true,
      timestamp: event.timestamp
    });
  }

  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private queryProjection(query: string, filters: any): any {
    // Simplified query projection
    return this.events.filter(event => 
      event.type.includes(query) && 
      (!filters.source || event.source === filters.source)
    );
  }

  // Public API methods
  getAgents(): AgentRegistration[] {
    return Array.from(this.agents.values());
  }

  getEvents(limit: number = 100): SystemEvent[] {
    return this.events.slice(-limit);
  }

  getServiceMesh(): Map<string, string[]> {
    return this.createServiceMesh();
  }
}

export const orchestrationEngine = new OrchestrationEngine();
