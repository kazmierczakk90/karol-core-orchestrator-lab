
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Clock, Shield, Zap, Database, Brain } from 'lucide-react';

const SystemMetrics = () => {
  const systemMetrics = {
    uptime: '99.7%',
    avgResponse: '145ms',
    errorRate: '0.02%',
    throughput: '1,247 req/min',
    memoryUsage: '74%',
    cpuUsage: '52%'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      <Card className="bg-slate-800/50 border-green-800/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-green-400" />
            <span className="text-sm text-slate-400">Uptime</span>
          </div>
          <div className="text-xl font-bold text-green-400">{systemMetrics.uptime}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-slate-400">Response</span>
          </div>
          <div className="text-xl font-bold text-blue-400">{systemMetrics.avgResponse}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-red-800/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-red-400" />
            <span className="text-sm text-slate-400">Error Rate</span>
          </div>
          <div className="text-xl font-bold text-red-400">{systemMetrics.errorRate}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-purple-800/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-slate-400">Throughput</span>
          </div>
          <div className="text-xl font-bold text-purple-400">{systemMetrics.throughput}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-orange-800/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-slate-400">Memory</span>
          </div>
          <div className="text-xl font-bold text-orange-400">{systemMetrics.memoryUsage}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-cyan-800/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-slate-400">CPU</span>
          </div>
          <div className="text-xl font-bold text-cyan-400">{systemMetrics.cpuUsage}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMetrics;
