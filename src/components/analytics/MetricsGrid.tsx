
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Metric {
  name: string;
  value: number;
  threshold: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

interface MetricsGridProps {
  metrics: Metric[];
}

const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-400" />;
      default: return <Minus className="h-3 w-3 text-slate-400" />;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const percentage = (metric.value / metric.threshold) * 100;
        const isHealthy = metric.value >= metric.threshold;
        
        return (
          <Card key={index} className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-300">
                  {metric.name}
                </CardTitle>
                <Badge 
                  className={isHealthy ? 
                    "bg-green-500/20 text-green-400" : 
                    "bg-red-500/20 text-red-400"
                  }
                >
                  {isHealthy ? 'OK' : 'ALERT'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    {metric.value.toFixed(1)}{metric.unit || ''}
                  </span>
                  {metric.change !== undefined && (
                    <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
                      {getTrendIcon(metric.trend)}
                      <span className="text-xs font-medium">
                        {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
                
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2"
                />
                
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Current: {metric.value.toFixed(1)}</span>
                  <span>Target: {metric.threshold}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
