
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Play, Settings, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AgentSimulatorModule = () => {
  const { toast } = useToast();
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [jsonInput, setJSONInput] = useState('{\n  "action": "analyze",\n  "context": "user_input",\n  "parameters": {}\n}');
  const [simulationResults, setSimulationResults] = useState<any[]>([]);

  const handleSimulate = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const result = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        agent: '@prompt-forge',
        input: parsed,
        output: {
          status: 'success',
          response: 'Simulation executed successfully',
          confidence: 0.85
        }
      };
      
      setSimulationResults(prev => [result, ...prev.slice(0, 4)]);
      
      toast({
        title: "Simulation Complete",
        description: "@prompt-forge executed simulation successfully",
      });
    } catch (error) {
      toast({
        title: "JSON Error",
        description: "Invalid JSON format",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span>Agent Simulator</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="playground" className="space-y-4">
          <TabsList className="bg-slate-700/50">
            <TabsTrigger value="playground">JSON Playground</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="playground" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-mode"
                  checked={isAutoMode}
                  onCheckedChange={setIsAutoMode}
                />
                <Label htmlFor="auto-mode" className="text-white">Auto Mode</Label>
                <Badge variant={isAutoMode ? "default" : "secondary"}>
                  {isAutoMode ? "AUTO" : "MANUAL"}
                </Badge>
              </div>
              <Button onClick={handleSimulate} className="bg-purple-600 hover:bg-purple-700">
                <Play className="h-4 w-4 mr-2" />
                Simulate
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Agent Input (JSON)</Label>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJSONInput(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white font-mono min-h-32"
                placeholder="Enter JSON configuration..."
              />
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Code className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">Agent: @prompt-forge</span>
              </div>
              <div className="text-xs text-slate-400">
                Status: Ready | Mode: {isAutoMode ? 'Automatic' : 'Manual'} | Last Update: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Simulation Results</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {simulationResults.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No simulations run yet</p>
                </div>
              ) : (
                simulationResults.map(result => (
                  <div key={result.id} className="bg-slate-900/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{result.agent}</Badge>
                      <span className="text-xs text-slate-400">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-slate-300">
                      <div>Status: <span className="text-green-400">{result.output.status}</span></div>
                      <div>Confidence: <span className="text-yellow-400">{(result.output.confidence * 100).toFixed(0)}%</span></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Simulation Timeout</Label>
                <div className="text-sm text-slate-400">30 seconds</div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Max Iterations</Label>
                <div className="text-sm text-slate-400">10</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AgentSimulatorModule;
