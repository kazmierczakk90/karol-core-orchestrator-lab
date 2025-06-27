
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage, CreateChatMessageRequest } from '@/types/chat';
import { ChatSessionService } from './ChatSessionService';
import { ChatAnalyticsService } from './ChatAnalyticsService';

export class ChatMessageService {
  static async createMessage(data: CreateChatMessageRequest): Promise<ChatMessage | null> {
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

  static async getMessages(sessionId: string): Promise<ChatMessage[]> {
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

  static async sendMessageToAI(sessionId: string, content: string): Promise<ChatMessage | null> {
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
      await ChatSessionService.updateSession(sessionId, {
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      await ChatAnalyticsService.logSessionAnalytics(sessionId, 'ai_assistant_message_exchange');

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
}
