
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

const MiniAIDashboard = () => {
  const [miniAIs, setMiniAIs] = useState<MiniAI[]>([]);
  const [executions, setExecutions] = useState<MiniAIExecution[]>([]);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);

  useEffect(() => {
    loadData();
    
    // Create some default Mini AIs for demonstration
    if (miniAIService.getMiniAIs().length === 0) {
      createDefaultMiniAIs();
    }
  }, []);

  const loadData = () => {
    setMiniAIs(miniAIService.getMiniAIs());
    setExecutions(miniAIService.getExecutions());
    setMemory(miniAIService.getMemory());
  };

  const createDefaultMiniAIs = () => {
    // Intelligent Link Extractor
    miniAIService.createMiniAI(
      'Inteligentny Ekstraktor Linków',
      'standard-tool',
      {
        actionType: 'extract',
        outputFormat: 'json',
        parameters: {
          extractType: 'links',
          includeNoFollow: false,
          groupByDomain: true
        }
      },
      'Ekstrakcja i uporządkowanie linków z danej strony'
    );

    // Text Summarizer
    miniAIService.createMiniAI(
      'Podsumowywacz Tekstu',
      'standard-tool',
      {
        actionType: 'summarize',
        outputFormat: 'markdown',
        prompt: 'Stwórz zwięzłe podsumowanie tekstu w 3-5 punktach:'
      },
      'Inteligentne podsumowywanie długich tekstów'
    );

    // Translator
    miniAIService.createMiniAI(
      'Translator AI',
      'standard-tool',
      {
        actionType: 'translate',
        outputFormat: 'text',
        parameters: {
          targetLanguage: 'en',
          sourceLanguage: 'auto'
        }
      },
      'Tłumaczenie tekstów między językami'
    );

    // Mini App - Task Timer
    miniAIService.createMiniAI(
      'Task Timer Pro',
      'mini-app',
      {
        outputFormat: 'html',
        parameters: {
          artifactType: 'timer',
          features: ['pomodoro', 'break_tracking', 'task_notes']
        }
      },
      'Zaawansowany timer do zarządzania zadaniami'
    );

    loadData();
  };

  const handleExecute = async (miniAI: MiniAI) => {
    try {
      const testInput = miniAI.type === 'standard-tool' 
        ? 'Przykładowy tekst do przetworzenia przez Mini AI. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        : { action: 'start_timer', duration: 25 };

      const execution = await miniAIService.executeMiniAI(miniAI.id, testInput);
      console.log('Mini AI execution completed:', execution);
      loadData();
    } catch (error) {
      console.error('Error executing Mini AI:', error);
    }
  };

  const handleToggle = (miniAIId: string) => {
    miniAIService.toggleMiniAI(miniAIId);
    loadData();
  };

  const handlePin = (miniAIId: string) => {
    miniAIService.pinMiniAI(miniAIId);
    loadData();
  };

  const handleDelete = (miniAIId: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten Mini AI?')) {
      miniAIService.deleteMiniAI(miniAIId);
      loadData();
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
