
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { Activity, Wifi, WifiOff, BarChart3, AlertTriangle } from 'lucide-react';

const RealTimeMonitor = () => {
  const { isConnected, activeConnections, stats } = useRealTimeUpdates();

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Real-Time Monitor</span>
        </CardTitle>
        <CardDescription className="text-slate-300">
          Live system updates and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Connection Status</span>
            <Badge className={`${
              isConnected 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/50 p-2 rounded">
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-slate-400">Messages</span>
              </div>
              <p className="text-sm font-semibold text-white">{stats.totalMessages}</p>
            </div>
            <div className="bg-slate-900/50 p-2 rounded">
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3 text-red-400" />
                <span className="text-xs text-slate-400">Errors</span>
              </div>
              <p className="text-sm font-semibold text-white">{stats.errors}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-slate-300 text-sm">Active Channels ({activeConnections.length}):</span>
            <div className="flex flex-wrap gap-1">
              {activeConnections.map(connection => (
                <Badge
                  key={connection}
                  variant="outline"
                  className="text-xs text-cyan-400 border-cyan-500/30"
                >
                  {connection.replace('-updates', '')}
                </Badge>
              ))}
              {activeConnections.length === 0 && (
                <span className="text-slate-500 text-sm">No active channels</span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span className="text-sm text-slate-400">
                {isConnected 
                  ? `Live updates active • ${stats.reconnectAttempts} reconnects`
                  : 'Connection lost - attempting to reconnect'
                }
              </span>
            </div>
            {stats.lastHeartbeat && (
              <div className="text-xs text-slate-500 mt-1">
                Last heartbeat: {stats.lastHeartbeat.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeMonitor;
