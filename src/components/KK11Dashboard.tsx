
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { openaiService } from '@/services/openaiService';
import { toast } from '@/components/ui/sonner';
import { Brain, Activity, Zap, Target, Eye, Play, Pause, RotateCcw } from 'lucide-react';

const KK11Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState<any>({});
  const [isInitializing, setIsInitializing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = () => {
    const status = openaiService.getKK11Status();
    setSystemStatus(status);
    setLastUpdate(new Date());
  };

  const handleInitializeKK11 = async () => {
    setIsInitializing(true);
    try {
      const result = await openaiService.processCommand('/start KK1.1');
      toast.success('Karol-Core KK1.1 AGI został zainicjalizowany!', {
        description: 'Wszystkie specjalizowane agenty są aktywne',
        duration: 5000
      });
      updateStatus();
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

  const getStatusColor = (mode: string) => {
    switch (mode) {
      case 'LIVE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'CHAINED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'REACTIVE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const kk11Agents = [
    { id: '@prompt-forge', name: 'Prompt Forge', icon: Brain, description: 'FUKO-LANG prompt optimization' },
    { id: '@scoring-core', name: 'Scoring Core', icon: Target, description: 'Multi-dimensional decision scoring' },
    { id: '@meta-core', name: 'Meta Core', icon: Eye, description: 'System self-awareness' },
    { id: '@future-agent', name: 'Future Agent', icon: Zap, description: 'Predictive planning' },
    { id: '@executor', name: 'Executor', icon: Activity, description: 'Operational execution' }
  ];

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
                Advanced AGI System Control & Monitoring
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(systemStatus.mode)}>
                {systemStatus.mode || 'MANUAL'}
              </Badge>
              <div className="text-right">
                <div className="text-cyan-400 font-bold">{systemStatus.activeAgents || 0}</div>
                <div className="text-slate-400 text-sm">Active Agents</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-cyan-400">
                {lastUpdate.toLocaleTimeString()}
              </div>
              <div className="text-slate-400 text-sm">Last Update</div>
            </div>
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
              <div className="text-slate-400 text-sm mb-2">Predictive Accuracy</div>
              <Progress value={85} className="h-3 mb-1" />
              <div className="text-right text-yellow-400 text-sm font-semibold">85%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KK11Dashboard;
