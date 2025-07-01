
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Activity, Shield, TrendingUp, 
  Clock, Zap, Database, AlertTriangle 
} from 'lucide-react';
import { useFunctionCatalog } from '@/hooks/useFunctionCatalog';

const FunctionCatalogDashboard = () => {
  const { metrics } = useFunctionCatalog();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-slate-800/50 border-cyan-800/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-slate-400">Total Functions</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400">{metrics.totalFunctions}</div>
          <div className="text-xs text-slate-500">System components</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-green-800/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-green-400" />
            <span className="text-sm text-slate-400">Active</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{metrics.activeFunctions}</div>
          <div className="text-xs text-slate-500">Currently running</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-red-800/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-red-400" />
            <span className="text-sm text-slate-400">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{metrics.criticalFunctions}</div>
          <div className="text-xs text-slate-500">High priority</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-purple-800/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-slate-400">Performance</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {Math.round(metrics.averagePerformance)}%
          </div>
          <div className="text-xs text-slate-500">Average score</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunctionCatalogDashboard;
