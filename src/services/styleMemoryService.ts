/**
 * Style Memory Service - P3 Component
 * Maintains style consistency across agent responses
 */

export interface StyleProfile {
  agentId: string;
  characteristics: {
    tone: 'formal' | 'casual' | 'technical' | 'creative';
    verbosity: number; // 0-1
    complexity: number; // 0-1
    emoji_usage: number; // 0-1
  };
  patterns: string[];
  examples: string[];
  consistency_score: number;
  last_updated: Date;
}

const styleProfiles: Map<string, StyleProfile> = new Map();

export function recordStyleSample(agentId: string, text: string): void {
  let profile = styleProfiles.get(agentId);
  
  if (!profile) {
    profile = {
      agentId,
      characteristics: {
        tone: 'technical',
        verbosity: 0.5,
        complexity: 0.5,
        emoji_usage: 0.0
      },
      patterns: [],
      examples: [],
      consistency_score: 1.0,
      last_updated: new Date()
    };
    styleProfiles.set(agentId, profile);
  }
  
  // Analyze text characteristics
  const wordCount = text.split(/\s+/).length;
  const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}]/gu) || []).length;
  const avgWordLength = text.split(/\s+/).reduce((sum, w) => sum + w.length, 0) / wordCount;
  
  // Update profile
  profile.characteristics.verbosity = Math.min(1, wordCount / 100);
  profile.characteristics.complexity = Math.min(1, avgWordLength / 8);
  profile.characteristics.emoji_usage = Math.min(1, emojiCount / 5);
  
  profile.examples.push(text.substring(0, 200));
  if (profile.examples.length > 10) {
    profile.examples = profile.examples.slice(-10);
  }
  
  profile.last_updated = new Date();
  
  console.log(`[StyleMemory] Updated profile for ${agentId}`);
}

export function getStyleProfile(agentId: string): StyleProfile | null {
  return styleProfiles.get(agentId) || null;
}

export function getAllStyleProfiles(): StyleProfile[] {
  return Array.from(styleProfiles.values());
}

export function calculateStyleConsistency(agentId: string): number {
  const profile = styleProfiles.get(agentId);
  if (!profile || profile.examples.length < 3) {
    return 1.0;
  }
  
  // Simple consistency check based on characteristic variance
  const examples = profile.examples;
  const verbosities = examples.map(e => e.split(/\s+/).length / 100);
  const variance = calculateVariance(verbosities);
  
  // Lower variance = higher consistency
  const consistencyScore = Math.max(0, 1 - variance * 2);
  
  profile.consistency_score = Math.round(consistencyScore * 100) / 100;
  return profile.consistency_score;
}

function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

export function getSystemStyleCoherence(): number {
  const profiles = getAllStyleProfiles();
  if (profiles.length === 0) return 1.0;
  
  const scores = profiles.map(p => calculateStyleConsistency(p.agentId));
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  return Math.round(avgScore * 100) / 100;
}

// Initialize default style profiles
export function initializeDefaultProfiles(): void {
  const defaultAgents = [
    { id: '@router', tone: 'technical' as const },
    { id: '@guardian-core', tone: 'formal' as const },
    { id: '@voice-core', tone: 'creative' as const },
    { id: '@meta-reflex', tone: 'technical' as const }
  ];
  
  for (const agent of defaultAgents) {
    if (!styleProfiles.has(agent.id)) {
      styleProfiles.set(agent.id, {
        agentId: agent.id,
        characteristics: {
          tone: agent.tone,
          verbosity: 0.5,
          complexity: 0.5,
          emoji_usage: 0.0
        },
        patterns: [],
        examples: [],
        consistency_score: 1.0,
        last_updated: new Date()
      });
    }
  }
}

initializeDefaultProfiles();
