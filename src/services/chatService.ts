
import { supabase } from '@/integrations/supabase/client';
import type { 
  ChatSession, 
  ChatMessage, 
  CreateChatSessionRequest, 
  CreateChatMessageRequest 
} from '@/types/chat';

class ChatService {
  async createSession(data: CreateChatSessionRequest): Promise<ChatSession | null> {
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert({
        agent_id: data.agent_id,
        title: data.title,
        metadata: data.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
    return session as ChatSession;
  }

  async getSessions(): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat sessions:', error);
      return [];
    }
    return data as ChatSession[];
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching chat session:', error);
      return null;
    }
    return data as ChatSession;
  }

  async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<boolean> {
    const { error } = await supabase
      .from('chat_sessions')
      .update(updates)
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating chat session:', error);
      return false;
    }
    return true;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('Error deleting chat session:', error);
      return false;
    }
    return true;
  }

  async createMessage(data: CreateChatMessageRequest): Promise<ChatMessage | null> {
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: data.session_id,
        role: data.role,
        content: data.content,
        metadata: data.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating chat message:', error);
      return null;
    }
    return message as ChatMessage;
  }

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
    return data as ChatMessage[];
  }

  async sendMessageToAI(sessionId: string, content: string): Promise<ChatMessage | null> {
    try {
      // Najpierw zapisz wiadomość użytkownika
      const userMessage = await this.createMessage({
        session_id: sessionId,
        role: 'user',
        content: content,
      });

      if (!userMessage) {
        throw new Error('Failed to save user message');
      }

      // Pobierz kontekst konwersacji
      const messages = await this.getMessages(sessionId);
      
      // Wywołaj Edge Function dla OpenAI
      const { data, error } = await supabase.functions.invoke('openai-integration', {
        body: {
          action: 'chat',
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });

      if (error) {
        throw new Error(`AI request failed: ${error.message}`);
      }

      // Zapisz odpowiedź AI
      const aiMessage = await this.createMessage({
        session_id: sessionId,
        role: 'assistant',
        content: data.response || 'Przepraszam, wystąpił błąd podczas generowania odpowiedzi.',
        metadata: {
          tokens_used: data.tokens_used || 0,
          processing_time: data.processing_time || 0
        }
      });

      return aiMessage;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      return null;
    }
  }
}

export const chatService = new ChatService();
