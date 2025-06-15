
export interface MiniAI {
  id: string;
  name: string;
  type: string;
  description: string | null;
  category: string | null;
  is_active: boolean | null;
  is_pinned: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  config: { [key: string]: any } | null;
  author: string | null;
  is_public: boolean | null;
}

export interface CreateMiniAIData {
  name: string;
  type: string;
  description?: string;
  category?: string;
  config?: { [key: string]: any };
}

export interface MiniAIConfig {
  actionType?: 'extract' | 'summarize' | 'translate' | 'analyze' | 'custom';
  outputFormat?: 'json' | 'markdown' | 'text' | 'html';
  parameters?: { [key: string]: any };
  prompt?: string;
}

export interface MiniAIExecution {
  id: string;
  miniAIId: string;
  input: any;
  output: any | null;
  status: 'running' | 'completed' | 'error';
  error?: string;
  executedAt: Date;
  executionTime: number;
}

export interface MemoryEntry {
  id: string;
  agentId: string;
  content: string;
  context: string;
  importance: 1 | 2 | 3 | 4 | 5;
  memoryType: 'permanent' | 'session';
  triggerRules: string[];
  timestamp: Date;
}

export interface LinkExtraction {
  url: string;
  title: string;
  domain: string;
  isNoFollow: boolean;
  category: string;
}
