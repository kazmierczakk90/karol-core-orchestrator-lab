/**
 * Agent Registry Module - Wydzielony z orchestrationEngine
 * Zarządzanie rejestracją i discovery agentów
 */

import { AgentCapability, SystemEvent } from '@/types/platformCore';

export interface AgentRegistration {
  id: string;
  name: string;
  capabilities: AgentCapability[];
  status: 'online' | 'offline' | 'busy' | 'error';
  lastHeartbeat: Date;
  performance: number;
  loadLevel: number;
  version: string;
}

export class AgentRegistry {
  private agents: Map<string, AgentRegistration> = new Map();
  private serviceDiscovery: Map<string, string[]> = new Map();
  private eventCallbacks: Array<(event: SystemEvent) => void> = [];

  // Rejestracja agenta z walidacją
  registerAgent(agent: Omit<AgentRegistration, 'lastHeartbeat'>): boolean {
    try {
      // Walidacja danych wejściowych
      if (!agent.id || !agent.name || !Array.isArray(agent.capabilities)) {
        throw new Error('Invalid agent data');
      }

      const registration: AgentRegistration = {
        ...agent,
        lastHeartbeat: new Date()
      };
      
      this.agents.set(agent.id, registration);
      this.updateServiceDiscovery(agent.id, agent.capabilities);
      this.publishEvent('agent_registered', agent.id, { capabilities: agent.capabilities });
      
      return true;
    } catch (error) {
      this.publishEvent('agent_registration_failed', agent.id, { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return false;
    }
  }

  // Usunięcie agenta z rejestru
  unregisterAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    this.agents.delete(agentId);
    this.removeFromServiceDiscovery(agentId);
    this.publishEvent('agent_unregistered', agentId, {});
    
    return true;
  }

  // Discovery based on capabilities
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

  // Health check z auto-cleanup
  healthCheck(): Record<string, 'healthy' | 'unhealthy' | 'degraded'> {
    const health: Record<string, 'healthy' | 'unhealthy' | 'degraded'> = {};
    const now = new Date();
    const unhealthyAgents: string[] = [];

    this.agents.forEach((agent, id) => {
      const timeSinceHeartbeat = now.getTime() - agent.lastHeartbeat.getTime();
      
      if (timeSinceHeartbeat > 60000) { // 1 minuta
        health[id] = 'unhealthy';
        unhealthyAgents.push(id);
        this.updateAgentStatus(id, 'offline');
      } else if (timeSinceHeartbeat > 30000 || agent.performance < 70) {
        health[id] = 'degraded';
      } else {
        health[id] = 'healthy';
      }
    });

    // Auto-cleanup offline agentów po 5 minutach
    if (unhealthyAgents.length > 0) {
      setTimeout(() => {
        unhealthyAgents.forEach(id => {
          const agent = this.agents.get(id);
          if (agent && now.getTime() - agent.lastHeartbeat.getTime() > 300000) {
            this.unregisterAgent(id);
          }
        });
      }, 5000);
    }

    return health;
  }

  // Heartbeat z metrykami
  heartbeat(agentId: string, metrics?: { performance: number; loadLevel: number }): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.lastHeartbeat = new Date();
    if (metrics) {
      agent.performance = Math.max(0, Math.min(100, metrics.performance));
      agent.loadLevel = Math.max(0, Math.min(100, metrics.loadLevel));
    }

    return true;
  }

  // Update status
  updateAgentStatus(agentId: string, status: AgentRegistration['status']): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.lastHeartbeat = new Date();
      this.publishEvent('agent_status_updated', agentId, { status });
    }
  }

  // Gettery
  getAgent(agentId: string): AgentRegistration | undefined {
    return this.agents.get(agentId);
  }

  getAgents(): AgentRegistration[] {
    return Array.from(this.agents.values());
  }

  getOnlineAgents(): AgentRegistration[] {
    return Array.from(this.agents.values()).filter(a => a.status === 'online');
  }

  getAgentCount(): number {
    return this.agents.size;
  }

  // Event handling
  onEvent(callback: (event: SystemEvent) => void): () => void {
    this.eventCallbacks.push(callback);
    return () => {
      const index = this.eventCallbacks.indexOf(callback);
      if (index > -1) {
        this.eventCallbacks.splice(index, 1);
      }
    };
  }

  // Private helpers
  private updateServiceDiscovery(agentId: string, capabilities: AgentCapability[]): void {
    capabilities.forEach(cap => {
      if (!this.serviceDiscovery.has(cap.name)) {
        this.serviceDiscovery.set(cap.name, []);
      }
      const agents = this.serviceDiscovery.get(cap.name)!;
      if (!agents.includes(agentId)) {
        agents.push(agentId);
      }
    });
  }

  private removeFromServiceDiscovery(agentId: string): void {
    this.serviceDiscovery.forEach((agents, capability) => {
      const index = agents.indexOf(agentId);
      if (index > -1) {
        agents.splice(index, 1);
      }
      if (agents.length === 0) {
        this.serviceDiscovery.delete(capability);
      }
    });
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

  // Cleanup - zwalnianie pamięci
  cleanup(): void {
    this.agents.clear();
    this.serviceDiscovery.clear();
    this.eventCallbacks = [];
  }
}
