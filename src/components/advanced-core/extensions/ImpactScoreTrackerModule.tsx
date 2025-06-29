
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Award } from 'lucide-react';

const ImpactScoreTrackerModule = () => {
  const [agentScores] = useState([
    { agent: '@evolution-tracker', score: 92, trend: '+5', decisions: 24 },
    { agent: '@voice-core', score: 88, trend: '+2', decisions: 18 },
    { agent: '@router', score: 85, trend: '-1', decisions: 31 },
    { agent: '@state-keeper', score: 79, trend: '+8', decisions: 15 },
    { agent: '@prompt-forge', score: 76, trend: '+3', decisions: 22 }
  ]);

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-green-400';
    if (trend.startsWith('-')) return 'text-red-400';
    return 'text-slate-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Impact Score Tracker</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-purple-400">@evolution-tracker</Badge>
          <Badge variant="secondary" className="text-xs">
            Live Scoring
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {agentScores.map((agent, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {agent.agent}
                  </Badge>
                  <span className="text-sm text-slate-300">
                    {agent.decisions} decisions
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-bold ${getScoreColor(agent.score)}`}>
                    {agent.score}%
                  </span>
                  <span className={`text-xs ${getTrendColor(agent.trend)}`}>
                    {agent.trend}
                  </span>
                </div>
              </div>
              <Progress 
                value={agent.score} 
                className="h-2" 
              />
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 pt-4 space-y-2">
          <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Award className="h-4 w-4 text-yellow-400" />
            <span>Top Performer</span>
          </h4>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-yellow-500/20 text-yellow-400">
                @evolution-tracker
              </Badge>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">92%</div>
                <div className="text-xs text-slate-400">24 decisions</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="text-xs text-slate-400">
            <div>Trigger: każda decyzja</div>
            <div>Heatmapa: aktywna</div>
            <div>Ranking: real-time</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpactScoreTrackerModule;
