
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Zap, Play, Pause, Settings, Trash2, Plus, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { SystemConnection } from '@/types/system';
import AddConnectionModal from '@/components/connections/AddConnectionModal';

const SystemConnectionsTable = () => {
  const [connections, setConnections] = useState<SystemConnection[]>([
    { id: 'conn_1', name: 'OpenAI API', type: 'api', status: 'connected', endpoint: 'https://api.openai.com', lastPing: new Date(), responseTime: 245, uptime: 99.8, requests: 1547, errors: 3, description: 'Primary AI model API connection' },
    { id: 'conn_2', name: 'Google Search API', type: 'api', status: 'connected', endpoint: 'https://www.googleapis.com/customsearch', lastPing: new Date(), responseTime: 180, uptime: 99.9, requests: 892, errors: 1, description: 'Search functionality integration' },
    { id: 'conn_3', name: 'Supabase Database', type: 'database', status: 'connected', endpoint: 'https://xhhgaysawtaeimxeodfd.supabase.co', lastPing: new Date(), responseTime: 95, uptime: 99.95, requests: 2341, errors: 2, description: 'Primary database connection' },
    { id: 'conn_4', name: 'Vector Store', type: 'service', status: 'connected', endpoint: 'https://api.pinecone.io', lastPing: new Date(), responseTime: 320, uptime: 98.5, requests: 567, errors: 8, description: 'Vector database for embeddings' },
    { id: 'conn_5', name: 'Voice Processing', type: 'service', status: 'testing', endpoint: 'https://api.elevenlabs.io', lastPing: new Date(), responseTime: 450, uptime: 97.2, requests: 234, errors: 12, description: 'Voice synthesis and processing' },
    { id: 'conn_6', name: 'Party App Webhook', type: 'webhook', status: 'error', endpoint: 'https://partyapp.club/webhook', lastPing: new Date(), responseTime: 0, uptime: 85.3, requests: 156, errors: 45, description: 'Event notifications from PartyApp' },
    { id: 'conn_7', name: 'Slack Integration', type: 'integration', status: 'disconnected', endpoint: 'https://hooks.slack.com/services', lastPing: new Date(), responseTime: 0, uptime: 0, requests: 0, errors: 0, description: 'Team communication integration' }
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, status: 'testing', lastPing: new Date() }
        : conn
    ));

    // Simulate connection test
    setTimeout(() => {
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId 
          ? { 
              ...conn, 
              status: Math.random() > 0.2 ? 'connected' : 'error',
              responseTime: Math.floor(Math.random() * 500) + 50,
              lastPing: new Date()
            }
          : conn
      ));
    }, 2000);
  };

  const toggleConnection = (connectionId: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { 
            ...conn, 
            status: conn.status === 'connected' ? 'disconnected' : 'connected',
            lastPing: new Date()
          }
        : conn
    ));
  };
  
  const handleAddConnection = (newConnection: SystemConnection) => {
    setConnections(prev => [...prev, newConnection]);
  };

  const getConnectionStats = () => {
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
              {connections.map((connection) => (
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
                    <span className={`font-semibold ${getResponseTimeColor(connection.responseTime)}`}>
                      {connection.responseTime === 0 ? '-' : `${connection.responseTime}ms`}
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
                      {connection.lastPing.toLocaleTimeString()}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:border-green-400"
                        onClick={() => testConnection(connection.id)}
                        disabled={connection.status === 'testing'}
                      >
                        <RefreshCw className={`h-3 w-3 ${connection.status === 'testing' ? 'animate-spin' : ''}`} />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:border-cyan-400"
                        onClick={() => toggleConnection(connection.id)}
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
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddConnectionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddConnection={handleAddConnection}
      />
    </>
  );
};

export default SystemConnectionsTable;
