
import { useState } from 'react';
import { toast } from 'sonner';
import {
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
} from '@dnd-kit/sortable';
import { WorkflowStep, WorkflowTemplate } from '@/types/workflow';
import { WorkflowSidebar } from './workflow/WorkflowSidebar';
import { WorkflowEditor } from './workflow/WorkflowEditor';

const WorkflowBuilder = () => {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([
    {
      id: 'wf_content_creation',
      name: 'Content Creation Pipeline',
      description: 'Complete content creation from research to publication',
      category: 'Content',
      steps: [
        { id: 'step_1', type: 'action', title: 'Research Topic', description: 'Deep research on given topic', agentId: '@google-search', status: 'pending' },
        { id: 'step_2', type: 'delay', title: 'Wait for approval', description: 'Wait 1 hour for manual approval', status: 'pending', delayMinutes: 60 },
        { id: 'step_3', type: 'action', title: 'Create Outline', description: 'Generate content outline', agentId: '@creative', status: 'pending' },
        { id: 'step_4', type: 'condition', title: 'Check Outline', description: 'Outline must be approved', status: 'pending', condition: 'status === "approved"' },
        { id: 'step_5', type: 'action', title: 'Write Content', description: 'Write full content based on outline', agentId: '@technical', status: 'pending' },
        { id: 'step_6', type: 'action', title: 'Review & Edit', description: 'Review and edit content', agentId: '@kontroling', status: 'pending' },
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
        { id: 'step_3', type: 'condition', title: 'Verify Data Quality', description: 'Ensure data quality is above 95%', status: 'pending', condition: 'quality_score > 0.95' },
        { id: 'step_4', type: 'action', title: 'Analyze Patterns', description: 'Pattern recognition and analysis', agentId: '@analiza', status: 'pending' },
        { id: 'step_5', type: 'action', title: 'Generate Report', description: 'Create analysis report', agentId: '@logger', status: 'pending' },
      ]
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(
    workflows[0] ? JSON.parse(JSON.stringify(workflows[0])) : null
  );
  const [isRunning, setIsRunning] = useState(false);

  const executeWorkflow = async (workflow: WorkflowTemplate) => {
    setIsRunning(true);
    
    const executingWorkflow = JSON.parse(JSON.stringify(workflow));
    setSelectedWorkflow(executingWorkflow);

    for (let i = 0; i < executingWorkflow.steps.length; i++) {
        const step = executingWorkflow.steps[i];
        step.status = 'running';
        setSelectedWorkflow({ ...executingWorkflow });

        if (step.type === 'delay' && step.delayMinutes) {
          // Shortened for simulation purposes
          await new Promise(resolve => setTimeout(resolve, step.delayMinutes * 20)); 
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const shouldFail = step.type === 'condition' && Math.random() < 0.3; // 30% chance to fail condition
        step.status = shouldFail ? 'failed' : 'completed';
        setSelectedWorkflow({ ...executingWorkflow });

        if (shouldFail) break; // Stop workflow on failed condition
    }
    
    // Reset status after execution
    setTimeout(() => {
        const finalWorkflow = JSON.parse(JSON.stringify(executingWorkflow));
        finalWorkflow.steps.forEach((step: WorkflowStep) => step.status = 'pending');
        setSelectedWorkflow(finalWorkflow);
        setWorkflows(prev => prev.map(w => w.id === finalWorkflow.id ? finalWorkflow : w));
        setIsRunning(false);
    }, 3000);
  };

  const onNewWorkflow = () => {
    const newWorkflow: WorkflowTemplate = {
      id: `wf_${Date.now()}`,
      name: 'New Workflow',
      description: 'Custom workflow description',
      category: 'Custom',
      steps: []
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
  };

  const addNewStep = () => {
    if (!selectedWorkflow) return;

    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      type: 'action',
      title: 'Nowy Krok',
      description: 'Opis nowego kroku',
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

  const cloneWorkflow = () => {
    if (!selectedWorkflow) return;
    const newWorkflow: WorkflowTemplate = {
      ...JSON.parse(JSON.stringify(selectedWorkflow)),
      id: `wf_${Date.now()}`,
      name: `${selectedWorkflow.name} (Copy)`,
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    toast.success(`Workflow "${selectedWorkflow.name}" sklonowany!`);
  };

  const saveWorkflow = () => {
    if (!selectedWorkflow) return;
    setWorkflows(prev => prev.map(wf => wf.id === selectedWorkflow.id ? selectedWorkflow : wf));
    toast.success(`Workflow "${selectedWorkflow.name}" zapisany!`);
  };

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    
    if (over && active.id !== over.id && selectedWorkflow) {
      const oldIndex = selectedWorkflow.steps.findIndex(step => step.id === active.id);
      const newIndex = selectedWorkflow.steps.findIndex(step => step.id === over.id);
      
      const newSteps = arrayMove(selectedWorkflow.steps, oldIndex, newIndex);
      
      const updatedWorkflow = {
        ...selectedWorkflow,
        steps: newSteps,
      };

      setSelectedWorkflow(updatedWorkflow);
      setWorkflows(prev => prev.map(wf => wf.id === selectedWorkflow.id ? updatedWorkflow : wf));
    }
  }

  const handleWorkflowChange = (updatedWorkflow: WorkflowTemplate) => {
    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
  }

  return (
    <div className="h-full flex space-x-4">
      <WorkflowSidebar
        workflows={workflows}
        selectedWorkflow={selectedWorkflow}
        isRunning={isRunning}
        onSelectWorkflow={(workflow) => setSelectedWorkflow(workflow)}
        onExecuteWorkflow={executeWorkflow}
        onNewWorkflow={onNewWorkflow}
      />
      <WorkflowEditor
        selectedWorkflow={selectedWorkflow}
        onWorkflowChange={handleWorkflowChange}
        onSave={saveWorkflow}
        onClone={cloneWorkflow}
        onAddNewStep={addNewStep}
        onUpdateStep={updateStep}
        onRemoveStep={removeStep}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
};

export default WorkflowBuilder;
