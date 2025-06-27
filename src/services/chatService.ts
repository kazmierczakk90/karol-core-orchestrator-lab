
import { supabase } from '@/integrations/supabase/client';
import type { 
  ChatSession, 
  ChatMessage, 
  CreateChatSessionRequest, 
  CreateChatMessageRequest 
} from '@/types/chat';

class ChatService {
  private getDemoUser() {
    return {
      id: '00000000-0000-0000-0000-000000000001', // Poprawny UUID dla demo
      email: 'demo@karol-core.dev'
    };
  }

  private async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('🎭 No authenticated user, using demo mode');
        return this.getDemoUser();
      }
      
      return user;
    } catch (error) {
      console.error('❌ Error getting user, falling back to demo:', error);
      return this.getDemoUser();
    }
  }

  async createSession(data: CreateChatSessionRequest): Promise<ChatSession | null> {
    try {
      console.log('🚀 Creating new session...');
      const user = await this.getCurrentUser();
      
      if (!user) {
        console.error('❌ No user available');
        return null;
      }

      console.log('👤 User identified:', { id: user.id, email: user.email });

      const sessionData = {
        user_id: user.id,
        agent_id: data.agent_id || 'karol-core-ai',
        title: data.title || `Sesja z Karol-Core AI - ${new Date().toLocaleString('pl-PL')}`,
        metadata: {
          ...data.metadata,
          assistant_id: 'asst_7foGqdfqZKRBNloPEVXmlrua',
          vector_store_id: 'vs_6850534726fc8191b5ef7a56e8fc4a3c',
          created_by: user.email || 'demo@karol-core.dev',
          platform: 'karol-core',
          version: '2.0',
          demo_mode: user.id === '00000000-0000-0000-0000-000000000001',
          functions: [
            'przekaz_dane_do_CEO',
            'przeslij_do_asystenta', 
            'pobierz_plik_z_magazynu',
            'zapisz_dane_do_magazynu',
            'lista_plikow_w_magazynie',
            'zarzadzanie_dostepem'
          ]
        },
        status: 'active'
      };

      console.log('📝 Session data prepared:', sessionData);

      // Użyj funkcji demo dla demo użytkownika
      if (user.id === '00000000-0000-0000-0000-000000000001') {
        console.log('🎭 Using demo session creation function');
        
        const { data: demoSessionId, error } = await supabase.rpc('create_demo_session', {
          p_agent_id: sessionData.agent_id,
          p_title: sessionData.title,
          p_metadata: sessionData.metadata
        });

        if (error) {
          console.error('❌ Demo session creation error:', error);
          return null;
        }

        console.log('✅ Demo session created:', demoSessionId);
        
        // Pobierz pełne dane sesji
        const { data: fullSession, error: fetchError } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('id', demoSessionId)
          .single();

        if (fetchError) {
          console.error('❌ Error fetching created session:', fetchError);
          return null;
        }

        await this.logSessionAnalytics(fullSession.id, 'demo_session_created');
        return fullSession as ChatSession;
      }

      // Dla prawdziwych użytkowników
      const { data: session, error } = await supabase
        .from('chat_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error('❌ Database error creating session:', error);
        return null;
      }
      
      console.log('✅ Session created successfully:', session);
      await this.logSessionAnalytics(session.id, 'session_created');
      
      return session as ChatSession;
    } catch (error) {
      console.error('💥 Unexpected error in createSession:', error);
      return null;
    }
  }

  async getSessions(): Promise<ChatSession[]> {
    try {
      const user = await this.getCurrentUser();
      
      if (!user) {
        console.log('❌ No user for getSessions');
        return [];
      }

      console.log('📋 Fetching sessions for user:', user.id);

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching sessions:', error);
        return [];
      }
      
      console.log('✅ Fetched sessions:', data?.length || 0);
      return data as ChatSession[];
    } catch (error) {
      console.error('💥 Unexpected error in getSessions:', error);
      return [];
    }
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching session:', error);
        return null;
      }
      return data as ChatSession;
    } catch (error) {
      console.error('Unexpected error in getSession:', error);
      return null;
    }
  }

  async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating session:', error);
        return false;
      }
      
      // Analiza aktywności sesji
      await this.logSessionAnalytics(sessionId, 'session_updated');
      
      return true;
    } catch (error) {
      console.error('Unexpected error in updateSession:', error);
      return false;
    }
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      console.log('Deleting session:', sessionId);
      
      // Analiza przed usunięciem
      await this.logSessionAnalytics(sessionId, 'session_deleted');
      
      // Usuń wiadomości z sesji
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);

      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
        return false;
      }

      // Usuń sesję
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (sessionError) {
        console.error('Error deleting session:', sessionError);
        return false;
      }

      console.log('Session deleted successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error in deleteSession:', error);
      return false;
    }
  }

  async createMessage(data: CreateChatMessageRequest): Promise<ChatMessage | null> {
    try {
      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: data.session_id,
          role: data.role,
          content: data.content,
          metadata: {
            ...data.metadata,
            assistant_id: 'asst_7foGqdfqZKRBNloPEVXmlrua',
            timestamp: new Date().toISOString()
          },
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating message:', error);
        return null;
      }
      return message as ChatMessage;
    } catch (error) {
      console.error('Unexpected error in createMessage:', error);
      return null;
    }
  }

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      return data as ChatMessage[];
    } catch (error) {
      console.error('Unexpected error in getMessages:', error);
      return [];
    }
  }

  async sendMessageToAI(sessionId: string, content: string): Promise<ChatMessage | null> {
    try {
      console.log('🤖 Sending message to AI for session:', sessionId);
      
      // Zapisz wiadomość użytkownika
      const userMessage = await this.createMessage({
        session_id: sessionId,
        role: 'user',
        content: content,
        metadata: {
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      });

      if (!userMessage) {
        throw new Error('Failed to save user message');
      }

      console.log('💾 User message saved, calling OpenAI Assistant...');

      // Wywołaj Edge Function z prawidłowymi parametrami
      const { data, error } = await supabase.functions.invoke('openai-integration', {
        body: {
          action: 'chat',
          session_id: sessionId,
          assistant_id: 'asst_7foGqdfqZKRBNloPEVXmlrua',
          vector_store_id: 'vs_6850534726fc8191b5ef7a56e8fc4a3c'
        }
      });

      if (error) {
        console.error('❌ OpenAI function error:', error);
        throw new Error(`AI request failed: ${error.message}`);
      }

      console.log('🎯 OpenAI Assistant response received:', data);

      // Zapisz odpowiedź AI
      const aiMessage = await this.createMessage({
        session_id: sessionId,
        role: 'assistant',
        content: data.response || 'Przepraszam, wystąpił błąd podczas generowania odpowiedzi.',
        metadata: {
          tokens_used: data.tokens_used || 0,
          processing_time: data.processing_time || 0,
          assistant_id: 'asst_7foGqdfqZKRBNloPEVXmlrua',
          thread_id: data.thread_id,
          run_id: data.run_id,
          vector_store_id: 'vs_6850534726fc8191b5ef7a56e8fc4a3c',
          model: data.model || 'gpt-4o-mini',
          timestamp: new Date().toISOString(),
          functions_available: [
            'przekaz_dane_do_CEO',
            'przeslij_do_asystenta', 
            'pobierz_plik_z_magazynu',
            'zapisz_dane_do_magazynu',
            'lista_plikow_w_magazynie',
            'zarzadzanie_dostepem'
          ]
        }
      });

      // Aktualizuj sesję
      await this.updateSession(sessionId, {
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      await this.logSessionAnalytics(sessionId, 'ai_assistant_message_exchange');

      console.log('✅ AI Assistant message saved successfully');
      return aiMessage;
    } catch (error) {
      console.error('💥 Error sending message to AI:', error);
      
      // Zapisz wiadomość błędu
      const errorMessage = await this.createMessage({
        session_id: sessionId,
        role: 'assistant',
        content: `Przepraszam, wystąpił błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}. Spróbuj ponownie.`,
        metadata: {
          error: true,
          error_message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          assistant_id: 'asst_7foGqdfqZKRBNloPEVXmlrua'
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

      // Zaawansowana analiza sesji
      const analysis = {
        session_id: sessionId,
        message_count: messages.length,
        user_messages: messages.filter(m => m.role === 'user').length,
        ai_messages: messages.filter(m => m.role === 'assistant').length,
        total_tokens: messages.reduce((sum, msg) => sum + (msg.metadata?.tokens_used || 0), 0),
        avg_processing_time: this.calculateAverageProcessingTime(messages),
        session_duration: this.calculateSessionDuration(session),
        topics: this.extractTopics(messages),
        sentiment: this.analyzeSentiment(messages),
        thread_continuity: this.analyzeThreadContinuity(messages),
        engagement_score: this.calculateEngagementScore(messages),
        created_at: new Date().toISOString()
      };

      // Zapisz analizę do analytics
      await supabase.from('analytics').insert({
        event_type: 'chat_session_analysis',
        agent_id: session.agent_id,
        description: `Zaawansowana analiza sesji: ${messages.length} wiadomości`,
        context: JSON.stringify(analysis),
        value: messages.length
      });

      console.log('Advanced session analysis completed:', analysis);
      return analysis;
    } catch (error) {
      console.error('Error analyzing session:', error);
      return null;
    }
  }

  private calculateAverageProcessingTime(messages: ChatMessage[]): number {
    const aiMessages = messages.filter(m => m.metadata?.processing_time);
    if (aiMessages.length === 0) return 0;
    
    const total = aiMessages.reduce((sum, msg) => sum + (msg.metadata.processing_time || 0), 0);
    return total / aiMessages.length;
  }

  private calculateSessionDuration(session: ChatSession): number {
    if (!session.last_message_at) return 0;
    return new Date(session.last_message_at).getTime() - new Date(session.created_at).getTime();
  }

  private analyzeThreadContinuity(messages: ChatMessage[]): number {
    // Analiza ciągłości wątku na podstawie kontekstu
    let continuityScore = 0;
    for (let i = 1; i < messages.length; i++) {
      const prev = messages[i - 1];
      const current = messages[i];
      
      // Sprawdź czy są powiązane tematycznie
      if (this.isThematicallyContinuous(prev.content, current.content)) {
        continuityScore++;
      }
    }
    
    return messages.length > 1 ? (continuityScore / (messages.length - 1)) * 100 : 100;
  }

  private isThematicallyContinuous(prev: string, current: string): boolean {
    // Prosta analiza ciągłości tematycznej
    const prevWords = prev.toLowerCase().split(' ');
    const currentWords = current.toLowerCase().split(' ');
    
    const commonWords = prevWords.filter(word => 
      currentWords.includes(word) && word.length > 3
    );
    
    return commonWords.length > 0;
  }

  private calculateEngagementScore(messages: ChatMessage[]): number {
    // Oblicz wskaźnik zaangażowania na podstawie długości wiadomości i częstotliwości
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return 0;
    
    const avgLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0) / userMessages.length;
    const messageFrequency = userMessages.length;
    
    return Math.min(100, (avgLength / 10) + (messageFrequency * 5));
  }

  private async logSessionAnalytics(sessionId: string, eventType: string): Promise<void> {
    try {
      console.log('📊 Logging analytics:', { sessionId, eventType });
      await supabase.from('analytics').insert({
        event_type: eventType,
        agent_id: 'karol-core-ai',
        description: `Live Chat event: ${eventType}`,
        context: JSON.stringify({ session_id: sessionId }),
        value: 1
      });
    } catch (error) {
      console.error('❌ Error logging analytics:', error);
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
