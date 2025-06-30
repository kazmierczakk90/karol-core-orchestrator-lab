
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Brain, Zap, Settings, Activity, TrendingUp, AlertTriangle,
  CheckCircle, Clock, Play, Pause, RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutoOptimization {
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

const AutoOptimizationEngine = () => {
  const { toast } = useToast();
  const [isEngineActive, setIsEngineActive] = useState(true);
  const [aggressiveness, setAggressiveness] = useState([5]);
  const [currentlyRunning, setCurrentlyRunning] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  const [optimizations, setOptimizations] = useState<AutoOptimization[]>([
    {
      id: 'memory-cleanup',
      name: 'Memory Cleanup',
      description: 'Automatic garbage collection and memory optimization',
      category: 'memory',
      enabled: true,
      status: 'completed',
      lastRun: new Date(Date.now() - 300000),
      nextRun: new Date(Date.now() + 300000),
      impact: 'high',
      frequency: 'hourly',
      success_rate: 94
    },
    {
      id: 'cache-optimization',
      name: 'Cache Optimization',
      description: 'Intelligent cache management and invalidation',
      category: 'performance',
      enabled: true,
      status: 'idle',
      lastRun: new Date(Date.now() - 600000),
      nextRun: new Date(Date.now() + 600000),
      impact: 'high',
      frequency: 'hourly',
      success_rate: 98
    },
    {
      id: 'security-scan',
      name: 'Security Scan',
      description: 'Automated security vulnerability detection',
      category: 'security',
      enabled: true,
      status: 'idle',
      lastRun: new Date(Date.now() - 3600000),
      nextRun: new Date(Date.now() + 3600000),
      impact: 'medium',
      frequency: 'daily',
      success_rate: 89
    },
    {
      id: 'ui-responsiveness',
      name: 'UI Responsiveness',
      description: 'Dynamic UI optimization based on device and usage patterns',
      category: 'ui',
      enabled: false,
      status: 'idle',
      impact: 'medium',
      frequency: 'realtime',
      success_rate: 76
    },
    {
      id: 'ai-model-tuning',
      name: 'AI Model Tuning',
      description: 'Automatic fine-tuning of AI models based on performance',
      category: 'ai',
      enabled: true,
      status: 'running',
      lastRun: new Date(),
      nextRun: new Date(Date.now() + 86400000),
      impact: 'high',
      frequency: 'weekly',
      success_rate: 92
    },
    {
      id: 'component-lazy-load',
      name: 'Component Lazy Loading',
      description: 'Dynamic component loading optimization',
      category: 'performance',
      enabled: true,
      status: 'idle',
      impact: 'medium',
      frequency: 'realtime',
      success_rate: 85
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isEngineActive) {
        // Simulate auto-optimization activities
        const runningOpt = optimizations.find(opt => opt.status === 'running');
        if (runningOpt) {
          setCurrentlyRunning(runningOpt.id);
          setOverallProgress(prev => Math.min(prev + 10, 100));
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isEngineActive, optimizations]);

  const toggleOptimization = (id: string) => {
    setOptimizations(prev => prev.map(opt => 
      opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
    ));
    
    const opt = optimizations.find(o => o.id === id);
    toast({
      title: opt?.enabled ? 'Auto-Optimization Disabled' : 'Auto-Optimization Enabled',
      description: `${opt?.name} has been ${opt?.enabled ? 'disabled' : 'enabled'}`,
    });
  };

  const runOptimization = async (id: string) => {
    setOptimizations(prev => prev.map(opt => 
      opt.id === id ? { ...opt, status: 'running' } : opt
    ));
    
    setCurrentlyRunning(id);
    const opt = optimizations.find(o => o.id === id);
    
    toast({
      title: 'Running Optimization',
      description: `Starting ${opt?.name}...`,
    });

    // Simulate optimization work
    await new Promise(resolve => setTimeout(resolve, 3000));

    setOptimizations(prev => prev.map(opt => 
      opt.id === id ? { 
        ...opt, 
        status: 'completed',
        lastRun: new Date(),
        nextRun: getNextRunTime(opt.frequency)
      } : opt
    ));
    
    setCurrentlyRunning(null);
    setOverallProgress(0);
    
    toast({
      title: 'Optimization Complete',
      description: `${opt?.name} completed successfully`,
    });
  };

  const getNextRunTime = (frequency: string): Date => {
    const now = new Date();
    switch (frequency) {
      case 'realtime': return new Date(now.getTime() + 60000);
      case 'hourly': return new Date(now.getTime() + 3600000);
      case 'daily': return new Date(now.getTime() + 86400000);
      case 'weekly': return new Date(now.getTime() + 604800000);
      default: return new Date(now.getTime() + 3600000);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'memory': return 'bg-purple-500/20 text-purple-400 border-purple-500';
      case 'security': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'ui': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'ai': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4 animate-spin text-yellow-400" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const activeOptimizations = optimizations.filter(opt => opt.enabled).length;
  const completedToday = optimizations.filter(opt => 
    opt.lastRun && opt.lastRun > new Date(Date.now() - 86400000)
  ).length;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>Auto-Optimization Engine</span>
            <Badge variant="outline" className={isEngineActive ? "text-green-400" : "text-red-400"}>
              {isEngineActive ? 'Active' : 'Paused'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Engine Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Engine Status</div>
                    <div className="text-sm text-slate-400">Auto-optimization engine</div>
                  </div>
                  <Switch 
                    checked={isEngineActive} 
                    onCheckedChange={setIsEngineActive}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50">
              <CardContent className="p-4">
                <div className="text-white font-medium mb-2">Aggressiveness Level</div>
                <Slider
                  value={aggressiveness}
                  onValueChange={setAggressiveness}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-slate-400 mt-1">
                  Level {aggressiveness[0]}/10 - {aggressiveness[0] > 7 ? 'Aggressive' : aggressiveness[0] > 4 ? 'Balanced' : 'Conservative'}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Active</span>
                    <span className="text-cyan-400 font-bold">{activeOptimizations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Today</span>
                    <span className="text-green-400 font-bold">{completedToday}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Activity */}
          {currentlyRunning && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <Activity className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Running optimization: {optimizations.find(o => o.id === currentlyRunning)?.name}
                <Progress value={overallProgress} className="mt-2" />
              </AlertDescription>
            </Alert>
          )}

          {/* Optimization List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Active Optimizations</h3>
              <Button 
                size="sm" 
                onClick={() => window.location.reload()}
                className="bg-slate-600 hover:bg-slate-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-3">
                {optimizations.map(optimization => (
                  <Card key={optimization.id} className="bg-slate-700/50 border-slate-600/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getStatusIcon(optimization.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-white font-medium">{optimization.name}</h4>
                              <Badge className={getCategoryColor(optimization.category)} variant="outline">
                                {optimization.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-300 mb-2">{optimization.description}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-slate-400">
                              <span>Frequency: {optimization.frequency}</span>
                              <span className={getImpactColor(optimization.impact)}>
                                Impact: {optimization.impact}
                              </span>
                              <span>Success: {optimization.success_rate}%</span>
                            </div>
                            
                            {optimization.lastRun && (
                              <div className="text-xs text-slate-500 mt-1">
                                Last run: {optimization.lastRun.toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={optimization.enabled}
                            onCheckedChange={() => toggleOptimization(optimization.id)}
                            disabled={optimization.status === 'running'}
                          />
                          <Button
                            size="sm"
                            onClick={() => runOptimization(optimization.id)}
                            disabled={!optimization.enabled || optimization.status === 'running'}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {optimization.status === 'running' ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
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
    </div>
  );
};

export default AutoOptimizationEngine;
