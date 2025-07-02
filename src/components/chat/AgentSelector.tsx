
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, X, Crown, Zap } from 'lucide-react';
import { AgentService, Agent, AGENT_CATEGORIES } from '@/services/agentService';

interface AgentSelectorProps {
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  selectedAgent,
  onSelectAgent,
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAgents = useMemo(() => {
    let agents = AgentService.getAgentsByCategory(selectedCategory);
    
    if (searchQuery) {
      agents = AgentService.searchAgents(searchQuery).filter(agent => 
        selectedCategory === 'all' || agent.category === selectedCategory
      );
    }
    
    return agents;
  }, [searchQuery, selectedCategory]);

  const categoriesWithCounts = useMemo(() => 
    AgentService.getCategoriesWithCounts(), []
  );

  const handleSelectAgent = (agent: Agent) => {
    onSelectAgent(agent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] bg-slate-900 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl text-cyan-400 flex items-center space-x-2">
            <Crown className="h-5 w-5" />
            <span>Wybierz Agenta Karol-Core</span>
          </CardTitle>
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Wyszukaj agenta po nazwie, opisie lub funkcji..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="border-slate-600 text-slate-300"
            >
              <Filter className="h-4 w-4 mr-2" />
              Wyczyść
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categoriesWithCounts.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-cyan-600 text-white border-cyan-600'
                    : 'border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-400'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>

          {/* Selected Agent Info */}
          {selectedAgent && (
            <Card className="bg-slate-800/50 border-cyan-600/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{selectedAgent.avatar}</div>
                  <div>
                    <h3 className="text-white font-medium">{selectedAgent.name}</h3>
                    <p className="text-slate-400 text-sm">{selectedAgent.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
                        {AGENT_CATEGORIES.find(cat => cat.id === selectedAgent.category)?.name}
                      </Badge>
                      <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Aktywny
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agents Grid */}
          <ScrollArea className="h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className={`cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedAgent?.id === agent.id
                      ? 'bg-cyan-600/20 border-cyan-600/50 shadow-lg'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50'
                  }`}
                  onClick={() => handleSelectAgent(agent)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl flex-shrink-0">{agent.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm truncate">
                          {agent.name}
                        </h4>
                        <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                          {agent.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                            {agent.id}
                          </Badge>
                          {agent.isActive && (
                            <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                              <Zap className="h-2 w-2 mr-1" />
                              ON
                            </Badge>
                          )}
                        </div>
                        {agent.capabilities && agent.capabilities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {agent.capabilities.slice(0, 2).map((capability, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="border-purple-500/30 text-purple-400 text-xs"
                              >
                                {capability.replace('_', ' ')}
                              </Badge>
                            ))}
                            {agent.capabilities.length > 2 && (
                              <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                                +{agent.capabilities.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAgents.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nie znaleziono agentów spełniających kryteria wyszukiwania</p>
                <p className="text-sm mt-1">Spróbuj zmienić kategorię lub hasło wyszukiwania</p>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <div className="text-sm text-slate-400">
              Znaleziono {filteredAgents.length} z {AgentService.getAllAgents().length} agentów
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
                Anuluj
              </Button>
              {selectedAgent && (
                <Button 
                  onClick={() => handleSelectAgent(selectedAgent)}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  Wybierz {selectedAgent.name}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentSelector;
