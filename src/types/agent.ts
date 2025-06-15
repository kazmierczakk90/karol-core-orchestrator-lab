
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
