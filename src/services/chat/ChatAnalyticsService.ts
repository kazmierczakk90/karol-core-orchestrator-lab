
import { supabase } from '@/integrations/supabase/db';
import type { ChatSession, ChatMessage } from '@/types/chat';

export class ChatAnalyticsService {
  static async logSessionAnalytics(sessionId: string, eventType: string): Promise<void> {
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

  static async analyzeSessionForPlatform(sessionId: string, session: ChatSession, messages: ChatMessage[]): Promise<any> {
    try {
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

  private static calculateAverageProcessingTime(messages: ChatMessage[]): number {
    const aiMessages = messages.filter(m => m.metadata?.processing_time);
    if (aiMessages.length === 0) return 0;
    
    const total = aiMessages.reduce((sum, msg) => sum + (msg.metadata.processing_time || 0), 0);
    return total / aiMessages.length;
  }

  private static calculateSessionDuration(session: ChatSession): number {
    if (!session.last_message_at) return 0;
    return new Date(session.last_message_at).getTime() - new Date(session.created_at).getTime();
  }

  private static analyzeThreadContinuity(messages: ChatMessage[]): number {
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

  private static isThematicallyContinuous(prev: string, current: string): boolean {
    // Prosta analiza ciągłości tematycznej
    const prevWords = prev.toLowerCase().split(' ');
    const currentWords = current.toLowerCase().split(' ');
    
    const commonWords = prevWords.filter(word => 
      currentWords.includes(word) && word.length > 3
    );
    
    return commonWords.length > 0;
  }

  private static calculateEngagementScore(messages: ChatMessage[]): number {
    // Oblicz wskaźnik zaangażowania na podstawie długości wiadomości i częstotliwości
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return 0;
    
    const avgLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0) / userMessages.length;
    const messageFrequency = userMessages.length;
    
    return Math.min(100, (avgLength / 10) + (messageFrequency * 5));
  }

  private static extractTopics(messages: ChatMessage[]): string[] {
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

  private static analyzeSentiment(messages: ChatMessage[]): string {
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
