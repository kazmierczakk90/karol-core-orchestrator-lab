/**
 * GuardianCore - Semantic drift detection and style consistency monitoring
 * P0 Component - Critical for AGI integrity
 */

import { getRecentResponses } from './memoryService';
import { getEmbedding, cosineSimilarity, meanVector } from './embeddingService';
import { karolConfigService } from './karolConfigService';
import { sendAlert } from './alertService';

export interface DriftCheckResult {
  agentId: string;
  similarity: number;
  driftDetected: boolean;
  threshold: number;
  timestamp: Date;
  recommendation?: string;
}

let lastCheckTime: Date | null = null;

export async function checkDrift(): Promise<DriftCheckResult[]> {
  const config = await karolConfigService.getConfig();
  const guardianConfig = config?.modules?.guardianCore;
  
  if (!guardianConfig?.enabled) {
    console.log('[GuardianCore] Disabled in config');
    return [];
  }
  
  const threshold = guardianConfig.drift_threshold || 0.78;
  const results: DriftCheckResult[] = [];
  
  try {
    // Get last 6 responses per agent
    const agentResponses = await getRecentResponses({ limit: 6 });
    
    for (const agentId of Object.keys(agentResponses)) {
      const responses = agentResponses[agentId];
      
      if (responses.length < 4) {
        console.log(`[GuardianCore] Insufficient data for ${agentId}`);
        continue;
      }
      
      // Get embeddings for all responses
      const embeddings = await Promise.all(
        responses.map(r => getEmbedding(r.text))
      );
      
      // Compare recent (last 2) vs previous (2 before that)
      const recentMean = meanVector([embeddings[0], embeddings[1]]);
      const previousMean = meanVector([embeddings[2], embeddings[3]]);
      
      const similarity = cosineSimilarity(recentMean, previousMean);
      const driftDetected = similarity < threshold;
      
      const result: DriftCheckResult = {
        agentId,
        similarity: Math.round(similarity * 1000) / 1000,
        driftDetected,
        threshold,
        timestamp: new Date(),
        recommendation: driftDetected 
          ? `Review recent prompts and outputs for ${agentId}. Consider style recalibration.`
          : undefined
      };
      
      results.push(result);
      
      if (driftDetected) {
        await sendAlert({
          level: 'warning',
          title: `Semantic drift detected: ${agentId}`,
          body: `Similarity ${similarity.toFixed(3)} is below threshold ${threshold}. Agent style may be inconsistent.`,
          agentId,
          metadata: { similarity, threshold, responses: responses.length }
        });
        
        console.warn(`[GuardianCore] 🚨 DRIFT: ${agentId} - similarity: ${similarity.toFixed(3)}`);
      } else {
        console.log(`[GuardianCore] ✅ OK: ${agentId} - similarity: ${similarity.toFixed(3)}`);
      }
    }
    
    lastCheckTime = new Date();
    
  } catch (error) {
    console.error('[GuardianCore] Check failed:', error);
    await sendAlert({
      level: 'error',
      title: 'GuardianCore check failed',
      body: `Error during drift detection: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
  
  return results;
}

export function getLastCheckTime(): Date | null {
  return lastCheckTime;
}

export async function performManualCheck(agentId?: string): Promise<DriftCheckResult[]> {
  console.log(`[GuardianCore] Manual check initiated${agentId ? ` for ${agentId}` : ''}`);
  return checkDrift();
}

// Start periodic checking if enabled
export function startGuardianCore() {
  karolConfigService.getConfig().then(config => {
    const guardianConfig = config?.modules?.guardianCore;
    
    if (guardianConfig?.enabled) {
      const intervalMinutes = guardianConfig.check_interval_minutes || 15;
      const intervalMs = intervalMinutes * 60 * 1000;
      
      console.log(`[GuardianCore] Starting with ${intervalMinutes}min interval`);
      
      // Initial check after 30 seconds
      setTimeout(() => checkDrift(), 30000);
      
      // Periodic checks
      setInterval(() => checkDrift(), intervalMs);
    }
  });
}
