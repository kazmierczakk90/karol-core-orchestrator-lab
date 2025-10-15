/**
 * Guardian-Recalibration Bridge
 * Connects P0 drift detection with P2 auto-calibration
 */

import { eventBus } from '../eventBus';
import { performRecalibration } from '../recalibrationEngine';

export function initializeGuardianRecalibrationBridge() {
  console.log('[Bridge] Initializing GuardianCore ↔ RecalibrationEngine bridge...');
  
  // Listen for drift detection events
  eventBus.on('drift_detected', async (data) => {
    console.log(`[Bridge] Drift detected for agent ${data.agentId}, triggering recalibration...`);
    
    try {
      // Trigger recalibration for the specific agent
      const report = await performRecalibration();
      
      // Check if this agent was fixed
      const agentIssue = report.driftIssues.find(issue => issue.agentId === data.agentId);
      
      if (agentIssue && !agentIssue.driftDetected) {
        console.log(`[Bridge] ✅ Agent ${data.agentId} recalibrated successfully`);
        eventBus.emitSync('calibration_completed', {
          timestamp: new Date(),
          source: 'guardian_recalibration_bridge',
          agentId: data.agentId,
          beforeScore: data.similarity,
          afterScore: agentIssue.similarity
        });
      } else {
        console.warn(`[Bridge] ⚠️ Agent ${data.agentId} still showing drift after recalibration`);
      }
    } catch (error) {
      console.error(`[Bridge] Recalibration failed for ${data.agentId}:`, error);
    }
  });
  
  console.log('[Bridge] GuardianCore ↔ RecalibrationEngine bridge active ✅');
}
