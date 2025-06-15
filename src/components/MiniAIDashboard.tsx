
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Zap, Brain, Plus } from 'lucide-react';
import { miniAIService } from '@/services/miniAIService';
import { MiniAI, MiniAIExecution, MemoryEntry } from '@/types/miniAI';
import MiniAIHeader from './mini-ai/MiniAIHeader';
import MiniAICard from './mini-ai/MiniAICard';
import ExecutionsList from './mini-ai/ExecutionsList';
import MemoryList from './mini-ai/MemoryList';
import CreatorTab from './mini-ai/CreatorTab';
import { useMiniAI } from '@/hooks/useMiniAI';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const MiniAIDashboard = () => {
  const { miniAIs = [], isLoading, updateMiniAI, deleteMiniAI } = useMiniAI();
  const [executions, setExecutions] = useState<MiniAIExecution[]>([]);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);

  // Local service is still used for non-persistent execution and memory for now.
  useEffect(() => {
    setExecutions(miniAIService.getExecutions());
    setMemory(miniAIService.getMemory());
  }, []);

  const handleExecute = async (miniAI: MiniAI) => {
    try {
      const testInput = miniAI.type === 'standard-tool' 
        ? 'Przykładowy tekst do przetworzenia przez Mini AI. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        : { action: 'start_timer', duration: 25 };

      const execution = await miniAIService.executeMiniAI(miniAI.id, testInput);
      console.log('Mini AI execution completed:', execution);
      // Reload local state
      setExecutions(miniAIService.getExecutions());
      setMemory(miniAIService.getMemory());
    } catch (error) {
      console.error('Error executing Mini AI:', error);
    }
  };

  const handleToggle = (miniAI: MiniAI) => {
    updateMiniAI({ id: miniAI.id, is_active: !miniAI.is_active });
  };

  const handlePin = (miniAI: MiniAI) => {
    updateMiniAI({ id: miniAI.id, is_pinned: !miniAI.is_pinned });
  };

  const handleDelete = (miniAIId: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten Mini AI?')) {
      deleteMiniAI(miniAIId);
    }
  };

  return (
    <div className="space-y-6">
      <MiniAIHeader miniAIs={miniAIs} />

      <Tabs defaultValue="mini-ais" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-blue-800/30">
          <TabsTrigger value="mini-ais" className="flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span>Moje Mini AI</span>
          </TabsTrigger>
          <TabsTrigger value="executions" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Wykonania</span>
          </TabsTrigger>
          <TabsTrigger value="memory" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Pamięć</span>
          </TabsTrigger>
          <TabsTrigger value="creator" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Kreator</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mini-ais" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                 <Card key={i} className="bg-slate-800/50 border-slate-700/50 p-4 space-y-3">
                   <Skeleton className="h-5 w-3/4" />
                   <Skeleton className="h-4 w-full" />
                   <div className="flex space-x-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-1/4" />
                   </div>
                   <div className="flex space-x-1 pt-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                   </div>
                 </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {miniAIs.map((miniAI) => (
                <MiniAICard
                  key={miniAI.id}
                  miniAI={miniAI}
                  onExecute={handleExecute}
                  onToggle={handleToggle}
                  onPin={handlePin}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="executions" className="mt-6">
          <ExecutionsList executions={executions} miniAIs={miniAIs} />
        </TabsContent>

        <TabsContent value="memory" className="mt-6">
          <MemoryList memory={memory} />
        </TabsContent>

        <TabsContent value="creator" className="mt-6">
          <CreatorTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MiniAIDashboard;
