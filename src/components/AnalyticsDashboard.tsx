
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Activity, 
  TrendingUp, 
  Brain, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Users,
  Database,
  Settings,
  BarChart3,
  Target,
  Lightbulb,
  Cpu,
  TreePine,
  Table as TableIcon
} from 'lucide-react';
import { autoImprovementService, SystemMetrics, ImprovementSuggestion, ImprovementEvent } from '@/services/autoImprovementService';
import NavigationTree from './NavigationTree';
import EnhancedTimeline from './EnhancedTimeline';
import SmartTable from './SmartTable';
import AgentPreferencesHub from './AgentPreferencesHub';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalyticsDashboard = ({ isOpen, onClose }: AnalyticsDashboardProps) => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [recentEvents, setRecentEvents] = useState<ImprovementEvent[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 5000); // Refresh co 5 sekund
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadDashboardData = () => {
    setMetrics(autoImprovementService.getMetrics());
    setSuggestions(autoImprovementService.getSuggestions());
    setRecentEvents(autoImprovementService.getRecentEvents(20));
  };

  const handleNodeSelect = (node: any) => {
    console.log('Selected node:', node);
    // Navigate to specific component/function/agent
    if (node.type === 'agent') {
      setActiveTab('agents');
    } else if (node.type === 'function') {
      // Open specific function details
      console.log('Opening function:', node.functionId);
    }
  };

  const handleGroupOperation = (operation: string, nodes: any[]) => {
    console.log(`Group operation: ${operation} on nodes:`, nodes);
    // Handle bulk operations on selected nodes
  };

  const handleNavigateToFunction = (functionId: string, filePath?: string) => {
    console.log('Navigate to function:', functionId, filePath);
    // Implement navigation logic
  };

  const handleNavigateToAgent = (agentId: string) => {
    console.log('Navigate to agent:', agentId);
    setActiveTab('agents');
  };

  if (!isOpen || !metrics) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'approved': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex h-full">
        {/* Enhanced Sidebar with Navigation Tree */}
        <div className="w-96 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-cyan-800/30 p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-cyan-400 animate-pulse" />
              <div>
                <h1 className="text-xl font-bold text-white">Analytics Hub</h1>
                <p className="text-sm text-slate-400">Auto-Improvement Control</p>
              </div>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm text-slate-300">System Status</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  Active
                </Badge>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Efficiency</span>
                <span className="text-sm text-white">{metrics.averageEfficiency.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.averageEfficiency} className="h-2" />
            </div>
          </div>

          {/* Navigation Tree */}
          <div className="flex-1 min-h-0">
            <NavigationTree 
              onNodeSelect={handleNodeSelect}
              onGroupOperation={handleGroupOperation}
              className="h-full"
            />
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mt-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
              { id: 'agents', label: 'Agent Hub', icon: Users },
              { id: 'improvement', label: 'Auto-Improvement', icon: TrendingUp }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-slate-900 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="p-8 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Total Events</CardTitle>
                    <Database className="h-4 w-4 text-cyan-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metrics.totalEvents}</div>
                    <p className="text-xs text-slate-400">System interactions</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Suggestions</CardTitle>
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metrics.totalSuggestions}</div>
                    <p className="text-xs text-slate-400">Improvement ideas</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Implemented</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metrics.implementedSuggestions}</div>
                    <p className="text-xs text-slate-400">Applied changes</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Weekly Growth</CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metrics.weeklyImprovement}</div>
                    <p className="text-xs text-slate-400">This week</p>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Timeline */}
              <EnhancedTimeline className="mb-8" />

              {/* Smart Table - always last element with anchor */}
              <SmartTable className="mt-8" />
            </TabsContent>

            <TabsContent value="timeline" className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">System Timeline</h2>
                <p className="text-slate-400">Real-time view of live events and planned actions</p>
              </div>
              <EnhancedTimeline />
            </TabsContent>

            <TabsContent value="suggestions" className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Auto-Improvement Suggestions</h2>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                  {suggestions.length} Total
                </Badge>
              </div>
              
              <div className="space-y-3">
                {suggestions.slice(0, 10).map((suggestion) => (
                  <Card key={suggestion.id} className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getStatusColor(suggestion.status)}>
                              {suggestion.status}
                            </Badge>
                            <Badge variant="outline" className={getImpactColor(suggestion.impact)}>
                              {suggestion.impact} impact
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {suggestion.category}
                            </span>
                          </div>
                          <p className="text-white text-sm mb-2">{suggestion.description}</p>
                          <p className="text-slate-400 text-xs">{suggestion.implementation}</p>
                        </div>
                        <div className="text-xs text-slate-500">
                          {suggestion.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="agents" className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Agent Preferences Hub</h2>
                <p className="text-slate-400">Central navigation and management for all system agents</p>
              </div>
              <AgentPreferencesHub 
                onNavigateToFunction={handleNavigateToFunction}
                onNavigateToAgent={handleNavigateToAgent}
              />
            </TabsContent>

            <TabsContent value="improvement" className="p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Auto-Improvement Engine</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Active Agents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: '@optymalizator', status: 'active', role: 'Analysis & Quality' },
                      { name: '@system-admin', status: 'active', role: 'Implementation' },
                      { name: '@logger', status: 'active', role: 'Event Tracking' },
                      { name: '@ceo', status: 'active', role: 'Approval Process' }
                    ].map((agent) => (
                      <div key={agent.name} className="flex items-center justify-between">
                        <div>
                          <span className="text-white text-sm font-medium">{agent.name}</span>
                          <p className="text-xs text-slate-400">{agent.role}</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                          {agent.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Improvement Cycle</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                        <span className="text-cyan-400 text-xs">1</span>
                      </div>
                      <div>
                        <span className="text-white text-sm">Event Detection</span>
                        <p className="text-xs text-slate-400">Continuous monitoring</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <span className="text-yellow-400 text-xs">2</span>
                      </div>
                      <div>
                        <span className="text-white text-sm">Analysis</span>
                        <p className="text-xs text-slate-400">@optymalizator review</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 text-xs">3</span>
                      </div>
                      <div>
                        <span className="text-white text-sm">Approval</span>
                        <p className="text-xs text-slate-400">@ceo decision</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-green-400 text-xs">4</span>
                      </div>
                      <div>
                        <span className="text-white text-sm">Implementation</span>
                        <p className="text-xs text-slate-400">@system-admin deploy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
