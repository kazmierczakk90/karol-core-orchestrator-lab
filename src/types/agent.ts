
export interface Agent {
  id: string;
  is_active: boolean;
  owner_id: string | null;
  created_at: string;
  tasks_completed: number;
  last_used: string;
  performance: number;
  name: string;
  type: "core" | "karol" | "integration" | "utility";
  description: string;
  identifier: string | null;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  capabilities: string[];
  version: string;
}

export type CreateAgentData = {
  identifier: string;
  name: string;
  type: "core" | "karol" | "integration" | "utility";
  description: string;
  version: string;
  capabilities: string[];
};

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
