import { useState, useCallback, useEffect } from 'react';
import { emotionalIntelligenceService, type EmotionalState, type EmotionalMemory } from '@/services/emotionalIntelligenceService';
import { toast } from 'sonner';

export const useEmotionalIntelligence = (agentId: string) => {
  const [currentState, setCurrentState] = useState<EmotionalState | null>(null);
  const [stateHistory, setStateHistory] = useState<any[]>([]);
  const [memories, setMemories] = useState<EmotionalMemory[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadCurrentState = useCallback(async () => {
    try {
      const state = await emotionalIntelligenceService.getCurrentState(agentId);
      setCurrentState(state);
    } catch (error) {
      console.error('Failed to load emotional state:', error);
    }
  }, [agentId]);

  const loadStateHistory = useCallback(async (limit: number = 20) => {
    setIsLoading(true);
    try {
      const history = await emotionalIntelligenceService.getStateHistory(agentId, limit);
      setStateHistory(history);
    } catch (error) {
      console.error('Failed to load state history:', error);
      toast.error('Failed to load emotional state history');
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  const loadMemories = useCallback(async (limit: number = 10) => {
    try {
      const memories = await emotionalIntelligenceService.getMemories(agentId, limit);
      setMemories(memories);
    } catch (error) {
      console.error('Failed to load memories:', error);
      toast.error('Failed to load emotional memories');
    }
  }, [agentId]);

  const analyzeMessage = useCallback(async (
    messageContent: string,
    sessionId?: string,
    messageId?: string
  ) => {
    setIsAnalyzing(true);
    try {
      const result = await emotionalIntelligenceService.analyzeMessage(
        messageContent,
        agentId,
        sessionId,
        messageId
      );

      if (result.success) {
        // Reload current state after analysis
        await loadCurrentState();
        return result.analysis;
      } else {
        toast.error('Emotional analysis failed');
        return null;
      }
    } catch (error) {
      console.error('Failed to analyze message:', error);
      toast.error('Failed to analyze emotional content');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [agentId, loadCurrentState]);

  const getHealthScore = useCallback(() => {
    if (!currentState) return 0;
    return emotionalIntelligenceService.calculateHealthScore(currentState);
  }, [currentState]);

  // Load initial state on mount
  useEffect(() => {
    loadCurrentState();
    loadMemories();
  }, [loadCurrentState, loadMemories]);

  return {
    currentState,
    stateHistory,
    memories,
    isAnalyzing,
    isLoading,
    analyzeMessage,
    loadStateHistory,
    loadMemories,
    getHealthScore,
    refresh: loadCurrentState,
  };
};
