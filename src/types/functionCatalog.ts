
export interface SystemFunction {
  id: string;
  name: string;
  description: string;
  level: 'decyzyjny' | 'pamięć' | 'agenci' | 'meta' | 'routing' | 'introspekcja' | 'monitoring' | 'logi' | 'bezpieczeństwo' | 'dev-tools' | 'optymalizacja' | 'ui' | 'integracje' | 'zaawansowane' | 'pomocnicze';
  status: 'aktywna' | 'częściowa' | 'wyłączona' | 'testowa';
  category: string;
  tags: string[];
  component?: string;
  usageCount: number;
  lastUsed?: Date;
  performance: number;
  dependencies: string[];
  version: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface FunctionMetrics {
  totalFunctions: number;
  activeFunctions: number;
  criticalFunctions: number;
  averagePerformance: number;
  recentUsage: number;
  errorRate: number;
}

export interface OrchestrationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  enabled: boolean;
}
