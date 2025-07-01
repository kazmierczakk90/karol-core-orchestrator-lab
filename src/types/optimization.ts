
export interface AutoOptimization {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'memory' | 'security' | 'ui' | 'ai';
  enabled: boolean;
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastRun?: Date;
  nextRun?: Date;
  impact: 'low' | 'medium' | 'high';
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  success_rate: number;
}

export interface OptimizationArea {
  id: string;
  name: string;
  score: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime: number;
  actualTime?: number;
  improvements: string[];
  issues: string[];
}
