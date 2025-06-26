
import { supabase } from '@/integrations/supabase/client';
import type { 
  ChatSession, 
  ChatMessage, 
  CreateChatSessionRequest, 
  CreateChatMessageRequest 
} from '@/types/chat';

class ChatService {
  async createSession(data: CreateChatSessionRequest): Promise<ChatSession | null> {
    try {
      // Pobierz aktualnego użytkownika
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return null;
      }

      const { data: session, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          agent_id: data.agent_id || 'karol-core-ai',
          title: data.title || `Nowa sesja ${new Date().toLocaleString('pl-PL')}`,
          metadata: data.metadata || {},
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating chat session:', error);
        return null;
      }
      
      console.log('Chat session created successfully:', session);
      return session as ChatSession;
    } catch (error) {
      console.error('Error in createSession:', error);
      return null;
    }
  }

  async getSessions(): Promise<ChatSession[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('User not authenticated for getSessions');
        return [];
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat sessions:', error);
        return [];
      }
      
      console.log('Fetched sessions:', data);
      return data as ChatSession[];
    } catch (error) {
      console.error('Error in getSessions:', error);
      return [];
    }
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
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating chat session:', error);
      return false;
    }
    return true;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      // Najpierw usuń wszystkie wiadomości z sesji
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);

      if (messagesError) {
        console.error('Error deleting chat messages:', messagesError);
        return false;
      }

      // Następnie usuń sesję
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (sessionError) {
        console.error('Error deleting chat session:', sessionError);
        return false;
      }

      console.log('Session and messages deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteSession:', error);
      return false;
    }
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
      console.log('Sending message to AI for session:', sessionId);
      
      // Najpierw zapisz wiadomość użytkownika
      const userMessage = await this.createMessage({
        session_id: sessionId,
        role: 'user',
        content: content,
      });

      if (!userMessage) {
        throw new Error('Failed to save user message');
      }

      console.log('User message saved, calling OpenAI...');

      // Wywołaj Edge Function dla OpenAI z session_id
      const { data, error } = await supabase.functions.invoke('openai-integration', {
        body: {
          action: 'chat',
          session_id: sessionId,
          model: 'gpt-4o-mini'
        }
      });

      if (error) {
        console.error('OpenAI function error:', error);
        throw new Error(`AI request failed: ${error.message}`);
      }

      console.log('OpenAI response received:', data);

      // Zapisz odpowiedź AI
      const aiMessage = await this.createMessage({
        session_id: sessionId,
        role: 'assistant',
        content: data.response || 'Przepraszam, wystąpił błąd podczas generowania odpowiedzi.',
        metadata: {
          tokens_used: data.tokens_used || 0,
          processing_time: data.processing_time || 0,
          assistant_id: data.assistant_id || 'asst_7foGqdfqZKRBNloPEVXmlrua'
        }
      });

      // Zaktualizuj timestamp ostatniej wiadomości w sesji
      await this.updateSession(sessionId, {
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      console.log('AI message saved successfully');
      return aiMessage;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      // Zapisz wiadomość błędu jako odpowiedź AI
      const errorMessage = await this.createMessage({
        session_id: sessionId,
        role: 'assistant',
        content: `Przepraszam, wystąpił błąd podczas komunikacji z systemem AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        metadata: {
          error: true,
          error_message: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      return errorMessage;
    }
  }

  async analyzeSessionForPlatform(sessionId: string): Promise<any> {
    try {
      const session = await this.getSession(sessionId);
      const messages = await this.getMessages(sessionId);
      
      if (!session || !messages.length) {
        return null;
      }

      // Analiza sesji dla platformy
      const analysis = {
        session_id: sessionId,
        message_count: messages.length,
        user_messages: messages.filter(m => m.role === 'user').length,
        ai_messages: messages.filter(m => m.role === 'assistant').length,
        total_tokens: messages.reduce((sum, msg) => sum + (msg.metadata?.tokens_used || 0), 0),
        avg_processing_time: messages
          .filter(m => m.metadata?.processing_time)
          .reduce((sum, msg, _, arr) => sum + (msg.metadata.processing_time || 0) / arr.length, 0),
        session_duration: session.last_message_at ? 
          new Date(session.last_message_at).getTime() - new Date(session.created_at).getTime() : 0,
        topics: this.extractTopics(messages),
        sentiment: this.analyzeSentiment(messages),
        created_at: new Date().toISOString()
      };

      // Zapisz analizę do tabeli analytics
      await supabase.from('analytics').insert({
        event_type: 'chat_session_analysis',
        agent_id: session.agent_id,
        description: `Analiza sesji czatu: ${messages.length} wiadomości`,
        context: JSON.stringify(analysis),
        value: messages.length
      });

      return analysis;
    } catch (error) {
      console.error('Error analyzing session:', error);
      return null;
    }
  }

  private extractTopics(messages: ChatMessage[]): string[] {
    // Prosta ekstrakcja tematów na podstawie słów kluczowych
    const userMessages = messages.filter(m => m.role === 'user');
    const allText = userMessages.map(m => m.content).join(' ').toLowerCase();
    
    const topics = [];
    if (allText.includes('technolog') || allText.includes('ai') || allText.includes('system')) topics.push('Technologia');
    if (allText.includes('biznes') || allText.includes('firma') || allText.includes('zarządzanie')) topics.push('Biznes');
    if (allText.includes('nauka') || allText.includes('edukacja') || allText.includes('uczenie')) topics.push('Edukacja');
    if (allText.includes('pomoc') || allText.includes('wsparcie') || allText.includes('problem')) topics.push('Wsparcie');
    
    return topics;
  }

  private analyzeSentiment(messages: ChatMessage[]): string {
    // Prosta analiza sentymentu
    const userMessages = messages.filter(m => m.role === 'user');
    const allText = userMessages.map(m => m.content).join(' ').toLowerCase();
    
    const positiveWords = ['dziękuję', 'świetnie', 'doskonale', 'podoba się', 'super', 'genialnie'];
    const negativeWords = ['problem', 'błąd', 'źle', 'nie działa', 'frustruje', 'trudno'];
    
    const positiveCount = positiveWords.reduce((count, word) => count + (allText.match(new RegExp(word, 'g')) || []).length, 0);
    const negativeCount = negativeWords.reduce((count, word) => count + (allText.match(new RegExp(word, 'g')) || []).length, 0);
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
}

export const chatService = new ChatService();
