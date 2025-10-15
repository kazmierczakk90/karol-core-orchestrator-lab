/**
 * Integration Bridges Index
 * Initializes all cross-layer connections
 */

import { initializeGuardianRecalibrationBridge } from './guardianRecalibrationBridge';
import { initializeInfluenceLoadBalancerBridge } from './influenceLoadBalancerBridge';
import { initializeStyleMemoryBridge } from './styleMemoryBridge';

export function initializeAllBridges() {
  console.log('🌉 [Bridges] Initializing all integration bridges...');
  
  try {
    // P0 ↔ P2: Drift detection → Recalibration
    initializeGuardianRecalibrationBridge();
    
    // P3 ↔ Core: Influence → Load balancing
    initializeInfluenceLoadBalancerBridge();
    
    // P3 ↔ P0: Style → Memory
    initializeStyleMemoryBridge();
    
    console.log('🌉 [Bridges] All integration bridges active ✅');
    console.log('📡 Cross-layer communication enabled:');
    console.log('   • GuardianCore ↔ RecalibrationEngine');
    console.log('   • InfluenceGraph ↔ LoadBalancer');
    console.log('   • StyleMemory ↔ MemoryService');
  } catch (error) {
    console.error('❌ [Bridges] Initialization failed:', error);
  }
}
