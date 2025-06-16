
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldCheck, Activity, AlertTriangle, CheckCircle, XCircle, Search, Play } from 'lucide-react';
import { useMetaDecision } from '@/hooks/useMetaDecision';

const FukoAuditor = () => {
  const { 
    auditLogs, 
    isLoading, 
    createAuditLog 
  } = useMetaDecision();

  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      // Create sample audit entries
      const auditTypes = ['consistency_check', 'performance_audit', 'security_scan', 'integrity_verification'];
      const severities = ['info', 'warning', 'error'] as const;
      
      for (let i = 0; i < 3; i++) {
        const auditType = auditTypes[Math.floor(Math.random() * auditTypes.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        
        await createAuditLog({
          audit_type: auditType,
          target_entity: 'agent',
          target_id: `@agent-${Math.floor(Math.random() * 100)}`,
          consistency_score: 70 + Math.random() * 30,
          issues_found: {
            count: Math.floor(Math.random() * 5),
            categories: ['style_deviation', 'performance_anomaly'],
            details: [`Issue detected in ${auditType}`]
          },
          recommendations: {
            actions: ['Review configuration', 'Update parameters'],
            priority: severity === 'error' ? 'high' : 'medium'
          },
          severity_level: severity,
          resolved: false
        });
      }
    } catch (error) {
      console.error('Failed to run audit:', error);
    } finally {
      setIsAuditing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'info': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getConsistencyScore = (score: number | null) => {
    if (!score) return { color: 'text-gray-400', level: 'Unknown' };
    if (score >= 90) return { color: 'text-green-400', level: 'Excellent' };
    if (score >= 75) return { color: 'text-yellow-400', level: 'Good' };
    if (score >= 60) return { color: 'text-orange-400', level: 'Fair' };
    return { color: 'text-red-400', level: 'Poor' };
  };

  const stats = {
    totalAudits: auditLogs.length,
    unresolvedIssues: auditLogs.filter(log => !log.resolved).length,
    criticalIssues: auditLogs.filter(log => log.severity_level === 'critical' || log.severity_level === 'error').length,
    avgConsistency: auditLogs.length > 0 
      ? Math.round(auditLogs.reduce((acc, log) => acc + (log.consistency_score || 0), 0) / auditLogs.length)
      : 0
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-green-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Activity className="h-8 w-8 text-green-400 animate-spin" />
              <span className="ml-3 text-slate-300">Loading FUKO-Auditor...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800/50 border-green-800/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6" />
            <span>FUKO-Auditor</span>
            <Badge className="bg-green-500/20 text-green-400 ml-2">Level 8 - Active</Badge>
          </CardTitle>
          <CardDescription className="text-slate-300">
            System audytu spójności, kontroli jakości i weryfikacji integralności
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{stats.totalAudits}</div>
              <div className="text-slate-400 text-sm">Total Audits</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-yellow-400 text-2xl font-bold">{stats.unresolvedIssues}</div>
              <div className="text-slate-400 text-sm">Unresolved</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-red-400 text-2xl font-bold">{stats.criticalIssues}</div>
              <div className="text-slate-400 text-sm">Critical Issues</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold">{stats.avgConsistency}%</div>
              <div className="text-slate-400 text-sm">Avg Consistency</div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-semibold">Audit Logs</h3>
            <Button 
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isAuditing ? <Activity className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              <span className="ml-2">
                {isAuditing ? 'Running Audit...' : 'Run System Audit'}
              </span>
            </Button>
          </div>

          <div className="rounded-lg border border-slate-700/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="text-slate-300">Audit Type</TableHead>
                  <TableHead className="text-slate-300">Target</TableHead>
                  <TableHead className="text-slate-300">Severity</TableHead>
                  <TableHead className="text-slate-300">Consistency Score</TableHead>
                  <TableHead className="text-slate-300">Issues Found</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => {
                  const consistencyInfo = getConsistencyScore(log.consistency_score);
                  const issuesCount = log.issues_found?.count || 0;
                  
                  return (
                    <TableRow key={log.id} className="border-slate-700/50 hover:bg-slate-700/30">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Search className="h-4 w-4 text-green-400" />
                          <div>
                            <div className="font-semibold text-white">{log.audit_type}</div>
                            <div className="text-slate-400 text-sm">
                              {log.target_entity}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-slate-300">{log.target_id}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(log.severity_level)}>
                          {log.severity_level.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${consistencyInfo.color}`}>
                            {log.consistency_score?.toFixed(1) || 'N/A'}%
                          </span>
                          <span className="text-slate-400 text-sm">
                            ({consistencyInfo.level})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {issuesCount > 0 ? (
                            <>
                              <AlertTriangle className="h-4 w-4 text-orange-400" />
                              <span className="text-orange-400 font-bold">{issuesCount}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-green-400">None</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {log.resolved ? (
                            <Badge className="bg-green-500/20 text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              <XCircle className="h-3 w-3 mr-1" />
                              Open
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-400 text-sm">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {auditLogs.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <ShieldCheck className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No audit logs found</p>
              <p>Run a system audit to start monitoring system integrity.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FukoAuditor;
