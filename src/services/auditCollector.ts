/**
 * Audit Collector - P1 Component
 * Collects and aggregates audit data from all system components
 */

import { karolConfigService } from './karolConfigService';
import { getHeartbeats } from './heartbeatService';
import { checkDrift } from './guardianCore';

export interface AuditEntry {
  timestamp: Date;
  component: string;
  action: string;
  status: 'success' | 'warning' | 'error';
  metadata?: Record<string, any>;
}

export interface AuditSummary {
  timestamp: Date;
  period: string;
  totalEvents: number;
  byStatus: {
    success: number;
    warning: number;
    error: number;
  };
  byComponent: Record<string, number>;
  criticalEvents: AuditEntry[];
}

const auditLog: AuditEntry[] = [];
const MAX_LOG_SIZE = 10000;

export function recordAudit(entry: Omit<AuditEntry, 'timestamp'>): void {
  const fullEntry: AuditEntry = {
    ...entry,
    timestamp: new Date()
  };
  
  auditLog.push(fullEntry);
  
  // Maintain log size
  if (auditLog.length > MAX_LOG_SIZE) {
    auditLog.splice(0, auditLog.length - MAX_LOG_SIZE);
  }
  
  console.log(`[AuditCollector] ${entry.component} - ${entry.action} - ${entry.status}`);
}

export async function getAuditSummary(periodMinutes: number = 60): Promise<AuditSummary> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - periodMinutes * 60 * 1000);
  
  const recentEvents = auditLog.filter(e => e.timestamp >= cutoff);
  
  const byStatus = {
    success: recentEvents.filter(e => e.status === 'success').length,
    warning: recentEvents.filter(e => e.status === 'warning').length,
    error: recentEvents.filter(e => e.status === 'error').length
  };
  
  const byComponent: Record<string, number> = {};
  recentEvents.forEach(e => {
    byComponent[e.component] = (byComponent[e.component] || 0) + 1;
  });
  
  const criticalEvents = recentEvents.filter(e => e.status === 'error');
  
  return {
    timestamp: now,
    period: `${periodMinutes}min`,
    totalEvents: recentEvents.length,
    byStatus,
    byComponent,
    criticalEvents
  };
}

export async function performSystemAudit(): Promise<AuditSummary> {
  console.log('[AuditCollector] Starting system audit...');
  
  // Check config health
  try {
    const config = await karolConfigService.getConfig();
    recordAudit({
      component: 'ConfigService',
      action: 'health_check',
      status: config ? 'success' : 'error'
    });
  } catch (error) {
    recordAudit({
      component: 'ConfigService',
      action: 'health_check',
      status: 'error',
      metadata: { error: error instanceof Error ? error.message : 'Unknown' }
    });
  }
  
  // Check agent heartbeats
  try {
    const heartbeats = await getHeartbeats();
    const downAgents = heartbeats.filter(h => h.status === 'down');
    recordAudit({
      component: 'HeartbeatService',
      action: 'agent_status_check',
      status: downAgents.length > 0 ? 'warning' : 'success',
      metadata: { total: heartbeats.length, down: downAgents.length }
    });
  } catch (error) {
    recordAudit({
      component: 'HeartbeatService',
      action: 'agent_status_check',
      status: 'error'
    });
  }
  
  // Check drift status
  try {
    const driftResults = await checkDrift();
    const driftDetected = driftResults.filter(r => r.driftDetected);
    recordAudit({
      component: 'GuardianCore',
      action: 'drift_check',
      status: driftDetected.length > 0 ? 'warning' : 'success',
      metadata: { checked: driftResults.length, drifted: driftDetected.length }
    });
  } catch (error) {
    recordAudit({
      component: 'GuardianCore',
      action: 'drift_check',
      status: 'error'
    });
  }
  
  return getAuditSummary(60);
}

// Auto-audit every 30 minutes
setInterval(() => {
  performSystemAudit();
}, 30 * 60 * 1000);
