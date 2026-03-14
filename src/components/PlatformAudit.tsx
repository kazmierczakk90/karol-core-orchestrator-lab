
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useAIOrchestrator } from '@/hooks/useAIOrchestrator';
import { useOpenAI } from '@/hooks/useOpenAI';
import { supabase } from '@/integrations/supabase/db';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Activity,
  Database,
  Shield,
  Zap,
  Brain,
  Users,
  BarChart3,
  Clock,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditResult {
  category: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  score: number;
  recommendations?: string[];
}

interface PerformanceMetrics {
  responseTime: number;
  uptime: number;
  errorRate: number;
  activeConnections: number;
}

const PlatformAudit = () => {
  const { user, profile } = useAuth();
  const { systemMetrics, isLoadingMetrics } = useAIOrchestrator();
  const { chatCompletion, isLoading: aiLoading } = useOpenAI();
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    responseTime: 0,
    uptime: 100,
    errorRate: 0,
    activeConnections: 0
  });

  useEffect(() => {
    // Auto-run audit on component mount for admin users
    if (profile?.role === 'admin' && auditResults.length === 0) {
      setTimeout(() => runPlatformAudit(), 1000);
    }
  }, [profile]);

  const runPlatformAudit = async () => {
    setIsRunningAudit(true);
    const results: AuditResult[] = [];
    const startTime = Date.now();

    try {
      console.log('Starting platform audit...');

      // 1. Database Connection Audit
      try {
        const dbStartTime = Date.now();
        const { data: dbTest, error } = await supabase.from('agents').select('count').limit(1);
        const dbResponseTime = Date.now() - dbStartTime;
        
        if (error) throw error;
        
        results.push({
          category: 'Database',
          status: 'success',
          message: `Database connection active (${dbResponseTime}ms response time)`,
          score: dbResponseTime < 500 ? 100 : dbResponseTime < 1000 ? 90 : 80
        });

        setPerformanceMetrics(prev => ({ ...prev, responseTime: dbResponseTime }));
      } catch (error) {
        console.error('Database audit failed:', error);
        results.push({
          category: 'Database',
          status: 'error',
          message: 'Database connection failed',
          score: 0,
          recommendations: ['Check Supabase connection', 'Verify environment variables', 'Review network connectivity']
        });
      }

      // 2. Authentication System Audit
      if (user && profile) {
        const profileComplete = profile.first_name && profile.last_name;
        results.push({
          category: 'Authentication',
          status: 'success',
          message: `User authenticated as ${profile.role} (Profile: ${profileComplete ? 'Complete' : 'Partial'})`,
          score: profileComplete ? 100 : 85
        });
      } else {
        results.push({
          category: 'Authentication',
          status: 'warning',
          message: 'User not authenticated or profile incomplete',
          score: 50,
          recommendations: ['Complete user profile setup', 'Verify authentication flow']
        });
      }

      // 3. OpenAI Integration Audit
      try {
        const aiStartTime = Date.now();
        await chatCompletion([
          { role: 'user', content: 'System health check - respond with OK' }
        ], 'gpt-3.5-turbo', { max_tokens: 5 });
        const aiResponseTime = Date.now() - aiStartTime;
        
        results.push({
          category: 'AI Integration',
          status: 'success',
          message: `OpenAI API connected (${aiResponseTime}ms response time)`,
          score: aiResponseTime < 2000 ? 100 : aiResponseTime < 5000 ? 90 : 80
        });
      } catch (error) {
        console.error('OpenAI audit failed:', error);
        results.push({
          category: 'AI Integration',
          status: 'error',
          message: 'OpenAI API connection failed',
          score: 0,
          recommendations: ['Verify OpenAI API key', 'Check API usage limits', 'Review network connectivity']
        });
      }

      // 4. Real-time Updates Audit
      try {
        const channel = supabase.channel('audit-test-' + Date.now());
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Real-time connection timeout'));
          }, 5000);
          
          channel.subscribe((status) => {
            clearTimeout(timeout);
            if (status === 'SUBSCRIBED') {
              resolve(true);
            } else {
              reject(new Error('Failed to subscribe to real-time channel'));
            }
          });
        });
        
        results.push({
          category: 'Real-time',
          status: 'success',
          message: 'Real-time subscriptions working properly',
          score: 100
        });
        
        supabase.removeChannel(channel);
        setPerformanceMetrics(prev => ({ ...prev, activeConnections: 1 }));
      } catch (error) {
        console.error('Real-time audit failed:', error);
        results.push({
          category: 'Real-time',
          status: 'warning',
          message: 'Real-time subscription issues detected',
          score: 70,
          recommendations: ['Check network connectivity', 'Verify Supabase real-time settings', 'Review firewall configuration']
        });
      }

      // 5. Security Audit
      const hasSecureRole = profile?.role === 'admin' || profile?.role === 'user';
      const hasCompleteProfile = profile?.first_name && profile?.last_name;
      const securityScore = hasSecureRole ? (hasCompleteProfile ? 100 : 90) : 60;
      
      results.push({
        category: 'Security',
        status: securityScore >= 90 ? 'success' : 'warning',
        message: hasSecureRole ? 
          `User roles properly configured (Score: ${securityScore})` : 
          'User role configuration needs review',
        score: securityScore,
        recommendations: securityScore < 90 ? 
          ['Complete user profile information', 'Review user role assignments', 'Implement proper access controls'] : 
          undefined
      });

      // 6. Performance Metrics Audit
      const metricsCount = systemMetrics?.length || 0;
      const totalTime = Date.now() - startTime;
      
      results.push({
        category: 'Performance',
        status: metricsCount > 0 ? 'success' : 'warning',
        message: metricsCount > 0 ? 
          `${metricsCount} metrics collected (Audit completed in ${totalTime}ms)` : 
          'Limited performance metrics available',
        score: metricsCount > 0 ? 95 : 60,
        recommendations: metricsCount === 0 ? 
          ['Enable detailed monitoring', 'Configure metric collection', 'Set up performance alerts'] : 
          undefined
      });

      // 7. System Health Audit
      const errorCount = results.filter(r => r.status === 'error').length;
      const warningCount = results.filter(r => r.status === 'warning').length;
      const healthScore = errorCount === 0 ? (warningCount === 0 ? 100 : 85) : 60;
      
      results.push({
        category: 'System Health',
        status: healthScore >= 90 ? 'success' : healthScore >= 70 ? 'warning' : 'error',
        message: `Overall system status: ${errorCount} errors, ${warningCount} warnings`,
        score: healthScore
      });

      // Calculate overall score
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      const avgScore = Math.round(totalScore / results.length);
      setOverallScore(avgScore);
      setAuditResults(results);

      // Update performance metrics
      setPerformanceMetrics(prev => ({
        ...prev,
        uptime: avgScore,
        errorRate: (errorCount / results.length) * 100
      }));

      const auditStatus = avgScore >= 90 ? 'excellent' : avgScore >= 80 ? 'good' : avgScore >= 70 ? 'fair' : 'poor';
      toast.success(`Platform audit completed! Overall score: ${avgScore}% (${auditStatus})`);

      console.log('Platform audit completed:', {
        score: avgScore,
        errors: errorCount,
        warnings: warningCount,
        duration: totalTime
      });

      // Log audit results to database
      try {
        await supabase.from('audit_logs').insert({
          audit_type: 'platform_health',
          target_entity: 'system',
          target_id: 'platform',
          consistency_score: avgScore,
          issues_found: JSON.stringify(results.filter(r => r.status === 'error' || r.status === 'warning')),
          recommendations: JSON.stringify(results.flatMap(r => r.recommendations || [])),
          severity_level: avgScore >= 80 ? 'info' : avgScore >= 60 ? 'warning' : 'error'
        });
      } catch (logError) {
        console.error('Failed to log audit results:', logError);
      }

    } catch (error) {
      console.error('Audit error:', error);
      toast.error('Audit failed to complete');
    } finally {
      setIsRunningAudit(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'authentication': return <Shield className="h-4 w-4" />;
      case 'ai integration': return <Brain className="h-4 w-4" />;
      case 'real-time': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'performance': return <BarChart3 className="h-4 w-4" />;
      case 'system health': return <TrendingUp className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-cyan-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Platform Health Audit</span>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Comprehensive system health and performance analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-400">Response Time</span>
              </div>
              <p className="text-lg font-semibold text-white">{performanceMetrics.responseTime}ms</p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-xs text-slate-400">Uptime</span>
              </div>
              <p className="text-lg font-semibold text-white">{performanceMetrics.uptime}%</p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <span className="text-xs text-slate-400">Error Rate</span>
              </div>
              <p className="text-lg font-semibold text-white">{performanceMetrics.errorRate.toFixed(1)}%</p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-400">Connections</span>
              </div>
              <p className="text-lg font-semibold text-white">{performanceMetrics.activeConnections}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400">Overall Health Score</span>
                <Badge variant={overallScore >= 90 ? "default" : overallScore >= 80 ? "secondary" : overallScore >= 70 ? "outline" : "destructive"}>
                  {overallScore}%
                </Badge>
              </div>
              <Progress value={overallScore} className="w-64" />
            </div>
            
            <Button 
              onClick={runPlatformAudit}
              disabled={isRunningAudit || aiLoading}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isRunningAudit ? 'Running Audit...' : 'Run Platform Audit'}
            </Button>
          </div>

          {auditResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Audit Results</h3>
              
              <div className="grid gap-4">
                {auditResults.map((result, index) => (
                  <Card key={index} className="bg-slate-900/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getCategoryIcon(result.category)}
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-white">{result.category}</span>
                              {getStatusIcon(result.status)}
                            </div>
                            <p className="text-sm text-slate-300">{result.message}</p>
                            
                            {result.recommendations && result.recommendations.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-slate-400 mb-1">Recommendations:</p>
                                <ul className="text-xs text-slate-300 space-y-1">
                                  {result.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start space-x-1">
                                      <span className="text-cyan-400">•</span>
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Badge 
                          variant={result.status === 'success' ? "default" : 
                                  result.status === 'warning' ? "secondary" : "destructive"}
                        >
                          {result.score}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformAudit;
