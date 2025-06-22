
// Comprehensive type definitions for Karol-Core Platform
export interface MemoryEntry {
  id: string;
  agentId: string;
  content: string;
  context: string;
  importance: 1 | 2 | 3 | 4 | 5;
  memoryType: 'episodic' | 'semantic' | 'procedural' | 'emotional' | 'session' | 'permanent';
  triggerRules: string[];
  timestamp: Date;
  associatedMemories?: string[];
  emotionalWeight?: number;
  compressionLevel?: number;
}

export interface BeliefSystem {
  id: string;
  belief: string;
  confidence: number;
  evidence: EvidenceEntry[];
  lastUpdated: Date;
  source: 'experience' | 'learning' | 'social' | 'inference';
  conflictsWith?: string[];
  temporalDecay: number;
}

export interface EvidenceEntry {
  id: string;
  type: 'observation' | 'testimony' | 'inference' | 'authority';
  strength: number;
  timestamp: Date;
  source: string;
}

export interface NarrativeArc {
  id: string;
  agentId: string;
  storyElements: StoryElement[];
  coherenceScore: number;
  emotionalTone: number;
  timespan: { start: Date; end?: Date };
  branches: string[];
}

export interface StoryElement {
  type: 'event' | 'character' | 'conflict' | 'resolution';
  content: string;
  emotionalImpact: number;
  importance: number;
  connections: string[];
}

export interface DecisionCriteria {
  id: string;
  name: string;
  weight: number;
  type: 'benefit' | 'cost' | 'risk' | 'time';
  measurable: boolean;
  alternatives: Alternative[];
}

export interface Alternative {
  id: string;
  name: string;
  scores: Record<string, number>;
  riskProfile: RiskProfile;
  timeProfile: TimeProfile;
}

export interface RiskProfile {
  probability: number;
  impact: number;
  mitigation: string[];
  contingency: string[];
}

export interface TimeProfile {
  duration: number;
  urgency: number;
  deadline?: Date;
  dependencies: string[];
}

export interface AgentCapability {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  domain: string;
  prerequisites: string[];
  performance: number;
}

export interface SystemEvent {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
  data: any;
  correlationId?: string;
  causedBy?: string[];
  effects?: string[];
}

export interface QuantumState<T> {
  superposition: Array<{ state: T; probability: number; coherence: number }>;
  collapsed: boolean;
  finalState?: T;
  entangled: string[];
}

export interface PredictionModel {
  id: string;
  type: 'timeseries' | 'classification' | 'regression' | 'anomaly';
  accuracy: number;
  lastTrained: Date;
  features: string[];
  predictions: Prediction[];
}

export interface Prediction {
  timestamp: Date;
  value: any;
  confidence: number;
  horizon: number;
  factors: Record<string, number>;
}
