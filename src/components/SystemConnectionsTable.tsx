import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Zap, Play, Pause, Settings, Trash2, Plus, RefreshCw, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { SystemConnection } from '@/types/system';
import AddConnectionModal from '@/components/connections/AddConnectionModal';
import { useToast } from "@/components/ui/use-toast";

const initialConnectionsData = [
    { id: 'conn_1', name: 'OpenAI API', type: 'api', status: 'connected', endpoint: 'https://api.openai.com', lastPing: new Date(), responseTime: 245, uptime: 99.8, requests: 1547, errors: 3, description: 'Primary AI model API connection' },
    { id: 'conn_2', name: 'Google Search API', type: 'api', status: 'connected', endpoint: 'https://www.googleapis.com/customsearch', lastPing: new Date(), responseTime: 180, uptime: 99.9, requests: 892, errors: 1, description: 'Search functionality integration' },
    { id: 'conn_3', name: 'Supabase Database', type: 'database', status: 'connected', endpoint: 'https://xhhgaysawtaeimxeodfd.supabase.co', lastPing: new Date(), responseTime: 95, uptime: 99.95, requests: 2341, errors: 2, description: 'Primary database connection' },
    { id: 'conn_4', name: 'Vector Store', type: 'service', status: 'connected', endpoint: 'https://api.pinecone.io', lastPing: new Date(), responseTime: 320, uptime: 98.5, requests: 567, errors: 8, description: 'Vector database for embeddings' },
    { id: 'conn_5', name: 'Voice Processing', type: 'service', status: 'testing', endpoint: 'https://api.elevenlabs.io', lastPing: new Date(), responseTime: 450, uptime: 97.2, requests: 234, errors: 12, description: 'Voice synthesis and processing' },
    { id: 'conn_6', name: 'Party App Webhook', type: 'webhook', status: 'error', endpoint: 'https://partyapp.club/webhook', lastPing: new Date(), responseTime: 0, uptime: 85.3, requests: 156, errors: 45, description: 'Event notifications from PartyApp' },
    { id: 'conn_7', name: 'Slack Integration', type: 'integration', status: 'disconnected', endpoint: 'https://hooks.slack.com/services', lastPing: new Date(), responseTime: 0, uptime: 0, requests: 0, errors: 0, description: 'Team communication integration' }
];

const SystemConnectionsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: connections, isLoading, error: queryError } = useQuery<SystemConnection[]>({
    queryKey: ['connections'],
    queryFn: async () => {
      const { data, error } = await supabase.from('system_connections').select('*').order('created_at', { ascending: true });
      if (error) throw new Error(error.message);
      return data || [];
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
        (payload) => {
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

  const typeColors = {
    api: 'bg-blue-500/20 text-blue-400',
    database: 'bg-green-500/20 text-green-400',
    service: 'bg-purple-500/20 text-purple-400',
    webhook: 'bg-orange-500/20 text-orange-400',
    integration: 'bg-cyan-500/20 text-cyan-400'
  };

  const statusColors = {
    connected: 'bg-green-500/20 text-green-400',
    disconnected: 'bg-gray-500/20 text-gray-400',
    error: 'bg-red-500/20 text-red-400',
    testing: 'bg-yellow-500/20 text-yellow-400'
  };

  const getResponseTimeColor = (time: number) => {
    if (time === 0) return 'text-gray-400';
    if (time < 200) return 'text-green-400';
    if (time < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return 'text-green-400';
    if (uptime >= 95) return 'text-yellow-400';
    return 'text-red-400';
  };

  const testConnection = (connectionId: string) => {
    updateConnectionMutation.mutate({ id: connectionId, status: 'testing', last_ping: new Date().toISOString() });

    setTimeout(() => {
      updateConnectionMutation.mutate({
        id: connectionId,
        status: Math.random() > 0.2 ? 'connected' : 'error',
        response_time: Math.floor(Math.random() * 500) + 50,
        last_ping: new Date().toISOString()
      });
    }, 2000);
  };

  const toggleConnection = (connection: SystemConnection) => {
    updateConnectionMutation.mutate({
      id: connection.id,
      status: connection.status === 'connected' ? 'disconnected' : 'connected',
      last_ping: new Date().toISOString()
    });
  };

  const deleteConnection = (connectionId: string) => {
    deleteConnectionMutation.mutate(connectionId);
  }
  
  const getConnectionStats = () => {
    if (!connections) return { total: 0, connected: 0, disconnected: 0, error: 0, testing: 0 };
    return {
      total: connections.length,
      connected: connections.filter(c => c.status === 'connected').length,
      disconnected: connections.filter(c => c.status === 'disconnected').length,
      error: connections.filter(c => c.status === 'error').length,
      testing: connections.filter(c => c.status === 'testing').length
    };
  };

  const stats = getConnectionStats();

  return (
    <>
      <Card className="bg-slate-800/50 border-cyan-800/30 h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-cyan-400 flex items-center space-x-2">
                <Zap className="h-6 w-6" />
                <span>System Connections</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Infrastruktura połączeń systemowych i integracji
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2 text-sm">
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {stats.connected}
                </Badge>
                <Badge className="bg-gray-500/20 text-gray-400">
                  {stats.disconnected}
                </Badge>
                {stats.error > 0 && (
                  <Badge className="bg-red-500/20 text-red-400">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {stats.error}
                  </Badge>
                )}
              </div>
              
              <Button 
                className="bg-gradient-primary hover:bg-gradient-secondary"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Connection
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
            </div>
          )}
          {queryError && (
            <div className="text-center py-10 text-red-400">
              <p>Error loading connections:</p>
              <p>{(queryError as Error).message}</p>
            </div>
          )}
          {!isLoading && !queryError && (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="text-slate-300">Connection</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Endpoint</TableHead>
                  <TableHead className="text-slate-300">Response Time</TableHead>
                  <TableHead className="text-slate-300">Uptime</TableHead>
                  <TableHead className="text-slate-300">Requests</TableHead>
                  <TableHead className="text-slate-300">Errors</TableHead>
                  <TableHead className="text-slate-300">Last Ping</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections?.map((connection) => (
                  <TableRow key={connection.id} className="border-slate-700/50 hover:bg-slate-700/30">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-white">{connection.name}</div>
                        <div className="text-slate-400 text-sm">{connection.description}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={typeColors[connection.type]}>
                        {connection.type}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={statusColors[connection.status]}>
                        {connection.status}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-slate-300 text-sm font-mono truncate max-w-xs block" title={connection.endpoint}>
                        {connection.endpoint}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <span className={`font-semibold ${getResponseTimeColor(connection.response_time)}`}>
                        {connection.response_time === 0 ? '-' : `${connection.response_time}ms`}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <span className={`font-semibold ${getUptimeColor(connection.uptime)}`}>
                        {connection.uptime === 0 ? '-' : `${connection.uptime}%`}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-slate-300 font-semibold">{connection.requests.toLocaleString()}</span>
                    </TableCell>
                    
                    <TableCell>
                      <span className={`font-semibold ${connection.errors > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {connection.errors}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-slate-400 text-sm">
                        {new Date(connection.last_ping).toLocaleTimeString()}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 hover:border-green-400"
                          onClick={() => testConnection(connection.id)}
                          disabled={connection.status === 'testing' || updateConnectionMutation.isPending}
                        >
                          <RefreshCw className={`h-3 w-3 ${connection.status === 'testing' ? 'animate-spin' : ''}`} />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 hover:border-cyan-400"
                          onClick={() => toggleConnection(connection)}
                          disabled={updateConnectionMutation.isPending}
                        >
                          {connection.status === 'connected' ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 hover:border-blue-400"
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 hover:border-red-400 text-red-400"
                          onClick={() => deleteConnection(connection.id)}
                          disabled={deleteConnectionMutation.isPending && deleteConnectionMutation.variables === connection.id}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <AddConnectionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};

export default SystemConnectionsTable;
