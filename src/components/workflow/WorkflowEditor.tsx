
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Workflow, Plus, Save, Copy, ArrowRight } from 'lucide-react';
import { WorkflowStep, WorkflowTemplate } from '@/types/workflow';
import { SortableWorkflowStep } from './SortableWorkflowStep';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from 'react';

interface WorkflowEditorProps {
  selectedWorkflow: WorkflowTemplate | null;
  onWorkflowChange: (workflow: WorkflowTemplate) => void;
  onSave: () => void;
  onClone: () => void;
  onAddNewStep: () => void;
  onUpdateStep: (step: WorkflowStep) => void;
  onRemoveStep: (stepId: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export const WorkflowEditor = ({
  selectedWorkflow,
  onWorkflowChange,
  onSave,
  onClone,
  onAddNewStep,
  onUpdateStep,
  onRemoveStep,
  onDragEnd,
}: WorkflowEditorProps) => {
  const [stepToDelete, setStepToDelete] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleConfirmDelete = () => {
    if (stepToDelete) {
      onRemoveStep(stepToDelete);
      setStepToDelete(null);
    }
  };

  if (!selectedWorkflow) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-cyan-800/30 w-full h-full flex flex-col items-center justify-center">
          <Workflow className="h-24 w-24 text-slate-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-300">Select a workflow</h2>
          <p className="text-slate-400">Choose a workflow from the left to start editing, or create a new one.</p>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="flex-1">
        <Card className="bg-slate-800/50 border-cyan-800/30 h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-cyan-400">
                  {selectedWorkflow.name}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {selectedWorkflow.description}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-slate-600" onClick={onClone}>
                  <Copy className="h-4 w-4 mr-1" />
                  Clone
                </Button>
                <Button size="sm" className="bg-gradient-secondary" onClick={onSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm font-semibold">Workflow Name</label>
                <Input
                  value={selectedWorkflow.name}
                  onChange={(e) => onWorkflowChange({ ...selectedWorkflow, name: e.target.value })}
                  className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-semibold">Category</label>
                <Input
                  value={selectedWorkflow.category}
                  onChange={(e) => onWorkflowChange({ ...selectedWorkflow, category: e.target.value })}
                  className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-slate-300 text-sm font-semibold">Description</label>
              <Textarea
                value={selectedWorkflow.description}
                onChange={(e) => onWorkflowChange({ ...selectedWorkflow, description: e.target.value })}
                className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
                rows={2}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Workflow Steps</h3>
                <Button
                  size="sm"
                  className="bg-gradient-primary hover:bg-gradient-secondary"
                  onClick={onAddNewStep}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              </div>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={selectedWorkflow.steps.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {selectedWorkflow.steps.map((step, index) => (
                       <div key={step.id} className="flex items-center space-x-2">
                          <div className="flex-1">
                            <SortableWorkflowStep
                                step={step}
                                index={index}
                                onUpdate={onUpdateStep}
                                onDelete={setStepToDelete}
                            />
                          </div>
                          {index < selectedWorkflow.steps.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-slate-500 flex-shrink-0" />
                          )}
                       </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {selectedWorkflow.steps.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Workflow className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No steps in this workflow</p>
                  <p className="text-sm">Click "Add Step" to start building</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={!!stepToDelete} onOpenChange={(open) => !open && setStepToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this workflow step.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStepToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
