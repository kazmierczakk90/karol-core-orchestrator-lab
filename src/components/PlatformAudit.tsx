
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useAIOrchestrator } from '@/hooks/useAIOrchestrator';
import { useOpenAI } from '@/hooks/useOpenAI';
import { supabase } from '@/integrations/supabase/client';
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
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditResult {
  category: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  score: number;
  recommendations?: string[];
}

const PlatformAudit = () => {
  const { user, profile } = useAuth();
  const { systemMetrics, isLoadingMetrics } = useAIOrchestrator();
  const { chatCompletion, isLoading: aiLoading } = useOpenAI();
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  const runPlatformAudit = async () => {
    setIsRunningAudit(true);
    const results: AuditResult[] = [];

    try {
      // 1. Database Connection Audit
      try {
        const { data: dbTest } = await supabase.from('agents').select('count').limit(1);
        results.push({
          category: 'Database',
          status: 'success',
          message: 'Database connection active and healthy',
          score: 100
        });
      } catch (error) {
        results.push({
          category: 'Database',
          status: 'error',
          message: 'Database connection failed',
          score: 0,
          recommendations: ['Check Supabase connection', 'Verify environment variables']
        });
      }

      // 2. Authentication System Audit
      if (user && profile) {
        results.push({
          category: 'Authentication',
          status: 'success',
          message: `User authenticated successfully as ${profile.role}`,
          score: 100
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
        await chatCompletion([
          { role: 'user', content: 'Test connection' }
        ], 'gpt-3.5-turbo', { max_tokens: 10 });
        
        results.push({
          category: 'AI Integration',
          status: 'success',
          message: 'OpenAI API connection successful',
          score: 100
        });
      } catch (error) {
        results.push({
          category: 'AI Integration',
          status: 'error',
          message: 'OpenAI API connection failed',
          score: 0,
          recommendations: ['Verify OpenAI API key', 'Check API usage limits']
        });
      }

      // 4. Real-time Updates Audit
      try {
        const channel = supabase.channel('audit-test');
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);
          channel.subscribe((status) => {
            clearTimeout(timeout);
            if (status === 'SUBSCRIBED') {
              resolve(true);
            } else {
              reject(new Error('Failed to subscribe'));
            }
          });
        });
        
        results.push({
          category: 'Real-time',
          status: 'success',
          message: 'Real-time subscriptions working',
          score: 100
        });
        
        supabase.removeChannel(channel);
      } catch (error) {
        results.push({
          category: 'Real-time',
          status: 'warning',
          message: 'Real-time subscription issues detected',
          score: 70,
          recommendations: ['Check network connectivity', 'Verify Supabase real-time settings']
        });
      }

      // 5. Security Audit
      const hasSecureRole = profile?.role === 'admin' || profile?.role === 'user';
      results.push({
        category: 'Security',
        status: hasSecureRole ? 'success' : 'warning',
        message: hasSecureRole ? 'User roles properly configured' : 'User role configuration needs review',
        score: hasSecureRole ? 100 : 60,
        recommendations: hasSecureRole ? undefined : ['Review user role assignments', 'Implement proper access controls']
      });

      // 6. Performance Metrics Audit
      if (systemMetrics && systemMetrics.length > 0) {
        results.push({
          category: 'Performance',
          status: 'success',
          message: `${systemMetrics.length} metrics collected successfully`,
          score: 95
        });
      } else {
        results.push({
          category: 'Performance',
          status: 'warning',
          message: 'Limited performance metrics available',
          score: 60,
          recommendations: ['Enable detailed monitoring', 'Configure metric collection']
        });
      }

      // Calculate overall score
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      const avgScore = Math.round(totalScore / results.length);
      setOverallScore(avgScore);
      setAuditResults(results);

      toast.success(`Platform audit completed! Overall score: ${avgScore}%`);

      // Log audit results
      await supabase.from('audit_logs').insert({
        audit_type: 'platform_health',
        target_entity: 'system',
        target_id: 'platform',
        consistency_score: avgScore,
        issues_found: results.filter(r => r.status === 'error' || r.status === 'warning'),
        recommendations: results.flatMap(r => r.recommendations || []),
        severity_level: avgScore >= 80 ? 'info' : avgScore >= 60 ? 'warning' : 'error'
      });

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
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400">Overall Health Score</span>
                <Badge variant={overallScore >= 80 ? "default" : overallScore >= 60 ? "secondary" : "destructive"}>
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
