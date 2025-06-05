
export interface OpenAIConfig {
  apiKey: string;
  assistantId: string;
  vectorStoreId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentId?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  assistantId: string;
  instructions: string;
  isActive: boolean;
  lastUsed?: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  agentId: string;
  files: ProjectFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  openaiFileId?: string;
}

export interface MemoryEntry {
  id: string;
  agentId: string;
  content: string;
  context: string;
  timestamp: Date;
  importance: number;
}

export interface DatabaseTable {
  id: string;
  name: string;
  description: string;
  variables: TableVariable[];
  agentAccess: string[];
}

export interface TableVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'json';
  value: any;
  description: string;
  updatedAt: Date;
}
