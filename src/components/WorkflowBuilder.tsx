
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Workflow, Plus, Play, Save, Copy, Trash2, ArrowRight } from 'lucide-react';
import { WorkflowStep, WorkflowTemplate } from '@/types/workflow';
import { WorkflowStepCard } from './workflow/WorkflowStepCard';

const WorkflowBuilder = () => {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([
    {
      id: 'wf_content_creation',
      name: 'Content Creation Pipeline',
      description: 'Complete content creation from research to publication',
      category: 'Content',
      steps: [
        { id: 'step_1', type: 'action', title: 'Research Topic', description: 'Deep research on given topic', agentId: '@google-search', status: 'pending' },
        { id: 'step_2', type: 'action', title: 'Create Outline', description: 'Generate content outline', agentId: '@creative', status: 'pending' },
        { id: 'step_3', type: 'action', title: 'Write Content', description: 'Write full content based on outline', agentId: '@technical', status: 'pending' },
        { id: 'step_4', type: 'action', title: 'Review & Edit', description: 'Review and edit content', agentId: '@kontroling', status: 'pending' },
      ]
    },
    {
      id: 'wf_data_analysis',
      name: 'Data Analysis Workflow',
      description: 'Complete data analysis from collection to insights',
      category: 'Analytics',
      steps: [
        { id: 'step_1', type: 'action', title: 'Collect Data', description: 'Gather data from sources', agentId: '@vector-store', status: 'pending' },
        { id: 'step_2', type: 'action', title: 'Clean Data', description: 'Data cleaning and preprocessing', agentId: '@analiza', status: 'pending' },
        { id: 'step_3', type: 'action', title: 'Analyze Patterns', description: 'Pattern recognition and analysis', agentId: '@analiza', status: 'pending' },
        { id: 'step_4', type: 'action', title: 'Generate Report', description: 'Create analysis report', agentId: '@logger', status: 'pending' },
      ]
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(workflows[0]);
  const [isRunning, setIsRunning] = useState(false);

  const executeWorkflow = async (workflow: WorkflowTemplate) => {
    setIsRunning(true);
    
    // Create a deep copy to avoid modifying the original state directly during simulation
    const executingWorkflow = JSON.parse(JSON.stringify(workflow));
    setSelectedWorkflow(executingWorkflow);

    for (let i = 0; i < executingWorkflow.steps.length; i++) {
        executingWorkflow.steps[i].status = 'running';
        setSelectedWorkflow({ ...executingWorkflow });

        await new Promise(resolve => setTimeout(resolve, 1000));

        executingWorkflow.steps[i].status = 'completed';
        setSelectedWorkflow({ ...executingWorkflow });
    }
    
    // Reset status after execution
    setTimeout(() => {
        const finalWorkflow = JSON.parse(JSON.stringify(executingWorkflow));
        finalWorkflow.steps.forEach((step: WorkflowStep) => step.status = 'pending');
        setSelectedWorkflow(finalWorkflow);
        setIsRunning(false);
    }, 2000);
  };

  const addNewStep = () => {
    if (!selectedWorkflow) return;

    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      type: 'action',
      title: 'New Step',
      description: 'Description of the new step',
      agentId: '@ceo',
      status: 'pending'
    };

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, newStep]
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(wf => wf.id === selectedWorkflow.id ? updatedWorkflow : wf));
  };

  const removeStep = (stepId: string) => {
    if (!selectedWorkflow) return;

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: selectedWorkflow.steps.filter(step => step.id !== stepId)
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(wf => wf.id === selectedWorkflow.id ? updatedWorkflow : wf));
  };
  
  const updateStep = (updatedStep: WorkflowStep) => {
    if (!selectedWorkflow) return;

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: selectedWorkflow.steps.map(step =>
        step.id === updatedStep.id ? updatedStep : step
      ),
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev =>
      prev.map(wf => (wf.id === selectedWorkflow.id ? updatedWorkflow : wf))
    );
  };

  return (
    <div className="h-full flex space-x-4">
      {/* Workflow Templates List */}
      <div className="w-1/3">
        <Card className="bg-slate-800/50 border-cyan-800/30 h-full">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Workflow className="h-5 w-5" />
              <span>Workflow Templates</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Gotowe szablony workflow'ów
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {workflows.map((workflow) => (
              <Card 
                key={workflow.id}
                className={`bg-slate-700/50 border-slate-600/50 cursor-pointer hover:border-cyan-400/50 transition-colors ${
                  selectedWorkflow?.id === workflow.id ? 'border-cyan-400 bg-cyan-400/10' : ''
                }`}
                onClick={() => setSelectedWorkflow(JSON.parse(JSON.stringify(workflow)))}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">{workflow.name}</h3>
                    <Badge className="bg-slate-600/50 text-slate-300">
                      {workflow.category}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{workflow.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {workflow.steps.length} kroków
                    </span>
                    <Button 
                      size="sm" 
                      className="bg-gradient-success hover:bg-gradient-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        executeWorkflow(workflow);
                      }}
                      disabled={isRunning}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button 
              className="w-full bg-gradient-primary hover:bg-gradient-secondary"
              onClick={() => {
                const newWorkflow: WorkflowTemplate = {
                  id: `wf_${Date.now()}`,
                  name: 'New Workflow',
                  description: 'Custom workflow description',
                  category: 'Custom',
                  steps: []
                };
                setWorkflows(prev => [...prev, newWorkflow]);
                setSelectedWorkflow(newWorkflow);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Builder */}
      <div className="flex-1">
        <Card className="bg-slate-800/50 border-cyan-800/30 h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-cyan-400">
                  {selectedWorkflow ? selectedWorkflow.name : 'Select Workflow'}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {selectedWorkflow ? selectedWorkflow.description : 'Choose a workflow to edit or create new one'}
                </CardDescription>
              </div>
              {selectedWorkflow && (
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-slate-600">
                    <Copy className="h-4 w-4 mr-1" />
                    Clone
                  </Button>
                  <Button size="sm" className="bg-gradient-secondary">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          {selectedWorkflow && (
            <CardContent className="space-y-4">
              {/* Workflow Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 text-sm font-semibold">Workflow Name</label>
                  <Input 
                    value={selectedWorkflow.name}
                    onChange={(e) => setSelectedWorkflow({...selectedWorkflow, name: e.target.value})}
                    className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm font-semibold">Category</label>
                  <Input 
                    value={selectedWorkflow.category}
                    onChange={(e) => setSelectedWorkflow({...selectedWorkflow, category: e.target.value})}
                    className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-slate-300 text-sm font-semibold">Description</label>
                <Textarea 
                  value={selectedWorkflow.description}
                  onChange={(e) => setSelectedWorkflow({...selectedWorkflow, description: e.target.value})}
                  className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
                  rows={2}
                />
              </div>

              {/* Workflow Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Workflow Steps</h3>
                  <Button 
                    size="sm" 
                    className="bg-gradient-primary hover:bg-gradient-secondary"
                    onClick={addNewStep}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Step
                  </Button>
                </div>

                <div className="space-y-3">
                  {selectedWorkflow.steps.map((step, index) => {
                    return (
                      <div key={step.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <WorkflowStepCard 
                            step={step}
                            onUpdate={updateStep}
                            onDelete={removeStep}
                          />
                        </div>
                        
                        {index < selectedWorkflow.steps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-slate-500" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {selectedWorkflow.steps.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Workflow className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No steps in this workflow</p>
                    <p className="text-sm">Click "Add Step" to start building</p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
