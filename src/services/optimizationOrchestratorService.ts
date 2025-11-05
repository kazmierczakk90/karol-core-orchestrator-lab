import { supabase } from '@/integrations/supabase/client';

export interface OptimizationTask {
  id: string;
  task_type: string;
  target_component: string;
  status: string;
  priority: number;
  improvement_percentage?: number;
  estimated_impact?: string;
  analysis_result?: any;
  created_at: string;
}

export interface OptimizationResult {
  taskId: string;
  strategy: string;
  improvementPercentage: number;
  estimatedImpact: string;
  steps: string[];
  risks: string[];
  testingRequirements: string[];
}

class OptimizationOrchestratorService {
  /**
   * Create and analyze an optimization task
   */
  async createOptimizationTask(
    taskType: string,
    targetComponent: string,
    currentMetrics: any,
    targetMetrics: any,
    priority: number = 5
  ): Promise<OptimizationResult | null> {
    try {
      console.log('[OptimizationOrchestrator] Creating task:', taskType, targetComponent);

      const { data, error } = await supabase.functions.invoke('optimization-orchestrator', {
        body: {
          taskType,
          targetComponent,
          currentMetrics,
          targetMetrics,
          priority,
        },
      });

      if (error) throw error;

      if (data.success) {
        return {
          taskId: data.task.id,
          strategy: data.task.strategy,
          improvementPercentage: data.task.improvementPercentage,
          estimatedImpact: data.task.estimatedImpact,
          steps: data.task.steps,
          risks: data.task.risks,
          testingRequirements: data.task.testingRequirements,
        };
      }

      return null;
    } catch (error) {
      console.error('[OptimizationOrchestrator] Create task error:', error);
      throw error;
    }
  }

  /**
   * Get optimization task details
   */
  async getTask(taskId: string): Promise<OptimizationTask | null> {
    try {
      const { data, error } = await supabase
        .from('optimization_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return data as OptimizationTask;
    } catch (error) {
      console.error('[OptimizationOrchestrator] Get task error:', error);
      return null;
    }
  }

  /**
   * Get all optimization tasks
   */
  async getTasks(filters?: {
    status?: string;
    priority?: number;
    limit?: number;
  }): Promise<OptimizationTask[]> {
    try {
      let query = supabase
        .from('optimization_tasks')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.priority) {
        query = query.gte('priority', filters.priority);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as OptimizationTask[];
    } catch (error) {
      console.error('[OptimizationOrchestrator] Get tasks error:', error);
      return [];
    }
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId: string, status: string, updates?: any) {
    try {
      const updateData: any = { status };

      if (status === 'testing' && !updates?.started_at) {
        updateData.started_at = new Date().toISOString();
      }

      if (status === 'completed' || status === 'failed') {
        updateData.completed_at = new Date().toISOString();
      }

      if (updates) {
        Object.assign(updateData, updates);
      }

      const { error } = await supabase
        .from('optimization_tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('[OptimizationOrchestrator] Update status error:', error);
      return false;
    }
  }

  /**
   * Get optimization statistics
   */
  async getStatistics() {
    try {
      const { data, error } = await supabase
        .from('optimization_tasks')
        .select('status, estimated_impact, improvement_percentage');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        pending: data?.filter(t => t.status === 'pending').length || 0,
        analyzing: data?.filter(t => t.status === 'analyzing').length || 0,
        testing: data?.filter(t => t.status === 'testing').length || 0,
        completed: data?.filter(t => t.status === 'completed').length || 0,
        failed: data?.filter(t => t.status === 'failed').length || 0,
        avgImprovement: data?.reduce((sum, t) => sum + (t.improvement_percentage || 0), 0) / (data?.length || 1),
        highImpact: data?.filter(t => t.estimated_impact === 'high' || t.estimated_impact === 'critical').length || 0,
      };

      return stats;
    } catch (error) {
      console.error('[OptimizationOrchestrator] Get statistics error:', error);
      return null;
    }
  }
}

export const optimizationOrchestratorService = new OptimizationOrchestratorService();
