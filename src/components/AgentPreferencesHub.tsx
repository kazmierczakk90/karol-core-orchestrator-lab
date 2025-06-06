
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Settings, 
  Code, 
  FileText, 
  Link, 
  Search, 
  Filter,
  Star,
  Heart,
  Zap,
  Brain,
  Shield,
  Database,
  MessageSquare,
  Command,
  Target,
  Activity
} from 'lucide-react';

interface AgentFunction {
  id: string;
  name: string;
  type: 'core' | 'utility' | 'integration' | 'analysis';
  status: 'active' | 'inactive' | 'maintenance';
  filePath?: string;
  description: string;
  dependencies: string[];
  lastUsed: Date;
  usage: number;
}

interface AgentProfile {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  avatar: string;
  description: string;
  capabilities: string[];
  functions: AgentFunction[];
  performance: {
    successRate: number;
    avgResponseTime: number;
    totalExecutions: number;
  };
  preferences: {
    priority: 'low' | 'medium' | 'high' | 'critical';
    autonomy: number; // 0-100
    learningEnabled: boolean;
  };
}

interface AgentPreferencesHubProps {
  className?: string;
  onNavigateToFunction?: (functionId: string, filePath?: string) => void;
  onNavigateToAgent?: (agentId: string) => void;
}

const AgentPreferencesHub = ({ className, onNavigateToFunction, onNavigateToAgent }: AgentPreferencesHubProps) => {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAgentProfiles();
  }, []);

  const loadAgentProfiles = () => {
    const agentProfiles: AgentProfile[] = [
      {
        id: '@ceo',
        name: 'CEO Agent',
        role: 'Strategic Decision Maker',
        status: 'active',
        avatar: 'CEO',
        description: 'Central executive agent responsible for high-level strategic decisions and system oversight',
        capabilities: ['Strategic Planning', 'Decision Making', 'Resource Allocation', 'Approval Authority'],
        performance: {
          successRate: 95,
          avgResponseTime: 1200,
          totalExecutions: 156
        },
        preferences: {
          priority: 'critical',
          autonomy: 85,
          learningEnabled: true
        },
        functions: [
          {
            id: 'strategic-decision',
            name: 'Strategic Decision Engine',
            type: 'core',
            status: 'active',
            filePath: '/services/strategicDecisionService.ts',
            description: 'Core decision-making logic for strategic choices',
            dependencies: ['@router', '@optymalizator'],
            lastUsed: new Date(Date.now() - 10 * 60 * 1000),
            usage: 45
          },
          {
            id: 'approval-workflow',
            name: 'Approval Workflow',
            type: 'core',
            status: 'active',
            description: 'Manages approval processes for system improvements',
            dependencies: ['@system-admin'],
            lastUsed: new Date(Date.now() - 30 * 60 * 1000),
            usage: 32
          }
        ]
      },
      {
        id: '@optymalizator',
        name: 'Optimizer Agent',
        role: 'Performance Analyst',
        status: 'active',
        avatar: 'OPT',
        description: 'Continuously analyzes system performance and generates improvement suggestions',
        capabilities: ['Performance Analysis', 'Code Optimization', 'Pattern Recognition', 'Suggestion Generation'],
        performance: {
          successRate: 88,
          avgResponseTime: 800,
          totalExecutions: 324
        },
        preferences: {
          priority: 'high',
          autonomy: 70,
          learningEnabled: true
        },
        functions: [
          {
            id: 'performance-analysis',
            name: 'Performance Analysis Engine',
            type: 'analysis',
            status: 'active',
            filePath: '/services/performanceAnalysisService.ts',
            description: 'Analyzes system performance metrics and identifies bottlenecks',
            dependencies: ['@logger', '@guardian-core'],
            lastUsed: new Date(Date.now() - 5 * 60 * 1000),
            usage: 89
          },
          {
            id: 'suggestion-generator',
            name: 'Improvement Suggestion Generator',
            type: 'analysis',
            status: 'active',
            description: 'Generates actionable improvement suggestions based on analysis',
            dependencies: [],
            lastUsed: new Date(Date.now() - 15 * 60 * 1000),
            usage: 67
          }
        ]
      },
      {
        id: '@router',
        name: 'Router Agent',
        role: 'Request Manager',
        status: 'active',
        avatar: 'RTR',
        description: 'Routes requests and manages inter-agent communication',
        capabilities: ['Request Routing', 'Load Balancing', 'Communication Management', 'Priority Handling'],
        performance: {
          successRate: 97,
          avgResponseTime: 450,
          totalExecutions: 1247
        },
        preferences: {
          priority: 'high',
          autonomy: 60,
          learningEnabled: false
        },
        functions: [
          {
            id: 'request-routing',
            name: 'Request Routing Engine',
            type: 'core',
            status: 'active',
            filePath: '/services/routingService.ts',
            description: 'Routes incoming requests to appropriate agents',
            dependencies: [],
            lastUsed: new Date(Date.now() - 2 * 60 * 1000),
            usage: 156
          },
          {
            id: 'load-balancer',
            name: 'Load Balancer',
            type: 'utility',
            status: 'active',
            description: 'Balances workload across available agents',
            dependencies: ['@guardian-core'],
            lastUsed: new Date(Date.now() - 8 * 60 * 1000),
            usage: 78
          }
        ]
      },
      {
        id: '@guardian-core',
        name: 'Guardian Agent',
        role: 'Security Monitor',
        status: 'active',
        avatar: 'GRD',
        description: 'Monitors system security and prevents unauthorized access',
        capabilities: ['Security Monitoring', 'Threat Detection', 'Access Control', 'Audit Logging'],
        performance: {
          successRate: 99,
          avgResponseTime: 300,
          totalExecutions: 890
        },
        preferences: {
          priority: 'critical',
          autonomy: 40,
          learningEnabled: true
        },
        functions: [
          {
            id: 'security-monitor',
            name: 'Security Monitoring System',
            type: 'core',
            status: 'active',
            filePath: '/services/securityService.ts',
            description: 'Continuous security monitoring and threat detection',
            dependencies: ['@logger'],
            lastUsed: new Date(Date.now() - 1 * 60 * 1000),
            usage: 234
          },
          {
            id: 'access-control',
            name: 'Access Control Manager',
            type: 'core',
            status: 'active',
            description: 'Manages user access and permissions',
            dependencies: [],
            lastUsed: new Date(Date.now() - 12 * 60 * 1000),
            usage: 45
          }
        ]
      },
      {
        id: '@system-admin',
        name: 'System Admin Agent',
        role: 'Implementation Specialist',
        status: 'active',
        avatar: 'ADM',
        description: 'Implements approved changes and manages system operations',
        capabilities: ['Code Implementation', 'System Deployment', 'Configuration Management', 'Maintenance'],
        performance: {
          successRate: 91,
          avgResponseTime: 2100,
          totalExecutions: 67
        },
        preferences: {
          priority: 'medium',
          autonomy: 50,
          learningEnabled: true
        },
        functions: [
          {
            id: 'implementation-engine',
            name: 'Implementation Engine',
            type: 'core',
            status: 'active',
            filePath: '/services/implementationService.ts',
            description: 'Implements approved system changes and improvements',
            dependencies: ['@ceo', '@guardian-core'],
            lastUsed: new Date(Date.now() - 45 * 60 * 1000),
            usage: 23
          }
        ]
      },
      {
        id: '@logger',
        name: 'Logger Agent',
        role: 'Event Tracker',
        status: 'active',
        avatar: 'LOG',
        description: 'Tracks and logs all system events and interactions',
        capabilities: ['Event Logging', 'Data Collection', 'Audit Trails', 'Performance Metrics'],
        performance: {
          successRate: 100,
          avgResponseTime: 150,
          totalExecutions: 2341
        },
        preferences: {
          priority: 'medium',
          autonomy: 30,
          learningEnabled: false
        },
        functions: [
          {
            id: 'event-logger',
            name: 'Event Logging System',
            type: 'utility',
            status: 'active',
            filePath: '/services/loggingService.ts',
            description: 'Comprehensive event logging and storage',
            dependencies: [],
            lastUsed: new Date(Date.now() - 30 * 1000),
            usage: 456
          }
        ]
      },
      {
        id: '@memory-core',
        name: 'Memory Core Agent',
        role: 'Knowledge Manager',
        status: 'pending',
        avatar: 'MEM',
        description: 'Manages system knowledge and learning processes',
        capabilities: ['Knowledge Storage', 'Learning Management', 'Memory Consolidation', 'Pattern Recognition'],
        performance: {
          successRate: 0,
          avgResponseTime: 0,
          totalExecutions: 0
        },
        preferences: {
          priority: 'medium',
          autonomy: 75,
          learningEnabled: true
        },
        functions: [
          {
            id: 'knowledge-base',
            name: 'Knowledge Base Manager',
            type: 'core',
            status: 'maintenance',
            filePath: '/services/knowledgeService.ts',
            description: 'Manages system knowledge and learning data',
            dependencies: ['@logger'],
            lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
            usage: 0
          }
        ]
      }
    ];

    setAgents(agentProfiles);
    setSelectedAgent('@ceo');
  };

  const getSelectedAgentData = () => {
    return agents.find(agent => agent.id === selectedAgent);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'maintenance': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
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

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case '@ceo': return <Target className="h-5 w-5" />;
      case '@optymalizator': return <Zap className="h-5 w-5" />;
      case '@router': return <Activity className="h-5 w-5" />;
      case '@guardian-core': return <Shield className="h-5 w-5" />;
      case '@system-admin': return <Settings className="h-5 w-5" />;
      case '@logger': return <FileText className="h-5 w-5" />;
      case '@memory-core': return <Brain className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  const selectedAgentData = getSelectedAgentData();

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Agent List */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center space-x-2">
            <Bot className="h-5 w-5 text-cyan-400" />
            <span>System Agents</span>
          </CardTitle>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white text-sm"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="p-3 space-y-2">
              {agents
                .filter(agent => agent.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((agent) => (
                <div
                  key={agent.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedAgent === agent.id 
                      ? 'bg-cyan-500/20 border border-cyan-500/50' 
                      : 'bg-slate-700/30 hover:bg-slate-700/50'
                  }`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-600">
                      {getAgentIcon(agent.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium text-sm truncate">{agent.name}</h4>
                        <Badge className={getStatusColor(agent.status)}>
                          {agent.status}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-xs truncate">{agent.role}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs text-slate-500">{agent.functions.length} functions</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-500">{agent.performance.successRate}% success</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Agent Details */}
      <div className="lg:col-span-2">
        {selectedAgentData ? (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-600">
                    {getAgentIcon(selectedAgentData.id)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedAgentData.name}</h2>
                    <p className="text-slate-400">{selectedAgentData.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(selectedAgentData.status)}>
                    {selectedAgentData.status}
                  </Badge>
                  <Badge className={getPriorityColor(selectedAgentData.preferences.priority)}>
                    {selectedAgentData.preferences.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-slate-700/50">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="functions">Functions</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Description</h3>
                    <p className="text-slate-300 text-sm">{selectedAgentData.description}</p>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-2">Capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgentData.capabilities.map((capability, index) => (
                        <Badge key={index} variant="outline" className="text-cyan-400 border-cyan-500/50">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-2xl font-bold text-white">{selectedAgentData.performance.successRate}%</div>
                      <div className="text-sm text-slate-400">Success Rate</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-2xl font-bold text-white">{selectedAgentData.performance.avgResponseTime}ms</div>
                      <div className="text-sm text-slate-400">Avg Response</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-2xl font-bold text-white">{selectedAgentData.performance.totalExecutions}</div>
                      <div className="text-sm text-slate-400">Total Executions</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="functions" className="mt-6">
                  <div className="space-y-3">
                    {selectedAgentData.functions.map((func) => (
                      <div key={func.id} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Code className="h-4 w-4 text-purple-400" />
                            <h4 className="text-white font-medium">{func.name}</h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(func.status)}>
                              {func.status}
                            </Badge>
                            {func.filePath && (
                              <Button
                                onClick={() => onNavigateToFunction?.(func.id, func.filePath)}
                                variant="outline"
                                size="sm"
                              >
                                <Link className="h-3 w-3 mr-1" />
                                View File
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-slate-300 text-sm mb-3">{func.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Last used: {func.lastUsed.toLocaleTimeString()}</span>
                          <span>Usage: {func.usage} times</span>
                        </div>

                        {func.dependencies.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-slate-500">Dependencies: </span>
                            {func.dependencies.map((dep, index) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">Success Rate Trend</h4>
                        <div className="text-3xl font-bold text-green-400">{selectedAgentData.performance.successRate}%</div>
                        <div className="text-sm text-slate-400">Last 30 days</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">Response Time</h4>
                        <div className="text-3xl font-bold text-blue-400">{selectedAgentData.performance.avgResponseTime}ms</div>
                        <div className="text-sm text-slate-400">Average</div>
                      </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Execution History</h4>
                      <div className="text-2xl font-bold text-white">{selectedAgentData.performance.totalExecutions}</div>
                      <div className="text-sm text-slate-400">Total executions since activation</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="mt-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Priority Level</h4>
                      <Badge className={getPriorityColor(selectedAgentData.preferences.priority)}>
                        {selectedAgentData.preferences.priority}
                      </Badge>
                    </div>

                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Autonomy Level</h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedAgentData.preferences.autonomy}%` }}
                          />
                        </div>
                        <span className="text-white font-medium">{selectedAgentData.preferences.autonomy}%</span>
                      </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">Learning Enabled</h4>
                        <Badge className={selectedAgentData.preferences.learningEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {selectedAgentData.preferences.learningEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-slate-400">Select an agent to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgentPreferencesHub;
