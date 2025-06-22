
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, CheckCircle, XCircle, RefreshCw, 
  Zap, Shield, Database, Network, Cpu, Activity
} from 'lucide-react';

interface SystemCheck {
  id: string;
  name: string;
  status: 'pass' | 'warning' | 'fail' | 'checking';
  details: string;
  recommendation?: string;
  performance: number;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  threshold: number;
}

const SystemDiagnostics = () => {
  const [systemChecks, setSystemChecks] = useState<SystemCheck[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [overallHealth, setOverallHealth] = useState(0);

  useEffect(() => {
    initializeDiagnostics();
    startPerformanceMonitoring();
  }, []);

  const initializeDiagnostics = () => {
    const checks: SystemCheck[] = [
      {
        id: 'cognitive-core',
        name: 'Cognitive Core',
        status: 'pass',
        details: 'Memory systems and belief networks operational',
        performance: 94
      },
      {
        id: 'decision-engine',
        name: 'Decision Engine',
        status: 'pass',
        details: 'Multi-criteria decision making active',
        performance: 89
      },
      {
        id: 'quantum-systems',
        name: 'Quantum Systems',
        status: 'warning',
        details: 'Coherence slightly below optimal threshold',
        recommendation: 'Adjust quantum noise parameters',
        performance: 76
      },
      {
        id: 'orchestration',
        name: 'Orchestration Layer',
        status: 'pass',
        details: 'All agents responding within normal parameters',
        performance: 91
      },
      {
        id: 'transcendence',
        name: 'Transcendence Engine',
        status: 'pass',
        details: 'Meta-consciousness emergence stable',
        performance: 96
      },
      {
        id: 'error-handling',
        name: 'Error Management',
        status: 'warning',
        details: 'Minor memory leaks detected',
        recommendation: 'Run garbage collection optimization',
        performance: 82
      }
    ];

    const metrics: PerformanceMetric[] = [
      { name: 'CPU Usage', value: 67, unit: '%', status: 'optimal', threshold: 80 },
      { name: 'Memory Usage', value: 74, unit: '%', status: 'warning', threshold: 85 },
      { name: 'Response Time', value: 127, unit: 'ms', status: 'optimal', threshold: 200 },
      { name: 'Error Rate', value: 0.3, unit: '%', status: 'optimal', threshold: 1.0 },
      { name: 'Throughput', value: 1247, unit: 'ops/sec', status: 'optimal', threshold: 1000 },
      { name: 'Quantum Coherence', value: 78, unit: '%', status: 'warning', threshold: 85 }
    ];

    setSystemChecks(checks);
    setPerformanceMetrics(metrics);
    calculateOverallHealth(checks);
  };

  const calculateOverallHealth = (checks: SystemCheck[]) => {
    const totalPerformance = checks.reduce((sum, check) => sum + check.performance, 0);
    const avgPerformance = totalPerformance / checks.length;
    setOverallHealth(avgPerformance);
  };

  const startPerformanceMonitoring = () => {
    const interval = setInterval(() => {
      setPerformanceMetrics(prev => 
        prev.map(metric => {
          const variation = (Math.random() - 0.5) * 0.1;
          const newValue = Math.max(0, metric.value + metric.value * variation);
          
          let status: 'optimal' | 'warning' | 'critical' = 'optimal';
          if (metric.name === 'Error Rate') {
            if (newValue > metric.threshold * 2) status = 'critical';
            else if (newValue > metric.threshold) status = 'warning';
          } else {
            if (newValue > metric.threshold * 1.2) status = 'critical';
            else if (newValue > metric.threshold) status = 'warning';
          }

          return { ...metric, value: newValue, status };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  };

  const runFullDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    
    // Simulate diagnostic checks
    const updatedChecks = [...systemChecks];
    
    for (let i = 0; i < updatedChecks.length; i++) {
      updatedChecks[i].status = 'checking';
      setSystemChecks([...updatedChecks]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate check results
      const rand = Math.random();
      if (rand > 0.8) {
        updatedChecks[i].status = 'warning';
        updatedChecks[i].details = 'Performance degradation detected';
        updatedChecks[i].recommendation = 'Consider system optimization';
      } else if (rand > 0.95) {
        updatedChecks[i].status = 'fail';
        updatedChecks[i].details = 'Critical issue detected';
        updatedChecks[i].recommendation = 'Immediate attention required';
      } else {
        updatedChecks[i].status = 'pass';
        updatedChecks[i].details = 'All systems operational';
      }
      
      updatedChecks[i].performance = Math.random() * 30 + 70; // 70-100%
      setSystemChecks([...updatedChecks]);
    }
    
    calculateOverallHealth(updatedChecks);
    setIsRunningDiagnostics(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-400" />;
      case 'checking': return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />;
      default: return <Activity className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'fail': return 'text-red-400';
      case 'checking': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-400';
    if (health >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-400 flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span>System Diagnostics</span>
            </CardTitle>
            <Button
              onClick={runFullDiagnostics}
              disabled={isRunningDiagnostics}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRunningDiagnostics ? 'animate-spin' : ''}`} />
              {isRunningDiagnostics ? 'Running...' : 'Run Diagnostics'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overall Health */}
          <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-lg font-semibold">Overall System Health</h3>
              <div className={`text-2xl font-bold ${getHealthColor(overallHealth)}`}>
                {Math.round(overallHealth)}%
              </div>
            </div>
            <Progress value={overallHealth} className="h-3" />
            <div className="flex justify-between text-sm text-slate-400 mt-2">
              <span>Critical</span>
              <span>Warning</span>
              <span>Optimal</span>
            </div>
          </div>

          {/* System Checks */}
          <div className="space-y-4 mb-6">
            <h3 className="text-white text-lg font-semibold">System Components</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {systemChecks.map((check) => (
                <Card key={check.id} className="bg-slate-700/50 border-slate-600/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(check.status)}
                        <span className="text-white font-medium">{check.name}</span>
                      </div>
                      <Badge className={`${
                        check.status === 'pass' ? 'bg-green-500/20 text-green-400' :
                        check.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        check.status === 'fail' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {check.status}
                      </Badge>
                    </div>
                    <div className="text-slate-300 text-sm mb-2">{check.details}</div>
                    {check.recommendation && (
                      <Alert className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {check.recommendation}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-slate-400 text-sm">Performance</span>
                      <span className={`text-sm font-medium ${getStatusColor(check.status)}`}>
                        {Math.round(check.performance)}%
                      </span>
                    </div>
                    <Progress value={check.performance} className="mt-1 h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className="bg-slate-700/50 border-slate-600/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">{metric.name}</span>
                      <Badge className={`text-xs ${
                        metric.status === 'optimal' ? 'bg-green-500/20 text-green-400' :
                        metric.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {metric.status}
                      </Badge>
                    </div>
                    <div className={`text-lg font-bold ${getMetricStatusColor(metric.status)}`}>
                      {typeof metric.value === 'number' ? 
                        (metric.value < 10 ? metric.value.toFixed(1) : Math.round(metric.value)) : 
                        metric.value
                      } {metric.unit}
                    </div>
                    <div className="text-slate-400 text-xs mt-1">
                      Threshold: {metric.threshold} {metric.unit}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDiagnostics;
