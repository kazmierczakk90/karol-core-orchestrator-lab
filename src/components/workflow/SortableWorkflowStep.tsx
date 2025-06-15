
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WorkflowStepCard } from './WorkflowStepCard';
import { WorkflowStep } from '@/types/workflow';
import { GripVertical } from 'lucide-react';

interface SortableWorkflowStepProps {
  step: WorkflowStep;
  index: number;
  onUpdate: (updatedStep: WorkflowStep) => void;
  onDelete: (stepId: string) => void;
}

export function SortableWorkflowStep({ step, index, onUpdate, onDelete }: SortableWorkflowStepProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center space-x-3 w-full">
      {/* Drag handle */}
      <div {...attributes} {...listeners} className="cursor-grab text-slate-500 hover:text-white p-2 rounded-md hover:bg-slate-700/50">
        <GripVertical className="h-5 w-5" />
      </div>
      
      {/* Step number */}
      <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
        {index + 1}
      </div>
      
      {/* Step card */}
      <div className="flex-1">
        <WorkflowStepCard 
          step={step}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
