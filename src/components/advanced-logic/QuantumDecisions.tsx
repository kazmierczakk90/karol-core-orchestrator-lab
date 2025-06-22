
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, Atom, Zap, GitBranch, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface QuantumState {
  id: string;
  state: string;
  probability: number;
  coherence: number;
  entangled: boolean;
}

interface QuantumDecision {
  id: string;
  problem: string;
  superposition: QuantumState[];
  collapsed: boolean;
  finalChoice: string | null;
  confidence: number;
}

const QuantumDecisions = () => {
  const [decisions, setDecisions] = useState<QuantumDecision[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState({
    maxSuperpositions: 5,
    coherenceThreshold: 0.7,
    entanglementEnabled: true,
    autoCollapse: false,
    quantumNoise: 0.1
  });

  const generateQuantumDecision = async () => {
    setIsProcessing(true);
    
    const problems = [
      "Resource allocation optimization",
      "Strategic decision branching",
      "Multi-agent coordination",
      "Risk assessment matrix"
    ];

    const problem = problems[Math.floor(Math.random() * problems.length)];
    
    const superposition: QuantumState[] = [];
    for (let i = 0; i < settings.maxSuperpositions; i++) {
      superposition.push({
        id: `state_${Date.now()}_${i}`,
        state: `Option ${String.fromCharCode(65 + i)}`,
        probability: Math.random(),
        coherence: Math.random(),
        entangled: settings.entanglementEnabled && Math.random() > 0.5
      });
    }

    // Normalize probabilities
    const total = superposition.reduce((sum, state) => sum + state.probability, 0);
    superposition.forEach(state => {
      state.probability = state.probability / total;
    });

    const decision: QuantumDecision = {
      id: `decision_${Date.now()}`,
      problem,
      superposition,
      collapsed: false,
      finalChoice: null,
      confidence: 0
    };

    setDecisions(prev => [decision, ...prev.slice(0, 4)]);
    
    if (settings.autoCollapse) {
      setTimeout(() => collapseDecision(decision.id), 2000);
    }
    
    setIsProcessing(false);
  };

  const collapseDecision = (decisionId: string) => {
    setDecisions(prev => prev.map(decision => {
      if (decision.id === decisionId && !decision.collapsed) {
        const highestProbState = decision.superposition.reduce((max, state) => 
          state.probability > max.probability ? state : max
        );
        
        return {
          ...decision,
          collapsed: true,
          finalChoice: highestProbState.state,
          confidence: highestProbState.probability * highestProbState.coherence
        };
      }
      return decision;
    }));
  };

  const SettingsDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-purple-400">Quantum Decision Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium">Max Superpositions: {settings.maxSuperpositions}</label>
            <Slider
              value={[settings.maxSuperpositions]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, maxSuperpositions: value }))}
              min={2}
              max={10}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <label className="text-white text-sm font-medium">Coherence Threshold: {settings.coherenceThreshold}</label>
            <Slider
              value={[settings.coherenceThreshold]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, coherenceThreshold: value }))}
              min={0.1}
              max={1.0}
              step={0.1}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Quantum Noise: {settings.quantumNoise}</label>
            <Slider
              value={[settings.quantumNoise]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, quantumNoise: value }))}
              min={0.0}
              max={0.5}
              step={0.05}
              className="mt-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Entanglement Enabled</span>
            <Switch
              checked={settings.entanglementEnabled}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, entanglementEnabled: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Auto Collapse</span>
            <Switch
              checked={settings.autoCollapse}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoCollapse: checked }))}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="bg-slate-800/50 border-purple-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-purple-400 flex items-center space-x-2">
            <Atom className="h-6 w-6" />
            <span>Quantum Decisions Engine - Level 15</span>
          </CardTitle>
          <SettingsDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={generateQuantumDecision}
            disabled={isProcessing}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Zap className="h-4 w-4 mr-2" />
            Generate Quantum Decision
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              Decisions: {decisions.length}
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
              Collapsed: {decisions.filter(d => d.collapsed).length}
            </Badge>
          </div>
        </div>

        {decisions.map((decision) => (
          <Card key={decision.id} className="bg-slate-700/50 border-slate-600/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-semibold">{decision.problem}</h4>
                  <p className="text-slate-400 text-sm">Decision ID: {decision.id.slice(-8)}</p>
                </div>
                {!decision.collapsed && (
                  <Button
                    size="sm"
                    onClick={() => collapseDecision(decision.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Collapse
                  </Button>
                )}
              </div>

              {decision.collapsed ? (
                <div className="bg-green-900/30 p-3 rounded-lg border border-green-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-400 font-medium">Final Choice: {decision.finalChoice}</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      {Math.round((decision.confidence || 0) * 100)}% confidence
                    </Badge>
                  </div>
                  <Progress value={(decision.confidence || 0) * 100} className="h-2" />
                </div>
              ) : (
                <div className="space-y-2">
                  <h5 className="text-cyan-400 text-sm font-medium">Quantum Superposition:</h5>
                  {decision.superposition.map((state) => (
                    <div key={state.id} className="flex items-center space-x-3 p-2 bg-slate-600/30 rounded">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm">{state.state}</span>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="text-xs">
                              P: {Math.round(state.probability * 100)}%
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              C: {Math.round(state.coherence * 100)}%
                            </Badge>
                            {state.entangled && (
                              <Badge className="bg-pink-500/20 text-pink-400 text-xs">
                                <GitBranch className="h-2 w-2 mr-1" />
                                Entangled
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Progress value={state.probability * 100} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {decisions.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Atom className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No quantum decisions generated</p>
            <p className="text-sm">Create a decision to explore quantum superposition</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantumDecisions;
