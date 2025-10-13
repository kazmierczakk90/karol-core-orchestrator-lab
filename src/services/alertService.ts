/**
 * Alert Service - System alerts and notifications
 */

export interface Alert {
  id?: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  body: string;
  timestamp?: Date;
  agentId?: string;
  metadata?: Record<string, any>;
}

// In-memory alert store
let alertStore: Alert[] = [];
const MAX_ALERTS = 500;

export async function sendAlert(alert: Alert): Promise<string> {
  const newAlert: Alert = {
    ...alert,
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date()
  };
  
  alertStore.push(newAlert);
  
  // Keep only recent alerts
  if (alertStore.length > MAX_ALERTS) {
    alertStore = alertStore.slice(-MAX_ALERTS);
  }
  
  // Log to console based on level
  const logFn = alert.level === 'error' || alert.level === 'critical' ? console.error : 
                alert.level === 'warning' ? console.warn : 
                console.info;
  
  logFn(`[${alert.level.toUpperCase()}] ${alert.title}:`, alert.body);
  
  // TODO: Integrate with external alerting (PagerDuty, Slack, etc.)
  
  return newAlert.id!;
}

export async function getAlerts(options: {
  level?: Alert['level'];
  agentId?: string;
  limit?: number;
  since?: Date;
} = {}): Promise<Alert[]> {
  let filtered = [...alertStore];
  
  if (options.level) {
    filtered = filtered.filter(a => a.level === options.level);
  }
  
  if (options.agentId) {
    filtered = filtered.filter(a => a.agentId === options.agentId);
  }
  
  if (options.since) {
    filtered = filtered.filter(a => a.timestamp && a.timestamp >= options.since);
  }
  
  filtered.sort((a, b) => {
    const timeA = a.timestamp?.getTime() || 0;
    const timeB = b.timestamp?.getTime() || 0;
    return timeB - timeA;
  });
  
  if (options.limit) {
    filtered = filtered.slice(0, options.limit);
  }
  
  return filtered;
}

export async function getAlertById(id: string): Promise<Alert | null> {
  return alertStore.find(a => a.id === id) || null;
}

export async function clearAlerts(level?: Alert['level']): Promise<number> {
  const beforeCount = alertStore.length;
  
  if (level) {
    alertStore = alertStore.filter(a => a.level !== level);
  } else {
    alertStore = [];
  }
  
  return beforeCount - alertStore.length;
}

export async function getAlertStats(): Promise<{
  total: number;
  byLevel: Record<Alert['level'], number>;
  recent24h: number;
}> {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const byLevel = {
    info: 0,
    warning: 0,
    error: 0,
    critical: 0
  };
  
  let recent24h = 0;
  
  for (const alert of alertStore) {
    byLevel[alert.level]++;
    if (alert.timestamp && alert.timestamp >= dayAgo) {
      recent24h++;
    }
  }
  
  return {
    total: alertStore.length,
    byLevel,
    recent24h
  };
}
