import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/db';
import { MetaDecision, AgentState, RoutingRule, PriorityQueueItem, AuditLog, FukoMemory, FukoIdentity } from '@/types/metaDecision';
import { errorHandlingService } from '@/services/errorHandlingService';
import { 
  convertToMetaDecision, 
  convertToAgentState, 
  convertToAuditLog, 
  convertToFukoMemory, 
  convertToFukoIdentity 
} from '@/utils/typeUtils';

export const useMetaDecision = () => {
  const [metaDecisions, setMetaDecisions] = useState<MetaDecision[]>([]);
  const [agentStates, setAgentStates] = useState<AgentState[]>([]);
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
  const [priorityQueue, setPriorityQueue] = useState<PriorityQueueItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [fukoMemories, setFukoMemories] = useState<FukoMemory[]>([]);
  const [fukoIdentities, setFukoIdentities] = useState<FukoIdentity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all meta-decision data
  const fetchMetaDecisionData = async () => {
    try {
      setIsLoading(true);
      
      const [
        decisionsResult,
        agentStatesResult,
        routingRulesResult,
        priorityQueueResult,
        auditLogsResult,
        fukoMemoriesResult,
        fukoIdentitiesResult
      ] = await Promise.all([
        supabase.from('meta_decisions').select('*').order('created_at', { ascending: false }),
        supabase.from('agent_states').select('*').order('updated_at', { ascending: false }),
        supabase.from('routing_rules').select('*').eq('is_active', true),
        supabase.from('priority_queue').select('*').order('calculated_priority', { ascending: false }),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('fuko_ram').select('*').order('created_at', { ascending: false }),
        supabase.from('fuko_identity').select('*').order('created_at', { ascending: false })
      ]);

      if (decisionsResult.error) throw decisionsResult.error;
      if (agentStatesResult.error) throw agentStatesResult.error;
      if (routingRulesResult.error) throw routingRulesResult.error;
      if (priorityQueueResult.error) throw priorityQueueResult.error;
      if (auditLogsResult.error) throw auditLogsResult.error;
      if (fukoMemoriesResult.error) throw fukoMemoriesResult.error;
      if (fukoIdentitiesResult.error) throw fukoIdentitiesResult.error;

      setMetaDecisions((decisionsResult.data || []).map(convertToMetaDecision));
      setAgentStates((agentStatesResult.data || []).map(convertToAgentState));
      setRoutingRules(routingRulesResult.data || []);
      setPriorityQueue(priorityQueueResult.data || []);
      setAuditLogs((auditLogsResult.data || []).map(convertToAuditLog));
      setFukoMemories((fukoMemoriesResult.data || []).map(convertToFukoMemory));
      setFukoIdentities((fukoIdentitiesResult.data || []).map(convertToFukoIdentity));

    } catch (error) {
      errorHandlingService.handleSupabaseError(error, 'Fetching meta-decision data');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new meta decision
  const createMetaDecision = async (decision: Omit<MetaDecision, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('meta_decisions')
        .insert([decision])
        .select()
        .single();

      if (error) throw error;
      
      const convertedData = convertToMetaDecision(data);
      setMetaDecisions(prev => [convertedData, ...prev]);
      return convertedData;
    } catch (error) {
      errorHandlingService.handleSupabaseError(error, 'Creating meta decision');
      throw error;
    }
  };

  // Update agent state
  const updateAgentState = async (agentId: string, updates: Partial<AgentState>) => {
    try {
      const { data, error } = await supabase
        .from('agent_states')
        .upsert([{ agent_id: agentId, ...updates, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      
      const convertedData = convertToAgentState(data);
      setAgentStates(prev => {
        const index = prev.findIndex(state => state.agent_id === agentId);
        if (index >= 0) {
          const newStates = [...prev];
          newStates[index] = convertedData;
          return newStates;
        }
        return [convertedData, ...prev];
      });
      
      return convertedData;
    } catch (error) {
      errorHandlingService.handleSupabaseError(error, 'Updating agent state');
      throw error;
    }
  };

  // Process decision through routing
  const processDecision = async (decisionId: string) => {
    try {
      // Calculate routing score
      const { data: scoreData, error: scoreError } = await supabase
        .rpc('calculate_routing_score', {
          decision_data: {},
          agent_capabilities: []
        });

      if (scoreError) throw scoreError;

      // Update decision status
      const { data, error } = await supabase
        .from('meta_decisions')
        .update({
          status: 'processing',
          routing_score: scoreData,
          processed_at: new Date().toISOString()
        })
        .eq('id', decisionId)
        .select()
        .single();

      if (error) throw error;

      const convertedData = convertToMetaDecision(data);
      setMetaDecisions(prev => 
        prev.map(decision => 
          decision.id === decisionId ? convertedData : decision
        )
      );

      return convertedData;
    } catch (error) {
      errorHandlingService.handleSupabaseError(error, 'Processing decision');
      throw error;
    }
  };

  // Create audit log
  const createAuditLog = async (log: Omit<AuditLog, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert([log])
        .select()
        .single();

      if (error) throw error;
      
      const convertedData = convertToAuditLog(data);
      setAuditLogs(prev => [convertedData, ...prev.slice(0, 99)]);
      return convertedData;
    } catch (error) {
      errorHandlingService.handleSupabaseError(error, 'Creating audit log');
      throw error;
    }
  };

  // Create FUKO memory
  const createFukoMemory = async (memory: Omit<FukoMemory, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('fuko_ram')
        .insert([memory])
        .select()
        .single();

      if (error) throw error;
      
      const convertedData = convertToFukoMemory(data);
      setFukoMemories(prev => [convertedData, ...prev]);
      return convertedData;
    } catch (error) {
      errorHandlingService.handleSupabaseError(error, 'Creating FUKO memory');
      throw error;
    }
  };

  // Update FUKO identity with proper required fields
  const updateFukoIdentity = async (agentId: string, identity: Partial<FukoIdentity>) => {
    try {
      // Ensure required fields are present
      const identityData = {
        agent_id: agentId,
        core_identity: identity.core_identity || {},
        style_signature: identity.style_signature || `default-${agentId}`,
        behavioral_patterns: identity.behavioral_patterns,
        identity_evolution: identity.identity_evolution,
        consistency_metrics: identity.consistency_metrics,
        last_verification: identity.last_verification
      };

      const { data, error } = await supabase
        .from('fuko_identity')
        .upsert([identityData])
        .select()
        .single();

      if (error) throw error;
      
      const convertedData = convertToFukoIdentity(data);
      setFukoIdentities(prev => {
        const index = prev.findIndex(id => id.agent_id === agentId);
        if (index >= 0) {
          const newIdentities = [...prev];
          newIdentities[index] = convertedData;
          return newIdentities;
        }
        return [convertedData, ...prev];
      });
      
      return convertedData;
    } catch (error) {
      errorHandlingService.handleSupabaseError(error, 'Updating FUKO identity');
      throw error;
    }
  };

  useEffect(() => {
    fetchMetaDecisionData();
  }, []);

  return {
    metaDecisions,
    agentStates,
    routingRules,
    priorityQueue,
    auditLogs,
    fukoMemories,
    fukoIdentities,
    isLoading,
    createMetaDecision,
    updateAgentState,
    processDecision,
    createAuditLog,
    createFukoMemory,
    updateFukoIdentity,
    refetch: fetchMetaDecisionData
  };
};
