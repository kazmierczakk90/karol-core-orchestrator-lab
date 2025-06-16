
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMetaDecision } from '@/hooks/useMetaDecision';

const PriorityManager = () => {
  const { 
    priorityQueue, 
    metaDecisions, 
    isLoading 
  } = useMetaDecision();

  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizePriorities = async () => {
    setIsOptimizing(true);
    // Simulate priority optimization
    setTimeout(() => {
      setIsOptimizing(false);
    }, 3000);
  };

  const getPriorityLevel = (priority: number) => {
    if (priority >= 8) return { color: 'bg-red-500/20 text-red-400', level: 'CRITICAL' };
    if (priority >= 6) return { color: 'bg-orange-500/20 text-orange-400', level: 'HIGH' };
    if (priority >= 4) return { color: 'bg-yellow-500/20 text-yellow-400', level: 'MEDIUM' };
    return { color: 'bg-green-500/20 text-green-400', level: 'LOW' };
  };

  const getQueueStats = () => {
    const highPriority = priorityQueue.filter(item => item.calculated_priority >= 7).length;
    const mediumPriority = priorityQueue.filter(item => item.calculated_priority >= 4 && item.calculated_priority < 7).length;
    const lowPriority = priorityQueue.filter(item => item.calculated_priority < 4).length;
    const avgWaitTime = priorityQueue.length > 0 
      ? Math.round(priorityQueue.reduce((acc, item) => acc + (item.estimated_duration || 0), 0) / priorityQueue.length)
      : 0;

    return { highPriority, mediumPriority, lowPriority, avgWaitTime };
  };

  const stats = getQueueStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-orange-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Activity className="h-8 w-8 text-orange-400 animate-spin" />
              <span className="ml-3 text-slate-300">Loading Priority Manager...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800/50 border-orange-800/30">
        <CardHeader>
          <CardTitle className="text-orange-400 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <span>Priority Manager</span>
            <Badge className="bg-orange-500/20 text-orange-400 ml-2">Level 5 - Active</Badge>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Dynamiczne zarządzanie priorytetami i optymalizacja kolejki zadań
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-red-400 text-2xl font-bold">{stats.highPriority}</div>
              <div className="text-slate-400 text-sm">High Priority</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-yellow-400 text-2xl font-bold">{stats.mediumPriority}</div>
              <div className="text-slate-400 text-sm">Medium Priority</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{stats.lowPriority}</div>
              <div className="text-slate-400 text-sm">Low Priority</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold">{stats.avgWaitTime}s</div>
              <div className="text-slate-400 text-sm">Avg Wait Time</div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-semibold">Priority Queue</h3>
            <Button 
              onClick={optimizePriorities}
              disabled={isOptimizing}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isOptimizing ? <Activity className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
              <span className="ml-2">
                {isOptimizing ? 'Optimizing...' : 'Optimize Priorities'}
              </span>
            </Button>
          </div>

          <div className="rounded-lg border border-slate-700/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="text-slate-300">Position</TableHead>
                  <TableHead className="text-slate-300">Decision</TableHead>
                  <TableHead className="text-slate-300">Priority</TableHead>
                  <TableHead className="text-slate-300">Est. Duration</TableHead>
                  <TableHead className="text-slate-300">Dependencies</TableHead>
                  <TableHead className="text-slate-300">Scheduled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priorityQueue.slice(0, 10).map((item, index) => {
                  const decision = metaDecisions.find(d => d.id === item.decision_id);
                  const priorityInfo = getPriorityLevel(item.calculated_priority);
                  
                  return (
                    <TableRow key={item.id} className="border-slate-700/50 hover:bg-slate-700/30">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-slate-600/50 text-slate-300">
                            #{item.queue_position || index + 1}
                          </Badge>
                          {index < 3 && (
                            <AlertTriangle className="h-4 w-4 text-orange-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-white">
                            {decision?.decision_type || 'Unknown'}
                          </div>
                          <div className="text-slate-400 text-sm font-mono">
                            {decision?.source_agent || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityInfo.color}>
                          {priorityInfo.level} ({item.calculated_priority.toFixed(1)})
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-300">
                            {item.estimated_duration || 0}s
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-300">
                          {item.dependencies && item.dependencies.length > 0 ? (
                            <Badge className="bg-blue-500/20 text-blue-400">
                              {item.dependencies.length} deps
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ready
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-400 text-sm">
                          {item.scheduled_at 
                            ? new Date(item.scheduled_at).toLocaleTimeString()
                            : 'ASAP'
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {priorityQueue.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Priority queue is empty</p>
              <p>No decisions waiting for processing.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PriorityManager;
