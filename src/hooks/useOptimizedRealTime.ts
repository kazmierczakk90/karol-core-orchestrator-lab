
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/db';
import { toast } from 'sonner';

interface RealTimeConfig {
  maxRetries?: number;
  retryDelay?: number;
  heartbeatInterval?: number;
  enableBatching?: boolean;
  batchSize?: number;
}

interface ConnectionStatus {
  isConnected: boolean;
  activeChannels: string[];
  lastHeartbeat: Date | null;
  reconnectAttempts: number;
  totalMessages: number;
  errors: number;
}

export const useOptimizedRealTime = (config: RealTimeConfig = {}) => {
  const {
    maxRetries = 5,
    retryDelay = 2000,
    heartbeatInterval = 30000,
    enableBatching = true,
    batchSize = 10
  } = config;

  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    activeChannels: [],
    lastHeartbeat: null,
    reconnectAttempts: 0,
    totalMessages: 0,
    errors: 0
  });

  const channelsRef = useRef<Map<string, any>>(new Map());
  const heartbeatRef = useRef<NodeJS.Timeout>();
  const messageQueueRef = useRef<any[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef<number>(0);

  const processMessageBatch = useCallback(() => {
    if (messageQueueRef.current.length === 0) return;

    const batch = messageQueueRef.current.splice(0, batchSize);
    
    batch.forEach(({ payload, handler }) => {
      try {
        handler(payload);
      } catch (error) {
        console.error('Error processing message:', error);
        setStatus(prev => ({ ...prev, errors: prev.errors + 1 }));
      }
    });

    setStatus(prev => ({ 
      ...prev, 
      totalMessages: prev.totalMessages + batch.length 
    }));

    if (messageQueueRef.current.length > 0) {
      batchTimeoutRef.current = setTimeout(processMessageBatch, 100);
    }
  }, [batchSize]);

  const queueMessage = useCallback((payload: any, handler: Function) => {
    if (enableBatching) {
      messageQueueRef.current.push({ payload, handler });
      
      if (!batchTimeoutRef.current) {
        batchTimeoutRef.current = setTimeout(processMessageBatch, 50);
      }
    } else {
      try {
        handler(payload);
        setStatus(prev => ({ 
          ...prev, 
          totalMessages: prev.totalMessages + 1 
        }));
      } catch (error) {
        console.error('Error processing message:', error);
        setStatus(prev => ({ ...prev, errors: prev.errors + 1 }));
      }
    }
  }, [enableBatching, processMessageBatch]);

  const startHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
    }

    heartbeatRef.current = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        lastHeartbeat: new Date()
      }));
    }, heartbeatInterval);
  }, [heartbeatInterval]);

  const subscribe = useCallback((
    channelName: string,
    table: string,
    eventType: string = '*',
    handler: (payload: any) => void,
    options: any = {}
  ) => {
    try {
      console.log(`Subscribing to ${channelName} for ${table}:${eventType}`);

      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: eventType,
            schema: 'public',
            table: table,
            ...options
          },
          (payload) => queueMessage(payload, handler)
        )
        .subscribe((status) => {
          console.log(`Channel ${channelName} status:`, status);
          
          if (status === 'SUBSCRIBED') {
            setStatus(prev => ({
              ...prev,
              isConnected: true,
              activeChannels: [...prev.activeChannels, channelName],
              reconnectAttempts: 0
            }));
            reconnectAttemptsRef.current = 0;
            startHeartbeat();
          } else if (status === 'CHANNEL_ERROR') {
            reconnectAttemptsRef.current += 1;
            setStatus(prev => ({
              ...prev,
              errors: prev.errors + 1,
              reconnectAttempts: reconnectAttemptsRef.current
            }));
            
            if (reconnectAttemptsRef.current < maxRetries) {
              setTimeout(() => {
                console.log(`Retrying connection for ${channelName}...`);
                subscribe(channelName, table, eventType, handler, options);
              }, retryDelay);
            } else {
              toast.error(`Failed to connect to ${channelName} after ${maxRetries} attempts`);
            }
          }
        });

      channelsRef.current.set(channelName, channel);
      return channel;

    } catch (error) {
      console.error('Error subscribing to channel:', error);
      setStatus(prev => ({ ...prev, errors: prev.errors + 1 }));
      throw error;
    }
  }, [queueMessage, startHeartbeat, maxRetries, retryDelay]);

  const unsubscribe = useCallback((channelName: string) => {
    const channel = channelsRef.current.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      channelsRef.current.delete(channelName);
      
      setStatus(prev => ({
        ...prev,
        activeChannels: prev.activeChannels.filter(name => name !== channelName)
      }));
    }
  }, []);

  const unsubscribeAll = useCallback(() => {
    channelsRef.current.forEach((channel, channelName) => {
      supabase.removeChannel(channel);
    });
    channelsRef.current.clear();
    
    setStatus(prev => ({
      ...prev,
      isConnected: false,
      activeChannels: []
    }));
  }, []);

  useEffect(() => {
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      unsubscribeAll();
    };
  }, [unsubscribeAll]);

  return {
    status,
    subscribe,
    unsubscribe,
    unsubscribeAll
  };
};
