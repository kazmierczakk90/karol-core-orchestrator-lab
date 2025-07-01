
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, CheckCircle, AlertTriangle, Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { AutoOptimization } from '@/types/optimization';

interface OptimizationListProps {
  optimizations: AutoOptimization[];
  toggleOptimization: (id: string) => void;
  runOptimization: (id: string) => void;
}

const OptimizationList = ({ optimizations, toggleOptimization, runOptimization }: OptimizationListProps) => {
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

  return (
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
  );
};

export default OptimizationList;
