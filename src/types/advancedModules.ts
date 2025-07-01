
export interface AdvancedModule {
  id: string;
  name: string;
  description: string;
  functionalArea: 'decyzyjny' | 'meta' | 'pamięć' | 'introspekcja' | 'routing' | 'eksperymentalny' | 'optymalizacja';
  status: 'beta' | 'eksperymentalny' | 'produkcyjny' | 'wyłączony';
  priority: 'pilne' | 'przydatne' | 'rozwojowe';
  integrationPoint: string;
  compatibility: string[];
  potentialGain: string;
  risk: 'niskie' | 'średnie' | 'wysokie';
  version: string;
  enabled: boolean;
  performanceMetrics: {
    executionTime: number;
    memoryUsage: number;
    successRate: number;
    errorCount: number;
  };
  dependencies: string[];
  safetyLayer: {
    isolation: boolean;
    rollbackEnabled: boolean;
    monitoringActive: boolean;
  };
}

export interface ModuleExecutionContext {
  moduleId: string;
  timestamp: Date;
  inputData: any;
  outputData?: any;
  executionTime: number;
  status: 'success' | 'error' | 'timeout';
  errorMessage?: string;
}

export interface SafetyProtocol {
  maxExecutionTime: number;
  memoryLimit: number;
  rollbackTriggers: string[];
  isolationLevel: 'strict' | 'moderate' | 'minimal';
}
