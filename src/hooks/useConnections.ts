
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SystemConnection, ConnectionType, ConnectionStatus } from '@/types/system';
import { useToast } from "@/components/ui/use-toast";

const initialConnectionsData = [
    { id: 'conn_1', name: 'OpenAI API', type: 'api' as ConnectionType, status: 'connected' as ConnectionStatus, endpoint: 'https://api.openai.com', lastPing: new Date(), responseTime: 245, uptime: 99.8, requests: 1547, errors: 3, description: 'Primary AI model API connection' },
    { id: 'conn_2', name: 'Google Search API', type: 'api' as ConnectionType, status: 'connected' as ConnectionStatus, endpoint: 'https://www.googleapis.com/customsearch', lastPing: new Date(), responseTime: 180, uptime: 99.9, requests: 892, errors: 1, description: 'Search functionality integration' },
    { id: 'conn_3', name: 'Supabase Database', type: 'database' as ConnectionType, status: 'connected' as ConnectionStatus, endpoint: 'https://xhhgaysawtaeimxeodfd.supabase.co', lastPing: new Date(), responseTime: 95, uptime: 99.95, requests: 2341, errors: 2, description: 'Primary database connection' },
    { id: 'conn_4', name: 'Vector Store', type: 'service' as ConnectionType, status: 'connected' as ConnectionStatus, endpoint: 'https://api.pinecone.io', lastPing: new Date(), responseTime: 320, uptime: 98.5, requests: 567, errors: 8, description: 'Vector database for embeddings' },
    { id: 'conn_5', name: 'Voice Processing', type: 'service' as ConnectionType, status: 'testing' as ConnectionStatus, endpoint: 'https://api.elevenlabs.io', lastPing: new Date(), responseTime: 450, uptime: 97.2, requests: 234, errors: 12, description: 'Voice synthesis and processing' },
    { id: 'conn_6', name: 'Party App Webhook', type: 'webhook' as ConnectionType, status: 'error' as ConnectionStatus, endpoint: 'https://partyapp.club/webhook', lastPing: new Date(), responseTime: 0, uptime: 85.3, requests: 156, errors: 45, description: 'Event notifications from PartyApp' },
    { id: 'conn_7', name: 'Slack Integration', type: 'integration' as ConnectionType, status: 'disconnected' as ConnectionStatus, endpoint: 'https://hooks.slack.com/services', lastPing: new Date(), responseTime: 0, uptime: 0, requests: 0, errors: 0, description: 'Team communication integration' }
];

export const useConnections = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: connections, isLoading, error: queryError } = useQuery({
    queryKey: ['connections'],
    queryFn: async (): Promise<SystemConnection[]> => {
      const { data, error } = await supabase.from('system_connections').select('*').order('created_at', { ascending: true });
      if (error) throw new Error(error.message);
      return (data as SystemConnection[]) || [];
    },
  });

  const { mutate: seedConnections } = useMutation({
    mutationFn: async () => {
      const connectionsToSeed = initialConnectionsData.map(c => ({
        name: c.name,
        description: c.description,
        type: c.type,
        status: c.status,
        endpoint: c.endpoint,
        last_ping: c.lastPing.toISOString(),
        response_time: c.responseTime,
        uptime: c.uptime,
        requests: c.requests,
        errors: c.errors,
      }));
      const { error } = await supabase.from('system_connections').insert(connectionsToSeed);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Seeding failed', description: error.message, variant: 'destructive' });
    }
  });

  useEffect(() => {
    if (connections && connections.length === 0) {
      seedConnections();
    }
  }, [connections, seedConnections]);

  useEffect(() => {
    const channel = supabase.channel('system_connections_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_connections' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['connections'] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const updateConnectionMutation = useMutation({
    mutationFn: async (connection: Partial<SystemConnection> & Pick<SystemConnection, 'id'>) => {
        const { id, ...updateData } = connection;
        const { error } = await supabase.from('system_connections').update(updateData).eq('id', id);
        if (error) throw error;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error: Error) => {
        toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
    }
  });

  const deleteConnectionMutation = useMutation({
    mutationFn: async (connectionId: string) => {
        const { error } = await supabase.from('system_connections').delete().eq('id', connectionId);
        if (error) throw error;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
        toast({ title: 'Connection Deleted' });
    },
    onError: (error: Error) => {
        toast({ title: 'Deletion Failed', description: error.message, variant: 'destructive' });
    }
  });
  
  return {
      connections,
      isLoading,
      queryError,
      updateConnection: updateConnectionMutation.mutate,
      isUpdating: updateConnectionMutation.isPending,
      deleteConnection: deleteConnectionMutation.mutate,
      isDeleting: deleteConnectionMutation.isPending,
      deleteConnectionVariables: deleteConnectionMutation.variables,
  };
};
