
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter, 
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Zap,
  Clock
} from 'lucide-react';
import { ExtractionAnalytics } from '@/types/smartExtractor';

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('extractions');

  // Mock analytics data
  const analytics: ExtractionAnalytics = {
    totalExtractions: 1547,
    totalItems: 23891,
    avgProcessingTime: 2.34,
    successRate: 94.2,
    topDomains: [
      { domain: 'amazon.com', count: 245, avgItems: 18.5 },
      { domain: 'ebay.com', count: 189, avgItems: 15.2 },
      { domain: 'shopify.com', count: 156, avgItems: 12.8 },
      { domain: 'etsy.com', count: 134, avgItems: 9.4 },
      { domain: 'alibaba.com', count: 98, avgItems: 22.1 }
    ],
    topTemplates: [
      { templateId: 'temp_1', templateName: 'E-commerce Scraper', usageCount: 334, successRate: 96.8 },
      { templateId: 'temp_2', templateName: 'News Analyzer', usageCount: 278, successRate: 92.1 },
      { templateId: 'temp_3', templateName: 'Product Monitor', usageCount: 189, successRate: 98.2 },
      { templateId: 'temp_4', templateName: 'Social Tracker', usageCount: 167, successRate: 89.5 }
    ],
    timeSeriesData: [
      { date: '2024-01-01', extractions: 45, items: 678, avgTime: 2.1 },
      { date: '2024-01-02', extractions: 52, items: 743, avgTime: 2.3 },
      { date: '2024-01-03', extractions: 38, items: 591, avgTime: 1.9 },
      { date: '2024-01-04', extractions: 67, items: 892, avgTime: 2.8 },
      { date: '2024-01-05', extractions: 71, items: 1024, avgTime: 2.5 },
      { date: '2024-01-06', extractions: 59, items: 834, avgTime: 2.2 },
      { date: '2024-01-07', extractions: 63, items: 945, avgTime: 2.4 }
    ],
    errorAnalysis: [
      { error: 'Timeout', count: 23, percentage: 45.1 },
      { error: 'Selector Not Found', count: 15, percentage: 29.4 },
      { error: 'Network Error', count: 8, percentage: 15.7 },
      { error: 'Rate Limited', count: 5, percentage: 9.8 }
    ]
  };

  const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  const MetricCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('400', '500/20')}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400 text-sm">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span>Advanced Analytics</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="border-slate-600">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Extractions"
            value={analytics.totalExtractions.toLocaleString()}
            icon={Zap}
            trend="+12.5% vs last period"
            color="text-cyan-400"
          />
          <MetricCard
            title="Items Extracted"
            value={analytics.totalItems.toLocaleString()}
            icon={Target}
            trend="+8.3% vs last period"
            color="text-purple-400"
          />
          <MetricCard
            title="Avg Processing Time"
            value={`${analytics.avgProcessingTime}s`}
            icon={Clock}
            trend="-5.2% vs last period"
            color="text-green-400"
          />
          <MetricCard
            title="Success Rate"
            value={`${analytics.successRate}%`}
            icon={Activity}
            trend="+2.1% vs last period"
            color="text-blue-400"
          />
        </div>

        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="domains">Top Domains</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="errors">Error Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Extraction Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="extractions" 
                      stroke="#06b6d4" 
                      fill="#06b6d4" 
                      fillOpacity={0.3}
                      name="Extractions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Processing Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgTime" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Avg Time (s)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topDomains.map((domain, index) => (
                    <div key={domain.domain} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-cyan-500/20 text-cyan-400">
                          #{index + 1}
                        </Badge>
                        <span className="text-white font-medium">{domain.domain}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-slate-300">{domain.count} extractions</span>
                        <span className="text-slate-300">{domain.avgItems} avg items</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Template Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.topTemplates}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="templateName" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="usageCount" fill="#06b6d4" name="Usage Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Error Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analytics.errorAnalysis}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {analytics.errorAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Error Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.errorAnalysis.map((error, index) => (
                      <div key={error.error} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-white">{error.error}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-300">{error.count}</span>
                          <Badge className="bg-red-500/20 text-red-400">
                            {error.percentage}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalytics;
