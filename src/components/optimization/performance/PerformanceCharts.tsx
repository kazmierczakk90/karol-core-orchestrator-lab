
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const PerformanceCharts = () => {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  );
};

export default PerformanceCharts;
