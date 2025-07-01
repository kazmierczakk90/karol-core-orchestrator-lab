
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

const OptimizationSummary = () => {
  const optimizationImpact = [
    { category: 'Performance', improvement: 14 },
    { category: 'Memory', improvement: 16 },
    { category: 'Security', improvement: 16 },
    { category: 'UX', improvement: 16 },
    { category: 'Reliability', improvement: 12 }
  ];

  return (
    <Card className="bg-slate-800/50 border-green-800/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Optimization Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-white font-medium">Performance Gains</div>
            <div className="space-y-1">
              {optimizationImpact.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">{item.category}</span>
                  <Badge className="bg-green-500/20 text-green-400">
                    +{item.improvement}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-white font-medium">System Health</div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Overall Score</span>
                <Badge className="bg-cyan-500/20 text-cyan-400">87/100</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Stability</span>
                <Badge className="bg-green-500/20 text-green-400">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Risk Level</span>
                <Badge className="bg-blue-500/20 text-blue-400">Low</Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-white font-medium">Next Actions</div>
            <div className="space-y-1">
              <div className="text-sm text-slate-300">• Phase 2 optimization ready</div>
              <div className="text-sm text-slate-300">• UI/UX improvements pending</div>
              <div className="text-sm text-slate-300">• Security enhancements queued</div>
              <div className="text-sm text-slate-300">• Performance monitoring active</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationSummary;
