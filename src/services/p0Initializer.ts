/**
 * P0 Initializer - Start all P0 protective systems
 * Called on app initialization
 */

import { startGuardianCore } from './guardianCore';
import { startIntentAttribution } from './intentAttributionService';

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
}
