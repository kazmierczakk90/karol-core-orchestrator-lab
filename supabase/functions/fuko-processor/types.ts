
export interface FukoMessage {
  id: string;
  timestamp: string;
  F: string;
  U: string;
  K: string;
  O: string;
  P: string;
  Z: string;
  K2: string;
  source_agent: string;
  target_agent?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  execution_result?: string;
}

export interface FukoAgent {
  id: string;
  name: string;
  category: 'core' | 'project' | 'service' | 'fuko' | 'system';
  status: 'active' | 'dormant' | 'monitoring';
  mode: 'CEO' | 'ECHO' | 'CREATIVE' | 'LIVE' | 'MENTOR';
  performance: number;
  last_update: string;
  capabilities: string[];
  dependencies: string[];
  competency_score: number;
}
