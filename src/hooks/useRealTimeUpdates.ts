
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRealTimeUpdates = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeConnections, setActiveConnections] = useState<string[]>([]);

  useEffect(() => {
    const channels: any[] = [];

    // Real-time updates for agents
    const agentsChannel = supabase
      .channel('schema-db-changes-agents')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agents'
        },
        (payload) => {
          console.log('Agents update:', payload);
          toast.info(`Agent ${payload.eventType}: ${payload.new?.name || payload.old?.name}`);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setActiveConnections(prev => [...prev, 'agents']);
          setIsConnected(true);
        }
      });

    // Real-time updates for meta decisions
    const decisionsChannel = supabase
      .channel('schema-db-changes-decisions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meta_decisions'
        },
        (payload) => {
          console.log('Decision update:', payload);
          if (payload.eventType === 'INSERT') {
            toast.info(`New decision: ${payload.new?.decision_type}`);
          } else if (payload.eventType === 'UPDATE') {
            toast.info(`Decision updated: ${payload.new?.status}`);
          }
        }
      )
      .subscribe();

    // Real-time updates for analytics
    const analyticsChannel = supabase
      .channel('schema-db-changes-analytics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analytics'
        },
        (payload) => {
          console.log('Analytics update:', payload);
          if (payload.new?.event_type === 'system_alert') {
            toast.warning(`System Alert: ${payload.new?.description}`);
          }
        }
      )
      .subscribe();

    // Real-time updates for logs
    const logsChannel = supabase
      .channel('schema-db-changes-logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'logs'
        },
        (payload) => {
          console.log('Log update:', payload);
          if (payload.new?.log_type === 'error') {
            toast.error(`System Error: ${payload.new?.message}`);
          }
        }
      )
      .subscribe();

    channels.push(agentsChannel, decisionsChannel, analyticsChannel, logsChannel);

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      setActiveConnections([]);
      setIsConnected(false);
    };
  }, []);

  return {
    isConnected,
    activeConnections
  };
};
