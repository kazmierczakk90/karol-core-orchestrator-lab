
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bot, Search, Play, Pause, Settings, Trash2, Plus, Activity } from 'lucide-react';

interface SystemAgent {
  id: string;
  name: string;
  type: 'core' | 'karol' | 'integration' | 'utility';
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  description: string;
  tasksCompleted: number;
  lastUsed: Date;
  capabilities: string[];
  version: string;
}

const SystemAgentsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const [agents, setAgents] = useState<SystemAgent[]>([
    { id: '@ceo', name: 'CEO Agent', type: 'core', status: 'active', description: 'Strategic decision making and high-level planning', tasksCompleted: 47, lastUsed: new Date(), capabilities: ['strategy', 'planning', 'leadership'], version: '2.1.0' },
    { id: '@logger', name: 'Logger Agent', type: 'utility', status: 'active', description: 'System logging and monitoring', tasksCompleted: 156, lastUsed: new Date(), capabilities: ['logging', 'monitoring', 'alerts'], version: '1.8.2' },
    { id: '@voice-core', name: 'Voice Core', type: 'core', status: 'active', description: 'Voice processing and communication', tasksCompleted: 23, lastUsed: new Date(), capabilities: ['voice', 'speech', 'audio'], version: '3.0.1' },
    { id: '@analiza', name: 'Analiza Agent', type: 'utility', status: 'active', description: 'Data analysis and insights', tasksCompleted: 89, lastUsed: new Date(), capabilities: ['analysis', 'data', 'insights'], version: '2.3.5' },
    { id: '@router', name: 'Router Agent', type: 'core', status: 'active', description: 'Task routing and distribution', tasksCompleted: 234, lastUsed: new Date(), capabilities: ['routing', 'distribution', 'load-balancing'], version: '1.9.0' },
    { id: '@kontroling', name: 'Kontroling Agent', type: 'utility', status: 'active', description: 'Quality control and oversight', tasksCompleted: 67, lastUsed: new Date(), capabilities: ['quality', 'control', 'validation'], version: '1.5.3' },
    { id: '@system-admin', name: 'System Admin', type: 'core', status: 'active', description: 'System administration and maintenance', tasksCompleted: 178, lastUsed: new Date(), capabilities: ['admin', 'maintenance', 'system'], version: '2.0.8' },
    { id: '@guardian-core', name: 'Guardian Core', type: 'core', status: 'active', description: 'Security and protection', tasksCompleted: 45, lastUsed: new Date(), capabilities: ['security', 'protection', 'monitoring'], version: '2.2.1' },
    { id: '@karol-core', name: 'Karol Core', type: 'karol', status: 'active', description: 'Core Karol system functionality', tasksCompleted: 312, lastUsed: new Date(), capabilities: ['core', 'orchestration', 'identity'], version: '4.1.2' },
    { id: '@karol-voice', name: 'Karol Voice', type: 'karol', status: 'active', description: 'Karol voice processing', tasksCompleted: 56, lastUsed: new Date(), capabilities: ['voice', 'karol-identity', 'communication'], version: '3.1.0' },
    { id: '@google-search', name: 'Google Search', type: 'integration', status: 'active', description: 'Google Search integration', tasksCompleted: 134, lastUsed: new Date(), capabilities: ['search', 'google', 'web'], version: '1.4.7' },
    { id: '@google-maps', name: 'Google Maps', type: 'integration', status: 'active', description: 'Google Maps integration', tasksCompleted: 28, lastUsed: new Date(), capabilities: ['maps', 'location', 'navigation'], version: '1.2.3' },
    { id: '@party-app', name: 'Party App', type: 'integration', status: 'maintenance', description: 'Event and party management', tasksCompleted: 15, lastUsed: new Date(), capabilities: ['events', 'parties', 'management'], version: '0.9.1' },
    { id: '@fuko-lang', name: 'FUKO Lang', type: 'karol', status: 'active', description: 'FUKO language processing', tasksCompleted: 98, lastUsed: new Date(), capabilities: ['language', 'fuko', 'processing'], version: '2.5.0' },
    { id: '@skyai.ai', name: 'SkyAI', type: 'integration', status: 'active', description: 'Advanced AI solutions', tasksCompleted: 76, lastUsed: new Date(), capabilities: ['ai', 'automation', 'solutions'], version: '1.7.4' }
  ]);

  const typeColors = {
    core: 'bg-blue-500/20 text-blue-400',
    karol: 'bg-purple-500/20 text-purple-400',
    integration: 'bg-green-500/20 text-green-400',
    utility: 'bg-orange-500/20 text-orange-400'
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-gray-500/20 text-gray-400',
    maintenance: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400'
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || agent.type === selectedType;
    return matchesSearch && matchesType;
  });

  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
        : agent
    ));
  };

  const getStatusCounts = () => {
    return {
      total: agents.length,
      active: agents.filter(a => a.status === 'active').length,
      inactive: agents.filter(a => a.status === 'inactive').length,
      maintenance: agents.filter(a => a.status === 'maintenance').length,
      error: agents.filter(a => a.status === 'error').length
    };
  };

  const stats = getStatusCounts();

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <span>System Agents</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Zarządzanie wszystkimi agentami w systemie Karol Core
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2 text-sm">
              <Badge className="bg-green-500/20 text-green-400">
                Active: {stats.active}
              </Badge>
              <Badge className="bg-gray-500/20 text-gray-400">
                Inactive: {stats.inactive}
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400">
                Maintenance: {stats.maintenance}
              </Badge>
              {stats.error > 0 && (
                <Badge className="bg-red-500/20 text-red-400">
                  Error: {stats.error}
                </Badge>
              )}
            </div>
            
            <Button className="bg-gradient-primary hover:bg-gradient-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border-slate-700/50 text-white pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            {['all', 'core', 'karol', 'integration', 'utility'].map((type) => (
              <Button
                key={type}
                size="sm"
                variant={selectedType === type ? "default" : "outline"}
                className={selectedType === type ? "bg-gradient-primary" : "border-slate-600"}
                onClick={() => setSelectedType(type)}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-slate-700/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50">
                <TableHead className="text-slate-300">Agent</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Tasks</TableHead>
                <TableHead className="text-slate-300">Capabilities</TableHead>
                <TableHead className="text-slate-300">Version</TableHead>
                <TableHead className="text-slate-300">Last Used</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id} className="border-slate-700/50 hover:bg-slate-700/30">
                  <TableCell>
                    <div>
                      <div className="font-mono text-cyan-400 font-semibold">{agent.id}</div>
                      <div className="text-slate-300 font-medium">{agent.name}</div>
                      <div className="text-slate-400 text-sm">{agent.description}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={`${typeColors[agent.type]}`}>
                      {agent.type}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={`${statusColors[agent.status]}`}>
                      {agent.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-slate-400" />
                      <span className="text-white font-semibold">{agent.tasksCompleted}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.slice(0, 3).map((capability) => (
                        <Badge key={capability} className="bg-slate-600/50 text-slate-300 text-xs">
                          {capability}
                        </Badge>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                          +{agent.capabilities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-slate-300 font-mono text-sm">{agent.version}</span>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-slate-400 text-sm">
                      {agent.lastUsed.toLocaleDateString()}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:border-cyan-400"
                        onClick={() => toggleAgentStatus(agent.id)}
                      >
                        {agent.status === 'active' ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:border-blue-400"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:border-red-400 text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No agents found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAgentsTable;
