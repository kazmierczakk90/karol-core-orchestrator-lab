import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Plus, Pin, Play, Pause, Trash2, Zap, Brain, Link } from 'lucide-react';
import { miniAIService } from '@/services/miniAIService';
import { MiniAI, MiniAIExecution, MemoryEntry } from '@/types/miniAI';

const MiniAIDashboard = () => {
  const [miniAIs, setMiniAIs] = useState<MiniAI[]>([]);
  const [executions, setExecutions] = useState<MiniAIExecution[]>([]);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [selectedMiniAI, setSelectedMiniAI] = useState<string | null>(null);

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

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-500/20 text-green-400 border-green-500/50'
      : 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  const getTypeColor = (type: string) => {
    return type === 'standard-tool'
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      : 'bg-purple-500/20 text-purple-400 border-purple-500/50';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-cyan-400 flex items-center space-x-2">
                <Bot className="h-6 w-6" />
                <span>Mini AI - Współpracujące Agenty</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                System dynamicznych rozszerzeń AI z funkcją pamięci i tworzenia artefaktów
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                {miniAIs.filter(m => m.isActive).length} aktywnych
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                {miniAIs.filter(m => m.isPinned).length} przypiętych
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

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
              <Card key={miniAI.id} className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-sm flex items-center space-x-2">
                        <span>{miniAI.name}</span>
                        {miniAI.isPinned && <Pin className="h-3 w-3 text-yellow-400" />}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400 mt-1">
                        {miniAI.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getTypeColor(miniAI.type)}>
                      {miniAI.type === 'standard-tool' ? 'Narzędzie' : 'Mini App'}
                    </Badge>
                    <Badge className={getStatusColor(miniAI.isActive)}>
                      {miniAI.isActive ? 'Aktywny' : 'Nieaktywny'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-1">
                    <Button
                      onClick={() => handleExecute(miniAI)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-xs"
                      disabled={!miniAI.isActive}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Uruchom
                    </Button>
                    <Button
                      onClick={() => handleToggle(miniAI.id)}
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 text-xs"
                    >
                      {miniAI.isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>
                    <Button
                      onClick={() => handlePin(miniAI.id)}
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 text-xs"
                    >
                      <Pin className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(miniAI.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 text-xs"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-cyan-400">Historia Wykonań</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {executions.slice(0, 10).map((execution) => {
                  const miniAI = miniAIs.find(m => m.id === execution.miniAIId);
                  return (
                    <div key={execution.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-700/50">
                      <div>
                        <div className="text-white text-sm font-medium">
                          {miniAI?.name || 'Unknown Mini AI'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {execution.executedAt.toLocaleString()} • {execution.executionTime}ms
                        </div>
                      </div>
                      <Badge className={
                        execution.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/50'
                          : execution.status === 'error'
                          ? 'bg-red-500/20 text-red-400 border-red-500/50'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      }>
                        {execution.status}
                      </Badge>
                    </div>
                  );
                })}
                {executions.length === 0 && (
                  <div className="text-center text-slate-400 py-8">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Brak wykonań. Uruchom Mini AI aby zobaczyć historię.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-cyan-400">Pamięć Agentów</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memory.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="p-3 bg-slate-900/50 rounded border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        Ważność: {entry.importance}/5
                      </Badge>
                      <Badge className={
                        entry.memoryType === 'permanent' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/50'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      }>
                        {entry.memoryType}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-300 mb-1">
                      {entry.content.substring(0, 200)}...
                    </div>
                    <div className="text-xs text-slate-400">
                      {entry.timestamp.toLocaleString()} • Agent: {entry.agentId}
                    </div>
                  </div>
                ))}
                {memory.length === 0 && (
                  <div className="text-center text-slate-400 py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Pamięć jest pusta. Wykonaj akcje aby tworzyć wspomnienia.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creator" className="mt-6">
          <Card className="bg-orange-500/20 border-orange-500/50">
            <CardHeader>
              <CardTitle className="text-orange-400">🚧 Kreator Mini AI</CardTitle>
              <CardDescription className="text-orange-300">
                Panel tworzenia nowych Mini AI - w trakcie implementacji
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-orange-300 py-8">
                <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Interfejs kreatora będzie tutaj...</p>
                <p className="text-sm mt-2">Funkcja w fazie rozwoju</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MiniAIDashboard;
