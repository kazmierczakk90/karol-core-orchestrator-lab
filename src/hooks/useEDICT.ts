
import { useState, useCallback } from 'react';
import { edictService } from '@/services/edictService';
import type { EDICTPrompt, IntentionAnalysis } from '@/types/edict';
import { toast } from 'sonner';

export const useEDICT = () => {
  const [prompts, setPrompts] = useState<EDICTPrompt[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<IntentionAnalysis | null>(null);

  const processPrompt = useCallback(async (originalPrompt: string, mode: 'lite' | 'advanced' = 'lite') => {
    setIsProcessing(true);
    try {
      const result = await edictService.processPrompt(originalPrompt, mode);
      if (result) {
        setPrompts(prev => [result, ...prev]);
        toast.success('Prompt successfully processed with EDICT Logic');
        return result;
      } else {
        toast.error('Failed to process prompt');
        return null;
      }
    } catch (error) {
      console.error('Error processing prompt:', error);
      toast.error('Error processing prompt');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const analyzeIntention = useCallback(async (prompt: string) => {
    try {
      const analysis = await edictService.analyzeIntention(prompt);
      setCurrentAnalysis(analysis);
      return analysis;
    } catch (error) {
      console.error('Error analyzing intention:', error);
      toast.error('Error analyzing intention');
      return null;
    }
  }, []);

  const loadPrompts = useCallback(async () => {
    try {
      const data = await edictService.getPrompts();
      setPrompts(data);
    } catch (error) {
      console.error('Error loading prompts:', error);
      toast.error('Error loading prompts');
    }
  }, []);

  return {
    prompts,
    isProcessing,
    currentAnalysis,
    processPrompt,
    analyzeIntention,
    loadPrompts
  };
};
