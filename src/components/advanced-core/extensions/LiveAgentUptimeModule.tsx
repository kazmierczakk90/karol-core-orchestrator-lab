
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Shield, Clock } from 'lucide-react';

interface AgentStatus {
  name: string;
  uptime: number;
  status: 'online' | 'busy' | 'offline';
  latency: number;
  lastSeen: string;
}

const LiveAgentUptimeModule = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([
    { name: '@voice-core', uptime: 99.8, status: 'online', latency: 12, lastSeen: '00:01' },
    { name: '@evolution-tracker', uptime: 97.5, status: 'busy', latency: 8, lastSeen: '00:02' },
    { name: '@router', uptime: 99.9, status: 'online', latency: 5, lastSeen: '00:00' },
    { name: '@state-keeper', uptime: 96.2, status: 'online', latency: 15, lastSeen: '00:01' },
    { name: '@guardian-core', uptime: 100, status: 'online', latency: 3, lastSeen: '00:00' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        latency: agent.latency + Math.floor(Math.random() * 3) - 1,
        lastSeen: '00:00'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return 'text-green-400';
    if (uptime >= 95) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Live Agent Uptime</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-blue-400">@guardian-core</Badge>
          <Badge variant="secondary" className="text-xs">
            Real-time Monitor
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {agents.map((agent, index) => (
          <div key={index} className="bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                <Badge variant="outline" className="text-xs">
                  {agent.name}
                </Badge>
                <span className="text-xs text-slate-400 capitalize">
                  {agent.status}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className={getUptimeColor(agent.uptime)}>
                  {agent.uptime}% up
                </span>
                <span className="text-slate-400">
                  {agent.latency}ms
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Last seen: {agent.lastSeen}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Monitored</span>
              </div>
            </div>
          </div>
        ))}

        <div className="border-t border-slate-700 pt-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="text-xs text-slate-400">
              <div>Status Lampki: Active</div>
              <div>Uptime Tracking: 24/7</div>
              <div>Latency Monitor: Real-time</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveAgentUptimeModule;
