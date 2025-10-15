/**
 * Centralized Event Bus - Cross-Layer Communication
 * Enables P0-P3+ modules to communicate asynchronously
 */

export type EventCallback<T = any> = (data: T) => void | Promise<void>;

export interface SystemEventData {
  timestamp: Date;
  source: string;
  metadata?: Record<string, any>;
}

export interface DriftDetectedEvent extends SystemEventData {
  agentId: string;
  similarity: number;
  threshold: number;
}

export interface AgentFailedEvent extends SystemEventData {
  agentId: string;
  reason: string;
  lastHeartbeat: Date;
}

export interface CalibrationCompletedEvent extends SystemEventData {
  agentId: string;
  beforeScore: number;
  afterScore: number;
}

export interface InfluenceChangedEvent extends SystemEventData {
  nodeId: string;
  oldInfluence: number;
  newInfluence: number;
}

export interface StyleDriftEvent extends SystemEventData {
  agentId: string;
  consistency: number;
  characteristicsChanged: string[];
}

type EventMap = {
  // P0 Events
  'drift_detected': DriftDetectedEvent;
  'agent_failed': AgentFailedEvent;
  'heartbeat_missed': AgentFailedEvent;
  'alert_created': SystemEventData & { level: string; message: string };
  
  // P1 Events
  'metrics_collected': SystemEventData & { metrics: any };
  'audit_event': SystemEventData & { eventType: string; details: any };
  
  // P2 Events
  'calibration_started': SystemEventData & { agentId: string };
  'calibration_completed': CalibrationCompletedEvent;
  'self_review_completed': SystemEventData & { score: number; recommendations: string[] };
  
  // P3 Events
  'influence_changed': InfluenceChangedEvent;
  'style_drift_detected': StyleDriftEvent;
  'style_updated': SystemEventData & { agentId: string; characteristics: any };
  
  // AGI 10.0 Events
  'agent_synced': SystemEventData & { agentId: string; missionId: string };
  'ui_state_changed': SystemEventData & { component: string; newState: any };
  'autonomy_decision': SystemEventData & { decision: string; confidence: number };
  
  // System Events
  'system_ready': SystemEventData;
  'system_error': SystemEventData & { error: Error };
};

class EventBus {
  private listeners: Map<keyof EventMap, Set<EventCallback>> = new Map();
  private eventHistory: Array<{ event: keyof EventMap; data: any; timestamp: Date }> = [];
  private maxHistorySize = 1000;
  private debugMode = false;

  /**
   * Subscribe to an event
   */
  on<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)!.add(callback);
    
    if (this.debugMode) {
      console.log(`[EventBus] Subscribed to: ${event}`);
    }
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit an event
   */
  async emit<K extends keyof EventMap>(event: K, data: EventMap[K]): Promise<void> {
    const listeners = this.listeners.get(event);
    
    // Record in history
    this.recordEvent(event, data);
    
    if (this.debugMode) {
      console.log(`[EventBus] Emitting: ${event}`, data);
    }
    
    if (!listeners || listeners.size === 0) {
      if (this.debugMode) {
        console.warn(`[EventBus] No listeners for: ${event}`);
      }
      return;
    }
    
    // Execute all callbacks
    const promises: Promise<void>[] = [];
    
    listeners.forEach(callback => {
      try {
        const result = callback(data);
        if (result instanceof Promise) {
          promises.push(result.catch(error => {
            console.error(`[EventBus] Callback error for ${event}:`, error);
          }));
        }
      } catch (error) {
        console.error(`[EventBus] Callback error for ${event}:`, error);
      }
    });
    
    // Wait for all async callbacks
    if (promises.length > 0) {
      await Promise.all(promises);
    }
  }

  /**
   * Emit event synchronously (fire and forget)
   */
  emitSync<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.emit(event, data).catch(error => {
      console.error(`[EventBus] Async emit error for ${event}:`, error);
    });
  }

  /**
   * Subscribe once to an event
   */
  once<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): void {
    const wrappedCallback: EventCallback<EventMap[K]> = (data) => {
      this.off(event, wrappedCallback);
      callback(data);
    };
    
    this.on(event, wrappedCallback);
  }

  /**
   * Get event history
   */
  getHistory(limit: number = 100): Array<{ event: string; data: any; timestamp: Date }> {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Get history for specific event
   */
  getEventHistory<K extends keyof EventMap>(event: K, limit: number = 50): Array<{ data: EventMap[K]; timestamp: Date }> {
    return this.eventHistory
      .filter(e => e.event === event)
      .slice(-limit)
      .map(e => ({ data: e.data, timestamp: e.timestamp }));
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get active listeners count
   */
  getListenerCount(event?: keyof EventMap): number {
    if (event) {
      return this.listeners.get(event)?.size || 0;
    }
    
    let total = 0;
    this.listeners.forEach(listeners => {
      total += listeners.size;
    });
    return total;
  }

  /**
   * Get all active events
   */
  getActiveEvents(): Array<keyof EventMap> {
    return Array.from(this.listeners.keys());
  }

  /**
   * Enable/disable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    console.log(`[EventBus] Debug mode: ${enabled ? 'ON' : 'OFF'}`);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(event?: keyof EventMap): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  // Private helpers
  private recordEvent(event: keyof EventMap, data: any): void {
    this.eventHistory.push({
      event,
      data,
      timestamp: new Date()
    });
    
    // Limit history size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Initialize debug mode based on environment
if (import.meta.env.DEV) {
  eventBus.setDebugMode(true);
}

// Export type-safe event emitter helpers
export const Events = {
  // P0
  driftDetected: (data: DriftDetectedEvent) => eventBus.emitSync('drift_detected', data),
  agentFailed: (data: AgentFailedEvent) => eventBus.emitSync('agent_failed', data),
  
  // P2
  calibrationCompleted: (data: CalibrationCompletedEvent) => eventBus.emitSync('calibration_completed', data),
  
  // P3
  influenceChanged: (data: InfluenceChangedEvent) => eventBus.emitSync('influence_changed', data),
  styleDriftDetected: (data: StyleDriftEvent) => eventBus.emitSync('style_drift_detected', data),
  
  // AGI 10.0
  agentSynced: (data: SystemEventData & { agentId: string; missionId: string }) => 
    eventBus.emitSync('agent_synced', data),
  autonomyDecision: (data: SystemEventData & { decision: string; confidence: number }) => 
    eventBus.emitSync('autonomy_decision', data),
};
