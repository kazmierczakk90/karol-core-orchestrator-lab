/**
 * P0 Initializer - Start all P0 protective systems + AGI 10.0 modules
 * Called on app initialization
 */

import { startGuardianCore } from './guardianCore';
import { startIntentAttribution } from './intentAttributionService';
import { coreSyncOrchestrator } from './core/coreSyncOrchestrator';
import { metaUIController } from './ui/metaUIController';
import { agiAutonomyEngine } from './autonomy/agiAutonomyEngine';

export function initializeP0Systems() {
  console.log('🛡️ [P0] Initializing protective systems...');
  
  try {
    // Start GuardianCore drift monitoring
    startGuardianCore();
    console.log('✅ [P0] GuardianCore initialized');
    
    // Start Intent Attribution Layer
    startIntentAttribution();
    console.log('✅ [P0] Intent Attribution Layer initialized');
    
    console.log('🛡️ [P0] All protective systems online');
  } catch (error) {
    console.error('❌ [P0] Initialization failed:', error);
  }
  
  // AGI 10.0 initialization
  console.log('🚀 [AGI 10.0] Initializing Karol-Core AGI Orchestration...');
  
  try {
    // Start Core Sync Orchestrator (core_sync.lov)
    coreSyncOrchestrator.start();
    console.log('✅ [AGI 10.0] Core Sync Orchestrator started');
    
    // Initialize Meta UI Controller (meta_ui.lov)
    metaUIController.initialize();
    console.log('✅ [AGI 10.0] Meta UI Controller initialized');
    
    // Start AGI Autonomy Engine (agi_autonomy.lov)
    agiAutonomyEngine.start();
    console.log('✅ [AGI 10.0] AGI Autonomy Engine started');
    
    console.log('🎯 [AGI 10.0] Karol-Core AGI-Orchestration Live activated');
    console.log('📡 Adaptacyjne podejmowanie decyzji ✓');
    console.log('🧠 Pamięć kontekstowa ✓');
    console.log('⚡ Dynamiczna reakcja agentów ✓');
  } catch (error) {
    console.error('❌ [AGI 10.0] Initialization failed:', error);
  }
}
