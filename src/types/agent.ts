export interface Agent {
  id: string;
  identifier: string;
  name: string;
  type: string;
  description: string;
  is_active: boolean;
  status: string;
  tasks_completed: number;
  last_used: string;
  capabilities: string[];
  version: string;
  performance: number;
  created_at: string;
  owner_id?: string;
}

export interface CreateAgentData {
  identifier: string;
  name: string;
  type: string;
  description: string;
  capabilities?: string[];
  version?: string;
}