
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Zap, Plus, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { SystemConnection } from '@/types/system';
import AddConnectionModal from '@/components/connections/AddConnectionModal';
import { useConnections } from '@/hooks/useConnections';
import { ConnectionTableRow } from './connections/ConnectionTableRow';

const SystemConnectionsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { 
    connections, 
    isLoading, 
    queryError,
    updateConnection,
    isUpdating,
    deleteConnection,
    isDeleting,
    deleteConnectionVariables,
   } = useConnections();

  const testConnection = (connectionId: string) => {
    updateConnection({ id: connectionId, status: 'testing', last_ping: new Date().toISOString() });

    setTimeout(() => {
      updateConnection({
        id: connectionId,
        status: Math.random() > 0.2 ? 'connected' : 'error',
        response_time: Math.floor(Math.random() * 500) + 50,
        last_ping: new Date().toISOString()
      });
    }, 2000);
  };

  const toggleConnection = (connection: SystemConnection) => {
    updateConnection({
      id: connection.id,
      status: connection.status === 'connected' ? 'disconnected' : 'connected',
      last_ping: new Date().toISOString()
    });
  };
  
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
                  <ConnectionTableRow
                    key={connection.id}
                    connection={connection}
                    onTest={testConnection}
                    onToggle={toggleConnection}
                    onDelete={deleteConnection}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                    deletingId={deleteConnectionVariables}
                  />
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
