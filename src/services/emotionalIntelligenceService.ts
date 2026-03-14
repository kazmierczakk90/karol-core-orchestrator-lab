import { supabase } from '@/integrations/supabase/db';

export interface EmotionalState {
  confidence: number;
  creativity: number;
  focus: number;
  empathy: number;
  curiosity: number;
  energy_level: number;
  stress_level: number;
}

export interface EmotionalMemory {
  id: string;
  agent_id: string;
  event_description: string;
  intensity: number;
  emotional_context: any;
  impact_score: number;
  created_at: string;
}

class EmotionalIntelligenceService {
  /**
   * Analyze emotional context of a message
   */
  async analyzeMessage(
    messageContent: string,
    agentId: string,
    sessionId?: string,
    messageId?: string
  ) {
    try {
      // Get current emotional state
      const currentState = await this.getCurrentState(agentId);

      const { data, error } = await supabase.functions.invoke('analyze-emotional-context', {
        body: {
          messageContent,
          agentId,
          sessionId,
          messageId,
          currentState,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[EmotionalIntelligence] Analysis error:', error);
      throw error;
    }
  }

  /**
   * Get current emotional state for an agent
   */
  async getCurrentState(agentId: string): Promise<EmotionalState | null> {
    try {
      const { data, error } = await supabase
        .from('emotional_states')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data ? {
        confidence: data.confidence,
        creativity: data.creativity,
        focus: data.focus,
        empathy: data.empathy,
        curiosity: data.curiosity,
        energy_level: data.energy_level,
        stress_level: data.stress_level,
      } : null;
    } catch (error) {
      console.error('[EmotionalIntelligence] Get state error:', error);
      return null;
    }
  }

  /**
   * Get emotional state history for an agent
   */
  async getStateHistory(agentId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('emotional_states')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[EmotionalIntelligence] Get history error:', error);
      return [];
    }
  }

  /**
   * Get emotional memories for an agent
   */
  async getMemories(agentId: string, limit: number = 10): Promise<EmotionalMemory[]> {
    try {
      const { data, error } = await supabase
        .from('emotional_memories')
        .select('*')
        .eq('agent_id', agentId)
        .order('intensity', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[EmotionalIntelligence] Get memories error:', error);
      return [];
    }
  }

  /**
   * Get emotional context for a session
   */
  async getSessionContext(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('message_emotional_context')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[EmotionalIntelligence] Get session context error:', error);
      return [];
    }
  }

  /**
   * Adjust response based on emotional context
   */
  adjustResponseTone(
    originalResponse: string,
    emotionalContext: {
      sentiment: string;
      responseTone: string;
      emotions: string[];
    }
  ): string {
    // This is a placeholder for more sophisticated tone adjustment
    // In production, this could use AI to rewrite the response
    const toneMarkers: Record<string, string> = {
      empathetic: '🤝 ',
      enthusiastic: '✨ ',
      calm: '🧘 ',
      professional: '💼 ',
      supportive: '🤗 ',
    };

    const marker = toneMarkers[emotionalContext.responseTone] || '';
    return `${marker}${originalResponse}`;
  }

  /**
   * Calculate overall emotional health score
   */
  calculateHealthScore(state: EmotionalState): number {
    const balance = (
      state.confidence +
      state.creativity +
      state.focus +
      state.empathy +
      state.curiosity
    ) / 5;

    const stressPenalty = state.stress_level / 2;
    const energyBonus = state.energy_level / 4;

    return Math.max(0, Math.min(100, balance - stressPenalty + energyBonus));
  }
}

export const emotionalIntelligenceService = new EmotionalIntelligenceService();
