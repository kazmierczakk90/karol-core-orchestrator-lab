/**
 * Heartbeat Service - Agent liveness monitoring
 */

export interface AgentHeartbeat {
  agentId: string;
  status: 'ok' | 'degraded' | 'down';
  latency: number;
  lastSeen: Date;
  metadata?: Record<string, any>;
}

interface HeartbeatStore {
  [agentId: string]: AgentHeartbeat;
}

const heartbeats: HeartbeatStore = {};
const HEARTBEAT_TIMEOUT_MS = 90000; // 90 seconds

export async function recordHeartbeat(
  agentId: string, 
  latency: number = 0,
  metadata?: Record<string, any>
): Promise<void> {
  heartbeats[agentId] = {
    agentId,
    status: latency < 1000 ? 'ok' : latency < 5000 ? 'degraded' : 'down',
    latency,
    lastSeen: new Date(),
    metadata
  };
}

export async function getHeartbeats(): Promise<AgentHeartbeat[]> {
  const now = Date.now();
  const results: AgentHeartbeat[] = [];
  
  for (const agentId in heartbeats) {
    const hb = heartbeats[agentId];
    const timeSinceLastSeen = now - hb.lastSeen.getTime();
    
    // Update status based on timeout
    if (timeSinceLastSeen > HEARTBEAT_TIMEOUT_MS) {
      hb.status = 'down';
    }
    
    results.push(hb);
  }
  
  return results.sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
}

export async function getHeartbeat(agentId: string): Promise<AgentHeartbeat | null> {
  const hb = heartbeats[agentId];
  if (!hb) return null;
  
  const now = Date.now();
  const timeSinceLastSeen = now - hb.lastSeen.getTime();
  
  if (timeSinceLastSeen > HEARTBEAT_TIMEOUT_MS) {
    hb.status = 'down';
  }
  
  return hb;
}

export async function getHealthStatus(): Promise<{
  total: number;
  ok: number;
  degraded: number;
  down: number;
}> {
  const all = await getHeartbeats();
  
  return {
    total: all.length,
    ok: all.filter(h => h.status === 'ok').length,
    degraded: all.filter(h => h.status === 'degraded').length,
    down: all.filter(h => h.status === 'down').length
  };
}

export async function clearHeartbeats(): Promise<void> {
  for (const key in heartbeats) {
    delete heartbeats[key];
  }
}

// Auto-cleanup for stale heartbeats
setInterval(() => {
  const now = Date.now();
  const staleThreshold = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const agentId in heartbeats) {
    const timeSinceLastSeen = now - heartbeats[agentId].lastSeen.getTime();
    if (timeSinceLastSeen > staleThreshold) {
      delete heartbeats[agentId];
    }
  }
}, 60 * 60 * 1000); // Cleanup every hour
