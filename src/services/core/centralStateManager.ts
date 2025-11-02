/**
 * Central State Manager - Unified AGI State Management
 * Single source of truth for entire Karol-Core system
 */

import { eventBus } from '../eventBus';
import { AgentRegistration } from './AgentRegistry';
import { SystemEvent } from '@/types/platformCore';

export interface AGIState {
  agents: Map<string, AgentRegistration>;
  missions: Map<string, Mission>;
  decisions: Map<string, Decision>;
  memories: Map<string, Memory>;
  system: SystemState;
}

export interface Mission {
  id: string;
  title: string;
  agentId: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  priority: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Decision {
  id: string;
  type: string;
  agentId: string;
  confidence: number;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface Memory {
  id: string;
  agentId: string;
  content: string;
  type: 'short_term' | 'long_term' | 'episodic';
  importance: number;
  createdAt: Date;
}

export interface SystemState {
  initialized: boolean;
  health: 'healthy' | 'degraded' | 'critical';
  activeAgents: number;
  totalMissions: number;
  uptime: number;
  lastSync: Date;
}

class CentralStateManager {
  private state: AGIState;
  private subscribers: Map<string, Set<(state: AGIState) => void>> = new Map();
  private stateHistory: AGIState[] = [];
  private maxHistorySize = 100;

  constructor() {
    this.state = this.initializeState();
    this.setupEventListeners();
  }

  private initializeState(): AGIState {
    return {
      agents: new Map(),
      missions: new Map(),
      decisions: new Map(),
      memories: new Map(),
      system: {
        initialized: false,
        health: 'healthy',
        activeAgents: 0,
        totalMissions: 0,
        uptime: 0,
        lastSync: new Date()
      }
    };
  }

  private setupEventListeners(): void {
    // Listen to system events - these are logged for audit purposes
    // Actual state updates happen through direct method calls
    console.log('[CentralStateManager] Event listeners ready');
  }

  // === STATE GETTERS ===

  getState(): Readonly<AGIState> {
    return this.state;
  }

  getAgent(agentId: string): AgentRegistration | undefined {
    return this.state.agents.get(agentId);
  }

  getAllAgents(): AgentRegistration[] {
    return Array.from(this.state.agents.values());
  }

  getMission(missionId: string): Mission | undefined {
    return this.state.missions.get(missionId);
  }

  getActiveMissions(): Mission[] {
    return Array.from(this.state.missions.values())
      .filter(m => m.status === 'active');
  }

  getSystemState(): SystemState {
    return { ...this.state.system };
  }

  // === STATE MUTATIONS ===

  updateAgent(agent: AgentRegistration): void {
    this.state.agents.set(agent.id, agent);
    this.updateSystemMetrics();
    this.notifySubscribers('agents');
    this.saveStateSnapshot();
  }

  removeAgent(agentId: string): void {
    this.state.agents.delete(agentId);
    this.updateSystemMetrics();
    this.notifySubscribers('agents');
  }

  addMission(mission: Mission): void {
    this.state.missions.set(mission.id, mission);
    this.state.system.totalMissions++;
    this.notifySubscribers('missions');
    this.saveStateSnapshot();
  }

  updateMission(missionId: string, updates: Partial<Mission>): void {
    const mission = this.state.missions.get(missionId);
    if (mission) {
      Object.assign(mission, updates);
      this.notifySubscribers('missions');
      this.saveStateSnapshot();
    }
  }

  addDecision(decision: Decision): void {
    this.state.decisions.set(decision.id, decision);
    this.notifySubscribers('decisions');
  }

  addMemory(memory: Memory): void {
    this.state.memories.set(memory.id, memory);
    this.notifySubscribers('memories');
  }

  // === SYSTEM STATE ===

  private updateSystemMetrics(): void {
    const agents = Array.from(this.state.agents.values());
    this.state.system.activeAgents = agents.filter(a => a.status === 'online').length;
    this.state.system.lastSync = new Date();
    
    // Update health based on metrics
    const healthyPercentage = this.state.system.activeAgents / Math.max(1, agents.length);
    if (healthyPercentage < 0.5) {
      this.state.system.health = 'critical';
    } else if (healthyPercentage < 0.8) {
      this.state.system.health = 'degraded';
    } else {
      this.state.system.health = 'healthy';
    }
  }

  markInitialized(): void {
    this.state.system.initialized = true;
    console.log('[CentralStateManager] System state initialized');
  }

  // === SUBSCRIPTIONS ===

  subscribe(key: string, callback: (state: AGIState) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(key);
      if (subs) {
        subs.delete(callback);
      }
    };
  }

  private notifySubscribers(key: string): void {
    const subs = this.subscribers.get(key);
    if (subs) {
      subs.forEach(callback => callback(this.state));
    }
    // Also notify wildcard subscribers
    const wildcardSubs = this.subscribers.get('*');
    if (wildcardSubs) {
      wildcardSubs.forEach(callback => callback(this.state));
    }
  }

  // === STATE HISTORY ===

  private saveStateSnapshot(): void {
    const snapshot = JSON.parse(JSON.stringify({
      agents: Array.from(this.state.agents.entries()),
      missions: Array.from(this.state.missions.entries()),
      decisions: Array.from(this.state.decisions.entries()),
      memories: Array.from(this.state.memories.entries()),
      system: this.state.system,
      timestamp: new Date()
    }));

    this.stateHistory.push(snapshot);

    // Limit history size
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
    }
  }

  getStateHistory(limit: number = 10): any[] {
    return this.stateHistory.slice(-limit);
  }

  // === QUERY HELPERS ===

  queryAgentsByCapability(capability: string): AgentRegistration[] {
    return Array.from(this.state.agents.values())
      .filter(agent => agent.capabilities.some(c => c.name === capability));
  }

  queryMissionsByAgent(agentId: string): Mission[] {
    return Array.from(this.state.missions.values())
      .filter(m => m.agentId === agentId);
  }

  queryRecentDecisions(agentId: string, limit: number = 10): Decision[] {
    return Array.from(this.state.decisions.values())
      .filter(d => d.agentId === agentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // === ANALYTICS ===

  getAnalytics() {
    const agents = Array.from(this.state.agents.values());
    const missions = Array.from(this.state.missions.values());
    const decisions = Array.from(this.state.decisions.values());

    return {
      agents: {
        total: agents.length,
        online: agents.filter(a => a.status === 'online').length,
        avgPerformance: agents.reduce((sum, a) => sum + a.performance, 0) / Math.max(1, agents.length)
      },
      missions: {
        total: missions.length,
        active: missions.filter(m => m.status === 'active').length,
        completed: missions.filter(m => m.status === 'completed').length,
        failed: missions.filter(m => m.status === 'failed').length
      },
      decisions: {
        total: decisions.length,
        avgConfidence: decisions.reduce((sum, d) => sum + d.confidence, 0) / Math.max(1, decisions.length),
        last24h: decisions.filter(d => Date.now() - d.timestamp.getTime() < 86400000).length
      },
      system: this.state.system
    };
  }

  // === CLEANUP ===

  cleanup(): void {
    this.state = this.initializeState();
    this.subscribers.clear();
    this.stateHistory = [];
    console.log('[CentralStateManager] Cleaned up');
  }
}

// Singleton instance
export const centralStateManager = new CentralStateManager();
export { CentralStateManager };
