
export interface ChatSession {
  id: string;
  user_id?: string;
  agent_id: string;
  title?: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, any>;
  tokens_used?: number;
  processing_time?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateChatSessionRequest {
  agent_id: string;
  title?: string;
  metadata?: Record<string, any>;
}

export interface CreateChatMessageRequest {
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
}
