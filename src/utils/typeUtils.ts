
import { Json } from '@/integrations/supabase/types';
import { MetaDecision, AgentState, AuditLog, FukoMemory, FukoIdentity } from '@/types/metaDecision';

// Type conversion utilities for Supabase JSON to strict types
export const convertToMetaDecision = (data: any): MetaDecision => ({
  id: data.id,
  decision_type: data.decision_type,
  source_agent: data.source_agent,
  target_agent: data.target_agent,
  priority: data.priority,
  status: ['pending', 'processing', 'completed', 'failed'].includes(data.status) 
    ? data.status as 'pending' | 'processing' | 'completed' | 'failed'
    : 'pending',
  context: data.context,
  routing_score: data.routing_score,
  execution_result: data.execution_result,
  emotional_state: data.emotional_state,
  style_fingerprint: data.style_fingerprint,
  created_at: data.created_at,
  processed_at: data.processed_at,
  completed_at: data.completed_at
});

export const convertToAgentState = (data: any): AgentState => ({
  id: data.id,
  agent_id: data.agent_id,
  current_status: ['idle', 'busy', 'offline', 'error'].includes(data.current_status)
    ? data.current_status as 'idle' | 'busy' | 'offline' | 'error'
    : 'idle',
  emotional_state: data.emotional_state,
  performance_score: data.performance_score,
  load_level: data.load_level,
  last_decision_at: data.last_decision_at,
  style_consistency: data.style_consistency,
  identity_score: data.identity_score,
  updated_at: data.updated_at
});

export const convertToAuditLog = (data: any): AuditLog => ({
  id: data.id,
  audit_type: data.audit_type,
  target_entity: data.target_entity,
  target_id: data.target_id,
  consistency_score: data.consistency_score,
  issues_found: data.issues_found,
  recommendations: data.recommendations,
  severity_level: ['info', 'warning', 'error', 'critical'].includes(data.severity_level)
    ? data.severity_level as 'info' | 'warning' | 'error' | 'critical'
    : 'info',
  resolved: data.resolved,
  created_at: data.created_at
});

export const convertToFukoMemory = (data: any): FukoMemory => ({
  id: data.id,
  agent_id: data.agent_id,
  memory_type: data.memory_type,
  emotional_context: data.emotional_context,
  memory_content: data.memory_content,
  intensity_level: data.intensity_level,
  decay_rate: data.decay_rate,
  trigger_conditions: data.trigger_conditions,
  last_accessed: data.last_accessed,
  created_at: data.created_at
});

export const convertToFukoIdentity = (data: any): FukoIdentity => ({
  id: data.id,
  agent_id: data.agent_id,
  core_identity: data.core_identity,
  style_signature: data.style_signature,
  behavioral_patterns: data.behavioral_patterns,
  identity_evolution: data.identity_evolution,
  consistency_metrics: data.consistency_metrics,
  last_verification: data.last_verification,
  created_at: data.created_at
});
