
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Brain, Activity, AlertTriangle, CheckCircle, Clock, Settings } from 'lucide-react';
import { useMetaDecision } from '@/hooks/useMetaDecision';
import { MetaDecision } from '@/types/metaDecision';

const MetaOrchestrator = () => {
  const { 
    metaDecisions, 
    agentStates, 
    isLoading, 
    createMetaDecision, 
    processDecision 
  } = useMetaDecision();
  
  const [isCreating, setIsCreating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-500/20 text-red-400';
    if (priority >= 6) return 'bg-orange-500/20 text-orange-400';
    if (priority >= 4) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  };

  const handleCreateTestDecision = async () => {
    setIsCreating(true);
    try {
      await createMetaDecision({
        decision_type: 'agent_coordination',
        source_agent: '@meta-orchestrator',
        target_agent: '@ceo',
        priority: Math.floor(Math.random() * 10) + 1,
        status: 'pending',
        context: {
          task: 'Test coordination decision',
          timestamp: new Date().toISOString(),
          metadata: { test: true }
        },
        emotional_state: {
          confidence: 0.8,
          urgency: 0.6,
          complexity: 0.7
        }
      });
    } catch (error) {
      console.error('Failed to create test decision:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleProcessDecision = async (decisionId: string) => {
    try {
      await processDecision(decisionId);
    } catch (error) {
      console.error('Failed to process decision:', error);
    }
  };

  const stats = {
    totalDecisions: metaDecisions.length,
    pendingDecisions: metaDecisions.filter(d => d.status === 'pending').length,
    activeAgents: agentStates.filter(a => a.current_status !== 'offline').length,
    avgPerformance: agentStates.length > 0 
      ? Math.round(agentStates.reduce((acc, a) => acc + a.performance_score, 0) / agentStates.length)
      : 0
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-purple-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Activity className="h-8 w-8 text-purple-400 animate-spin" />
              <span className="ml-3 text-slate-300">Loading Meta-Orchestrator...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800/50 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>Meta-Orchestrator</span>
            <Badge className="bg-purple-500/20 text-purple-400 ml-2">Level 3 - Active</Badge>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Centralny system zarządzania decyzjami i koordynacji agentów
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold">{stats.totalDecisions}</div>
              <div className="text-slate-400 text-sm">Total Decisions</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-yellow-400 text-2xl font-bold">{stats.pendingDecisions}</div>
              <div className="text-slate-400 text-sm">Pending</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{stats.activeAgents}</div>
              <div className="text-slate-400 text-sm">Active Agents</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-blue-400 text-2xl font-bold">{stats.avgPerformance}%</div>
              <div className="text-slate-400 text-sm">Avg Performance</div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-semibold">Recent Decisions</h3>
            <Button 
              onClick={handleCreateTestDecision}
              disabled={isCreating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isCreating ? <Activity className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
              <span className="ml-2">Create Test Decision</span>
            </Button>
          </div>

          <div className="rounded-lg border border-slate-700/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="text-slate-300">Decision</TableHead>
                  <TableHead className="text-slate-300">Priority</TableHead>
                  <TableHead className="text-slate-300">Source → Target</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Created</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metaDecisions.slice(0, 10).map((decision) => (
                  <TableRow key={decision.id} className="border-slate-700/50 hover:bg-slate-700/30">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-white">{decision.decision_type}</div>
                        <div className="text-slate-400 text-sm">
                          {decision.context?.task || 'No description'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(decision.priority)}>
                        P{decision.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-300 text-sm font-mono">
                        {decision.source_agent} → {decision.target_agent || 'auto'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(decision.status)}>
                        {decision.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-400 text-sm">
                        {new Date(decision.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {decision.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProcessDecision(decision.id)}
                          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                        >
                          Process
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {metaDecisions.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No decisions in queue</p>
              <p>Create a test decision to see the Meta-Orchestrator in action.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaOrchestrator;
