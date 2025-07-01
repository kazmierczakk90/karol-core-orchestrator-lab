
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Network, Play, Pause, Settings, 
  Zap, Activity, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrchestrationTask {
  id: string;
  name: string;
  status: 'running' | 'pending' | 'completed' | 'failed';
  functions: string[];
  progress: number;
  startTime: Date;
  estimatedDuration: number;
}

const SystemOrchestrator = () => {
  const { toast } = useToast();
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [tasks, setTasks] = useState<OrchestrationTask[]>([
    {
      id: 'sync-agents',
      name: 'Synchronizacja Agentów',
      status: 'running',
      functions: ['agent-orchestrator', 'cognitive-memory', 'fuko-engine'],
      progress: 65,
      startTime: new Date(Date.now() - 300000),
      estimatedDuration: 600000
    },
    {
      id: 'optimize-decision',
      name: 'Optymalizacja Decyzyjna',
      status: 'pending',
      functions: ['quantum-decisions', 'meta-evolution'],
      progress: 0,
      startTime: new Date(),
      estimatedDuration: 900000
    },
    {
      id: 'safety-check',
      name: 'Kontrola Bezpieczeństwa',
      status: 'completed',
      functions: ['safety-core', 'guardian-core'],
      progress: 100,
      startTime: new Date(Date.now() - 1200000),
      estimatedDuration: 300000
    }
  ]);

  const runOrchestration = async (taskId?: string) => {
    setIsOrchestrating(true);
    
    toast({
      title: 'Orchestration Started',
      description: taskId ? `Running task: ${tasks.find(t => t.id === taskId)?.name}` : 'Running full system orchestration',
    });

    // Simulate orchestration process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsOrchestrating(false);
    
    toast({
      title: 'Orchestration Complete',
      description: 'All functions synchronized successfully',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4 animate-spin text-yellow-400" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Pause className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-purple-800/30">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center space-x-2">
          <Network className="h-6 w-6" />
          <span>System Orchestrator</span>
          <Badge variant="outline" className={isOrchestrating ? "text-yellow-400" : "text-green-400"}>
            {isOrchestrating ? 'Running' : 'Ready'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Control Panel */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-white font-medium">Master Orchestration</div>
            <div className="text-sm text-slate-400">Coordinate all system functions</div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => runOrchestration()}
              disabled={isOrchestrating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Run Full Sync
            </Button>
            <Button
              variant="outline"
              className="bg-slate-700 hover:bg-slate-600"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isOrchestrating && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <Activity className="h-4 w-4 animate-spin" />
            <AlertDescription>
              System orchestration in progress... Synchronizing {tasks.length} function groups.
            </AlertDescription>
          </Alert>
        )}

        {/* Active Tasks */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Orchestration Tasks</h3>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {tasks.map(task => (
                <Card key={task.id} className="bg-slate-700/50 border-slate-600/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(task.status)}
                        <div>
                          <div className="text-white font-medium">{task.name}</div>
                          <div className="text-sm text-slate-400">
                            {task.functions.length} functions involved
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(task.status)} variant="outline">
                          {task.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => runOrchestration(task.id)}
                          disabled={isOrchestrating || task.status === 'running'}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-cyan-400">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.functions.map(func => (
                          <span 
                            key={func}
                            className="px-2 py-1 bg-slate-600/50 text-xs text-slate-300 rounded"
                          >
                            {func}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemOrchestrator;
