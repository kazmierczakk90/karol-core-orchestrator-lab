
import { supabase } from '@/integrations/supabase/client';
import type { ChatSession, CreateChatSessionRequest } from '@/types/chat';
import { DemoUserService } from './DemoUserService';
import { ChatAnalyticsService } from './ChatAnalyticsService';

export class ChatSessionService {
  static async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('🎭 No authenticated user, using demo mode');
        return DemoUserService.getDemoUser();
      }
      
      return user;
    } catch (error) {
      console.error('❌ Error getting user, falling back to demo:', error);
      return DemoUserService.getDemoUser();
    }
  }

  static async createSession(data: CreateChatSessionRequest): Promise<ChatSession | null> {
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
          demo_mode: DemoUserService.isDemoUser(user.id),
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
      if (DemoUserService.isDemoUser(user.id)) {
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
        
        // Pobierz pełne dane sesji używając RPC
        const { data: sessions, error: fetchError } = await supabase.rpc('get_demo_sessions');

        if (fetchError || !sessions || sessions.length === 0) {
          console.error('❌ Error fetching created session:', fetchError);
          return null;
        }

        // Znajdź nowo utworzoną sesję
        const fullSession = sessions.find((s: any) => s.id === demoSessionId);
        
        if (!fullSession) {
          console.error('❌ Created session not found in results');
          return null;
        }

        await ChatAnalyticsService.logSessionAnalytics(fullSession.id, 'demo_session_created');
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
      await ChatAnalyticsService.logSessionAnalytics(session.id, 'session_created');
      
      return session as ChatSession;
    } catch (error) {
      console.error('💥 Unexpected error in createSession:', error);
      return null;
    }
  }

  static async getSessions(): Promise<ChatSession[]> {
    try {
      const user = await this.getCurrentUser();
      
      if (!user) {
        console.log('❌ No user for getSessions');
        return [];
      }

      console.log('📋 Fetching sessions for user:', user.id);

      // Użyj funkcji RPC dla demo użytkownika
      if (DemoUserService.isDemoUser(user.id)) {
        console.log('🎭 Using demo sessions RPC function');
        const { data, error } = await supabase.rpc('get_demo_sessions');
        
        if (error) {
          console.error('❌ Error fetching demo sessions:', error);
          return [];
        }
        
        console.log('✅ Fetched demo sessions:', data?.length || 0);
        return data as ChatSession[];
      }

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

  static async getSession(sessionId: string): Promise<ChatSession | null> {
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

  static async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<boolean> {
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
      await ChatAnalyticsService.logSessionAnalytics(sessionId, 'session_updated');
      
      return true;
    } catch (error) {
      console.error('Unexpected error in updateSession:', error);
      return false;
    }
  }

  static async deleteSession(sessionId: string): Promise<boolean> {
    try {
      console.log('Deleting session:', sessionId);
      
      // Analiza przed usunięciem
      await ChatAnalyticsService.logSessionAnalytics(sessionId, 'session_deleted');
      
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
}
