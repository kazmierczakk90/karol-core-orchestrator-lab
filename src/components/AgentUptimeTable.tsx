/**
 * Agent Uptime Table - Real-time agent health monitoring
 * P0 Component
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getHeartbeats, getHealthStatus, type AgentHeartbeat } from '@/services/heartbeatService';

export default function AgentUptimeTable() {
  const [data, setData] = useState<AgentHeartbeat[]>([]);
  const [stats, setStats] = useState({ total: 0, ok: 0, degraded: 0, down: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heartbeats, status] = await Promise.all([
          getHeartbeats(),
          getHealthStatus()
        ]);
        setData(heartbeats);
        setStats(status);
      } catch (error) {
        console.error('Failed to fetch heartbeats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15s

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: AgentHeartbeat['status']) => {
    switch (status) {
      case 'ok':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">● Online</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">◐ Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">○ Down</Badge>;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Agent Uptime Monitor</CardTitle>
          <CardDescription>Loading agent heartbeats...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-cyan-400">Agent Uptime Monitor</CardTitle>
        <CardDescription>
          Real-time agent health: {stats.ok} online, {stats.degraded} degraded, {stats.down} down
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No agent heartbeats recorded yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-300 font-medium">Agent ID</th>
                  <th className="text-left py-2 px-3 text-slate-300 font-medium">Status</th>
                  <th className="text-right py-2 px-3 text-slate-300 font-medium">Latency</th>
                  <th className="text-right py-2 px-3 text-slate-300 font-medium">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr 
                    key={row.agentId} 
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-2 px-3">
                      <code className="text-sm text-cyan-300">{row.agentId}</code>
                    </td>
                    <td className="py-2 px-3">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className={`text-sm ${
                        row.latency < 1000 ? 'text-green-400' :
                        row.latency < 5000 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {row.latency}ms
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-sm text-slate-400">
                      {formatTimestamp(row.lastSeen)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
