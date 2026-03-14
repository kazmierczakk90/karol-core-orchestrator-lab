
import { supabase } from '@/integrations/supabase/db';
import type { ChatMessage, CreateChatMessageRequest } from '@/types/chat';
import { ChatSessionService } from './ChatSessionService';
import { ChatAnalyticsService } from './ChatAnalyticsService';

export class ChatMessageService {
  static async createMessage(data: CreateChatMessageRequest): Promise<ChatMessage | null> {
    try {
      console.log('💬 Creating message:', { session_id: data.session_id, role: data.role });
      
      // Check if demo user
      const { data: { user } } = await supabase.auth.getUser();
      const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';
      
      if (!user || user.id === DEMO_USER_ID) {
        console.log('🎭 Using RPC for demo user message creation');
        
        const { data: messageId, error } = await supabase.rpc('create_demo_message', {
          p_session_id: data.session_id,
          p_role: data.role,
          p_content: data.content,
          p_metadata: {
            ...data.metadata,
            assistant_id: 'asst_7foGqdfqZKRBNloPEVXmlrua',
            timestamp: new Date().toISOString(),
            demo_mode: true
          }
        });

        if (error) {
          console.error('❌ Error creating demo message:', error);
          return null;
        }

        // Fetch the created message
        const { data: messages } = await supabase.rpc('get_demo_messages', {
          p_session_id: data.session_id
        });

        const createdMessage = messages?.find((m: any) => m.id === messageId);
        if (createdMessage) {
          console.log('✅ Demo message created successfully:', messageId);
          return createdMessage as ChatMessage;
        }
        
        return null;
      }
      
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
        console.error('❌ Error creating message:', error);
        return null;
      }
      
      console.log('✅ Message created successfully:', message.id);
      return message as ChatMessage;
    } catch (error) {
      console.error('💥 Unexpected error in createMessage:', error);
      return null;
    }
  }

  static async getMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      // Check if demo user
      const { data: { user } } = await supabase.auth.getUser();
      const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';
      
      if (!user || user.id === DEMO_USER_ID) {
        console.log('🎭 Using RPC for demo user messages');
        const { data, error } = await supabase.rpc('get_demo_messages', {
          p_session_id: sessionId
        });

        if (error) {
          console.error('❌ Error fetching demo messages:', error);
          return [];
        }
        
        console.log('✅ Fetched demo messages:', data?.length || 0);
        return data as ChatMessage[];
      }

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
      console.log('📝 Message content:', content);
      
      // Zapisz wiadomość użytkownika
      const userMessage = await this.createMessage({
        session_id: sessionId,
        role: 'user',
        content: content,
        metadata: {
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          platform: 'karol-core',
          version: '2.0'
        }
      });

      if (!userMessage) {
        throw new Error('Failed to save user message');
      }

      console.log('💾 User message saved, calling OpenAI Assistant...');

      // Wywołaj Edge Function z prawidłowymi parametrami
      console.log('🚀 Calling OpenAI integration function...');
      const { data, error } = await supabase.functions.invoke('openai-integration', {
        body: {
          action: 'chat',
          session_id: sessionId,
          assistant_id: 'asst_7foGqdfqZKRBNloPEVXmlrua',
          vector_store_id: 'vs_67e03445b63c819183a0c37c390f5904',
          content: content
        }
      });

      if (error) {
        console.error('❌ OpenAI function error:', error);
        // Provide more detailed error information
        throw new Error(`AI request failed: ${error.message || 'Connection to OpenAI failed'}`);
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
          vector_store_id: 'vs_67e03445b63c819183a0c37c390f5904',
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
