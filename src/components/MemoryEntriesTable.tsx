
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Memory, Search, Trash2, Eye, Plus, Filter } from 'lucide-react';

interface MemoryEntry {
  id: string;
  agentId: string;
  content: string;
  context: string;
  timestamp: Date;
  importance: number;
  type: 'conversation' | 'task' | 'insight' | 'error' | 'system';
  tags: string[];
  accessed: number;
}

const MemoryEntriesTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>([
    { id: 'mem_1', agentId: '@ceo', content: 'Strategic decision made regarding AI development priorities', context: 'planning_session', timestamp: new Date(), importance: 9, type: 'insight', tags: ['strategy', 'ai', 'priority'], accessed: 12 },
    { id: 'mem_2', agentId: '@analiza', content: 'Data analysis completed for Q4 performance metrics', context: 'quarterly_review', timestamp: new Date(), importance: 7, type: 'task', tags: ['analysis', 'q4', 'metrics'], accessed: 5 },
    { id: 'mem_3', agentId: '@voice-core', content: 'User conversation about workflow optimization', context: 'user_interaction', timestamp: new Date(), importance: 6, type: 'conversation', tags: ['workflow', 'optimization', 'user'], accessed: 8 },
    { id: 'mem_4', agentId: '@system-admin', content: 'System maintenance completed successfully', context: 'maintenance', timestamp: new Date(), importance: 5, type: 'system', tags: ['maintenance', 'system', 'success'], accessed: 3 },
    { id: 'mem_5', agentId: '@router', content: 'Error in task routing algorithm detected', context: 'error_detection', timestamp: new Date(), importance: 8, type: 'error', tags: ['error', 'routing', 'algorithm'], accessed: 15 },
    { id: 'mem_6', agentId: '@google-search', content: 'Market research data collected for startup analysis', context: 'research_task', timestamp: new Date(), importance: 7, type: 'task', tags: ['research', 'market', 'startup'], accessed: 4 },
    { id: 'mem_7', agentId: '@fuko-lang', content: 'FUKO language pattern recognition improved', context: 'learning', timestamp: new Date(), importance: 8, type: 'insight', tags: ['fuko', 'language', 'pattern'], accessed: 7 }
  ]);

  const typeColors = {
    conversation: 'bg-blue-500/20 text-blue-400',
    task: 'bg-green-500/20 text-green-400',
    insight: 'bg-purple-500/20 text-purple-400',
    error: 'bg-red-500/20 text-red-400',
    system: 'bg-orange-500/20 text-orange-400'
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return 'text-red-400';
    if (importance >= 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const filteredEntries = memoryEntries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.agentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || entry.type === selectedType;
    return matchesSearch && matchesType;
  });

  const deleteEntry = (entryId: string) => {
    setMemoryEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const incrementAccess = (entryId: string) => {
    setMemoryEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, accessed: entry.accessed + 1 }
        : entry
    ));
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Memory className="h-6 w-6" />
              <span>Memory Entries</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Pamięć systemowa i wpisy z konwersacji agentów
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-500/20 text-purple-400">
              {memoryEntries.length} entries
            </Badge>
            <Button className="bg-gradient-primary hover:bg-gradient-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search memory entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border-slate-700/50 text-white pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            {['all', 'conversation', 'task', 'insight', 'error', 'system'].map((type) => (
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
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700/50">
              <TableHead className="text-slate-300">Content</TableHead>
              <TableHead className="text-slate-300">Agent</TableHead>
              <TableHead className="text-slate-300">Type</TableHead>
              <TableHead className="text-slate-300">Importance</TableHead>
              <TableHead className="text-slate-300">Context</TableHead>
              <TableHead className="text-slate-300">Tags</TableHead>
              <TableHead className="text-slate-300">Accessed</TableHead>
              <TableHead className="text-slate-300">Time</TableHead>
              <TableHead className="text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id} className="border-slate-700/50 hover:bg-slate-700/30">
                <TableCell className="max-w-xs">
                  <div className="text-white font-medium truncate" title={entry.content}>
                    {entry.content}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="font-mono text-cyan-400">{entry.agentId}</span>
                </TableCell>
                
                <TableCell>
                  <Badge className={typeColors[entry.type]}>
                    {entry.type}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${getImportanceColor(entry.importance)}`}>
                      {entry.importance}
                    </span>
                    <div className="w-12 bg-slate-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          entry.importance >= 8 ? 'bg-red-500' : 
                          entry.importance >= 6 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(entry.importance / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                    {entry.context}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} className="bg-slate-600/50 text-slate-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {entry.tags.length > 2 && (
                      <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                        +{entry.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-slate-300 font-semibold">{entry.accessed}</span>
                </TableCell>
                
                <TableCell>
                  <span className="text-slate-400 text-sm">
                    {entry.timestamp.toLocaleDateString()}
                  </span>
                </TableCell>
                
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-cyan-400"
                      onClick={() => incrementAccess(entry.id)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-red-400 text-red-400"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredEntries.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Memory className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No memory entries found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryEntriesTable;
