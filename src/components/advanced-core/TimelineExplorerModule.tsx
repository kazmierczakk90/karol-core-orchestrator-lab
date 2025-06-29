
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Filter, Eye, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimelineEvent {
  id: string;
  timestamp: string;
  agent: string;
  event: string;
  type: 'decision' | 'action' | 'change' | 'error';
  details: string;
  snapshot?: string;
}

const TimelineExplorerModule = () => {
  const { toast } = useToast();
  const [events] = useState<TimelineEvent[]>([
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      agent: '@state-keeper',
      event: 'Memory Snapshot Created',
      type: 'action',
      details: 'Full system state captured',
      snapshot: 'snap_001'
    },
    {
      id: '2',
      timestamp: '2024-01-15T10:25:00Z',
      agent: '@adaptive-core',
      event: 'Cognitive Adaptation',
      type: 'change',
      details: 'Learning pattern updated'
    },
    {
      id: '3',
      timestamp: '2024-01-15T10:20:00Z',
      agent: '@voice-core',
      event: 'Emotional State Change',
      type: 'decision',
      details: 'Confidence level adjusted to 85%'
    }
  ]);

  const [filter, setFilter] = useState({
    agent: 'all',
    type: 'all',
    search: ''
  });

  const filteredEvents = events.filter(event => {
    if (filter.agent !== 'all' && event.agent !== filter.agent) return false;
    if (filter.type !== 'all' && event.type !== filter.type) return false;
    if (filter.search && !event.event.toLowerCase().includes(filter.search.toLowerCase()) && 
        !event.details.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const getEventColor = (type: string) => {
    switch(type) {
      case 'decision': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'action': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'change': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const viewSnapshot = (snapshotId: string | undefined) => {
    if (!snapshotId) return;
    toast({
      title: "Snapshot Viewer",
      description: `@state-keeper loading snapshot ${snapshotId}`,
    });
  };

  const exportTimeline = () => {
    toast({
      title: "Export Started",
      description: "Timeline data being prepared for export",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Timeline Explorer</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-slate-900/50 rounded-lg">
            <div className="flex-1 min-w-48">
              <Input
                placeholder="Search events..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            
            <Select value={filter.agent} onValueChange={(value) => setFilter(prev => ({ ...prev, agent: value }))}>
              <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="@state-keeper">@state-keeper</SelectItem>
                <SelectItem value="@adaptive-core">@adaptive-core</SelectItem>
                <SelectItem value="@voice-core">@voice-core</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filter.type} onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="decision">Decisions</SelectItem>
                <SelectItem value="action">Actions</SelectItem>
                <SelectItem value="change">Changes</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={exportTimeline} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Timeline */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="flex items-start space-x-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${getEventColor(event.type).split(' ')[0]} border-2`} />
                  {index < filteredEvents.length - 1 && (
                    <div className="w-0.5 h-12 bg-slate-600 mt-2" />
                  )}
                </div>
                
                {/* Event content */}
                <div className="flex-1 pb-8">
                  <div className={`p-4 rounded-lg border ${getEventColor(event.type)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{event.agent}</Badge>
                        <span className="text-white font-medium">{event.event}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {event.snapshot && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => viewSnapshot(event.snapshot)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        )}
                        <span className="text-xs text-slate-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">{event.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineExplorerModule;
