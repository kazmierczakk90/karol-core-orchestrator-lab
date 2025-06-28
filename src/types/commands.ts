
export interface CoreCommand {
  id: string;
  name: string;
  description: string;
  module: string;
  syntax: string;
  parameters?: CommandParameter[];
  requiredRole?: 'user' | 'admin' | 'system';
  category: CommandCategory;
  isActive: boolean;
  executionType: 'immediate' | 'queued' | 'background';
  aiIntegrated?: boolean;
}

export interface CommandParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description?: string;
  defaultValue?: any;
}

export type CommandCategory = 
  | 'dashboard' | 'memory' | 'admin' | 'analytics' 
  | 'quantum' | 'cognitive' | 'evolution' | 'transcendence'
  | 'voice' | 'security' | 'orchestrator' | 'storage'
  | 'diagnostics' | 'logging' | 'planning' | 'scenarios'
  | 'inspector' | 'feedback' | 'system';

export interface CommandExecutionResult {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
  executionTime: number;
}

export interface CommandContext {
  userId?: string;
  sessionId?: string;
  agentId?: string;
  metadata?: Record<string, any>;
}
