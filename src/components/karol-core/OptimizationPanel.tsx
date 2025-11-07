import { useOptimizationOrchestrator } from "@/hooks/useOptimizationOrchestrator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Zap } from "lucide-react";
import { useEffect } from "react";

export function OptimizationPanel() {
  const { tasks, statistics, isCreating, loadTasks, loadStatistics } = useOptimizationOrchestrator();

  useEffect(() => {
    loadTasks();
    loadStatistics();
  }, []);

  if (isCreating) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const stats = statistics || { pending: 0, running: 0, completed: 0 };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold">{stats.pending || 0}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Running</p>
          <p className="text-2xl font-bold">{stats.running || 0}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold">{stats.completed || 0}</p>
        </Card>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Zadania Optymalizacyjne ({tasks.length})
        </h3>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brak zadań</p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {tasks.map((task) => (
              <Card key={task.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.task_type}</p>
                      <p className="text-xs text-muted-foreground">{task.target_component}</p>
                    </div>
                    <Badge variant={
                      task.status === 'completed' ? 'default' :
                      task.status === 'running' ? 'secondary' : 'outline'
                    }>
                      {task.status}
                    </Badge>
                  </div>
                  {task.status === 'running' && (
                    <Progress value={50} className="h-1" />
                  )}
                  {task.improvement_percentage && (
                    <p className="text-xs text-green-600">
                      +{task.improvement_percentage}% improvement
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
