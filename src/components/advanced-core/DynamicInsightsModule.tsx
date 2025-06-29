
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, BarChart3, Lightbulb, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Insight {
  id: string;
  category: 'style' | 'decision' | 'development';
  title: string;
  description: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  timestamp: string;
}

const DynamicInsightsModule = () => {
  const { toast } = useToast();
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: '1',
      category: 'style',
      title: 'Communication Pattern Detected',
      description: 'User prefers technical explanations with visual examples',
      score: 87,
      trend: 'up',
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      category: 'decision',
      title: 'Decision Speed Improved',
      description: 'Response time decreased by 23% in last hour',
      score: 92,
      trend: 'up',
      timestamp: '5 minutes ago'
    },
    {
      id: '3',
      category: 'development',
      title: 'Learning Acceleration',
      description: 'New concepts integrated 35% faster than baseline',
      score: 78,
      trend: 'stable',
      timestamp: '12 minutes ago'
    }
  ]);

  const [liveScores, setLiveScores] = useState({
    adaptability: 85,
    efficiency: 92,
    creativity: 76,
    consistency: 88
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshInsights = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setLiveScores(prev => ({
        adaptability: Math.max(0, Math.min(100, prev.adaptability + (Math.random() - 0.5) * 10)),
        efficiency: Math.max(0, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 8)),
        creativity: Math.max(0, Math.min(100, prev.creativity + (Math.random() - 0.5) * 12)),
        consistency: Math.max(0, Math.min(100, prev.consistency + (Math.random() - 0.5) * 6))
      }));
      
      setIsRefreshing(false);
      toast({
        title: "Insights Updated",
        description: "@feedback-loop generated new analysis",
      });
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'style': return 'bg-purple-500/20 text-purple-400';
      case 'decision': return 'bg-blue-500/20 text-blue-400';
      case 'development': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '—';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        refreshInsights();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isRefreshing]);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Dynamic Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Live Scores */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Live Performance</h3>
              <Button 
                onClick={refreshInsights} 
                disabled={isRefreshing}
                variant="outline" 
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(liveScores).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 capitalize">{key}</span>
                    <span className={`font-bold ${getScoreColor(Math.round(value))}`}>
                      {Math.round(value)}%
                    </span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Insights */}
          <div className="border-t border-slate-700 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <span>Recent Insights</span>
            </h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {insights.map(insight => (
                <div key={insight.id} className="p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(insight.category)}>
                          {insight.category}
                        </Badge>
                        <span className="text-lg">{getTrendIcon(insight.trend)}</span>
                        <span className={`font-bold ${getScoreColor(insight.score)}`}>
                          {insight.score}%
                        </span>
                      </div>
                      
                      <h4 className="text-white font-medium">{insight.title}</h4>
                      <p className="text-sm text-slate-300">{insight.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{insight.timestamp}</span>
                        <Badge variant="outline" className="text-xs">
                          @feedback-loop
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-lg font-semibold text-white mb-4">Trend Analysis</h3>
            <div className="bg-slate-900/50 rounded-lg p-6 min-h-24 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-cyan-400" />
                <p className="text-sm">Overall performance trending upward</p>
                <p className="text-xs mt-1">+12% improvement over last hour</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicInsightsModule;
