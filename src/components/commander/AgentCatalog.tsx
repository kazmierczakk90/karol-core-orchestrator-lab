
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Plus, Edit, Trash2, Star, StarOff, FolderTree, Info, Play, Settings, BarChart } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Agent {
  id: string;
  name: string;
  opis: string;
  tags: string[];
  status?: string;
  performance?: number;
}

interface AgentCatalogProps {
  agents: Agent[];
  onUseAgent?: (agent: Agent) => void;
  onAgentDetails?: (agent: Agent) => void;
  onEditAgent?: (agent: Agent) => void;
  onDeleteAgent?: (agent: Agent) => void;
}

const AgentCatalog = ({ agents, onUseAgent, onAgentDetails, onEditAgent, onDeleteAgent }: AgentCatalogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Agents', count: agents.length },
    { id: 'strategy', name: 'Strategy', count: agents.filter(a => a.tags.includes('strategy')).length },
    { id: 'system', name: 'System', count: agents.filter(a => a.tags.includes('system')).length },
    { id: 'voice', name: 'Voice & Audio', count: agents.filter(a => a.tags.includes('voice')).length },
    { id: 'security', name: 'Security', count: agents.filter(a => a.tags.includes('security')).length },
  ];

  const allTags = Array.from(new Set(agents.flatMap(agent => agent.tags)));

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.opis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => agent.tags.includes(tag));
    
    const matchesCategory = selectedCategory === 'all' || 
                           agent.tags.includes(selectedCategory);
    
    return matchesSearch && matchesTags && matchesCategory;
  });

  const toggleFavorite = (agentId: string) => {
    setFavorites(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleUseAgent = (agent: Agent) => {
    if (onUseAgent) {
      onUseAgent(agent);
    } else {
      toast.success(`Agent ${agent.name} selected!`, {
        description: 'Agent configured for use in test environment',
      });
    }
  };

  const handleAgentDetails = (agent: Agent) => {
    if (onAgentDetails) {
      onAgentDetails(agent);
    } else {
      toast.info(`Viewing details for ${agent.name}`);
    }
  };

  const handleEditAgent = (agent: Agent) => {
    if (onEditAgent) {
      onEditAgent(agent);
    } else {
      toast.info(`Editing ${agent.name}`);
    }
  };

  const handleDeleteAgent = (agent: Agent) => {
    if (onDeleteAgent) {
      onDeleteAgent(agent);
    } else {
      toast.error('Delete action not available', {
        description: 'Agent deletion is disabled in this environment',
      });
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'standby': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <FolderTree className="h-5 w-5" />
            <span>Agent Catalog</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search agents by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border-slate-700/50 text-white pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                size="sm"
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={selectedCategory === category.id ? "bg-gradient-primary" : "border-slate-600"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          {/* Tag Filters */}
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-semibold">Filter by Tags:</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  className={`cursor-pointer transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400'
                      : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                  <p className="text-slate-400 text-sm mt-1">{agent.opis}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFavorite(agent.id)}
                  className="text-slate-400 hover:text-yellow-400"
                >
                  {favorites.includes(agent.id) ? (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Agent ID */}
              <div className="bg-slate-900/50 p-2 rounded font-mono text-cyan-400 text-sm">
                {agent.id}
              </div>

              {/* Status and Performance */}
              <div className="flex items-center justify-between">
                {agent.status && (
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                )}
                {agent.performance && (
                  <div className="flex items-center space-x-1 text-sm">
                    <BarChart className="h-3 w-3 text-green-400" />
                    <span className="text-green-400">{agent.performance}%</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {agent.tags.map((tag) => (
                  <Badge key={tag} className="bg-slate-600/50 text-slate-300 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  className="bg-gradient-primary hover:bg-gradient-secondary"
                  onClick={() => handleUseAgent(agent)}
                >
                  <Play className="h-3 w-3 mr-2" />
                  Use Agent
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-slate-600"
                  onClick={() => handleAgentDetails(agent)}
                >
                  <Info className="h-3 w-3 mr-2" />
                  Details
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-slate-600"
                  onClick={() => handleEditAgent(agent)}
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-slate-600 text-red-400 hover:text-red-300"
                  onClick={() => handleDeleteAgent(agent)}
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No agents found</p>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add New Agent Button */}
      <div className="flex justify-center">
        <Button className="bg-gradient-success hover:bg-gradient-secondary">
          <Plus className="h-4 w-4 mr-2" />
          Add New Agent
        </Button>
      </div>
    </div>
  );
};

export default AgentCatalog;
