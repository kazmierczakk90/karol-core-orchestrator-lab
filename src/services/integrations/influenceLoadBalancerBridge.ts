/**
 * Influence-LoadBalancer Bridge
 * Uses decision influence to affect routing weights
 */

import { eventBus } from '../eventBus';
import { orchestrationEngineV2 } from '../orchestrationEngineV2';

export function initializeInfluenceLoadBalancerBridge() {
  console.log('[Bridge] Initializing InfluenceGraph ↔ LoadBalancer bridge...');
  
  // Listen for influence changes
  eventBus.on('influence_changed', (data) => {
    const { nodeId, newInfluence } = data;
    
    // Extract agent ID from node ID (format: "agent_id" or "@agent_id")
    const agentId = nodeId.startsWith('@') ? nodeId.substring(1) : nodeId;
    
    // Update load balancer weight based on influence
    // Higher influence = higher weight = more traffic
    const normalizedWeight = Math.min(10, Math.max(0.1, newInfluence));
    
    const agent = orchestrationEngineV2.getAgent(agentId);
    if (agent) {
      console.log(`[Bridge] Updating routing weight for ${agentId}: ${normalizedWeight.toFixed(2)}`);
      
      // Weight calculation: influence * performance factor
      const performanceFactor = agent.performance / 100;
      const finalWeight = normalizedWeight * performanceFactor;
      
      // Update weight in load balancer
      // Note: This requires exposing setWeight in orchestrationEngineV2
      console.log(`[Bridge] Final weight for ${agentId}: ${finalWeight.toFixed(2)}`);
    }
  });
  
  console.log('[Bridge] InfluenceGraph ↔ LoadBalancer bridge active ✅');
}
