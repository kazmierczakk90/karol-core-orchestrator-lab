/**
 * Memory Service - AGI memory management and retrieval
 */

interface MemoryEntry {
  id: string;
  agentId: string;
  text: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface RecentResponsesOptions {
  limit?: number;
  agentIds?: string[];
}

// In-memory store (replace with Supabase in production)
let memoryStore: MemoryEntry[] = [];

export async function storeMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<string> {
  const newEntry: MemoryEntry = {
    ...entry,
    id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date()
  };
  
  memoryStore.push(newEntry);
  
  // Keep only last 1000 entries
  if (memoryStore.length > 1000) {
    memoryStore = memoryStore.slice(-1000);
  }
  
  return newEntry.id;
}

export async function getRecentResponses(
  options: RecentResponsesOptions = {}
): Promise<Record<string, MemoryEntry[]>> {
  const { limit = 6, agentIds } = options;
  
  let filtered = memoryStore;
  if (agentIds && agentIds.length > 0) {
    filtered = memoryStore.filter(m => agentIds.includes(m.agentId));
  }
  
  // Group by agentId
  const grouped: Record<string, MemoryEntry[]> = {};
  
  for (const entry of filtered) {
    if (!grouped[entry.agentId]) {
      grouped[entry.agentId] = [];
    }
    grouped[entry.agentId].push(entry);
  }
  
  // Sort by timestamp desc and limit
  for (const agentId in grouped) {
    grouped[agentId] = grouped[agentId]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  return grouped;
}

export async function getMemoryById(id: string): Promise<MemoryEntry | null> {
  return memoryStore.find(m => m.id === id) || null;
}

export async function queryMemories(query: {
  agentId?: string;
  limit?: number;
  fromDate?: Date;
}): Promise<MemoryEntry[]> {
  let results = memoryStore;
  
  if (query.agentId) {
    results = results.filter(m => m.agentId === query.agentId);
  }
  
  if (query.fromDate) {
    results = results.filter(m => m.timestamp >= query.fromDate);
  }
  
  results = results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  if (query.limit) {
    results = results.slice(0, query.limit);
  }
  
  return results;
}

export async function clearMemories(agentId?: string): Promise<number> {
  const beforeCount = memoryStore.length;
  
  if (agentId) {
    memoryStore = memoryStore.filter(m => m.agentId !== agentId);
  } else {
    memoryStore = [];
  }
  
  return beforeCount - memoryStore.length;
}
