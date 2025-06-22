
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Network, Zap, Activity, Target, Layers,
  TrendingUp, AlertTriangle, CheckCircle, Clock,
  Cpu, Database, Globe, Shield, Workflow
} from 'lucide-react';

import { cognitiveCore } from '@/services/cognitiveCore';
import { decisionEngine } from '@/services/decisionEngine';
import { orchestrationEngine } from '@/services/orchestrationEngine';

const ComprehensiveDashboard = () => {
  const [systemMetrics, setSystemMetrics] = useState<any>({});
  const [agentMetrics, setAgentMetrics] = useState<any>({});
  const [decisionMetrics, setDecisionMetrics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        
        // Collect comprehensive metrics
        const orchestrationMetrics = orchestrationEngine.collectMetrics();
        const agents = orchestrationEngine.getAgents();
        const events = orchestrationEngine.getEvents(50);
        const healthStatus = orchestrationEngine.healthCheck();

        setSystemMetrics({
          totalAgents: orchestrationMetrics.totalAgents,
          onlineAgents: orchestrationMetrics.onlineAgents,
          averagePerformance: orchestrationMetrics.averagePerformance,
          averageLoad: orchestrationMetrics.averageLoad,
          eventCount: orchestrationMetrics.eventCount,
          healthStatus
        });

        setAgentMetrics({
          agents: agents.slice(0, 10), // Top 10 agents
          capabilityDistribution: orchestrationMetrics.capabilityDistribution
        });

        setDecisionMetrics({
          recentDecisions: events.filter(e => e.type.includes('decision')).slice(0, 5),
          successRate: 85 + Math.random() * 10,
          averageTime: 150 + Math.random() * 100
        });

      } catch (error) {
        console.error('Failed to load metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'unhealthy': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'unhealthy': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gradient-primary">Karol-Core Comprehensive Dashboard</h1>
        <p className="text-slate-300">Advanced AGI Platform Monitoring & Control Center</p>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-800/50 to-cyan-700/30 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Network className="h-8 w-8 text-cyan-400" />
              <div>
                <div className="text-2xl font-bold text-white">{systemMetrics.onlineAgents || 0}</div>
                <div className="text-cyan-300 text-sm">Active Agents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-800/50 to-emerald-700/30 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{Math.round(systemMetrics.averagePerformance || 0)}%</div>
                <div className="text-green-300 text-sm">Performance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-800/50 to-pink-700/30 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{systemMetrics.eventCount || 0}</div>
                <div className="text-purple-300 text-sm">Events</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-800/50 to-red-700/30 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Cpu className="h-8 w-8 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-white">{Math.round(systemMetrics.averageLoad || 0)}%</div>
                <div className="text-orange-300 text-sm">System Load</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="quantum">Quantum</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>System Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(systemMetrics.healthStatus || {}).map(([agentId, status]) => (
                    <div key={agentId} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(status as string)}
                        <span className="text-white font-medium">{agentId.slice(0, 12)}...</span>
                      </div>
                      <Badge className={`${getStatusColor(status as string)} border-current`}>
                        {status as string}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center space-x-2">
                  <Layers className="h-5 w-5" />
                  <span>Platform Levels</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { level: 'Cognitive Core', progress: 85, color: 'bg-purple-500' },
                    { level: 'Decision Engine', progress: 92, color: 'bg-blue-500' },
                    { level: 'Orchestration', progress: 78, color: 'bg-green-500' },
                    { level: 'Interface Layer', progress: 89, color: 'bg-orange-500' },
                    { level: 'Analytics', progress: 95, color: 'bg-pink-500' }
                  ].map((item) => (
                    <div key={item.level} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{item.level}</span>
                        <span className="text-slate-400">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all duration-1000`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center space-x-2">
                <Network className="h-5 w-5" />
                <span>Agent Registry</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentMetrics.agents?.length > 0 ? (
                  agentMetrics.agents.map((agent: any, index: number) => (
                    <div key={agent.id || index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          agent.status === 'online' ? 'bg-green-400' :
                          agent.status === 'busy' ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <div className="text-white font-medium">{agent.name || `Agent ${index + 1}`}</div>
                          <div className="text-slate-400 text-sm">{agent.capabilities?.length || 0} capabilities</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-white text-sm">{agent.performance || 85}% perf</div>
                          <div className="text-slate-400 text-xs">{agent.loadLevel || 0}% load</div>
                        </div>
                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                          {agent.status || 'online'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No agents registered</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Decision Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">{Math.round(decisionMetrics.successRate || 0)}%</div>
                  <div className="text-slate-400 text-sm">Success Rate</div>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">{Math.round(decisionMetrics.averageTime || 0)}ms</div>
                  <div className="text-slate-400 text-sm">Avg Time</div>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">{decisionMetrics.recentDecisions?.length || 0}</div>
                  <div className="text-slate-400 text-sm">Recent</div>
                </div>
              </div>

              <div className="space-y-3">
                {decisionMetrics.recentDecisions?.length > 0 ? (
                  decisionMetrics.recentDecisions.map((decision: any, index: number) => (
                    <div key={decision.id || index} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{decision.type || 'Decision'}</div>
                          <div className="text-slate-400 text-sm">{decision.source || 'System'}</div>
                        </div>
                        <div className="text-slate-400 text-xs">
                          {new Date(decision.timestamp || Date.now()).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent decisions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Memory Systems</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Memory Types</h4>
                  {[
                    { type: 'Episodic', count: 245, color: 'bg-blue-500' },
                    { type: 'Semantic', count: 189, color: 'bg-green-500' },
                    { type: 'Procedural', count: 156, color: 'bg-purple-500' },
                    { type: 'Emotional', count: 87, color: 'bg-red-500' }
                  ].map((memory) => (
                    <div key={memory.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${memory.color}`} />
                        <span className="text-white">{memory.type}</span>
                      </div>
                      <span className="text-slate-400">{memory.count}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Memory Health</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">Compression Ratio</span>
                        <span className="text-slate-400">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">Retrieval Speed</span>
                        <span className="text-slate-400">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">Association Strength</span>
                        <span className="text-slate-400">89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quantum" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-pink-400 flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Quantum Systems</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Quantum States</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Superposition Active', value: 12, status: 'active' },
                      { name: 'Entangled Pairs', value: 8, status: 'stable' },
                      { name: 'Collapsed States', value: 156, status: 'normal' },
                      { name: 'Coherence Level', value: 94, status: 'optimal' }
                    ].map((quantum) => (
                      <div key={quantum.name} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <span className="text-white">{quantum.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-pink-400 font-medium">{quantum.value}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              quantum.status === 'optimal' ? 'text-green-400 border-green-400' :
                              quantum.status === 'active' ? 'text-blue-400 border-blue-400' :
                              quantum.status === 'stable' ? 'text-yellow-400 border-yellow-400' :
                              'text-slate-400 border-slate-400'
                            }`}
                          >
                            {quantum.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Quantum Operations</h4>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      onClick={() => console.log('Creating quantum superposition...')}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Create Superposition
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/20"
                      onClick={() => console.log('Entangling agents...')}
                    >
                      <Network className="h-4 w-4 mr-2" />
                      Entangle Agents
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-pink-500 text-pink-400 hover:bg-pink-500/20"
                      onClick={() => console.log('Measuring quantum state...')}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Measure State
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveDashboard;
