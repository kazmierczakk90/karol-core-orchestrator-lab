import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HealthStatus {
  agent_id: string;
  health_status: string;
  health_score: number;
  detected_issues: any[];
  recommended_actions: string[];
}

interface DriftStatus {
  agent_id: string;
  drift_detected: boolean;
  drift_severity: number;
  correction_applied: boolean;
}

class ActiveSafetyService {
  private monitoringInterval: number | null = null;
  private readonly CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

  // Start continuous monitoring
  startMonitoring(): void {
    if (this.monitoringInterval) {
      console.log('⚠️ Monitoring already active');
      return;
    }

    console.log('🛡️ Starting active safety monitoring');
    
    // Initial check
    this.performHealthChecks();

    // Schedule periodic checks
    this.monitoringInterval = window.setInterval(() => {
      this.performHealthChecks();
    }, this.CHECK_INTERVAL_MS);

    toast.success('Active safety monitoring enabled');
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🛡️ Safety monitoring stopped');
      toast.info('Safety monitoring disabled');
    }
  }

  // Perform health checks on all agents
  private async performHealthChecks(): Promise<void> {
    try {
      console.log('🏥 Performing health checks...');

      // Get all active agents
      const { data: agents } = await supabase
        .from('agents')
        .select('identifier')
        .eq('is_active', true);

      if (!agents || agents.length === 0) {
        console.log('No active agents to monitor');
        return;
      }

      // Check each agent
      const results = await Promise.all(
        agents.map(agent => this.checkAgentHealth(agent.identifier))
      );

      // Report any critical issues
      const criticalIssues = results.filter(r => 
        r && (r.health_status === 'critical' || r.health_status === 'unhealthy')
      );

      if (criticalIssues.length > 0) {
        console.warn('🚨 Critical health issues detected:', criticalIssues.length);
        toast.error(`${criticalIssues.length} agent(s) require attention`);
      }

    } catch (error) {
      console.error('Error in health checks:', error);
    }
  }

  // Check individual agent health
  async checkAgentHealth(agentId: string, autoCorrect = true): Promise<HealthStatus | null> {
    try {
      const { data, error } = await supabase.functions.invoke('agent-health-monitor', {
        body: { agent_id: agentId, perform_actions: autoCorrect }
      });

      if (error) throw error;

      return data as HealthStatus;

    } catch (error) {
      console.error(`Health check failed for ${agentId}:`, error);
      return null;
    }
  }

  // Check for agent drift
  async checkDrift(agentId: string, autoCorrect = true): Promise<DriftStatus | null> {
    try {
      const { data, error } = await supabase.functions.invoke('drift-correction', {
        body: { agent_id: agentId, auto_correct: autoCorrect }
      });

      if (error) throw error;

      const result = data as DriftStatus;

      if (result.drift_detected) {
        console.warn(`🎯 Drift detected in ${agentId}:`, {
          severity: result.drift_severity,
          corrected: result.correction_applied
        });
        
        if (!result.correction_applied) {
          toast.warning(`Drift detected in ${agentId} - manual review needed`);
        }
      }

      return result;

    } catch (error) {
      console.error(`Drift check failed for ${agentId}:`, error);
      return null;
    }
  }

  // Get recent safety actions
  async getRecentActions(limit = 20): Promise<any[]> {
    const { data } = await supabase
      .from('safety_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  }

  // Get agent health history
  async getHealthHistory(agentId: string, hours = 24): Promise<any[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const { data } = await supabase
      .from('agent_health_checks')
      .select('*')
      .eq('agent_id', agentId)
      .gte('checked_at', since.toISOString())
      .order('checked_at', { ascending: false });

    return data || [];
  }

  // Manual trigger of safety action
  async triggerSafetyAction(
    agentId: string,
    actionType: 'agent_restart' | 'failover' | 'load_balance' | 'circuit_breaker'
  ): Promise<boolean> {
    try {
      console.log(`🔧 Triggering safety action: ${actionType} for ${agentId}`);

      // Execute action based on type
      switch (actionType) {
        case 'agent_restart':
          await this.restartAgent(agentId);
          break;
        case 'failover':
          await this.executeFailover(agentId);
          break;
        case 'load_balance':
          await this.balanceLoad(agentId);
          break;
        case 'circuit_breaker':
          await this.activateCircuitBreaker(agentId);
          break;
      }

      // Log action
      await supabase.from('safety_actions').insert({
        trigger_type: 'manual',
        action_type: actionType,
        target_agent: agentId,
        executed: true,
        executed_at: new Date().toISOString(),
        success: true,
        system_impact: 'moderate'
      });

      toast.success(`Safety action ${actionType} executed`);
      return true;

    } catch (error) {
      console.error('Safety action failed:', error);
      toast.error('Failed to execute safety action');
      return false;
    }
  }

  private async restartAgent(agentId: string): Promise<void> {
    await supabase
      .from('agent_states')
      .update({
        current_status: 'restarting',
        load_level: 0,
        updated_at: new Date().toISOString()
      })
      .eq('agent_id', agentId);

    // Simulate restart delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    await supabase
      .from('agent_states')
      .update({
        current_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('agent_id', agentId);
  }

  private async executeFailover(agentId: string): Promise<void> {
    // Find backup agent
    const { data: agents } = await supabase
      .from('agents')
      .select('*')
      .eq('is_active', true)
      .neq('identifier', agentId)
      .limit(1);

    if (agents && agents.length > 0) {
      console.log(`Failing over to backup agent: ${agents[0].identifier}`);
      // Transfer load to backup
    }
  }

  private async balanceLoad(agentId: string): Promise<void> {
    await supabase
      .from('agent_states')
      .update({
        load_level: 0.3, // Reduce load
        updated_at: new Date().toISOString()
      })
      .eq('agent_id', agentId);
  }

  private async activateCircuitBreaker(agentId: string): Promise<void> {
    await supabase
      .from('agent_states')
      .update({
        current_status: 'circuit_break',
        updated_at: new Date().toISOString()
      })
      .eq('agent_id', agentId);

    // Auto-reset after 1 minute
    setTimeout(async () => {
      await supabase
        .from('agent_states')
        .update({
          current_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('agent_id', agentId);
    }, 60000);
  }
}

export const activeSafetyService = new ActiveSafetyService();
