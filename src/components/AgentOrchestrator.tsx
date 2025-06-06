
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Network, Users, Zap, Activity, Clock, CheckCircle, AlertTriangle, Pause } from 'lucide-react';

interface AgentTask {
  id: string;
  title: string;
  description: string;
  assignedAgent: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  estimatedTime: string;
  dependencies: string[];
  createdAt: Date;
}

interface AgentPerformance {
  agentId: string;
  tasksCompleted: number;
  averageTime: string;
  successRate: number;
  currentLoad: number;
  status: 'idle' | 'busy' | 'overloaded' | 'offline';
}

const AgentOrchestrator = () => {
  const [tasks, setTasks] = useState<AgentTask[]>([
    {
      id: 'task_1',
      title: 'Market Research Analysis',
      description: 'Analyze current market trends for startup opportunities',
      assignedAgent: '@google-search',
      status: 'running',
      priority: 'high',
      progress: 75,
      estimatedTime: '15 min',
      dependencies: [],
      createdAt: new Date()
    },
    {
      id: 'task_2',
      title: 'Content Creation',
      description: 'Create blog post about AI automation',
      assignedAgent: '@creative',
      status: 'pending',
      priority: 'medium',
      progress: 0,
      estimatedTime: '30 min',
      dependencies: ['task_1'],
      createdAt: new Date()
    },
    {
      id: 'task_3',
      title: 'Data Processing',
      description: 'Process and clean customer data',
      assignedAgent: '@analiza',
      status: 'completed',
      priority: 'high',
      progress: 100,
      estimatedTime: '45 min',
      dependencies: [],
      createdAt: new Date()
    }
  ]);

  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([
    { agentId: '@ceo', tasksCompleted: 12, averageTime: '25 min', successRate: 95, currentLoad: 60, status: 'busy' },
    { agentId: '@google-search', tasksCompleted: 8, averageTime: '15 min', successRate: 98, currentLoad: 80, status: 'busy' },
    { agentId: '@analiza', tasksCompleted: 15, averageTime: '35 min', successRate: 92, currentLoad: 40, status: 'idle' },
    { agentId: '@creative', tasksCompleted: 6, averageTime: '45 min', successRate: 88, currentLoad: 20, status: 'idle' },
    { agentId: '@router', tasksCompleted: 20, averageTime: '5 min', successRate: 99, currentLoad: 30, status: 'idle' },
    { agentId: '@kontroling', tasksCompleted: 10, averageTime: '20 min', successRate: 96, currentLoad: 50, status: 'busy' }
  ]);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    running: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400',
    paused: 'bg-gray-500/20 text-gray-400'
  };

  const priorityColors = {
    low: 'bg-gray-500/20 text-gray-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-orange-500/20 text-orange-400',
    critical: 'bg-red-500/20 text-red-400'
  };

  const agentStatusColors = {
    idle: 'bg-green-500/20 text-green-400',
    busy: 'bg-blue-500/20 text-blue-400',
    overloaded: 'bg-red-500/20 text-red-400',
    offline: 'bg-gray-500/20 text-gray-400'
  };

  const getLoadColor = (load: number) => {
    if (load < 50) return 'bg-green-500';
    if (load < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const runningTasks = tasks.filter(t => t.status === 'running').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const failedTasks = tasks.filter(t => t.status === 'failed').length;
  const totalTasks = tasks.length;

  const distributeTask = (task: AgentTask) => {
    // Find best agent based on load and capabilities
    const availableAgents = agentPerformance.filter(a => a.currentLoad < 90 && a.status !== 'offline');
    const bestAgent = availableAgents.reduce((best, current) => 
      current.currentLoad < best.currentLoad ? current : best
    );

    setTasks(prev => prev.map(t => 
      t.id === task.id 
        ? { ...t, assignedAgent: bestAgent.agentId, status: 'running' as const }
        : t
    ));

    // Update agent load
    setAgentPerformance(prev => prev.map(a => 
      a.agentId === bestAgent.agentId 
        ? { ...a, currentLoad: Math.min(a.currentLoad + 20, 100), status: 'busy' as const }
        : a
    ));
  };

  const pauseTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'paused' as const } : t
    ));
  };

  const resumeTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'running' as const } : t
    ));
  };

  return (
    <div className="h-full space-y-4">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-primary/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-blue-400 font-semibold">Running</p>
                <p className="text-2xl font-bold text-white">{runningTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-green-400 font-semibold">Completed</p>
                <p className="text-2xl font-bold text-white">{completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-warning/20 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-red-400 font-semibold">Failed</p>
                <p className="text-2xl font-bold text-white">{failedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary/20 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-cyan-400 font-semibold">Total</p>
                <p className="text-2xl font-bold text-white">{totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 h-[calc(100%-120px)]">
        {/* Task Queue */}
        <Card className="bg-slate-800/50 border-cyan-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Task Queue</span>
            </CardTitle>
            <CardDescription>
              Active and pending tasks across all agents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {tasks.map((task) => (
              <Card key={task.id} className="bg-slate-700/50 border-slate-600/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      <p className="text-slate-400 text-sm">{task.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={`text-xs ${statusColors[task.status]}`}>
                        {task.status}
                      </Badge>
                      <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Assigned to: {task.assignedAgent}</span>
                      <span className="text-slate-400">ETA: {task.estimatedTime}</span>
                    </div>
                    
                    {task.status === 'running' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      {task.status === 'pending' && (
                        <Button 
                          size="sm" 
                          className="bg-gradient-success hover:bg-gradient-secondary"
                          onClick={() => distributeTask(task)}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Distribute
                        </Button>
                      )}
                      
                      {task.status === 'running' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-600"
                          onClick={() => pauseTask(task.id)}
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      )}
                      
                      {task.status === 'paused' && (
                        <Button 
                          size="sm" 
                          className="bg-gradient-primary"
                          onClick={() => resumeTask(task.id)}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card className="bg-slate-800/50 border-cyan-800/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Network className="h-5 w-5" />
              <span>Agent Performance</span>
            </CardTitle>
            <CardDescription>
              Real-time agent status and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {agentPerformance.map((agent) => (
              <Card key={agent.agentId} className="bg-slate-700/50 border-slate-600/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white font-mono">{agent.agentId}</h3>
                      <Badge className={`text-xs ${agentStatusColors[agent.status]}`}>
                        {agent.status}
                      </Badge>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      <div>Success: {agent.successRate}%</div>
                      <div>Avg: {agent.averageTime}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Current Load</span>
                      <span className="text-white">{agent.currentLoad}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getLoadColor(agent.currentLoad)}`}
                        style={{ width: `${agent.currentLoad}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Tasks completed: {agent.tasksCompleted}</span>
                      <span>
                        {agent.currentLoad > 80 ? '⚠️ High load' : 
                         agent.currentLoad > 50 ? '⚡ Active' : '✅ Available'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentOrchestrator;
