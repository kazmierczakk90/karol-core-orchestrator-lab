/**
 * P0 Initializer - Start all P0 protective systems + AGI 10.0 modules
 * Called on app initialization
 */

import { startGuardianCore } from './guardianCore';
import { startIntentAttribution } from './intentAttributionService';
import { coreSyncOrchestrator } from './core/coreSyncOrchestrator';
import { metaUIController } from './ui/metaUIController';
import { agiAutonomyEngine } from './autonomy/agiAutonomyEngine';
import { startRecalibrationCycle } from './recalibrationEngine';
import { initializeAllBridges } from './integrations/index';
import { eventBus } from './eventBus';
import { centralStateManager } from './core/centralStateManager';

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
  
  // P1-P2 initialization
  console.log('📊 [P1-P2] Initializing Operational Intelligence & Self-Calibration...');
  
  try {
    // Start Recalibration Cycle (P2)
    startRecalibrationCycle(60); // Every 60 minutes
    console.log('✅ [P2] Recalibration Engine started (60min cycle)');
    
    console.log('🛡️ [P1-P2] Operational & Self-Calibration layers active');
  } catch (error) {
    console.error('❌ [P1-P2] Initialization failed:', error);
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
  
  // Initialize Event Bus and Integration Bridges
  console.log('🌉 [EventBus] Initializing cross-layer communication...');
  
  try {
    eventBus.setDebugMode(import.meta.env.DEV);
    console.log('✅ [EventBus] Event bus initialized');
    
    // Initialize all integration bridges (P0↔P2, P3↔Core, etc.)
    initializeAllBridges();
    console.log('✅ [Bridges] All integration bridges active');
    
    // Emit system ready event
    // Initialize Central State Manager (Unified State)
    centralStateManager.markInitialized();
    console.log('✅ [StateManager] Central State Manager initialized');
    
    eventBus.emitSync('system_ready', {
      timestamp: new Date(),
      source: 'p0_initializer',
      metadata: {
        layers: ['P0', 'P1', 'P2', 'P3', 'AGI-10.0'],
        bridges: ['guardian↔recalibration', 'influence↔loadbalancer', 'style↔memory'],
        stateManagement: 'unified'
      }
    });
    
    console.log('🎉 [System] Karol-Core AGI fully initialized and operational!');
    console.log('📊 System Analytics:', centralStateManager.getAnalytics());
  } catch (error) {
    console.error('❌ [EventBus] Initialization failed:', error);
  }
}
