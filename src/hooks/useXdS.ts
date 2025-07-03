
import { useState, useCallback } from 'react';
import { xdsService } from '@/services/xdsService';
import type { XdSResearch, ResearchPipeline } from '@/types/xds';
import { toast } from 'sonner';

export const useXdS = () => {
  const [researches, setResearches] = useState<XdSResearch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPipeline, setCurrentPipeline] = useState<ResearchPipeline[]>([]);

  const createResearch = useCallback(async (query: string) => {
    try {
      const research = await xdsService.createResearch(query);
      if (research) {
        setResearches(prev => [research, ...prev]);
        toast.success('Research created successfully');
        
        // Rozpocznij przetwarzanie
        processResearch(research.id);
        
        return research;
      } else {
        toast.error('Failed to create research');
        return null;
      }
    } catch (error) {
      console.error('Error creating research:', error);
      toast.error('Error creating research');
      return null;
    }
  }, []);

  const processResearch = useCallback(async (researchId: string) => {
    setIsProcessing(true);
    setCurrentPipeline(xdsService.getResearchPipeline());
    
    try {
      const success = await xdsService.processResearch(researchId);
      if (success) {
        // Aktualizuj pipeline status
        setCurrentPipeline(prev => prev.map(stage => ({
          ...stage,
          status: 'completed'
        })));
        
        // Odśwież listę badań
        loadResearches();
        
        toast.success('Research processing completed');
      } else {
        toast.error('Research processing failed');
      }
    } catch (error) {
      console.error('Error processing research:', error);
      toast.error('Error processing research');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const loadResearches = useCallback(async () => {
    try {
      const data = await xdsService.getResearches();
      setResearches(data);
    } catch (error) {
      console.error('Error loading researches:', error);
      toast.error('Error loading researches');
    }
  }, []);

  const extractContent = useCallback(async (url: string, type: 'web' | 'pdf' | 'document') => {
    try {
      const content = await xdsService.extractContent(url, type);
      if (content) {
        toast.success('Content extracted successfully');
        return content;
      } else {
        toast.error('Failed to extract content');
        return null;
      }
    } catch (error) {
      console.error('Error extracting content:', error);
      toast.error('Error extracting content');
      return null;
    }
  }, []);

  return {
    researches,
    isProcessing,
    currentPipeline,
    createResearch,
    processResearch,
    loadResearches,
    extractContent
  };
};
