
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, TrendingDown, Activity, Zap, Database, 
  Brain, Shield, Code, Clock, CheckCircle
} from 'lucide-react';

const PerformanceAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('overall');

  const performanceData = [
    { time: '00:00', performance: 85, memory: 70, cpu: 45, errors: 2 },
    { time: '04:00', performance: 88, memory: 72, cpu: 48, errors: 1 },
    { time: '08:00', performance: 92, memory: 75, cpu: 52, errors: 0 },
    { time: '12:00', performance: 89, memory: 78, cpu: 55, errors: 1 },
    { time: '16:00', performance: 91, memory: 76, cpu: 50, errors: 0 },
    { time: '20:00', performance: 94, memory: 74, cpu: 47, errors: 0 }
  ];

  const areaScores = [
    { name: 'Architecture', value: 85, color: '#3B82F6' },
    { name: 'Decision Engine', value: 92, color: '#10B981' },
    { name: 'UI/UX', value: 78, color: '#F59E0B' },
    { name: 'Memory Mgmt', value: 88, color: '#8B5CF6' },
    { name: 'Security', value: 82, color: '#EF4444' },
    { name: 'Integration', value: 86, color: '#06B6D4' }
  ];

  const optimizationImpact = [
    { category: 'Performance', before: 75, after: 89, improvement: 14 },
    { category: 'Memory', before: 68, after: 84, improvement: 16 },
    { category: 'Security', before: 72, after: 88, improvement: 16 },
    { category: 'UX', before: 65, after: 81, improvement: 16 },
    { category: 'Reliability', before: 80, after: 92, improvement: 12 }
  ];

  const systemMetrics = {
    uptime: '99.7%',
    avgResponse: '145ms',
    errorRate: '0.02%',
    throughput: '1,247 req/min',
    memoryUsage: '74%',
    cpuUsage: '52%'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
          <p className="text-slate-400">Comprehensive system performance monitoring and analysis</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card className="bg-slate-800/50 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-400">Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Line type="monotone" dataKey="performance" stroke="#06B6D4" strokeWidth={2} />
                <Line type="monotone" dataKey="memory" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="cpu" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Area Scores Distribution */}
        <Card className="bg-slate-800/50 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-purple-400">12-Area Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={areaScores}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {areaScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Optimization Impact */}
        <Card className="bg-slate-800/50 border-slate-600/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-green-400">Optimization Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={optimizationImpact}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="category" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="before" fill="#EF4444" name="Before" />
                <Bar dataKey="after" fill="#10B981" name="After" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Improvement Summary */}
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
    </div>
  );
};

export default PerformanceAnalyticsDashboard;
