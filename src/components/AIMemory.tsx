
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Filter, Search } from 'lucide-react';
import { openaiService } from '@/services/openaiService';
import { MemoryEntry, Agent } from '@/types/openai';

const AIMemory = () => {
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [filteredMemory, setFilteredMemory] = useState<MemoryEntry[]>([]);

  useEffect(() => {
    setAgents(openaiService.getAgents());
    refreshMemory();
  }, []);

  useEffect(() => {
    if (selectedAgent === 'all') {
      setFilteredMemory(memory);
    } else {
      setFilteredMemory(memory.filter(m => m.agentId === selectedAgent));
    }
  }, [memory, selectedAgent]);

  const refreshMemory = () => {
    setMemory(openaiService.getMemory());
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (importance >= 6) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    if (importance >= 4) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  const formatContent = (content: string) => {
    if (content.length > 200) {
      return content.substring(0, 200) + '...';
    }
    return content;
  };

  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Memory Database</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Dostęp do pamięci i rozumowania agentów
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white min-w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">Wszyscy Agenci</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={refreshMemory}
              variant="outline"
              size="sm"
              className="border-cyan-500/50 text-cyan-400"
            >
              <Search className="h-4 w-4 mr-2" />
              Odśwież
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {filteredMemory.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Brak wpisów w pamięci dla wybranego agenta</p>
            </div>
          ) : (
            filteredMemory
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((entry) => (
                <Card key={entry.id} className="bg-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-cyan-400">
                          {agents.find(a => a.id === entry.agentId)?.name || entry.agentId}
                        </Badge>
                        <Badge className={getImportanceColor(entry.importance)}>
                          Importance: {entry.importance}/10
                        </Badge>
                        <Badge variant="outline" className="text-slate-400">
                          {entry.context}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{entry.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {formatContent(entry.content)}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIMemory;
