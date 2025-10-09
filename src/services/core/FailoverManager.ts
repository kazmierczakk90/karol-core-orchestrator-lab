/**
 * Failover Manager - Wydzielony z orchestrationEngine
 * Zarządzanie awarią i redundancją agentów
 */

import { AgentRegistration } from './AgentRegistry';
import { AgentCapability, SystemEvent } from '@/types/platformCore';

interface FailoverStrategy {
  type: 'immediate' | 'graceful' | 'delayed';
  maxRetries: number;
  retryDelay: number;
  backupAgentsRequired: number;
}

interface FailoverEvent {
  id: string;
  timestamp: Date;
  failedAgentId: string;
  backupAgentIds: string[];
  strategy: FailoverStrategy['type'];
  success: boolean;
  reason?: string;
}

export class FailoverManager {
  private failoverHistory: FailoverEvent[] = [];
  private failedAgents: Set<string> = new Set();
  private recoveryAttempts: Map<string, number> = new Map();
  private eventCallbacks: Array<(event: SystemEvent) => void> = [];
  
  private defaultStrategy: FailoverStrategy = {
    type: 'graceful',
    maxRetries: 3,
    retryDelay: 5000,
    backupAgentsRequired: 1
  };

  constructor(strategy?: Partial<FailoverStrategy>) {
    if (strategy) {
      this.defaultStrategy = { ...this.defaultStrategy, ...strategy };
    }
  }

  // Główna metoda obsługi awarii
  async handleFailure(
    failedAgent: AgentRegistration,
    availableAgents: AgentRegistration[],
    strategy?: FailoverStrategy
  ): Promise<{ success: boolean; backupAgents: AgentRegistration[]; reason?: string }> {
    
    const effectiveStrategy = strategy || this.defaultStrategy;
    this.failedAgents.add(failedAgent.id);

    // Znajdź backup agentów
    const backupAgents = this.findBackupAgents(failedAgent, availableAgents);

    if (backupAgents.length < effectiveStrategy.backupAgentsRequired) {
      const event = this.createFailoverEvent(
        failedAgent.id,
        [],
        effectiveStrategy.type,
        false,
        'Insufficient backup agents'
      );
      this.recordFailover(event);
      return { 
        success: false, 
        backupAgents: [], 
        reason: 'Insufficient backup agents available' 
      };
    }

    // Wykonaj failover zgodnie ze strategią
    const result = await this.executeFailover(
      failedAgent,
      backupAgents,
      effectiveStrategy
    );

    const event = this.createFailoverEvent(
      failedAgent.id,
      result.backupAgents.map(a => a.id),
      effectiveStrategy.type,
      result.success,
      result.reason
    );
    this.recordFailover(event);

    return result;
  }

  // Znajdź agentów z kompatybilnymi capabilities
  private findBackupAgents(
    failedAgent: AgentRegistration,
    availableAgents: AgentRegistration[]
  ): AgentRegistration[] {
    return availableAgents
      .filter(agent => 
        agent.id !== failedAgent.id &&
        agent.status === 'online' &&
        this.hasCompatibleCapabilities(agent, failedAgent.capabilities)
      )
      .sort((a, b) => {
        // Sortuj po: 1. performance, 2. load level, 3. compatibility score
        const perfDiff = b.performance - a.performance;
        if (perfDiff !== 0) return perfDiff;
        
        const loadDiff = a.loadLevel - b.loadLevel;
        if (loadDiff !== 0) return loadDiff;
        
        return this.calculateCompatibilityScore(b, failedAgent.capabilities) -
               this.calculateCompatibilityScore(a, failedAgent.capabilities);
      });
  }

  // Sprawdź kompatybilność capabilities
  private hasCompatibleCapabilities(
    agent: AgentRegistration,
    requiredCapabilities: AgentCapability[]
  ): boolean {
    return requiredCapabilities.every(reqCap =>
      agent.capabilities.some(agentCap =>
        agentCap.name === reqCap.name && agentCap.level >= reqCap.level
      )
    );
  }

  // Oblicz scoring kompatybilności
  private calculateCompatibilityScore(
    agent: AgentRegistration,
    requiredCapabilities: AgentCapability[]
  ): number {
    let score = 0;
    requiredCapabilities.forEach(reqCap => {
      const agentCap = agent.capabilities.find(c => c.name === reqCap.name);
      if (agentCap) {
        // Punkty za level + dodatkowe za wyższy level
        score += agentCap.level + Math.max(0, agentCap.level - reqCap.level) * 0.5;
      }
    });
    return score;
  }

  // Wykonaj failover z wybraną strategią
  private async executeFailover(
    failedAgent: AgentRegistration,
    backupAgents: AgentRegistration[],
    strategy: FailoverStrategy
  ): Promise<{ success: boolean; backupAgents: AgentRegistration[]; reason?: string }> {
    
    switch (strategy.type) {
      case 'immediate':
        return this.immediateFailover(failedAgent, backupAgents);
        
      case 'graceful':
        return this.gracefulFailover(failedAgent, backupAgents, strategy);
        
      case 'delayed':
        return this.delayedFailover(failedAgent, backupAgents, strategy);
        
      default:
        return { success: false, backupAgents: [], reason: 'Unknown strategy' };
    }
  }

  // Immediate failover - natychmiastowe przełączenie
  private async immediateFailover(
    failedAgent: AgentRegistration,
    backupAgents: AgentRegistration[]
  ): Promise<{ success: boolean; backupAgents: AgentRegistration[] }> {
    
    const selectedBackups = backupAgents.slice(0, 1);
    this.publishEvent('immediate_failover', failedAgent.id, {
      backupAgents: selectedBackups.map(a => a.id)
    });

    return { success: true, backupAgents: selectedBackups };
  }

  // Graceful failover - stopniowe przełączanie z retry
  private async gracefulFailover(
    failedAgent: AgentRegistration,
    backupAgents: AgentRegistration[],
    strategy: FailoverStrategy
  ): Promise<{ success: boolean; backupAgents: AgentRegistration[]; reason?: string }> {
    
    const attempts = this.recoveryAttempts.get(failedAgent.id) || 0;
    
    if (attempts < strategy.maxRetries) {
      // Spróbuj odzyskać połączenie
      await this.delay(strategy.retryDelay);
      this.recoveryAttempts.set(failedAgent.id, attempts + 1);
      
      // Symulacja próby recovery
      const recovered = Math.random() > 0.7; // 30% szans na recovery
      
      if (recovered) {
        this.recoveryAttempts.delete(failedAgent.id);
        this.failedAgents.delete(failedAgent.id);
        this.publishEvent('agent_recovered', failedAgent.id, { attempts: attempts + 1 });
        return { success: true, backupAgents: [] };
      }
    }

    // Po wyczerpaniu prób, przełącz na backup
    const selectedBackups = backupAgents.slice(0, 1);
    this.publishEvent('graceful_failover', failedAgent.id, {
      backupAgents: selectedBackups.map(a => a.id),
      attempts
    });

    return { success: true, backupAgents: selectedBackups };
  }

  // Delayed failover - opóźnione przełączenie z analizą
  private async delayedFailover(
    failedAgent: AgentRegistration,
    backupAgents: AgentRegistration[],
    strategy: FailoverStrategy
  ): Promise<{ success: boolean; backupAgents: AgentRegistration[] }> {
    
    await this.delay(strategy.retryDelay);
    
    // Analiza przed failoverem
    const analysis = this.analyzeFailure(failedAgent);
    this.publishEvent('failover_analysis', failedAgent.id, analysis);

    const selectedBackups = backupAgents.slice(0, strategy.backupAgentsRequired);
    this.publishEvent('delayed_failover', failedAgent.id, {
      backupAgents: selectedBackups.map(a => a.id),
      analysis
    });

    return { success: true, backupAgents: selectedBackups };
  }

  // Analiza przyczyny awarii
  private analyzeFailure(agent: AgentRegistration): {
    likelyReason: string;
    severity: 'low' | 'medium' | 'high';
    recommendations: string[];
  } {
    const timeSinceHeartbeat = Date.now() - agent.lastHeartbeat.getTime();
    
    let likelyReason = 'Unknown';
    let severity: 'low' | 'medium' | 'high' = 'medium';
    const recommendations: string[] = [];

    if (timeSinceHeartbeat > 300000) {
      likelyReason = 'Prolonged inactivity';
      severity = 'high';
      recommendations.push('Check agent process', 'Verify network connectivity');
    } else if (agent.performance < 30) {
      likelyReason = 'Performance degradation';
      severity = 'medium';
      recommendations.push('Investigate resource usage', 'Check for memory leaks');
    } else if (agent.loadLevel > 95) {
      likelyReason = 'Overload';
      severity = 'high';
      recommendations.push('Scale resources', 'Distribute load to other agents');
    }

    return { likelyReason, severity, recommendations };
  }

  // Gettery
  getFailoverHistory(limit: number = 50): FailoverEvent[] {
    return this.failoverHistory.slice(-limit);
  }

  getFailedAgents(): string[] {
    return Array.from(this.failedAgents);
  }

  isAgentFailed(agentId: string): boolean {
    return this.failedAgents.has(agentId);
  }

  getRecoveryAttempts(agentId: string): number {
    return this.recoveryAttempts.get(agentId) || 0;
  }

  // Event handling
  onEvent(callback: (event: SystemEvent) => void): () => void {
    this.eventCallbacks.push(callback);
    return () => {
      const index = this.eventCallbacks.indexOf(callback);
      if (index > -1) this.eventCallbacks.splice(index, 1);
    };
  }

  // Private helpers
  private createFailoverEvent(
    failedAgentId: string,
    backupAgentIds: string[],
    strategy: FailoverStrategy['type'],
    success: boolean,
    reason?: string
  ): FailoverEvent {
    return {
      id: `failover_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date(),
      failedAgentId,
      backupAgentIds,
      strategy,
      success,
      reason
    };
  }

  private recordFailover(event: FailoverEvent): void {
    this.failoverHistory.push(event);
    
    // Zachowaj tylko ostatnie 100 eventów
    if (this.failoverHistory.length > 100) {
      this.failoverHistory.shift();
    }
  }

  private publishEvent(type: string, source: string, data: any): void {
    const event: SystemEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      timestamp: new Date(),
      source,
      data
    };

    this.eventCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in event callback:', error);
      }
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Reset recovery attempts po sukcesie
  resetRecoveryAttempts(agentId: string): void {
    this.recoveryAttempts.delete(agentId);
    this.failedAgents.delete(agentId);
  }

  // Cleanup
  cleanup(): void {
    this.failoverHistory = [];
    this.failedAgents.clear();
    this.recoveryAttempts.clear();
    this.eventCallbacks = [];
  }
}
