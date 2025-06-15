
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Agent, CreateAgentData } from '@/types/agent';
import { useToast } from "@/components/ui/use-toast";

const fetchAgents = async (): Promise<Agent[]> => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Agent[];
};

const createAgent = async (agentData: CreateAgentData) => {
  const { data, error } = await supabase.from('agents').insert([agentData]).select();
  if (error) throw error;
  return data;
};

const updateAgent = async (agent: Partial<Agent> & { id: string }) => {
    const { id, ...updateData } = agent;
    const { error } = await supabase
        .from('agents')
        .update(updateData)
        .eq('id', id);
    if (error) throw error;
};

const deleteAgent = async (agentId: string) => {
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', agentId);
  if (error) throw error;
};

export const useAgents = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: agents, isLoading, error } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  useEffect(() => {
    const channel = supabase
      .channel('agents-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agents' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['agents'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createAgentMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({ title: 'Agent Created', description: 'New agent has been successfully added.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Creation Failed', description: error.message, variant: 'destructive' });
    }
  });

  const updateAgentMutation = useMutation({
    mutationFn: updateAgent,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({ title: 'Agent Updated', description: `Agent status changed.` });
    },
    onError: (error: Error) => {
      toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
    }
  });

  const deleteAgentMutation = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({ title: 'Agent Deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Deletion Failed', description: error.message, variant: 'destructive' });
    }
  });

  return {
    agents,
    isLoading,
    error,
    createAgent: createAgentMutation.mutate,
    isCreating: createAgentMutation.isPending,
    updateAgent: updateAgentMutation.mutate,
    isUpdating: updateAgentMutation.isPending,
    deleteAgent: deleteAgentMutation.mutate,
    isDeleting: deleteAgentMutation.isPending,
  };
};
