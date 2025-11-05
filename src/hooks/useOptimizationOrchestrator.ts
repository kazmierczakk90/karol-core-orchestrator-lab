import { useState, useCallback, useEffect } from 'react';
import { optimizationOrchestratorService, type OptimizationTask, type OptimizationResult } from '@/services/optimizationOrchestratorService';
import { toast } from 'sonner';

export const useOptimizationOrchestrator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [tasks, setTasks] = useState<OptimizationTask[]>([]);
  const [statistics, setStatistics] = useState<any>(null);

  const createTask = useCallback(async (
    taskType: string,
    targetComponent: string,
    currentMetrics: any,
    targetMetrics: any,
    priority: number = 5
  ) => {
    setIsCreating(true);
    try {
      const result = await optimizationOrchestratorService.createOptimizationTask(
        taskType,
        targetComponent,
        currentMetrics,
        targetMetrics,
        priority
      );

      if (result) {
        toast.success(`Optimization task created: ${result.strategy} (${result.improvementPercentage}% improvement expected)`);
        await loadTasks();
        return result;
      } else {
        toast.error('Failed to create optimization task');
        return null;
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create optimization task');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const loadTasks = useCallback(async (filters?: {
    status?: string;
    priority?: number;
    limit?: number;
  }) => {
    try {
      const data = await optimizationOrchestratorService.getTasks(filters);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load optimization tasks');
    }
  }, []);

  const loadStatistics = useCallback(async () => {
    try {
      const stats = await optimizationOrchestratorService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  }, []);

  const updateStatus = useCallback(async (taskId: string, status: string, updates?: any) => {
    try {
      const success = await optimizationOrchestratorService.updateTaskStatus(taskId, status, updates);
      if (success) {
        toast.success(`Task status updated to: ${status}`);
        await loadTasks();
      } else {
        toast.error('Failed to update task status');
      }
      return success;
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update task status');
      return false;
    }
  }, [loadTasks]);

  useEffect(() => {
    loadTasks();
    loadStatistics();
  }, [loadTasks, loadStatistics]);

  return {
    isCreating,
    tasks,
    statistics,
    createTask,
    loadTasks,
    loadStatistics,
    updateStatus,
  };
};
