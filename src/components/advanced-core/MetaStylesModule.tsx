
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Radar, User, Lightbulb, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StyleProfile {
  formal: number;
  creative: number;
  philosophical: number;
  technical: number;
  empathetic: number;
  direct: number;
}

interface StyleInsight {
  category: string;
  observation: string;
  confidence: number;
}

const MetaStylesModule = () => {
  const { toast } = useToast();
  const [styleProfile, setStyleProfile] = useState<StyleProfile>({
    formal: 65,
    creative: 78,
    philosophical: 45,
    technical: 89,
    empathetic: 72,
    direct: 58
  });

  const [insights, setInsights] = useState<StyleInsight[]>([
    {
      category: 'Communication',
      observation: 'User prefers structured explanations with examples',
      confidence: 87
    },
    {
      category: 'Problem Solving',
      observation: 'Shows high technical aptitude with creative approaches',
      confidence: 92
    },
    {
      category: 'Learning Style',
      observation: 'Responds well to visual aids and step-by-step breakdowns',
      confidence: 78
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dominantStyle, setDominantStyle] = useState('Technical');

  const analyzeStyle = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      // Update style profile with small random changes
      setStyleProfile(prev => ({
        formal: Math.max(0, Math.min(100, prev.formal + (Math.random() - 0.5) * 20)),
        creative: Math.max(0, Math.min(100, prev.creative + (Math.random() - 0.5) * 15)),
        philosophical: Math.max(0, Math.min(100, prev.philosophical + (Math.random() - 0.5) * 25)),
        technical: Math.max(0, Math.min(100, prev.technical + (Math.random() - 0.5) * 10)),
        empathetic: Math.max(0, Math.min(100, prev.empathetic + (Math.random() - 0.5) * 18)),
        direct: Math.max(0, Math.min(100, prev.direct + (Math.random() - 0.5) * 22))
      }));
      
      setIsAnalyzing(false);
      toast({
        title: "Style Analysis Complete",
        description: "@meta-analyst updated user profile",
      });
    }, 2500);
  };

  // Update dominant style based on highest score
  useEffect(() => {
    const maxEntry = Object.entries(styleProfile).reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    setDominantStyle(maxEntry[0].charAt(0).toUpperCase() + maxEntry[0].slice(1));
  }, [styleProfile]);

  const getStyleColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-500/20 text-green-400';
    if (confidence >= 70) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-orange-500/20 text-orange-400';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-emerald-400 flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Karol-Meta Styles</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Style Profile Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">User Style Profile</h3>
                <p className="text-sm text-slate-400">
                  Dominant Style: <span className="text-emerald-400 font-medium">{dominantStyle}</span>
                </p>
              </div>
              <Button 
                onClick={analyzeStyle} 
                disabled={isAnalyzing}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>

            {/* Radar Chart Representation */}
            <div className="bg-slate-900/50 rounded-lg p-6 min-h-48 flex items-center justify-center">
              <div className="text-center">
                <Radar className="h-16 w-16 mx-auto mb-4 text-emerald-400" />
                <p className="text-slate-400 mb-2">Style Radar Chart</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(styleProfile).map(([key, value]) => (
                    <div key={key} className="text-left">
                      <span className="text-slate-300 capitalize">{key}: </span>
                      <span className={getStyleColor(Math.round(value))}>{Math.round(value)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Style Scores */}
          <div className="border-t border-slate-700 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-white">Detailed Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(styleProfile).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 capitalize font-medium">{key}</span>
                    <span className={`font-bold ${getStyleColor(Math.round(value))}`}>
                      {Math.round(value)}%
                    </span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Auto Style Insights */}
          <div className="border-t border-slate-700 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <span>Auto Style Profile</span>
            </h3>
            
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.category}
                        </Badge>
                        <Badge className={`text-xs ${getConfidenceColor(insight.confidence)}`}>
                          {insight.confidence}% confident
                        </Badge>
                      </div>
                      <p className="text-white text-sm">{insight.observation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Attribution */}
          <div className="border-t border-slate-700 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Analysis by:</span>
              <Badge variant="outline">@meta-analyst</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaStylesModule;
