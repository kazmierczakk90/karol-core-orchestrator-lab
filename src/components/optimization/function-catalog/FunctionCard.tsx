
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, Clock, TrendingUp, Settings, 
  Play, Pause, Info, AlertTriangle 
} from 'lucide-react';
import { SystemFunction } from '@/types/functionCatalog';

interface FunctionCardProps {
  func: SystemFunction;
  onToggle?: (id: string) => void;
  onDetails?: (id: string) => void;
}

const FunctionCard = ({ func, onToggle, onDetails }: FunctionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktywna': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'częściowa': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'wyłączona': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'testowa': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'decyzyjny': return 'bg-purple-500/20 text-purple-400';
      case 'pamięć': return 'bg-blue-500/20 text-blue-400';
      case 'agenci': return 'bg-cyan-500/20 text-cyan-400';
      case 'meta': return 'bg-pink-500/20 text-pink-400';
      case 'monitoring': return 'bg-green-500/20 text-green-400';
      case 'bezpieczeństwo': return 'bg-red-500/20 text-red-400';
      case 'ui': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-3 w-3 text-red-400" />;
      case 'high': return <TrendingUp className="h-3 w-3 text-orange-400" />;
      case 'medium': return <Activity className="h-3 w-3 text-yellow-400" />;
      case 'low': return <Clock className="h-3 w-3 text-blue-400" />;
      default: return <Settings className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600/50 hover:border-cyan-500/50 transition-colors">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-white font-medium text-sm">{func.name}</h3>
                {getPriorityIcon(func.priority)}
              </div>
              <p className="text-xs text-slate-300 mb-2">{func.description}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1">
            <Badge className={getStatusColor(func.status)} variant="outline" size="sm">
              {func.status}
            </Badge>
            <Badge className={getLevelColor(func.level)} variant="outline" size="sm">
              {func.level}
            </Badge>
            <Badge variant="outline" className="text-slate-400" size="sm">
              v{func.version}
            </Badge>
          </div>

          {/* Performance */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Performance</span>
              <span className="text-cyan-400">{func.performance}%</span>
            </div>
            <Progress value={func.performance} className="h-1" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Usage:</span>
              <span className="text-white">{func.usageCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last used:</span>
              <span className="text-white">
                {func.lastUsed ? func.lastUsed.toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>

          {/* Tags */}
          {func.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {func.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-1.5 py-0.5 bg-slate-700/50 text-xs text-slate-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <div className="flex space-x-1">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onToggle?.(func.id)}
                className="h-6 px-2 text-xs"
              >
                {func.status === 'aktywna' ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onDetails?.(func.id)}
                className="h-6 px-2 text-xs"
              >
                <Info className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-xs text-slate-500">{func.category}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunctionCard;
