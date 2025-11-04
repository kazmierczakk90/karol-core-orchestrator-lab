import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckRequest {
  agent_id: string;
  perform_actions?: boolean; // whether to auto-correct issues
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agent_id, perform_actions = true } = await req.json() as HealthCheckRequest;
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🏥 Health check for agent:', agent_id);

    // 1. Get agent state
    const { data: agentState } = await supabase
      .from('agent_states')
      .select('*')
      .eq('agent_id', agent_id)
      .maybeSingle();

    if (!agentState) {
      console.log('⚠️ Agent not found, creating default state');
      await supabase.from('agent_states').insert({
        agent_id,
        current_status: 'idle',
        performance_score: 85
      });
    }

    // 2. Get recent agent activity
    const { data: recentDecisions } = await supabase
      .from('meta_decisions')
      .select('*')
      .eq('source_agent', agent_id)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    const { data: recentLogs } = await supabase
      .from('logs')
      .select('*')
      .eq('agent_id', agent_id)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(100);

    // 3. Calculate health metrics
    const errorLogs = recentLogs?.filter(log => log.log_type === 'error') || [];
    const totalLogs = recentLogs?.length || 1;
    const errorRate = errorLogs.length / totalLogs;

    const completedDecisions = recentDecisions?.filter(d => d.status === 'completed') || [];
    const failedDecisions = recentDecisions?.filter(d => d.status === 'failed') || [];
    const successRate = recentDecisions?.length 
      ? completedDecisions.length / recentDecisions.length 
      : 1;

    const avgResponseTime = agentState?.performance_score 
      ? (100 - agentState.performance_score) * 10 // Mock calculation
      : 500;

    const loadLevel = agentState?.load_level || 0;

    // 4. Assess health status
    let healthStatus: 'healthy' | 'degraded' | 'unhealthy' | 'critical' | 'offline' = 'healthy';
    let healthScore = 100;
    const detectedIssues: any[] = [];
    const recommendedActions: string[] = [];

    // Error rate check
    if (errorRate > 0.5) {
      healthStatus = 'critical';
      healthScore -= 40;
      detectedIssues.push({
        issue: 'High error rate',
        severity: 'critical',
        value: `${(errorRate * 100).toFixed(1)}%`,
        threshold: '50%'
      });
      recommendedActions.push('restart_agent');
    } else if (errorRate > 0.3) {
      healthStatus = healthStatus === 'healthy' ? 'unhealthy' : healthStatus;
      healthScore -= 30;
      detectedIssues.push({
        issue: 'Elevated error rate',
        severity: 'high',
        value: `${(errorRate * 100).toFixed(1)}%`,
        threshold: '30%'
      });
      recommendedActions.push('investigate_errors');
    } else if (errorRate > 0.1) {
      healthStatus = healthStatus === 'healthy' ? 'degraded' : healthStatus;
      healthScore -= 15;
      detectedIssues.push({
        issue: 'Moderate error rate',
        severity: 'medium',
        value: `${(errorRate * 100).toFixed(1)}%`
      });
    }

    // Success rate check
    if (successRate < 0.5) {
      healthStatus = 'critical';
      healthScore -= 30;
      detectedIssues.push({
        issue: 'Low success rate',
        severity: 'critical',
        value: `${(successRate * 100).toFixed(1)}%`
      });
      recommendedActions.push('check_configuration');
    } else if (successRate < 0.7) {
      healthStatus = healthStatus === 'healthy' ? 'degraded' : healthStatus;
      healthScore -= 20;
      detectedIssues.push({
        issue: 'Below optimal success rate',
        severity: 'medium',
        value: `${(successRate * 100).toFixed(1)}%`
      });
    }

    // Load check
    if (loadLevel > 0.9) {
      healthScore -= 25;
      detectedIssues.push({
        issue: 'High load',
        severity: 'high',
        value: `${(loadLevel * 100).toFixed(0)}%`
      });
      recommendedActions.push('load_balance');
    } else if (loadLevel > 0.7) {
      healthScore -= 10;
      detectedIssues.push({
        issue: 'Elevated load',
        severity: 'medium',
        value: `${(loadLevel * 100).toFixed(0)}%`
      });
    }

    // Response time check
    if (avgResponseTime > 2000) {
      healthScore -= 15;
      detectedIssues.push({
        issue: 'Slow response time',
        severity: 'medium',
        value: `${avgResponseTime}ms`
      });
      recommendedActions.push('optimize_performance');
    }

    healthScore = Math.max(0, healthScore);

    console.log('📊 Health assessment:', {
      status: healthStatus,
      score: healthScore,
      issues: detectedIssues.length
    });

    // 5. Save health check
    const { data: healthCheck } = await supabase
      .from('agent_health_checks')
      .insert({
        agent_id,
        response_time: avgResponseTime,
        error_rate: errorRate,
        success_rate: successRate,
        load_level: loadLevel,
        health_status: healthStatus,
        health_score: healthScore,
        detected_issues: detectedIssues,
        recommended_actions: recommendedActions,
        alert_triggered: healthStatus === 'critical' || healthStatus === 'unhealthy',
        alert_level: healthStatus === 'critical' ? 'critical' : healthStatus === 'unhealthy' ? 'error' : 'warning'
      })
      .select()
      .single();

    // 6. Perform auto-correction if needed
    let actionTaken = 'none';
    if (perform_actions && recommendedActions.length > 0) {
      console.log('🔧 Performing auto-correction actions:', recommendedActions);

      if (recommendedActions.includes('restart_agent')) {
        // Simulate agent restart
        await supabase
          .from('agent_states')
          .update({
            current_status: 'restarting',
            updated_at: new Date().toISOString()
          })
          .eq('agent_id', agent_id);

        await supabase
          .from('safety_actions')
          .insert({
            triggered_by_check: healthCheck.id,
            trigger_type: 'health_issue',
            action_type: 'agent_restart',
            target_agent: agent_id,
            action_parameters: { reason: 'high_error_rate' },
            executed: true,
            executed_at: new Date().toISOString(),
            success: true,
            system_impact: 'moderate'
          });

        actionTaken = 'restart';
      } else if (recommendedActions.includes('load_balance')) {
        // Trigger load balancing
        await supabase
          .from('safety_actions')
          .insert({
            triggered_by_check: healthCheck.id,
            trigger_type: 'health_issue',
            action_type: 'load_balance',
            target_agent: agent_id,
            action_parameters: { current_load: loadLevel },
            executed: true,
            executed_at: new Date().toISOString(),
            success: true,
            system_impact: 'minimal'
          });

        actionTaken = 'load_balance';
      }

      // Update health check with action taken
      await supabase
        .from('agent_health_checks')
        .update({ auto_action_taken: actionTaken })
        .eq('id', healthCheck.id);
    }

    return new Response(JSON.stringify({
      agent_id,
      health_status: healthStatus,
      health_score: healthScore,
      metrics: {
        error_rate: errorRate,
        success_rate: successRate,
        response_time: avgResponseTime,
        load_level: loadLevel
      },
      issues: detectedIssues,
      recommendations: recommendedActions,
      action_taken: actionTaken,
      alert: healthStatus === 'critical' || healthStatus === 'unhealthy'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error in health monitoring:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to perform health check'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
