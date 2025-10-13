/**
 * Intent Attribution Layer - Tag every decision with source
 * P0 Component - Critical for AGI traceability
 */

export type IntentSource = 'user' | 'system' | 'agent' | 'scheduler' | 'webhook';

export interface AttributedDecision {
  id: string;
  source: IntentSource;
  sourceId?: string; // user_id, agent_id, etc.
  intentType: string;
  timestamp: Date;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
}

const attributionStore: AttributedDecision[] = [];
const MAX_STORE_SIZE = 10000;

export async function attributeIntent(
  intentType: string,
  source: IntentSource,
  sourceId?: string,
  context?: Record<string, any>,
  metadata?: Record<string, any>
): Promise<string> {
  const decision: AttributedDecision = {
    id: `intent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    source,
    sourceId,
    intentType,
    timestamp: new Date(),
    context,
    metadata
  };
  
  attributionStore.push(decision);
  
  // Maintain size limit
  if (attributionStore.length > MAX_STORE_SIZE) {
    attributionStore.splice(0, attributionStore.length - MAX_STORE_SIZE);
  }
  
  console.log(`[IntentAttribution] ${source}/${intentType} → ${decision.id}`);
  
  return decision.id;
}

export async function getAttributions(options: {
  source?: IntentSource;
  sourceId?: string;
  intentType?: string;
  limit?: number;
  since?: Date;
} = {}): Promise<AttributedDecision[]> {
  let filtered = [...attributionStore];
  
  if (options.source) {
    filtered = filtered.filter(d => d.source === options.source);
  }
  
  if (options.sourceId) {
    filtered = filtered.filter(d => d.sourceId === options.sourceId);
  }
  
  if (options.intentType) {
    filtered = filtered.filter(d => d.intentType === options.intentType);
  }
  
  if (options.since) {
    filtered = filtered.filter(d => d.timestamp >= options.since);
  }
  
  filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  if (options.limit) {
    filtered = filtered.slice(0, options.limit);
  }
  
  return filtered;
}

export async function getAttributionStats(): Promise<{
  total: number;
  bySource: Record<IntentSource, number>;
  recent24h: number;
  topIntentTypes: Array<{ type: string; count: number }>;
}> {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const bySource: Record<IntentSource, number> = {
    user: 0,
    system: 0,
    agent: 0,
    scheduler: 0,
    webhook: 0
  };
  
  const intentTypeCounts: Record<string, number> = {};
  let recent24h = 0;
  
  for (const decision of attributionStore) {
    bySource[decision.source]++;
    
    intentTypeCounts[decision.intentType] = (intentTypeCounts[decision.intentType] || 0) + 1;
    
    if (decision.timestamp >= dayAgo) {
      recent24h++;
    }
  }
  
  const topIntentTypes = Object.entries(intentTypeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    total: attributionStore.length,
    bySource,
    recent24h,
    topIntentTypes
  };
}

export async function clearAttributions(): Promise<number> {
  const count = attributionStore.length;
  attributionStore.length = 0;
  return count;
}

// Initialize attribution tracking
export function startIntentAttribution() {
  console.log('[IntentAttribution] Layer activated');
  
  // Auto-cleanup old attributions every 6 hours
  setInterval(() => {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
    const originalLength = attributionStore.length;
    
    for (let i = attributionStore.length - 1; i >= 0; i--) {
      if (attributionStore[i].timestamp < cutoff) {
        attributionStore.splice(i, 1);
      }
    }
    
    const removed = originalLength - attributionStore.length;
    if (removed > 0) {
      console.log(`[IntentAttribution] Cleaned ${removed} old records`);
    }
  }, 6 * 60 * 60 * 1000);
}
