/**
 * Influence Graph Service - P3 Component
 * Tracks decision influence and agent interactions
 */

export interface InfluenceNode {
  id: string;
  type: 'agent' | 'decision' | 'prompt' | 'action';
  label: string;
  weight: number;
  metadata?: Record<string, any>;
}

export interface InfluenceEdge {
  source: string;
  target: string;
  strength: number;
  type: 'triggers' | 'influences' | 'depends_on' | 'produces';
}

export interface InfluenceGraph {
  nodes: InfluenceNode[];
  edges: InfluenceEdge[];
  timestamp: Date;
}

const nodes: Map<string, InfluenceNode> = new Map();
const edges: InfluenceEdge[] = [];

export function addNode(node: InfluenceNode): void {
  nodes.set(node.id, node);
  console.log(`[InfluenceGraph] Node added: ${node.id} (${node.type})`);
}

export function addEdge(edge: InfluenceEdge): void {
  edges.push(edge);
  console.log(`[InfluenceGraph] Edge added: ${edge.source} → ${edge.target}`);
}

export function recordInfluence(
  sourceId: string,
  targetId: string,
  type: InfluenceEdge['type'],
  strength: number = 1.0
): void {
  addEdge({
    source: sourceId,
    target: targetId,
    type,
    strength: Math.min(1.0, Math.max(0.0, strength))
  });
}

export function getInfluenceGraph(): InfluenceGraph {
  return {
    nodes: Array.from(nodes.values()),
    edges: [...edges],
    timestamp: new Date()
  };
}

export function getNodeInfluence(nodeId: string): {
  incoming: InfluenceEdge[];
  outgoing: InfluenceEdge[];
  totalInfluence: number;
} {
  const incoming = edges.filter(e => e.target === nodeId);
  const outgoing = edges.filter(e => e.source === nodeId);
  
  const totalInfluence = 
    incoming.reduce((sum, e) => sum + e.strength, 0) +
    outgoing.reduce((sum, e) => sum + e.strength, 0);
  
  return {
    incoming,
    outgoing,
    totalInfluence: Math.round(totalInfluence * 100) / 100
  };
}

export function getMostInfluentialNodes(limit: number = 10): InfluenceNode[] {
  const nodeInfluences = Array.from(nodes.values()).map(node => ({
    node,
    influence: getNodeInfluence(node.id).totalInfluence
  }));
  
  return nodeInfluences
    .sort((a, b) => b.influence - a.influence)
    .slice(0, limit)
    .map(item => item.node);
}

export function clearGraph(): void {
  nodes.clear();
  edges.length = 0;
  console.log('[InfluenceGraph] Graph cleared');
}

// Initialize default system nodes
export function initializeSystemNodes(): void {
  addNode({ id: '@router', type: 'agent', label: 'Router Agent', weight: 1.0 });
  addNode({ id: '@guardian-core', type: 'agent', label: 'Guardian Core', weight: 0.95 });
  addNode({ id: '@voice-core', type: 'agent', label: 'Voice Core', weight: 0.85 });
  addNode({ id: '@meta-reflex', type: 'agent', label: 'Reflex Engine', weight: 0.80 });
  addNode({ id: '@state-keeper', type: 'agent', label: 'State Keeper', weight: 0.90 });
}

initializeSystemNodes();
