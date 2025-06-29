
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Brain, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MetaClock = () => {
  const { toast } = useToast();
  const [evolutionScore] = useState(87);
  
  const todaysInsights = {
    decisionsProcessed: 34,
    newLearnings: 7,
    systemImprovements: 3,
    reflectionScore: 9.2
  };

  const generateDailyReport = () => {
    toast({
      title: "Daily Analysis Complete",
      description: "@meta-timer has generated today's reflection report",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>MetaClock (Zegar Refleksji)</span>
          <Badge variant="outline" className="text-cyan-400">@meta-timer</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-cyan-400 text-xl font-bold">{todaysInsights.decisionsProcessed}</div>
              <div className="text-slate-400 text-sm">Decisions Today</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-green-400 text-xl font-bold">{todaysInsights.newLearnings}</div>
              <div className="text-slate-400 text-sm">New Learnings</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-purple-400 text-xl font-bold">{todaysInsights.systemImprovements}</div>
              <div className="text-slate-400 text-sm">Improvements</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-yellow-400 text-xl font-bold">{todaysInsights.reflectionScore}</div>
              <div className="text-slate-400 text-sm">Reflection Score</div>
            </div>
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-medium flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <span>Evolution Score</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">{evolutionScore}%</div>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full" 
                style={{ width: `${evolutionScore}%` }}
              />
            </div>
            <div className="text-slate-400 text-sm mt-2">
              Daily growth trajectory: +2.3% from yesterday
            </div>
          </div>

          <Button 
            onClick={generateDailyReport}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            <Brain className="h-4 w-4 mr-2" />
            Generate Daily Reflection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaClock;
