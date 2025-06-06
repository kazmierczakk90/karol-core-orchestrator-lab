
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, Trash2, Download, RefreshCw } from 'lucide-react';

interface SimulationResult {
  agentId: string;
  task: string;
  response: string;
  timestamp: Date;
  status: 'completed' | 'running' | 'failed';
  executionTime: number;
}

interface AgentSimulatorProps {
  simulationResults: SimulationResult[];
  onClearResults: () => void;
}

const AgentSimulator = ({ simulationResults, onClearResults }: AgentSimulatorProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentSimulation, setCurrentSimulation] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'running': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const formatExecutionTime = (time: number) => {
    return `${(time / 1000).toFixed(2)}s`;
  };

  const startBatchSimulation = () => {
    setIsRunning(true);
    // Mock batch simulation
    setTimeout(() => {
      setIsRunning(false);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center justify-between">
            <span>Simulation Controls</span>
            <div className="flex space-x-2">
              <Button
                onClick={startBatchSimulation}
                disabled={isRunning}
                className="bg-gradient-success hover:bg-gradient-secondary"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Batch
                  </>
                )}
              </Button>
              <Button
                onClick={onClearResults}
                variant="outline"
                className="border-red-600 text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        {isRunning && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Batch Simulation Progress</span>
                <span className="text-slate-400">Running...</span>
              </div>
              <Progress value={65} className="w-full" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Simulation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{simulationResults.filter(r => r.status === 'completed').length}</div>
            <div className="text-slate-400 text-sm">Completed</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{simulationResults.filter(r => r.status === 'running').length}</div>
            <div className="text-slate-400 text-sm">Running</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{simulationResults.filter(r => r.status === 'failed').length}</div>
            <div className="text-slate-400 text-sm">Failed</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {simulationResults.length > 0 
                ? formatExecutionTime(simulationResults.reduce((acc, r) => acc + r.executionTime, 0) / simulationResults.length)
                : '0.00s'
              }
            </div>
            <div className="text-slate-400 text-sm">Avg. Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Simulation Results */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400">Simulation History</CardTitle>
            <Button variant="outline" className="border-slate-600">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {simulationResults.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No simulation results yet</p>
              <p className="text-sm">Run some simulations to see results here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {simulationResults.map((result, index) => (
                <div key={index} className="border border-slate-700/50 rounded-lg p-4 bg-slate-900/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-cyan-500/20 text-cyan-400 font-mono">
                        {result.agentId}
                      </Badge>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                      <span className="text-slate-400 text-sm">
                        {formatExecutionTime(result.executionTime)}
                      </span>
                    </div>
                    <span className="text-slate-400 text-sm">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 text-sm font-semibold">Task:</span>
                      <p className="text-white text-sm mt-1">{result.task}</p>
                    </div>
                    
                    <div>
                      <span className="text-slate-400 text-sm font-semibold">Response:</span>
                      <div className="bg-slate-800/50 p-3 rounded mt-1 border-l-4 border-cyan-400">
                        <p className="text-slate-300 text-sm whitespace-pre-wrap">{result.response}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentSimulator;
