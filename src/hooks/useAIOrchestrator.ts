
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/db';
import { toast } from 'sonner';

interface AIRequest {
  action: 'process_decision' | 'route_agent' | 'execute_workflow' | 'cognitive_analysis';
  payload: any;
  agent_id?: string;
  priority?: number;
}

export const useAIOrchestrator = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processAIRequest = useMutation({
    mutationFn: async (request: AIRequest) => {
      setIsProcessing(true);
      
      const { data, error } = await supabase.functions.invoke('ai-orchestrator', {
        body: request
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('AI request processed successfully');
      setIsProcessing(false);
    },
    onError: (error: any) => {
      toast.error(`AI processing failed: ${error.message}`);
      setIsProcessing(false);
    }
  });

  const getSystemMetrics = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('event_type', 'system_metric')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const getActiveDecisions = useQuery({
    queryKey: ['active-decisions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meta_decisions')
        .select('*')
        .in('status', ['pending', 'processing', 'routed'])
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const processDecision = (payload: any, agentId?: string) => {
    return processAIRequest.mutate({
      action: 'process_decision',
      payload,
      agent_id: agentId
    });
  };

  const routeAgent = (payload: any) => {
    return processAIRequest.mutate({
      action: 'route_agent',
      payload
    });
  };

  const executeWorkflow = (payload: any, agentId?: string) => {
    return processAIRequest.mutate({
      action: 'execute_workflow',
      payload,
      agent_id: agentId
    });
  };

  const cognitiveAnalysis = (content: string, analysisType = 'general') => {
    return processAIRequest.mutate({
      action: 'cognitive_analysis',
      payload: { content, analysis_type: analysisType }
    });
  };

  return {
    isProcessing,
    processDecision,
    routeAgent,
    executeWorkflow,
    cognitiveAnalysis,
    systemMetrics: getSystemMetrics.data,
    activeDecisions: getActiveDecisions.data,
    isLoadingMetrics: getSystemMetrics.isLoading,
    isLoadingDecisions: getActiveDecisions.isLoading
  };
};
