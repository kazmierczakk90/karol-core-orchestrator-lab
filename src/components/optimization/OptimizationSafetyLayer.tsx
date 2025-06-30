
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, Zap, 
  Database, Undo2, Lock, Eye, Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SafetyCheck {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'warning' | 'fail' | 'pending';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'stability' | 'performance' | 'security' | 'data';
  lastCheck: Date;
  autoFix: boolean;
}

interface SystemSnapshot {
  id: string;
  timestamp: Date;
  description: string;
  size: string;
  status: 'healthy' | 'degraded' | 'critical';
  canRestore: boolean;
}

const OptimizationSafetyLayer = () => {
  const { toast } = useToast();
  const [safetyEnabled, setSafetyEnabled] = useState(true);
  const [rollbackProtection, setRollbackProtection] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [validationLevel, setValidationLevel] = useState('strict');

  const [safetyChecks] = useState<SafetyCheck[]>([
    {
      id: 'memory-stability',
      name: 'Memory Stability Check',
      description: 'Validates memory usage patterns and detects potential leaks',
      status: 'pass',
      severity: 'high',
      category: 'stability',
      lastCheck: new Date(Date.now() - 300000),
      autoFix: true
    },
    {
      id: 'performance-regression',
      name: 'Performance Regression Test',
      description: 'Ensures optimizations don\'t degrade system performance',
      status: 'pass',
      severity: 'medium',
      category: 'performance',
      lastCheck: new Date(Date.now() - 600000),
      autoFix: false
    },
    {
      id: 'security-validation',
      name: 'Security Validation',
      description: 'Verifies security protocols remain intact after optimizations',
      status: 'warning',
      severity: 'critical',
      category: 'security',
      lastCheck: new Date(Date.now() - 900000),
      autoFix: true
    },
    {
      id: 'data-integrity',
      name: 'Data Integrity Check',
      description: 'Validates data consistency and prevents corruption',
      status: 'pass',
      severity: 'critical',
      category: 'data',
      lastCheck: new Date(Date.now() - 1200000),
      autoFix: true
    },
    {
      id: 'component-compatibility',
      name: 'Component Compatibility',
      description: 'Ensures all components work together after optimization',
      status: 'pending',
      severity: 'medium',
      category: 'stability',
      lastCheck: new Date(Date.now() - 1500000),
      autoFix: false
    }
  ]);

  const [snapshots] = useState<SystemSnapshot[]>([
    {
      id: 'snapshot-1',
      timestamp: new Date(Date.now() - 3600000),
      description: 'Pre-optimization baseline',
      size: '2.3 MB',
      status: 'healthy',
      canRestore: true
    },
    {
      id: 'snapshot-2',
      timestamp: new Date(Date.now() - 7200000),
      description: 'After performance optimizations',
      size: '2.1 MB',
      status: 'healthy',
      canRestore: true
    },
    {
      id: 'snapshot-3',
      timestamp: new Date(Date.now() - 86400000),
      description: 'Daily automated backup',
      size: '2.4 MB',
      status: 'healthy',
      canRestore: true
    }
  ]);

  const runSafetyCheck = async (checkId: string) => {
    const check = safetyChecks.find(c => c.id === checkId);
    toast({
      title: 'Running Safety Check',
      description: `Executing ${check?.name}...`,
    });

    // Simulate safety check
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: 'Safety Check Complete',
      description: `${check?.name} completed successfully`,
    });
  };

  const createSnapshot = async () => {
    toast({
      title: 'Creating System Snapshot',
      description: 'Capturing current system state...',
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    toast({
      title: 'Snapshot Created',
      description: 'System snapshot saved successfully',
    });
  };

  const restoreSnapshot = async (snapshotId: string) => {
    const snapshot = snapshots.find(s => s.id === snapshotId);
    toast({
      title: 'Restoring System',
      description: `Restoring to: ${snapshot?.description}`,
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    toast({
      title: 'System Restored',
      description: 'System successfully restored to previous state',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'fail': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-slate-400" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stability': return <Activity className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'data': return <Database className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getSnapshotStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const passedChecks = safetyChecks.filter(c => c.status === 'pass').length;
  const warningChecks = safetyChecks.filter(c => c.status === 'warning').length;
  const failedChecks = safetyChecks.filter(c => c.status === 'fail').length;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-red-800/30">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Optimization Safety Layer</span>
            <Badge variant="outline" className={safetyEnabled ? "text-green-400" : "text-red-400"}>
              {safetyEnabled ? 'Protected' : 'Disabled'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Safety Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Safety Layer</div>
                    <div className="text-sm text-slate-400">Main protection</div>
                  </div>
                  <Switch 
                    checked={safetyEnabled} 
                    onCheckedChange={setSafetyEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Rollback Protection</div>
                    <div className="text-sm text-slate-400">Auto-restore on failure</div>
                  </div>
                  <Switch 
                    checked={rollbackProtection} 
                    onCheckedChange={setRollbackProtection}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Auto Backup</div>
                    <div className="text-sm text-slate-400">Periodic snapshots</div>
                  </div>
                  <Switch 
                    checked={autoBackup} 
                    onCheckedChange={setAutoBackup}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Safety Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{passedChecks}</div>
              <div className="text-slate-400 text-sm">Passed Checks</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-yellow-400 text-2xl font-bold">{warningChecks}</div>
              <div className="text-slate-400 text-sm">Warnings</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-red-400 text-2xl font-bold">{failedChecks}</div>
              <div className="text-slate-400 text-sm">Failed</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold">{snapshots.length}</div>
              <div className="text-slate-400 text-sm">Snapshots</div>
            </div>
          </div>

          {/* Safety Checks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Safety Validations</h3>
              <Button 
                onClick={createSnapshot} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Database className="h-4 w-4 mr-2" />
                Create Snapshot
              </Button>
            </div>

            <ScrollArea className="h-64">
              <div className="space-y-3">
                {safetyChecks.map(check => (
                  <Card key={check.id} className="bg-slate-700/50 border-slate-600/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getStatusIcon(check.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-white font-medium">{check.name}</h4>
                              <Badge className={getSeverityColor(check.severity)} variant="outline">
                                {check.severity}
                              </Badge>
                              <div className="text-slate-400">
                                {getCategoryIcon(check.category)}
                              </div>
                            </div>
                            <p className="text-sm text-slate-300 mb-2">{check.description}</p>
                            <div className="text-xs text-slate-500">
                              Last check: {check.lastCheck.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {check.autoFix && (
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              Auto-Fix
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            onClick={() => runSafetyCheck(check.id)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Activity className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* System Snapshots */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">System Snapshots</h3>
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {snapshots.map(snapshot => (
                  <Card key={snapshot.id} className="bg-slate-700/50 border-slate-600/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Database className="h-4 w-4 text-blue-400" />
                          <div>
                            <div className="text-white font-medium">{snapshot.description}</div>
                            <div className="text-sm text-slate-400">
                              {snapshot.timestamp.toLocaleString()} • {snapshot.size}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getSnapshotStatusColor(snapshot.status)}>
                            {snapshot.status}
                          </Badge>
                          {snapshot.canRestore ? (
                            <Button
                              size="sm"
                              onClick={() => restoreSnapshot(snapshot.id)}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              <Undo2 className="h-3 w-3 mr-1" />
                              Restore
                            </Button>
                          ) : (
                            <Button size="sm" disabled>
                              <Lock className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizationSafetyLayer;
