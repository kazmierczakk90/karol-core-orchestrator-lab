
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Clock, 
  Bot, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Play,
  Pause,
  Settings,
  Brain,
  MessageSquare,
  Command
} from 'lucide-react';
import { autoImprovementService, ImprovementEvent } from '@/services/autoImprovementService';

interface TimelineEvent {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  type: 'live' | 'planned';
  category: 'decision' | 'action' | 'chat' | 'command' | 'result' | 'system';
  agentId?: string;
  status: 'completed' | 'in-progress' | 'pending' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata?: any;
}

interface EnhancedTimelineProps {
  className?: string;
}

const EnhancedTimeline = ({ className }: EnhancedTimelineProps) => {
  const [liveEvents, setLiveEvents] = useState<TimelineEvent[]>([]);
  const [plannedEvents, setPlannedEvents] = useState<TimelineEvent[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  useEffect(() => {
    loadTimelineData();
    
    if (isAutoRefresh) {
      const interval = setInterval(loadTimelineData, 3000); // Refresh co 3 sekundy
      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  const loadTimelineData = () => {
    // Load live events from auto-improvement service
    const recentEvents = autoImprovementService.getRecentEvents(30);
    const convertedLiveEvents: TimelineEvent[] = recentEvents.map(event => ({
      id: event.id,
      timestamp: event.timestamp,
      title: event.context,
      description: event.details?.message || `${event.eventType} event`,
      type: 'live',
      category: event.eventType,
      agentId: event.agentId,
      status: event.details?.success !== false ? 'completed' : 'failed',
      priority: event.details?.impact === 'high' ? 'high' : event.details?.impact === 'medium' ? 'medium' : 'low',
      metadata: event.details
    }));

    // Generate some planned events for demonstration
    const plannedEventsData: TimelineEvent[] = [
      {
        id: 'planned-1',
        timestamp: new Date(Date.now() + 15 * 60 * 1000), // 15 minut
        title: 'Scheduled Agent Optimization',
        description: '@optymalizator will analyze system performance and suggest improvements',
        type: 'planned',
        category: 'system',
        agentId: '@optymalizator',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'planned-2',
        timestamp: new Date(Date.now() + 30 * 60 * 1000), // 30 minut
        title: 'Memory Consolidation Process',
        description: '@memory-core will consolidate and organize recent interactions',
        type: 'planned',
        category: 'system',
        agentId: '@memory-core',
        status: 'pending',
        priority: 'low'
      },
      {
        id: 'planned-3',
        timestamp: new Date(Date.now() + 60 * 60 * 1000), // 1 godzina
        title: 'Security Audit Scan',
        description: '@guardian-core will perform comprehensive security analysis',
        type: 'planned',
        category: 'system',
        agentId: '@guardian-core',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'planned-4',
        timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 godziny
        title: 'Auto-Improvement Review',
        description: '@ceo will review and approve pending improvement suggestions',
        type: 'planned',
        category: 'decision',
        agentId: '@ceo',
        status: 'pending',
        priority: 'critical'
      },
      {
        id: 'planned-5',
        timestamp: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 godziny
        title: 'System Backup Process',
        description: '@system-admin will initiate automated backup procedures',
        type: 'planned',
        category: 'system',
        agentId: '@system-admin',
        status: 'pending',
        priority: 'medium'
      }
    ];

    setLiveEvents(convertedLiveEvents.slice(0, 20));
    setPlannedEvents(plannedEventsData);
  };

  const getEventIcon = (category: string) => {
    switch (category) {
      case 'decision': return <Brain className="h-4 w-4" />;
      case 'action': return <Zap className="h-4 w-4" />;
      case 'chat': return <MessageSquare className="h-4 w-4" />;
      case 'command': return <Command className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'in-progress': return <Play className="h-4 w-4 text-blue-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'decision': return 'bg-purple-500/30 border-purple-500/50';
      case 'action': return 'bg-blue-500/30 border-blue-500/50';
      case 'chat': return 'bg-green-500/30 border-green-500/50';
      case 'command': return 'bg-yellow-500/30 border-yellow-500/50';
      case 'system': return 'bg-cyan-500/30 border-cyan-500/50';
      default: return 'bg-gray-500/30 border-gray-500/50';
    }
  };

  const getAgentAvatar = (agentId?: string) => {
    if (!agentId) return 'SYS';
    return agentId.replace('@', '').substring(0, 2).toUpperCase();
  };

  const renderTimelineItem = (event: TimelineEvent, index: number) => (
    <div key={event.id} className="relative">
      {/* Timeline line */}
      {index < (event.type === 'live' ? liveEvents.length - 1 : plannedEvents.length - 1) && (
        <div className="absolute left-6 top-16 w-0.5 h-16 bg-slate-600" />
      )}
      
      <div className="flex items-start space-x-4 pb-6">
        {/* Avatar with status */}
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-slate-600">
            <AvatarFallback className={`text-white text-xs font-bold ${getCategoryColor(event.category)}`}>
              {getAgentAvatar(event.agentId)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1">
            {getStatusIcon(event.status)}
          </div>
        </div>

        {/* Event content */}
        <div className="flex-1 min-w-0">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getEventIcon(event.category)}
                <h4 className="text-white font-medium text-sm">{event.title}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(event.priority)}>
                  {event.priority}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {event.category}
                </Badge>
              </div>
            </div>
            
            <p className="text-slate-300 text-sm mb-3">{event.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 text-slate-400" />
                <span className="text-xs text-slate-400">
                  {event.type === 'live' 
                    ? `${Math.round((Date.now() - event.timestamp.getTime()) / 60000)}m ago`
                    : `in ${Math.round((event.timestamp.getTime() - Date.now()) / 60000)}m`
                  }
                </span>
              </div>
              
              {event.agentId && (
                <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-500/50">
                  {event.agentId}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`grid grid-cols-2 gap-6 ${className}`}>
      {/* Live Events Column */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse" />
              <span>Live Events</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                {liveEvents.length} events
              </Badge>
              <button
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className={`p-1 rounded ${isAutoRefresh ? 'text-green-400' : 'text-slate-400'}`}
              >
                {isAutoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]"> {/* 30% wyższe kontenery */}
            <div className="p-4">
              {liveEvents.length > 0 ? (
                liveEvents.map((event, index) => renderTimelineItem(event, index))
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400">No live events</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Planned Events Column */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              <span>Planned Actions</span>
            </CardTitle>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              {plannedEvents.length} scheduled
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]"> {/* 30% wyższe kontenery */}
            <div className="p-4">
              {plannedEvents.length > 0 ? (
                plannedEvents.map((event, index) => renderTimelineItem(event, index))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400">No planned events</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedTimeline;
