import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Database } from '@/integrations/supabase/types';

export type FUKOMessage = Database['public']['Tables']['fuko_messages']['Row'];
export type CreateFUKOMessageData = Database['public']['Tables']['fuko_messages']['Insert'];
export type FukoAgent = Database['public']['Tables']['fuko_agents']['Row'];
export type KpiData = Database['public']['Tables']['kpi_data']['Row'];

const fetchFukoMessages = async (): Promise<FUKOMessage[]> => {
  const { data, error } = await supabase
    .from('fuko_messages')
    .select('*')
    .order('timestamp', { ascending: false });
  if (error) throw error;
  return data;
};

const fetchFukoAgents = async (): Promise<FukoAgent[]> => {
  const { data, error } = await supabase
    .from('fuko_agents')
    .select('*')
    .order('last_update', { ascending: false });
  if (error) throw error;
  return data;
};

const fetchKpiData = async (): Promise<KpiData[]> => {
    const { data, error } = await supabase.from('kpi_data').select('*');
    if (error) throw error;
    return data;
};

const createFukoMessage = async (messageData: CreateFUKOMessageData) => {
  const { data, error } = await supabase.from('fuko_messages').insert([messageData]).select();
  if (error) throw error;
  return data;
};

export const useFuko = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['fuko_messages'],
    queryFn: fetchFukoMessages,
  });

  const { data: agents, isLoading: isLoadingAgents } = useQuery({
    queryKey: ['fuko_agents'],
    queryFn: fetchFukoAgents,
  });

  const { data: kpiData, isLoading: isLoadingKpi } = useQuery({
    queryKey: ['kpi_data'],
    queryFn: fetchKpiData,
  });

  useEffect(() => {
    const channels = [
        supabase.channel('fuko-messages-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'fuko_messages' }, () => {
            queryClient.invalidateQueries({ queryKey: ['fuko_messages'] });
        }).subscribe(),
        supabase.channel('fuko-agents-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'fuko_agents' }, () => {
            queryClient.invalidateQueries({ queryKey: ['fuko_agents'] });
        }).subscribe(),
        supabase.channel('kpi-data-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'kpi_data' }, () => {
            queryClient.invalidateQueries({ queryKey: ['kpi_data'] });
        }).subscribe(),
    ];

    return () => {
      channels.forEach(channel => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      });
    };
  }, [queryClient]);

  const createMessageMutation = useMutation({
    mutationFn: createFukoMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuko_messages'] });
      toast({ title: 'FUKO Message Created', description: 'New FUKO message sent for processing.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Creation Failed', description: error.message, variant: 'destructive' });
    }
  });
  
  const transformedKpiData = kpiData?.reduce((acc, item) => {
      acc[item.name] = { value: item.value, threshold: item.threshold, trend: item.trend };
      return acc;
  }, {} as Record<string, { value: number; threshold: number; trend: string; }>) || {};


  return {
    messages,
    isLoadingMessages,
    agents,
    isLoadingAgents,
    kpiData: transformedKpiData,
    isLoadingKpi,
    createFukoMessage: createMessageMutation.mutate,
  };
};
