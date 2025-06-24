
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Zap, Clock, Brain } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SystemOverview = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch agents data
        const { data: agentsData } = await supabase
          .from('agents')
          .select('*')
          .limit(10);
        
        // Fetch messages data
        const { data: messagesData } = await supabase
          .from('fuko_messages')
          .select('*')
          .limit(10);

        // Mock KPI data since we don't have a specific KPI table
        const mockKpiData = {
          system_level: { value: 'AGI-L2' }
        };
        
        setAgents(agentsData || []);
        setMessages(messagesData || []);
        setKpiData(mockKpiData);
      } catch (error) {
        console.error('Error fetching system overview data:', error);
        // Set default values on error
        setAgents([]);
        setMessages([]);
        setKpiData({ system_level: { value: 'Demo' } });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalMessages = messages.length;
  const systemLevel = kpiData?.system_level?.value;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-9 w-9 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-5 w-[50px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-500/20 rounded">
          <Brain className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <p className="text-sm text-slate-400">System Level</p>
          <p className="text-lg font-semibold text-white">{systemLevel || 'Demo'}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-500/20 rounded">
          <Activity className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <p className="text-sm text-slate-400">System Status</p>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            operational
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-500/20 rounded">
          <Database className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Active Agents</p>
          <p className="text-lg font-semibold text-white">{activeAgents}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-2 bg-cyan-500/20 rounded">
          <Zap className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Messages</p>
          <p className="text-lg font-semibold text-white">{totalMessages}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-2 bg-yellow-500/20 rounded">
          <Clock className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Uptime</p>
          <p className="text-lg font-semibold text-white">24h</p>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
