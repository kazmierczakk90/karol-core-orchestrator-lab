
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MiniAI, CreateMiniAIData } from '@/types/miniAI';
import { useToast } from "@/components/ui/use-toast";

const fetchMiniAIs = async (): Promise<MiniAI[]> => {
  const { data, error } = await supabase
    .from('mini_ai')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as MiniAI[];
};

const createMiniAI = async (miniAIData: CreateMiniAIData) => {
  const { data, error } = await supabase.from('mini_ai').insert([miniAIData]).select();
  if (error) throw error;
  return data;
};

const updateMiniAI = async (miniAI: Partial<MiniAI> & { id: string }) => {
    const { id, ...updateData } = miniAI;
    const { error } = await supabase
        .from('mini_ai')
        .update(updateData)
        .eq('id', id);
    if (error) throw error;
};

const deleteMiniAI = async (miniAIId: string) => {
  const { error } = await supabase
    .from('mini_ai')
    .delete()
    .eq('id', miniAIId);
  if (error) throw error;
};

export const useMiniAI = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: miniAIs, isLoading, error } = useQuery<MiniAI[]>({
    queryKey: ['mini_ai'],
    queryFn: fetchMiniAIs,
  });

  useEffect(() => {
    const channel = supabase
      .channel('mini-ai-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mini_ai' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['mini_ai'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createMiniAIMutation = useMutation({
    mutationFn: createMiniAI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mini_ai'] });
      toast({ title: 'Mini AI Created', description: 'New Mini AI has been successfully added.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Creation Failed', description: error.message, variant: 'destructive' });
    }
  });

  const updateMiniAIMutation = useMutation({
    mutationFn: updateMiniAI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mini_ai'] });
      toast({ title: 'Mini AI Updated', description: `Mini AI status changed.` });
    },
    onError: (error: Error) => {
      toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMiniAIMutation = useMutation({
    mutationFn: deleteMiniAI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mini_ai'] });
      toast({ title: 'Mini AI Deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Deletion Failed', description: error.message, variant: 'destructive' });
    }
  });

  return {
    miniAIs,
    isLoading,
    error,
    createMiniAI: createMiniAIMutation.mutate,
    isCreating: createMiniAIMutation.isPending,
    updateMiniAI: updateMiniAIMutation.mutate,
    isUpdating: updateMiniAIMutation.isPending,
    deleteMiniAI: deleteMiniAIMutation.mutate,
    isDeleting: deleteMiniAIMutation.isPending,
  };
};
