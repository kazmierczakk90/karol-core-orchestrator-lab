
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GitBranch, Activity, Settings, Target, Zap } from 'lucide-react';
import { useMetaDecision } from '@/hooks/useMetaDecision';

const DecisionRouter = () => {
  const { 
    routingRules, 
    metaDecisions, 
    agentStates, 
    isLoading 
  } = useMetaDecision();

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeRouting = async () => {
    setIsAnalyzing(true);
    // Simulate routing analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const getRoutingEfficiency = () => {
    const processedDecisions = metaDecisions.filter(d => d.status === 'completed');
    const avgRoutingScore = processedDecisions.length > 0
      ? processedDecisions.reduce((acc, d) => acc + (d.routing_score || 0), 0) / processedDecisions.length
      : 0;
    return Math.round(avgRoutingScore);
  };

  const getAgentLoadDistribution = () => {
    return agentStates.map(agent => ({
      agent_id: agent.agent_id,
      load_level: agent.load_level,
      performance: agent.performance_score,
      status: agent.current_status
    }));
  };

  const stats = {
    activeRules: routingRules.length,
    routingEfficiency: getRoutingEfficiency(),
    avgResponseTime: '1.2s',
    successRate: '94%'
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Activity className="h-8 w-8 text-blue-400 animate-spin" />
              <span className="ml-3 text-slate-300">Loading Decision Router...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center space-x-2">
            <GitBranch className="h-6 w-6" />
            <span>Decision Router</span>
            <Badge className="bg-blue-500/20 text-blue-400 ml-2">Level 4 - Active</Badge>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Inteligentny system routingu decyzji i load balancing agentów
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-blue-400 text-2xl font-bold">{stats.activeRules}</div>
              <div className="text-slate-400 text-sm">Active Rules</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{stats.routingEfficiency}%</div>
              <div className="text-slate-400 text-sm">Efficiency</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold">{stats.avgResponseTime}</div>
              <div className="text-slate-400 text-sm">Response Time</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{stats.successRate}</div>
              <div className="text-slate-400 text-sm">Success Rate</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-700/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  <span>Routing Rules</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {routingRules.slice(0, 5).map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{rule.rule_name}</div>
                        <div className="text-slate-400 text-sm font-mono">
                          {rule.agent_pattern} → {rule.decision_pattern}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={rule.priority_modifier > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
                          {rule.priority_modifier > 0 ? '+' : ''}{rule.priority_modifier}
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-400">
                          Active
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {routingRules.length === 0 && (
                  <div className="text-center py-6 text-slate-400">
                    <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No routing rules configured</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span>Agent Load Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getAgentLoadDistribution().slice(0, 5).map((agent) => (
                    <div key={agent.agent_id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium font-mono">{agent.agent_id}</div>
                        <div className="text-slate-400 text-sm">
                          Performance: {agent.performance}%
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-blue-400 h-2 rounded-full" 
                            style={{ width: `${agent.load_level * 10}%` }}
                          />
                        </div>
                        <Badge className={
                          agent.status === 'idle' ? 'bg-green-500/20 text-green-400' :
                          agent.status === 'busy' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }>
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {agentStates.length === 0 && (
                  <div className="text-center py-6 text-slate-400">
                    <Zap className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No agent states available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-center">
            <Button 
              onClick={analyzeRouting}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? <Activity className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
              <span className="ml-2">
                {isAnalyzing ? 'Analyzing Routing...' : 'Analyze Routing Efficiency'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DecisionRouter;
