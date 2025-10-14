/**
 * Core Sync Orchestrator (core_sync.lov)
 * Synchronizuje agentów z misjami w czasie rzeczywistym
 */

import { orchestrationEngineV2 } from '../orchestrationEngineV2';
import { AgentRegistration } from './AgentRegistry';

export interface Mission {
  id: string;
  name: string;
  priority: number;
  requiredCapabilities: string[];
  status: 'pending' | 'assigned' | 'active' | 'completed' | 'failed';
  assignedAgents: string[];
  startedAt?: Date;
  completedAt?: Date;
  progress: number;
  metadata?: Record<string, any>;
}

export interface SyncMetrics {
  totalMissions: number;
  activeMissions: number;
  completedMissions: number;
  agentUtilization: number;
  syncHealth: 'healthy' | 'degraded' | 'critical';
  lastSyncAt: Date;
}

class CoreSyncOrchestrator {
  private missions: Map<string, Mission> = new Map();
  private syncInterval: NodeJS.Timeout | null = null;
  private syncFrequencyMs: number = 5000; // 5s
  private listeners: Set<(metrics: SyncMetrics) => void> = new Set();

  start(): void {
    if (this.syncInterval) return;
    
    console.log('🔄 Core Sync Orchestrator started');
    this.syncInterval = setInterval(() => this.syncCycle(), this.syncFrequencyMs);
    this.syncCycle(); // immediate first sync
  }

  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private async syncCycle(): Promise<void> {
    try {
      // 1. Check pending missions
      const pending = Array.from(this.missions.values()).filter(m => m.status === 'pending');
      
      for (const mission of pending) {
        await this.assignMission(mission);
      }

      // 2. Update active missions progress
      const active = Array.from(this.missions.values()).filter(m => m.status === 'active');
      for (const mission of active) {
        this.updateMissionProgress(mission);
      }

      // 3. Health check agents
      await orchestrationEngineV2.performHealthCheck();

      // 4. Notify listeners
      this.notifyListeners();
    } catch (error) {
      console.error('❌ Sync cycle error:', error);
    }
  }

  private async assignMission(mission: Mission): Promise<void> {
    const agents: AgentRegistration[] = [];
    
    for (const capability of mission.requiredCapabilities) {
      const agent = orchestrationEngineV2.selectAgent(capability, 1, 'adaptive');
      if (agent) {
        agents.push(agent);
      }
    }

    if (agents.length > 0) {
      mission.assignedAgents = agents.map(a => a.id);
      mission.status = 'assigned';
      mission.startedAt = new Date();
      
      // Publish event
      orchestrationEngineV2.publishEvent('mission_assigned', 'core_sync', {
        missionId: mission.id,
        agents: mission.assignedAgents
      });
    }
  }

  private updateMissionProgress(mission: Mission): void {
    // Simulate progress based on agent performance
    const agents = mission.assignedAgents
      .map(id => orchestrationEngineV2.getAgent(id))
      .filter(Boolean) as AgentRegistration[];

    if (agents.length === 0) return;

    const avgPerformance = agents.reduce((sum, a) => sum + a.performance, 0) / agents.length;
    mission.progress = Math.min(100, mission.progress + (avgPerformance / 1000));

    if (mission.progress >= 100) {
      mission.status = 'completed';
      mission.completedAt = new Date();
      
      orchestrationEngineV2.publishEvent('mission_completed', 'core_sync', {
        missionId: mission.id,
        duration: mission.completedAt.getTime() - (mission.startedAt?.getTime() || 0)
      });
    } else {
      mission.status = 'active';
    }
  }

  // Public API
  createMission(mission: Omit<Mission, 'id' | 'assignedAgents' | 'progress'>): Mission {
    const newMission: Mission = {
      ...mission,
      id: `mission_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      assignedAgents: [],
      progress: 0
    };

    this.missions.set(newMission.id, newMission);
    return newMission;
  }

  getMissions(): Mission[] {
    return Array.from(this.missions.values());
  }

  getMission(id: string): Mission | undefined {
    return this.missions.get(id);
  }

  getMetrics(): SyncMetrics {
    const missions = Array.from(this.missions.values());
    const agents = orchestrationEngineV2.getAgents().filter(a => a.status === 'online');
    
    const activeMissions = missions.filter(m => m.status === 'active');
    const assignedAgentIds = new Set(activeMissions.flatMap(m => m.assignedAgents));
    const utilization = agents.length > 0 ? (assignedAgentIds.size / agents.length) * 100 : 0;

    let health: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (utilization > 90) health = 'critical';
    else if (utilization > 70) health = 'degraded';

    return {
      totalMissions: missions.length,
      activeMissions: activeMissions.length,
      completedMissions: missions.filter(m => m.status === 'completed').length,
      agentUtilization: Math.round(utilization),
      syncHealth: health,
      lastSyncAt: new Date()
    };
  }

  onMetricsUpdate(callback: (metrics: SyncMetrics) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const metrics = this.getMetrics();
    this.listeners.forEach(cb => cb(metrics));
  }

  cleanup(): void {
    this.stop();
    this.missions.clear();
    this.listeners.clear();
  }
}

export const coreSyncOrchestrator = new CoreSyncOrchestrator();
