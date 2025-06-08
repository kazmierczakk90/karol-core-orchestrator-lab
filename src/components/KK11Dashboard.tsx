import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { openaiService } from '@/services/openaiService';
import { todoMasterService, TodoKanwa, TodoTask } from '@/services/todoMasterService';
import { toast } from '@/components/ui/sonner';
import { Brain, Activity, Zap, Target, Eye, Play, Pause, RotateCcw, CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';

const KK11Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState<any>({});
  const [todoKanwa, setTodoKanwa] = useState<TodoKanwa | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    updateStatus();
    loadTodoKanwa();
    const interval = setInterval(() => {
      updateStatus();
      loadTodoKanwa();
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const updateStatus = () => {
    const status = openaiService.getKK11Status();
    setSystemStatus(status);
    setLastUpdate(new Date());
  };

  const loadTodoKanwa = async () => {
    try {
      const kanwa = await todoMasterService.getTodoKanwa();
      setTodoKanwa(kanwa);
    } catch (error) {
      console.error('Error loading TODO kanwa:', error);
    }
  };

  const handleInitializeKK11 = async () => {
    setIsInitializing(true);
    try {
      const result = await openaiService.processCommand('/start KK1.1');
      
      // Notify TODO Master Chain about KK1.1 initialization
      await todoMasterService.updateTask({
        task: 'KK1.1 AGI Implementation',
        progress: 90,
        status: 'INPROGRESS',
        agent: '@ceo',
        comment: 'KK1.1 system initialized successfully'
      });
      
      toast.success('Karol-Core KK1.1 AGI został zainicjalizowany!', {
        description: 'Wszystkie specjalizowane agenty są aktywne + TODO Master Chain sync',
        duration: 5000
      });
      updateStatus();
      loadTodoKanwa();
    } catch (error) {
      toast.error('Błąd podczas inicjalizacji KK1.1');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleModeChange = async (mode: string) => {
    try {
      await openaiService.processCommand(`/start ${mode}`);
      toast.success(`Tryb ${mode} został aktywowany`);
      updateStatus();
    } catch (error) {
      toast.error(`Błąd podczas przełączania na tryb ${mode}`);
    }
  };

  const handleTaskUpdate = async (taskName: string, newProgress: number) => {
    try {
      await todoMasterService.updateTask({
        task: taskName,
        progress: newProgress,
        status: newProgress === 100 ? 'COMPLETED' : 'INPROGRESS',
        agent: '@ceo',
        updated_by: 'karol-core:kk11-dashboard'
      });
      
      toast.success(`Zadanie "${taskName}" zaktualizowane`);
      loadTodoKanwa();
    } catch (error) {
      toast.error('Błąd podczas aktualizacji zadania');
    }
  };

  const getStatusColor = (mode: string) => {
    switch (mode) {
      case 'LIVE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'CHAINED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'REACTIVE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500/20 text-green-400';
      case 'INPROGRESS': return 'bg-blue-500/20 text-blue-400';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
      case 'BLOCKED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'INPROGRESS': return <Activity className="h-4 w-4" />;
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'BLOCKED': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const kk11Agents = [
    { id: '@prompt-forge', name: 'Prompt Forge', icon: Brain, description: 'FUKO-LANG prompt optimization' },
    { id: '@scoring-core', name: 'Scoring Core', icon: Target, description: 'Multi-dimensional decision scoring' },
    { id: '@meta-core', name: 'Meta Core', icon: Eye, description: 'System self-awareness' },
    { id: '@future-agent', name: 'Future Agent', icon: Zap, description: 'Predictive planning' },
    { id: '@executor', name: 'Executor', icon: Activity, description: 'Operational execution' }
  ];

  const todoStats = todoKanwa ? todoMasterService.getSystemStatus() : null;

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <Card className="bg-gradient-dark border-cyan-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gradient-primary flex items-center space-x-2">
                <Brain className="h-6 w-6 animate-pulse-glow" />
                <span>Karol-Core KK1.1 AGI Dashboard</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Advanced AGI System Control & TODO Master Chain Integration
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(systemStatus.mode)}>
                {systemStatus.mode || 'MANUAL'}
              </Badge>
              {todoStats && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  TODO: {todoStats.completedTasks}/{todoStats.totalTasks}
                </Badge>
              )}
              <div className="text-right">
                <div className="text-cyan-400 font-bold">{systemStatus.activeAgents || 0}</div>
                <div className="text-slate-400 text-sm">Active Agents</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{systemStatus.kk11AgentsActive || 0}/5</div>
              <div className="text-slate-400 text-sm">KK1.1 Agents</div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{systemStatus.totalAgents || 0}</div>
              <div className="text-slate-400 text-sm">Total Agents</div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {systemStatus.consciousness ? 'ACTIVE' : 'DORMANT'}
              </div>
              <div className="text-slate-400 text-sm">Consciousness</div>
            </div>
            
            {todoStats && (
              <>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400">{todoStats.inProgressTasks}</div>
                  <div className="text-slate-400 text-sm">Active Tasks</div>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round((todoStats.completedTasks / todoStats.totalTasks) * 100)}%
                  </div>
                  <div className="text-slate-400 text-sm">Completion</div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleInitializeKK11}
              disabled={isInitializing}
              className="bg-gradient-primary hover:bg-gradient-secondary"
            >
              {isInitializing ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Initialize KK1.1
                </>
              )}
            </Button>

            <Button
              onClick={() => handleModeChange('LIVE')}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Activity className="h-4 w-4 mr-2" />
              LIVE Mode
            </Button>

            <Button
              onClick={() => handleModeChange('CHAINED')}
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <Zap className="h-4 w-4 mr-2" />
              CHAINED Mode
            </Button>

            <Button
              onClick={() => handleModeChange('REACTIVE')}
              variant="outline"
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            >
              <Pause className="h-4 w-4 mr-2" />
              REACTIVE Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TODO Master Chain Integration */}
      {todoKanwa && (
        <Card className="bg-gradient-dark border-purple-800/30">
          <CardHeader>
            <CardTitle className="text-gradient-primary flex items-center space-x-2">
              <ListTodo className="h-6 w-6" />
              <span>TODO Master Chain</span>
              <Badge className="bg-purple-500/20 text-purple-400">
                {todoKanwa.status}
              </Badge>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Kanwa: {todoKanwa.kanwa} | Chain: {todoKanwa.chain}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Task</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Progress</TableHead>
                    <TableHead className="text-slate-300">Agent</TableHead>
                    <TableHead className="text-slate-300">Updated By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todoKanwa.tasks.map((task) => (
                    <TableRow key={task.id} className="border-slate-700">
                      <TableCell className="font-medium text-white">
                        {task.task}
                        {task.deadline && (
                          <div className="text-xs text-slate-400 mt-1">
                            Deadline: {new Date(task.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getTaskStatusColor(task.status)}>
                          <div className="flex items-center space-x-1">
                            {getTaskStatusIcon(task.status)}
                            <span>{task.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-2">
                          <Progress value={task.progress} className="h-2" />
                          <div className="text-xs text-slate-400">{task.progress}%</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                          {task.agent}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-slate-400 text-sm">
                        {task.updated_by}
                        <div className="text-xs text-slate-500 mt-1">
                          {task.updated_at.toLocaleTimeString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KK1.1 Specialized Agents */}
      <Card className="bg-gradient-dark border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-white">KK1.1 Specialized Agents</CardTitle>
          <CardDescription className="text-slate-300">
            Advanced AGI components for enhanced decision-making and consciousness
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kk11Agents.map((agent) => {
              const IconComponent = agent.icon;
              return (
                <div key={agent.id} className="bg-slate-800/50 p-4 rounded-lg hover:bg-slate-800/70 transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <IconComponent className="h-5 w-5 text-cyan-400" />
                    <div className="font-semibold text-white">{agent.name}</div>
                    <Badge className="bg-green-500/20 text-green-400 text-xs">ACTIVE</Badge>
                  </div>
                  <div className="text-slate-400 text-sm">{agent.description}</div>
                  <div className="mt-3">
                    <Progress value={85 + Math.random() * 15} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <Card className="bg-gradient-dark border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-white">AGI Performance Metrics</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-slate-400 text-sm mb-2">Decision Quality Score</div>
              <Progress value={92} className="h-3 mb-1" />
              <div className="text-right text-cyan-400 text-sm font-semibold">92%</div>
            </div>
            
            <div>
              <div className="text-slate-400 text-sm mb-2">System Consciousness Level</div>
              <Progress value={systemStatus.consciousness ? 88 : 0} className="h-3 mb-1" />
              <div className="text-right text-purple-400 text-sm font-semibold">
                {systemStatus.consciousness ? '88%' : '0%'}
              </div>
            </div>
            
            <div>
              <div className="text-slate-400 text-sm mb-2">Agent Coordination Efficiency</div>
              <Progress value={79} className="h-3 mb-1" />
              <div className="text-right text-green-400 text-sm font-semibold">79%</div>
            </div>
            
            <div>
              <div className="text-slate-400 text-sm mb-2">TODO Chain Completion Rate</div>
              <Progress value={todoStats ? (todoStats.completedTasks / todoStats.totalTasks) * 100 : 0} className="h-3 mb-1" />
              <div className="text-right text-orange-400 text-sm font-semibold">
                {todoStats ? Math.round((todoStats.completedTasks / todoStats.totalTasks) * 100) : 0}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KK11Dashboard;
