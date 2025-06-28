
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, RotateCcw, Activity, CheckCircle } from 'lucide-react';
import { useCommands } from '@/hooks/useCommands';
import { toast } from 'sonner';

interface SimulationStep {
  id: number;
  type: 'message' | 'command' | 'response';
  content: string;
  timestamp: Date;
  status: 'pending' | 'executing' | 'completed' | 'error';
  metadata?: any;
}

const ChatSimulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [simulationResults, setSimulationResults] = useState<any[]>([]);
  const { executeCommand, commands } = useCommands();

  // Scenariusz symulacji z CEO agentem
  const simulationScenario: Omit<SimulationStep, 'id' | 'timestamp' | 'status'>[] = [
    {
      type: 'message',
      content: 'Rozpoczynam symulację czatu z CEO agentem - testowanie 5 losowych komend',
    },
    {
      type: 'command',
      content: '&dash',
      metadata: { description: 'Otwórz główny dashboard' }
    },
    {
      type: 'response',
      content: 'Oczekiwana odpowiedź: Dashboard został otwarty pomyślnie',
    },
    {
      type: 'command',
      content: '&memory.store "Rozpoczęcie symulacji testowej z CEO agentem" 8',
      metadata: { description: 'Zapisz informację w pamięci systemu' }
    },
    {
      type: 'response',
      content: 'Oczekiwana odpowiedź: Informacja została zapisana w pamięci z wagą 8',
    },
    {
      type: 'command',
      content: '&quantum',
      metadata: { description: 'Dostęp do systemu decyzji kwantowych' }
    },
    {
      type: 'response',
      content: 'Oczekiwana odpowiedź: System decyzji kwantowych został uruchomiony',
    },
    {
      type: 'command',
      content: '&analytics',
      metadata: { description: 'Otwórz dashboard analityki' }
    },
    {
      type: 'response',
      content: 'Oczekiwana odpowiedź: Dashboard analityki został otwarty',
    },
    {
      type: 'command',
      content: '&status',
      metadata: { description: 'Sprawdź status systemu' }
    },
    {
      type: 'response',
      content: 'Oczekiwana odpowiedź: Status systemu został wyświetlony',
    },
    {
      type: 'message',
      content: 'Symulacja zakończona - wszystkie komendy zostały przetestowane',
    }
  ];

  const initializeSimulation = () => {
    const steps: SimulationStep[] = simulationScenario.map((step, index) => ({
      id: index,
      ...step,
      timestamp: new Date(),
      status: 'pending'
    }));
    setSimulationSteps(steps);
    setCurrentStep(0);
    setSimulationResults([]);
  };

  const executeStep = async (step: SimulationStep) => {
    setSimulationSteps(prev => 
      prev.map(s => s.id === step.id ? { ...s, status: 'executing' } : s)
    );

    try {
      if (step.type === 'command') {
        console.log(`🎯 Executing command: ${step.content}`);
        
        // Symulacja wykonania komendy
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Próba rzeczywistego wykonania komendy
        try {
          executeCommand(step.content, { 
            sessionId: 'simulation', 
            metadata: { 
              simulation: true,
              step: step.id 
            }
          });
          
          const result = {
            stepId: step.id,
            command: step.content,
            status: 'success',
            timestamp: new Date(),
            message: `Komenda ${step.content} została wykonana pomyślnie`
          };
          
          setSimulationResults(prev => [...prev, result]);
          toast.success(`Komenda wykonana: ${step.content}`);
          
        } catch (error) {
          const result = {
            stepId: step.id,
            command: step.content,
            status: 'error',
            timestamp: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error'
          };
          
          setSimulationResults(prev => [...prev, result]);
          toast.error(`Błąd komendy: ${step.content}`);
        }
      } else {
        // Symulacja wiadomości lub odpowiedzi
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`📝 ${step.type}: ${step.content}`);
      }

      setSimulationSteps(prev => 
        prev.map(s => s.id === step.id ? { ...s, status: 'completed' } : s)
      );

    } catch (error) {
      setSimulationSteps(prev => 
        prev.map(s => s.id === step.id ? { ...s, status: 'error' } : s)
      );
      console.error(`❌ Error in step ${step.id}:`, error);
    }
  };

  const runSimulation = async () => {
    setIsRunning(true);
    
    for (let i = currentStep; i < simulationSteps.length; i++) {
      if (!isRunning) break;
      
      setCurrentStep(i);
      await executeStep(simulationSteps[i]);
      
      // Pauza między krokami
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setIsRunning(false);
    toast.success('Symulacja zakończona pomyślnie!');
  };

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    initializeSimulation();
  };

  useEffect(() => {
    initializeSimulation();
  }, []);

  const getStepIcon = (status: SimulationStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'executing':
        return <Activity className="h-4 w-4 text-blue-400 animate-pulse" />;
      case 'error':
        return <div className="h-4 w-4 rounded-full bg-red-400" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-slate-600" />;
    }
  };

  const getStepColor = (status: SimulationStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'executing':  
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Kontrola symulacji */}
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Symulator Czatu CEO</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              onClick={runSimulation}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
            
            <Button
              onClick={pauseSimulation}
              disabled={!isRunning}
              variant="outline"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pauza
            </Button>
            
            <Button
              onClick={resetSimulation}
              variant="outline"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Postęp symulacji:</span>
              <span className="text-white">{currentStep + 1} / {simulationSteps.length}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / simulationSteps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Dostępne komendy:</span>
              <div className="text-white font-semibold">{commands.length}</div>
            </div>
            <div>
              <span className="text-slate-400">Wykonane testy:</span>
              <div className="text-white font-semibold">{simulationResults.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kroki symulacji */}
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400">Kroki Symulacji</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {simulationSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                    index === currentStep 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-slate-700 bg-slate-700/20'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getStepIcon(step.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`text-xs ${
                          step.type === 'command' 
                            ? 'bg-purple-500/20 text-purple-400'
                            : step.type === 'response'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {step.type}
                      </Badge>
                    </div>
                    
                    <p className={`text-sm mt-1 ${getStepColor(step.status)}`}>
                      {step.content}
                    </p>
                    
                    {step.metadata?.description && (
                      <p className="text-xs text-slate-500 mt-1">
                        {step.metadata.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Wyniki symulacji */}
      {simulationResults.length > 0 && (
        <Card className="bg-slate-800/50 border-blue-800/30 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-cyan-400">Wyniki Symulacji</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-60">
              <div className="space-y-2">
                {simulationResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.status === 'success'
                        ? 'border-green-500/30 bg-green-500/10'
                        : 'border-red-500/30 bg-red-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-cyan-400">
                        {result.command}
                      </code>
                      <Badge className={
                        result.status === 'success'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }>
                        {result.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-300 mt-1">
                      {result.message || result.error}
                    </p>
                    
                    <p className="text-xs text-slate-500 mt-1">
                      {result.timestamp.toLocaleTimeString('pl-PL')}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatSimulator;
