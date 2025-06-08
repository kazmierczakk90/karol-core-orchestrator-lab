
import { useState, useEffect, useCallback } from 'react';

interface RealTimeUpdate {
  type: 'agent_status' | 'execution_status' | 'system_metric';
  data: any;
  timestamp: Date;
}

export const useRealTimeUpdates = () => {
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const simulateRealTimeUpdates = useCallback(() => {
    const updateTypes = ['agent_status', 'execution_status', 'system_metric'] as const;
    
    const generateUpdate = (): RealTimeUpdate => {
      const type = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      let data;
      switch (type) {
        case 'agent_status':
          data = {
            agentId: `@agent-${Math.floor(Math.random() * 10)}`,
            status: Math.random() > 0.8 ? 'inactive' : 'active',
            lastActivity: new Date()
          };
          break;
        case 'execution_status':
          data = {
            executionId: `exec_${Date.now()}`,
            status: ['running', 'completed', 'error'][Math.floor(Math.random() * 3)],
            progress: Math.floor(Math.random() * 100)
          };
          break;
        case 'system_metric':
          data = {
            metric: 'cpu_usage',
            value: Math.floor(Math.random() * 100),
            trend: Math.random() > 0.5 ? 'up' : 'down'
          };
          break;
      }

      return {
        type,
        data,
        timestamp: new Date()
      };
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of update
        const update = generateUpdate();
        setUpdates(prev => [update, ...prev.slice(0, 99)]); // Keep last 100 updates
      }
    }, 2000);

    setIsConnected(true);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  useEffect(() => {
    const cleanup = simulateRealTimeUpdates();
    return cleanup;
  }, [simulateRealTimeUpdates]);

  return {
    updates,
    isConnected
  };
};
