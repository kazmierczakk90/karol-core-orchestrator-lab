
import type { 
  ChatSession, 
  ChatMessage, 
  CreateChatSessionRequest, 
  CreateChatMessageRequest 
} from '@/types/chat';
import { ChatSessionService } from './ChatSessionService';
import { ChatMessageService } from './ChatMessageService';
import { ChatAnalyticsService } from './ChatAnalyticsService';

class ChatService {
  // Session methods
  async createSession(data: CreateChatSessionRequest): Promise<ChatSession | null> {
    return ChatSessionService.createSession(data);
  }

  async getSessions(): Promise<ChatSession[]> {
    return ChatSessionService.getSessions();
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    return ChatSessionService.getSession(sessionId);
  }

  async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<boolean> {
    return ChatSessionService.updateSession(sessionId, updates);
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return ChatSessionService.deleteSession(sessionId);
  }

  // Message methods
  async createMessage(data: CreateChatMessageRequest): Promise<ChatMessage | null> {
    return ChatMessageService.createMessage(data);
  }

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    return ChatMessageService.getMessages(sessionId);
  }

  async sendMessageToAI(sessionId: string, content: string): Promise<ChatMessage | null> {
    return ChatMessageService.sendMessageToAI(sessionId, content);
  }

  // Analytics methods
  async analyzeSessionForPlatform(sessionId: string): Promise<any> {
    try {
      const session = await this.getSession(sessionId);
      const messages = await this.getMessages(sessionId);
      
      if (!session || !messages.length) {
        return null;
      }

      return ChatAnalyticsService.analyzeSessionForPlatform(sessionId, session, messages);
    } catch (error) {
      console.error('Error analyzing session:', error);
      return null;
    }
  }
}

export const chatService = new ChatService();
