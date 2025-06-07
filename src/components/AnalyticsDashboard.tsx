
import { useState, useEffect } from 'react';
import { fukoCore } from '@/services/fukoCore';
import { autoImprovementService } from '@/services/autoImprovementService';
import { toast } from '@/components/ui/sonner';
import AnalyticsHeader from './analytics/AnalyticsHeader';
import MetricsGrid from './analytics/MetricsGrid';
import PerformanceChart from './analytics/PerformanceChart';
import AgentStatusGrid from './analytics/AgentStatusGrid';

const AnalyticsDashboard = () => {
  const [kpiData, setKpiData] = useState<any>({});
  const [agents, setAgents] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadAnalyticsData();
    const interval = setInterval(loadAnalyticsData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = () => {
    const kpis = fukoCore.getKPIData();
    const agentList = fukoCore.getAgents();
    
    setKpiData(kpis);
    setAgents(agentList);
    setLastUpdate(new Date());
    
    // Generate chart data
    const now = new Date();
    const chartPoints = [];
    for (let i = 9; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2 * 60 * 1000);
      chartPoints.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        performance: Math.random() * 20 + 75,
        efficiency: Math.random() * 15 + 80,
        accuracy: Math.random() * 10 + 85
      });
    }
    setChartData(chartPoints);
  };

  const handleRefresh = () => {
    loadAnalyticsData();
    toast.success('Analytics data refreshed');
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      kpiData,
      agents,
      chartData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Analytics data exported');
  };

  const handleToggleAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent?.status === 'active') {
      fukoCore.deactivateAgent(agentId);
      toast.info(`Agent ${agentId} deactivated`);
    } else {
      fukoCore.activateAgent(agentId);
      toast.success(`Agent ${agentId} activated`);
    }
    loadAnalyticsData();
  };

  const handleViewDetails = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    toast.info(`Viewing details for ${agent?.name || agentId}`);
  };

  // Convert KPI data to metrics format with proper typing
  const metrics = Object.keys(kpiData).map(key => {
    const randomValue = Math.random();
    const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
    const randomTrend = trends[Math.floor(Math.random() * trends.length)];
    
    return {
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: kpiData[key].value || 0,
      threshold: kpiData[key].threshold || 100,
      unit: key.includes('percentage') ? '%' : '',
      trend: randomTrend,
      change: (Math.random() - 0.5) * 10
    };
  });

  return (
    <div className="space-y-6">
      <AnalyticsHeader
        totalMetrics={Object.keys(kpiData).length}
        activeAgents={agents.filter(a => a.status === 'active').length}
        onRefresh={handleRefresh}
        onExport={handleExport}
        lastUpdate={lastUpdate}
      />
      
      <MetricsGrid metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={chartData} />
        <AgentStatusGrid
          agents={agents}
          onToggleAgent={handleToggleAgent}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
