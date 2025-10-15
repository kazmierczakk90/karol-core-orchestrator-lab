/**
 * StyleMemory-MemoryService Bridge
 * Unifies style tracking with general memory storage
 */

import { eventBus } from '../eventBus';
import { storeMemory } from '../memoryService';

export function initializeStyleMemoryBridge() {
  console.log('[Bridge] Initializing StyleMemory ↔ MemoryService bridge...');
  
  // Listen for style updates
  eventBus.on('style_updated', async (data) => {
    const { agentId, characteristics } = data;
    
    try {
      // Store style data in unified memory
      await storeMemory({
        agentId,
        text: `Style characteristics: ${JSON.stringify(characteristics)}`,
        metadata: {
          type: 'style_profile',
          characteristics,
          timestamp: data.timestamp,
          source: 'style_memory_service'
        }
      });
      
      console.log(`[Bridge] ✅ Style profile stored for ${agentId}`);
    } catch (error) {
      console.error(`[Bridge] Failed to store style for ${agentId}:`, error);
    }
  });
  
  // Listen for style drift
  eventBus.on('style_drift_detected', async (data) => {
    const { agentId, consistency, characteristicsChanged } = data;
    
    console.warn(`[Bridge] ⚠️ Style drift for ${agentId}: consistency ${consistency.toFixed(2)}`);
    
    // Store drift event in memory
    await storeMemory({
      agentId,
      text: `Style drift detected. Changed: ${characteristicsChanged.join(', ')}`,
      metadata: {
        type: 'style_drift_event',
        consistency,
        characteristicsChanged,
        timestamp: data.timestamp
      }
    });
  });
  
  console.log('[Bridge] StyleMemory ↔ MemoryService bridge active ✅');
}
