
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { WorkflowStep } from '@/types/workflow';
import { CheckCircle, Clock, Edit, Play, Save, Trash2, XCircle, Share2, AlertTriangle, Timer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkflowStepEditor } from './WorkflowStepEditor';

interface WorkflowStepCardProps {
  step: WorkflowStep;
  onUpdate: (updatedStep: WorkflowStep) => void;
  onDelete: (stepId: string) => void;
}

const stepIcons = {
    action: Play,
    condition: AlertTriangle,
    delay: Timer,
    parallel: Share2,
};

const stepTypeColors = {
    action: 'border-blue-500/30',
    condition: 'border-yellow-500/30',
    delay: 'border-purple-500/30',
    parallel: 'border-green-500/30'
};

const statusColors = {
    pending: 'bg-gray-500/20 text-gray-400',
    running: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400'
};

const statusIcons = {
    pending: Clock,
    running: Play,
    completed: CheckCircle,
    failed: XCircle
};

export const WorkflowStepCard = ({ step, onUpdate, onDelete }: WorkflowStepCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const StatusIcon = statusIcons[step.status];
  const StepTypeIcon = stepIcons[step.type];

  const handleSave = (updatedStep: WorkflowStep) => {
    onUpdate(updatedStep);
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
      <WorkflowStepEditor 
        step={step}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <Card className={`bg-slate-700/50 border ${stepTypeColors[step.type]}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <StepTypeIcon className="h-4 w-4 text-slate-400" />
            <h4 className="font-semibold text-white">{step.title}</h4>
            <Badge className={`text-xs capitalize ${statusColors[step.status]}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {step.status}
            </Badge>
          </div>
          <div className="flex items-center">
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => onDelete(step.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-3">{step.description}</p>
        <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize border-slate-600">{step.type}</Badge>
            {step.agentId && (
                <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                    Agent: {step.agentId}
                </Badge>
            )}
            {step.condition && (
                <Badge className="bg-yellow-500/20 text-yellow-400 text-xs" title={step.condition}>
                    Warunek
                </Badge>
            )}
            {step.delayMinutes && (
                <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                    Opóźnienie: {step.delayMinutes} min
                </Badge>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
