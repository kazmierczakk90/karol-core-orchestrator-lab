/**
 * Meta UI Controller (meta_ui.lov)
 * Dynamiczne zarządzanie panelami interfejsu AGI
 */

export interface DynamicPanel {
  id: string;
  type: 'metrics' | 'graph' | 'timeline' | 'console' | 'map' | 'custom';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  visible: boolean;
  priority: number;
  dataSource: string;
  refreshRate?: number;
  config?: Record<string, any>;
}

export interface UIContext {
  userId: string;
  role: 'admin' | 'operator' | 'viewer';
  preferences: Record<string, any>;
  activeView: string;
}

export interface UIMetrics {
  activePanels: number;
  visiblePanels: number;
  totalInteractions: number;
  adaptiveScore: number;
  lastUpdateAt: Date;
}

class MetaUIController {
  private panels: Map<string, DynamicPanel> = new Map();
  private contexts: Map<string, UIContext> = new Map();
  private listeners: Set<(panels: DynamicPanel[]) => void> = new Set();
  private metricsListeners: Set<(metrics: UIMetrics) => void> = new Set();
  private interactionCount: number = 0;

  // Initialize default panels
  initialize(): void {
    this.registerDefaultPanels();
    console.log('🎨 Meta UI Controller initialized');
  }

  private registerDefaultPanels(): void {
    const defaults: Omit<DynamicPanel, 'id'>[] = [
      {
        type: 'metrics',
        title: 'System Metrics',
        position: { x: 0, y: 0, w: 4, h: 2 },
        visible: true,
        priority: 10,
        dataSource: 'orchestration_metrics',
        refreshRate: 5000
      },
      {
        type: 'graph',
        title: 'Agent Network',
        position: { x: 4, y: 0, w: 8, h: 4 },
        visible: true,
        priority: 9,
        dataSource: 'agent_graph',
        refreshRate: 10000
      },
      {
        type: 'timeline',
        title: 'Event Timeline',
        position: { x: 0, y: 2, w: 4, h: 2 },
        visible: true,
        priority: 8,
        dataSource: 'system_events',
        refreshRate: 3000
      },
      {
        type: 'console',
        title: 'AGI Console',
        position: { x: 0, y: 4, w: 12, h: 2 },
        visible: true,
        priority: 7,
        dataSource: 'live_logs',
        refreshRate: 2000
      },
      {
        type: 'map',
        title: 'Mission Map',
        position: { x: 0, y: 6, w: 6, h: 3 },
        visible: true,
        priority: 6,
        dataSource: 'mission_sync',
        refreshRate: 5000
      }
    ];

    defaults.forEach((panel, index) => {
      const id = `panel_${index}_${Date.now()}`;
      this.panels.set(id, { ...panel, id });
    });
  }

  // Panel Management
  createPanel(panel: Omit<DynamicPanel, 'id'>): DynamicPanel {
    const newPanel: DynamicPanel = {
      ...panel,
      id: `panel_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    };

    this.panels.set(newPanel.id, newPanel);
    this.notifyPanelListeners();
    return newPanel;
  }

  updatePanel(id: string, updates: Partial<DynamicPanel>): boolean {
    const panel = this.panels.get(id);
    if (!panel) return false;

    Object.assign(panel, updates);
    this.notifyPanelListeners();
    return true;
  }

  deletePanel(id: string): boolean {
    const deleted = this.panels.delete(id);
    if (deleted) this.notifyPanelListeners();
    return deleted;
  }

  getPanels(): DynamicPanel[] {
    return Array.from(this.panels.values())
      .sort((a, b) => b.priority - a.priority);
  }

  getVisiblePanels(): DynamicPanel[] {
    return this.getPanels().filter(p => p.visible);
  }

  // Context Management
  setContext(userId: string, context: UIContext): void {
    this.contexts.set(userId, context);
    this.adaptPanelsToContext(context);
  }

  getContext(userId: string): UIContext | undefined {
    return this.contexts.get(userId);
  }

  private adaptPanelsToContext(context: UIContext): void {
    // Adaptive UI based on role and preferences
    const panels = this.getPanels();

    panels.forEach(panel => {
      if (context.role === 'viewer' && panel.type === 'console') {
        panel.visible = false;
      }
      
      if (context.preferences.hideGraphs && panel.type === 'graph') {
        panel.visible = false;
      }

      if (context.preferences.focusMode) {
        panel.visible = panel.priority >= 8; // Only high priority
      }
    });

    this.notifyPanelListeners();
  }

  // Interaction Tracking
  trackInteraction(panelId: string, action: string): void {
    this.interactionCount++;
    const panel = this.panels.get(panelId);
    
    if (panel) {
      // Increase priority on interaction
      panel.priority = Math.min(10, panel.priority + 0.1);
    }

    this.notifyMetricsListeners();
  }

  // Metrics
  getMetrics(): UIMetrics {
    const panels = this.getPanels();
    const visible = this.getVisiblePanels();
    
    // Calculate adaptive score (0-100)
    const avgPriority = panels.reduce((sum, p) => sum + p.priority, 0) / panels.length;
    const visibilityRatio = visible.length / panels.length;
    const adaptiveScore = Math.round((avgPriority / 10) * visibilityRatio * 100);

    return {
      activePanels: panels.length,
      visiblePanels: visible.length,
      totalInteractions: this.interactionCount,
      adaptiveScore,
      lastUpdateAt: new Date()
    };
  }

  // Event Listeners
  onPanelsUpdate(callback: (panels: DynamicPanel[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getPanels()); // Immediate callback
    return () => this.listeners.delete(callback);
  }

  onMetricsUpdate(callback: (metrics: UIMetrics) => void): () => void {
    this.metricsListeners.add(callback);
    callback(this.getMetrics()); // Immediate callback
    return () => this.metricsListeners.delete(callback);
  }

  private notifyPanelListeners(): void {
    const panels = this.getPanels();
    this.listeners.forEach(cb => cb(panels));
  }

  private notifyMetricsListeners(): void {
    const metrics = this.getMetrics();
    this.metricsListeners.forEach(cb => cb(metrics));
  }

  cleanup(): void {
    this.panels.clear();
    this.contexts.clear();
    this.listeners.clear();
    this.metricsListeners.clear();
  }
}

export const metaUIController = new MetaUIController();
