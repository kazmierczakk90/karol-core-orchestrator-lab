
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Activity, Zap, Database, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SyncBusProps {
  syncEnabled: boolean;
  setSyncEnabled: (enabled: boolean) => void;
}

const RealtimeSyncBusModule = ({ syncEnabled, setSyncEnabled }: SyncBusProps) => {
  const { toast } = useToast();

  const syncChannels = [
    { name: 'Snapshot ↔ Memory', active: true, throughput: '1.2k/s' },
    { name: 'Memory ↔ Insights', active: syncEnabled, throughput: '0.8k/s' },
    { name: 'Insights ↔ Decisions', active: true, throughput: '0.5k/s' },
    { name: 'Decisions ↔ Narrative', active: syncEnabled, throughput: '0.3k/s' },
    { name: 'Cross-Agent Sync', active: true, throughput: '2.1k/s' }
  ];

  const toggleSyncBus = (enabled: boolean) => {
    setSyncEnabled(enabled);
    toast({
      title: enabled ? "Sync Bus Activated" : "Sync Bus Deactivated",
      description: `@sync-core ${enabled ? 'enabled' : 'disabled'} real-time sync`,
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Realtime Sync Bus</span>
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-cyan-400">@sync-core</Badge>
            <Badge className={`${syncEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {syncEnabled ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="sync-bus" className="text-slate-300 text-sm">
              Enable Bus
            </Label>
            <Switch
              id="sync-bus"
              checked={syncEnabled}
              onCheckedChange={toggleSyncBus}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {syncChannels.map((channel, index) => (
            <div key={index} className="bg-slate-900/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${channel.active ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span className="text-white text-sm">{channel.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {channel.throughput}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {channel.active ? (
                      <Zap className="h-3 w-3 text-green-400" />
                    ) : (
                      <Database className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="flex items-center justify-center mb-1">
                <Database className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-blue-400">5.9k</div>
              <div className="text-xs text-slate-400">Messages/s</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="flex items-center justify-center mb-1">
                <Brain className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-lg font-bold text-purple-400">12</div>
              <div className="text-xs text-slate-400">Active Modules</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="flex items-center justify-center mb-1">
                <Activity className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-lg font-bold text-green-400">99.8%</div>
              <div className="text-xs text-slate-400">Uptime</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="text-xs text-slate-400">
            <div>Data Exchange: snapshot/memory/insight</div>
            <div>Bus Protocol: Real-time WebSocket</div>
            <div>Modules: 12 connected</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeSyncBusModule;
