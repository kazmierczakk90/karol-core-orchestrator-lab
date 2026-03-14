
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/db';
import { toast } from 'sonner';
import { useOptimizedRealTime } from './useOptimizedRealTime';

export const useRealTimeUpdates = () => {
  const { status, subscribe, unsubscribeAll } = useOptimizedRealTime({
    maxRetries: 3,
    retryDelay: 1500,
    enableBatching: true,
    batchSize: 5
  });

  useEffect(() => {
    console.log('Setting up optimized real-time subscriptions...');

    // Agents updates
    subscribe('agents-updates', 'agents', '*', (payload) => {
      console.log('Agents update:', payload);
      const agentName = (payload.new as any)?.name || (payload.old as any)?.name || 'Unknown Agent';
      
      if (payload.eventType === 'INSERT') {
        toast.info(`New agent created: ${agentName}`);
      } else if (payload.eventType === 'UPDATE') {
        toast.info(`Agent updated: ${agentName}`);
      } else if (payload.eventType === 'DELETE') {
        toast.info(`Agent deleted: ${agentName}`);
      }
    });

    // Meta decisions updates
    subscribe('decisions-updates', 'meta_decisions', '*', (payload) => {
      console.log('Decision update:', payload);
      if (payload.eventType === 'INSERT') {
        const decisionType = (payload.new as any)?.decision_type || 'Unknown';
        toast.info(`New decision: ${decisionType}`);
      } else if (payload.eventType === 'UPDATE') {
        const status = (payload.new as any)?.status || 'Unknown';
        toast.info(`Decision updated: ${status}`);
      }
    });

    // Analytics updates - only for system alerts
    subscribe('analytics-updates', 'analytics', 'INSERT', (payload) => {
      console.log('Analytics update:', payload);
      if ((payload.new as any)?.event_type === 'system_alert') {
        const description = (payload.new as any)?.description || 'System Alert';
        toast.warning(`System Alert: ${description}`);
      }
    });

    // Logs updates - only for errors
    subscribe('logs-updates', 'logs', 'INSERT', (payload) => {
      console.log('Log update:', payload);
      if ((payload.new as any)?.log_type === 'error') {
        const message = (payload.new as any)?.message || 'System Error';
        toast.error(`System Error: ${message}`);
      }
    });

    // Profile updates
    subscribe('profiles-updates', 'profiles', '*', (payload) => {
      console.log('Profile update:', payload);
      if (payload.eventType === 'INSERT') {
        const email = (payload.new as any)?.email || 'New user';
        toast.info(`New user registered: ${email}`);
      }
    });

    return () => {
      console.log('Cleaning up real-time subscriptions...');
      unsubscribeAll();
    };
  }, [subscribe, unsubscribeAll]);

  return {
    isConnected: status.isConnected,
    activeConnections: status.activeChannels,
    stats: {
      totalMessages: status.totalMessages,
      errors: status.errors,
      reconnectAttempts: status.reconnectAttempts,
      lastHeartbeat: status.lastHeartbeat
    }
  };
};
