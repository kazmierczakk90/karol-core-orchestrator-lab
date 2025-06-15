
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bot, Search, Play, Pause, Settings, Trash2, Plus, Activity } from 'lucide-react';
import { Agent } from '@/types/agent';
import { Skeleton } from '@/components/ui/skeleton';
import { useAgents } from '@/hooks/useAgents';
import { AddAgentModal } from '@/components/agents/AddAgentModal';

const SystemAgentsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    agents = [], 
    isLoading, 
    createAgent, 
    isCreating, 
    updateAgent, 
    deleteAgent 
  } = useAgents();

  const typeColors: { [key: string]: string } = {
    core: 'bg-blue-500/20 text-blue-400',
    karol: 'bg-purple-500/20 text-purple-400',
    integration: 'bg-green-500/20 text-green-400',
    utility: 'bg-orange-500/20 text-orange-400'
  };

  const statusColors: { [key: string]: string } = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-gray-500/20 text-gray-400',
    maintenance: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400'
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (agent.identifier && agent.identifier.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || agent.type === selectedType;
    return matchesSearch && matchesType;
  });

  const toggleAgentStatus = (agent: Agent) => {
    if (!agent) return;

    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    const newIsActive = newStatus === 'active';

    updateAgent({ id: agent.id, status: newStatus, is_active: newIsActive });
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
    <>
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
              
              <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-primary hover:bg-gradient-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add Agent
              </Button>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
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
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                          <div className="font-mono text-cyan-400 font-semibold">{agent.identifier || agent.id}</div>
                          <div className="text-slate-300 font-medium">{agent.name}</div>
                          <div className="text-slate-400 text-sm">{agent.description}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={`${typeColors[agent.type] || 'bg-slate-500/20 text-slate-400'}`}>
                          {agent.type}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={`${statusColors[agent.status] || 'bg-slate-500/20 text-slate-400'}`}>
                          {agent.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-slate-400" />
                          <span className="text-white font-semibold">{agent.tasks_completed}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities?.slice(0, 3).map((capability) => (
                            <Badge key={capability} className="bg-slate-600/50 text-slate-300 text-xs">
                              {capability}
                            </Badge>
                          ))}
                          {agent.capabilities && agent.capabilities.length > 3 && (
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
                          {new Date(agent.last_used).toLocaleDateString()}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 hover:border-cyan-400"
                            onClick={() => toggleAgentStatus(agent)}
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
                            onClick={() => deleteAgent(agent.id)}
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
          )}

          {!isLoading && filteredAgents.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No agents found</p>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
      <AddAgentModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAgentAdded={createAgent}
        isCreating={isCreating}
      />
    </>
  );
};

export default SystemAgentsTable;
