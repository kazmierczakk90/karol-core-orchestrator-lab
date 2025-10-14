/**
 * Metrics Gateway - P1 Component
 * Exposes Prometheus-compatible metrics for monitoring
 */

import { getHeartbeats, getHealthStatus } from './heartbeatService';
import { getAuditSummary } from './auditCollector';

export interface SystemMetrics {
  timestamp: number;
  agents: {
    total: number;
    ok: number;
    degraded: number;
    down: number;
  };
  audit: {
    events_total: number;
    events_success: number;
    events_warning: number;
    events_error: number;
  };
  performance: {
    avg_latency_ms: number;
    max_latency_ms: number;
  };
}

let metricsCache: SystemMetrics | null = null;
let lastUpdate = 0;
const CACHE_TTL_MS = 5000; // 5 seconds

export async function collectMetrics(): Promise<SystemMetrics> {
  const now = Date.now();
  
  // Return cached metrics if fresh
  if (metricsCache && (now - lastUpdate) < CACHE_TTL_MS) {
    return metricsCache;
  }
  
  const [healthStatus, auditSummary, heartbeats] = await Promise.all([
    getHealthStatus(),
    getAuditSummary(60),
    getHeartbeats()
  ]);
  
  const latencies = heartbeats.map(h => h.latency);
  const avgLatency = latencies.length > 0 
    ? latencies.reduce((a, b) => a + b, 0) / latencies.length 
    : 0;
  const maxLatency = latencies.length > 0 ? Math.max(...latencies) : 0;
  
  metricsCache = {
    timestamp: now,
    agents: {
      total: healthStatus.total,
      ok: healthStatus.ok,
      degraded: healthStatus.degraded,
      down: healthStatus.down
    },
    audit: {
      events_total: auditSummary.totalEvents,
      events_success: auditSummary.byStatus.success,
      events_warning: auditSummary.byStatus.warning,
      events_error: auditSummary.byStatus.error
    },
    performance: {
      avg_latency_ms: Math.round(avgLatency),
      max_latency_ms: Math.round(maxLatency)
    }
  };
  
  lastUpdate = now;
  return metricsCache;
}

export function formatPrometheusMetrics(metrics: SystemMetrics): string {
  const lines: string[] = [];
  
  lines.push('# HELP karol_agents_total Total number of agents');
  lines.push('# TYPE karol_agents_total gauge');
  lines.push(`karol_agents_total ${metrics.agents.total}`);
  
  lines.push('# HELP karol_agents_ok Number of healthy agents');
  lines.push('# TYPE karol_agents_ok gauge');
  lines.push(`karol_agents_ok ${metrics.agents.ok}`);
  
  lines.push('# HELP karol_agents_degraded Number of degraded agents');
  lines.push('# TYPE karol_agents_degraded gauge');
  lines.push(`karol_agents_degraded ${metrics.agents.degraded}`);
  
  lines.push('# HELP karol_agents_down Number of down agents');
  lines.push('# TYPE karol_agents_down gauge');
  lines.push(`karol_agents_down ${metrics.agents.down}`);
  
  lines.push('# HELP karol_audit_events_total Total audit events');
  lines.push('# TYPE karol_audit_events_total counter');
  lines.push(`karol_audit_events_total ${metrics.audit.events_total}`);
  
  lines.push('# HELP karol_audit_errors_total Total error events');
  lines.push('# TYPE karol_audit_errors_total counter');
  lines.push(`karol_audit_errors_total ${metrics.audit.events_error}`);
  
  lines.push('# HELP karol_latency_avg_ms Average agent latency');
  lines.push('# TYPE karol_latency_avg_ms gauge');
  lines.push(`karol_latency_avg_ms ${metrics.performance.avg_latency_ms}`);
  
  lines.push('# HELP karol_latency_max_ms Maximum agent latency');
  lines.push('# TYPE karol_latency_max_ms gauge');
  lines.push(`karol_latency_max_ms ${metrics.performance.max_latency_ms}`);
  
  return lines.join('\n');
}

export async function getMetricsEndpoint(): Promise<string> {
  const metrics = await collectMetrics();
  return formatPrometheusMetrics(metrics);
}
