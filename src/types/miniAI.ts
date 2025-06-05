
export interface MiniAI {
  id: string;
  name: string;
  type: 'standard-tool' | 'mini-app';
  description: string;
  category: string;
  isActive: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  config: MiniAIConfig;
  author: string;
  isPublic: boolean;
}

export interface MiniAIConfig {
  contentType?: 'text' | 'html' | 'json' | 'mixed';
  actionType?: 'summarize' | 'translate' | 'extract' | 'analyze' | 'custom';
  outputFormat: 'text' | 'markdown' | 'json' | 'html';
  prompt?: string;
  model?: 'gpt-4' | 'gpt-3.5-turbo';
  maxTokens?: number;
  temperature?: number;
  parameters?: Record<string, any>;
}

export interface MiniAIArtifact {
  id: string;
  miniAIId: string;
  name: string;
  type: 'timer' | 'calculator' | 'list' | 'form' | 'dashboard' | 'custom';
  code: string;
  dataModel: Record<string, any>;
  isPublished: boolean;
  publishedUrl?: string;
}

export interface MemoryEntry {
  id: string;
  agentId: string;
  content: string;
  context: string;
  importance: 1 | 2 | 3 | 4 | 5;
  memoryType: 'permanent' | 'session' | 'temporary';
  triggerRules: string[];
  timestamp: Date;
  expiresAt?: Date;
}

export interface MiniAIExecution {
  id: string;
  miniAIId: string;
  input: any;
  output: any;
  status: 'running' | 'completed' | 'error';
  executedAt: Date;
  executionTime: number;
  error?: string;
}

export interface LinkExtraction {
  url: string;
  title: string;
  domain: string;
  isNoFollow: boolean;
  category: string;
  description?: string;
}
