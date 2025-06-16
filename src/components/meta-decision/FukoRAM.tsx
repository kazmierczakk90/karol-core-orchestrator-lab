
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Brain, Activity, Heart, Zap, Plus, Search } from 'lucide-react';
import { useMetaDecision } from '@/hooks/useMetaDecision';

const FukoRAM = () => {
  const { 
    fukoMemories, 
    isLoading, 
    createFukoMemory 
  } = useMetaDecision();

  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateMemory = async () => {
    setIsCreating(true);
    try {
      await createFukoMemory({
        agent_id: '@system',
        memory_type: 'emotional_state',
        emotional_context: {
          emotion: 'confidence',
          intensity: 0.8,
          trigger: 'successful_decision',
          context: 'Meta-decision processing'
        },
        memory_content: 'System confidence increased after successful meta-decision routing',
        intensity_level: 8,
        decay_rate: 0.05,
        trigger_conditions: {
          events: ['decision_success', 'performance_improvement'],
          thresholds: { performance: 0.85 }
        }
      });
    } catch (error) {
      console.error('Failed to create FUKO memory:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion?.toLowerCase()) {
      case 'confidence': return 'bg-green-500/20 text-green-400';
      case 'uncertainty': return 'bg-yellow-500/20 text-yellow-400';
      case 'stress': return 'bg-red-500/20 text-red-400';
      case 'satisfaction': return 'bg-blue-500/20 text-blue-400';
      case 'curiosity': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getIntensityLevel = (intensity: number) => {
    if (intensity >= 8) return { color: 'text-red-400', label: 'Very High' };
    if (intensity >= 6) return { color: 'text-orange-400', label: 'High' };
    if (intensity >= 4) return { color: 'text-yellow-400', label: 'Medium' };
    return { color: 'text-green-400', label: 'Low' };
  };

  const filteredMemories = fukoMemories.filter(memory =>
    memory.memory_content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.agent_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.memory_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalMemories: fukoMemories.length,
    activeMemories: fukoMemories.filter(m => m.intensity_level >= 5).length,
    avgIntensity: fukoMemories.length > 0 
      ? Math.round(fukoMemories.reduce((acc, m) => acc + m.intensity_level, 0) / fukoMemories.length)
      : 0,
    memoryTypes: [...new Set(fukoMemories.map(m => m.memory_type))].length
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-pink-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Activity className="h-8 w-8 text-pink-400 animate-spin" />
              <span className="ml-3 text-slate-300">Loading FUKO-RAM...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800/50 border-pink-800/30">
        <CardHeader>
          <CardTitle className="text-pink-400 flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>FUKO-RAM</span>
            <Badge className="bg-pink-500/20 text-pink-400 ml-2">Level 6 - Active</Badge>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Pamięć emocjonalna systemu z tracking stanów i kontekstu decyzyjnego
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-pink-400 text-2xl font-bold">{stats.totalMemories}</div>
              <div className="text-slate-400 text-sm">Total Memories</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{stats.activeMemories}</div>
              <div className="text-slate-400 text-sm">Active Memories</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-yellow-400 text-2xl font-bold">{stats.avgIntensity}</div>
              <div className="text-slate-400 text-sm">Avg Intensity</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold">{stats.memoryTypes}</div>
              <div className="text-slate-400 text-sm">Memory Types</div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-white text-lg font-semibold">Emotional Memories</h3>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search memories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white w-64"
                />
              </div>
            </div>
            <Button 
              onClick={handleCreateMemory}
              disabled={isCreating}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {isCreating ? <Activity className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="ml-2">Create Memory</span>
            </Button>
          </div>

          <div className="rounded-lg border border-slate-700/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="text-slate-300">Agent</TableHead>
                  <TableHead className="text-slate-300">Memory Type</TableHead>
                  <TableHead className="text-slate-300">Emotion</TableHead>
                  <TableHead className="text-slate-300">Intensity</TableHead>
                  <TableHead className="text-slate-300">Content</TableHead>
                  <TableHead className="text-slate-300">Last Accessed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMemories.slice(0, 10).map((memory) => {
                  const emotion = memory.emotional_context?.emotion || 'unknown';
                  const intensityInfo = getIntensityLevel(memory.intensity_level);
                  
                  return (
                    <TableRow key={memory.id} className="border-slate-700/50 hover:bg-slate-700/30">
                      <TableCell>
                        <div className="font-mono text-white">{memory.agent_id}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          {memory.memory_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-pink-400" />
                          <Badge className={getEmotionColor(emotion)}>
                            {emotion}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          <span className={`font-bold ${intensityInfo.color}`}>
                            {memory.intensity_level}/10
                          </span>
                          <span className="text-slate-400 text-sm">
                            ({intensityInfo.label})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="text-white text-sm truncate">
                            {memory.memory_content}
                          </div>
                          <div className="text-slate-400 text-xs">
                            Decay: {(memory.decay_rate * 100).toFixed(1)}%/hour
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-400 text-sm">
                          {memory.last_accessed 
                            ? new Date(memory.last_accessed).toLocaleString()
                            : 'Never'
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredMemories.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                {searchTerm ? 'No memories match your search' : 'No emotional memories stored'}
              </p>
              <p>
                {searchTerm ? 'Try a different search term' : 'Create a memory to see FUKO-RAM in action.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FukoRAM;
