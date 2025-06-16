
export interface MetaDecision {
  id: string;
  decision_type: string;
  source_agent: string;
  target_agent?: string;
  priority: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  context?: any;
  routing_score?: number;
  execution_result?: any;
  emotional_state?: any;
  style_fingerprint?: string;
  created_at: string;
  processed_at?: string;
  completed_at?: string;
}

export interface AgentState {
  id: string;
  agent_id: string;
  current_status: 'idle' | 'busy' | 'offline' | 'error';
  emotional_state: any;
  performance_score: number;
  load_level: number;
  last_decision_at?: string;
  style_consistency: number;
  identity_score: number;
  updated_at: string;
}

export interface RoutingRule {
  id: string;
  rule_name: string;
  agent_pattern: string;
  decision_pattern: string;
  priority_modifier: number;
  conditions?: any;
  actions?: any;
  is_active: boolean;
  created_at: string;
}

export interface PriorityQueueItem {
  id: string;
  decision_id: string;
  calculated_priority: number;
  queue_position?: number;
  resource_requirements?: any;
  estimated_duration?: number;
  dependencies?: string[];
  scheduled_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  audit_type: string;
  target_entity: string;
  target_id: string;
  consistency_score?: number;
  issues_found?: any;
  recommendations?: any;
  severity_level: 'info' | 'warning' | 'error' | 'critical';
  resolved: boolean;
  created_at: string;
}

export interface FukoMemory {
  id: string;
  agent_id: string;
  memory_type: string;
  emotional_context: any;
  memory_content: string;
  intensity_level: number;
  decay_rate: number;
  trigger_conditions?: any;
  last_accessed?: string;
  created_at: string;
}

export interface FukoIdentity {
  id: string;
  agent_id: string;
  core_identity: any;
  style_signature: string;
  behavioral_patterns?: any;
  identity_evolution?: any[];
  consistency_metrics?: any;
  last_verification?: string;
  created_at: string;
}
