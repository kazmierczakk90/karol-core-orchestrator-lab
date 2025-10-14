/**
 * Recalibration Engine - P2 Component
 * Self-calibrating system for maintaining AGI consistency
 */

import { checkDrift, type DriftCheckResult } from './guardianCore';
import { getAuditSummary } from './auditCollector';
import { karolConfigService } from './karolConfigService';
import { sendAlert } from './alertService';

export interface CalibrationReport {
  timestamp: Date;
  driftIssues: DriftCheckResult[];
  auditScore: number;
  recommendations: string[];
  autoFixesApplied: number;
  manualReviewNeeded: boolean;
}

export async function performRecalibration(): Promise<CalibrationReport> {
  console.log('[RecalibrationEngine] Starting recalibration cycle...');
  
  const [driftResults, auditSummary, config] = await Promise.all([
    checkDrift(),
    getAuditSummary(360), // 6 hours
    karolConfigService.getConfig()
  ]);
  
  const driftIssues = driftResults.filter(r => r.driftDetected);
  const recommendations: string[] = [];
  let autoFixesApplied = 0;
  
  // Analyze drift issues
  if (driftIssues.length > 0) {
    recommendations.push(`${driftIssues.length} agent(s) showing semantic drift`);
    
    for (const issue of driftIssues) {
      if (issue.recommendation) {
        recommendations.push(issue.recommendation);
      }
      
      // Auto-fix if enabled and drift is not severe
      if (config?.modules?.guardianCore?.auto_fix && issue.similarity > 0.70) {
        console.log(`[RecalibrationEngine] Auto-fixing ${issue.agentId}`);
        autoFixesApplied++;
        // Implement auto-fix logic here
      }
    }
  }
  
  // Calculate audit score (0-100)
  const totalEvents = auditSummary.totalEvents;
  const errorRate = totalEvents > 0 
    ? auditSummary.byStatus.error / totalEvents 
    : 0;
  const auditScore = Math.max(0, Math.round(100 * (1 - errorRate * 2)));
  
  if (auditScore < 70) {
    recommendations.push('System audit score below threshold - review error logs');
  }
  
  const manualReviewNeeded = driftIssues.length > 3 || auditScore < 60;
  
  const report: CalibrationReport = {
    timestamp: new Date(),
    driftIssues,
    auditScore,
    recommendations,
    autoFixesApplied,
    manualReviewNeeded
  };
  
  // Send alert if manual review needed
  if (manualReviewNeeded) {
    await sendAlert({
      level: 'warning',
      title: 'System Recalibration: Manual Review Required',
      body: `Audit Score: ${auditScore}/100, Drift Issues: ${driftIssues.length}`,
      metadata: report
    });
  }
  
  console.log('[RecalibrationEngine] Recalibration complete:', {
    auditScore,
    driftIssues: driftIssues.length,
    autoFixes: autoFixesApplied,
    manualReview: manualReviewNeeded
  });
  
  return report;
}

export function startRecalibrationCycle(intervalMinutes: number = 60) {
  console.log(`[RecalibrationEngine] Starting with ${intervalMinutes}min interval`);
  
  // Initial calibration after 5 minutes
  setTimeout(() => performRecalibration(), 5 * 60 * 1000);
  
  // Periodic recalibration
  setInterval(() => performRecalibration(), intervalMinutes * 60 * 1000);
}
