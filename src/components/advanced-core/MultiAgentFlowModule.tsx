
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Workflow, Plus, ArrowRight, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FlowStep {
  id: string;
  agent: string;
  action: string;
  condition?: string;
  order: number;
}

const MultiAgentFlowModule = () => {
  const { toast } = useToast();
  const [flows, setFlows] = useState<FlowStep[]>([
    { id: '1', agent: '@memory-core', action: 'scan', order: 1 },
    { id: '2', agent: '@adaptive-core', action: 'analyze', condition: 'memory_found', order: 2 },
    { id: '3', agent: '@router', action: 'route_decision', order: 3 }
  ]);

  const [newStep, setNewStep] = useState({
    agent: '',
    action: '',
    condition: ''
  });

  const availableAgents = [
    '@memory-core',
    '@adaptive-core', 
    '@voice-core',
    '@router',
    '@state-keeper',
    '@evolution-tracker',
    '@guardian-core'
  ];

  const addFlowStep = () => {
    if (!newStep.agent || !newStep.action) {
      toast({
        title: "Missing Information",
        description: "Please select agent and action",
        variant: "destructive"
      });
      return;
    }

    const step: FlowStep = {
      id: Date.now().toString(),
      agent: newStep.agent,
      action: newStep.action,
      condition: newStep.condition || undefined,
      order: flows.length + 1
    };

    setFlows(prev => [...prev, step]);
    setNewStep({ agent: '', action: '', condition: '' });
    
    toast({
      title: "Step Added",
      description: `${newStep.agent} added to flow`,
    });
  };

  const removeStep = (id: string) => {
    setFlows(prev => prev.filter(step => step.id !== id));
    toast({
      title: "Step Removed",
      description: "Flow step deleted",
    });
  };

  const executeFlow = () => {
    toast({
      title: "Flow Executing",
      description: `@router processing ${flows.length} steps`,
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center space-x-2">
          <Workflow className="h-5 w-5" />
          <span>Multi-Agent Flow Editor</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Flow */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Current Flow</h3>
              <Button onClick={executeFlow} className="bg-green-600 hover:bg-green-700">
                Execute Flow
              </Button>
            </div>
            
            <div className="space-y-2">
              {flows.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.order}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{step.agent}</Badge>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                      <span className="text-white">{step.action}</span>
                      {step.condition && (
                        <>
                          <span className="text-slate-400">if</span>
                          <Badge variant="secondary">{step.condition}</Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeStep(step.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Step */}
          <div className="border-t border-slate-700 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-white">Add New Step</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Agent</Label>
                <Select value={newStep.agent} onValueChange={(value) => setNewStep(prev => ({ ...prev, agent: value }))}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-600">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAgents.map(agent => (
                      <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Action</Label>
                <Input
                  placeholder="action name"
                  value={newStep.action}
                  onChange={(e) => setNewStep(prev => ({ ...prev, action: e.target.value }))}
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Condition (optional)</Label>
                <Input
                  placeholder="condition"
                  value={newStep.condition}
                  onChange={(e) => setNewStep(prev => ({ ...prev, condition: e.target.value }))}
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <Button onClick={addFlowStep} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiAgentFlowModule;
