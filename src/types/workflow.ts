
export interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'delay' | 'parallel';
  title: string;
  description: string;
  agentId?: string;
  condition?: string;
  delayMinutes?: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  category: string;
}
