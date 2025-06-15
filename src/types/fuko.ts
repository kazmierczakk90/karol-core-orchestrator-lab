
export interface FukoMessage {
  id?: string;
  timestamp?: string;
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
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  execution_result?: string;
}
