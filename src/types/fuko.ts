
// FUKO-PZK Decision System Types
export interface FUKOMessage {
  id: string;
  timestamp: Date;
  
  // FUKO-PZK Structure
  F: string; // Funkcja - what the agent should execute
  U: string; // Uzasadnienie - why it's doing this
  K: string; // Kontekst - operating conditions
  O: string; // Oczekiwany efekt - expected outcome
  P: string; // Próg aktywacji - activation trigger
  Z: string; // Zależność - dependencies
  K2: string; // Komenda - system command or call expression
  
  // Metadata
  sourceAgent: string;
  targetAgent?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  executionResult?: string;
}

export interface Agent {
  id: string;
  name: string;
  category: 'core' | 'project' | 'service' | 'fuko' | 'system';
  status: 'active' | 'dormant' | 'monitoring';
  mode: 'CEO' | 'ECHO' | 'CREATIVE' | 'LIVE' | 'MENTOR';
  performance: number;
  lastUpdate: string;
  capabilities: string[];
  dependencies: string[];
  competencyScore: number;
}

export interface DecisionRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
  isActive: boolean;
}

export interface KPIData {
  [key: string]: {
    value: number;
    threshold: number;
    trend: 'up' | 'down' | 'stable';
    lastUpdate: Date;
  };
}
