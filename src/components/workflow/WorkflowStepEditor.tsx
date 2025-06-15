
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WorkflowStep } from '@/types/workflow';
import { Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkflowStepEditorProps {
  step: WorkflowStep;
  onSave: (updatedStep: WorkflowStep) => void;
  onCancel: () => void;
}

const stepTypeColors = {
    action: 'border-blue-500/30',
    condition: 'border-yellow-500/30',
    delay: 'border-purple-500/30',
    parallel: 'border-green-500/30'
};

export const WorkflowStepEditor = ({ step, onSave, onCancel }: WorkflowStepEditorProps) => {
  const [editableStep, setEditableStep] = useState(step);

  const handleSave = () => {
    onSave(editableStep);
  };

  const renderStepInputs = () => {
    switch (editableStep.type) {
      case 'action':
        return (
          <Input 
            value={editableStep.agentId || ''}
            onChange={(e) => setEditableStep({...editableStep, agentId: e.target.value})}
            placeholder="Agent ID (np. @ceo)"
            className="bg-slate-900/50 border-slate-700/50 text-white text-xs"
          />
        );
      case 'condition':
        return (
          <Textarea 
            value={editableStep.condition || ''}
            onChange={(e) => setEditableStep({...editableStep, condition: e.target.value})}
            placeholder="Warunek (np. {krok_1.wynik} === 'sukces')"
            className="bg-slate-900/50 border-slate-700/50 text-white text-xs"
            rows={2}
          />
        );
      case 'delay':
        return (
          <Input 
            type="number"
            value={editableStep.delayMinutes ?? ''}
            onChange={(e) => {
                const value = e.target.value;
                setEditableStep({
                    ...editableStep, 
                    delayMinutes: value === '' ? undefined : parseInt(value, 10)
                });
            }}
            placeholder="Opóźnienie w minutach"
            className="bg-slate-900/50 border-slate-700/50 text-white text-xs"
          />
        );
      case 'parallel':
        return <p className="text-xs text-slate-400 p-2 bg-slate-900/50 rounded">Konfiguracja kroków równoległych nie jest jeszcze dostępna.</p>;
      default:
        return null;
    }
  };

  return (
    <Card className={`bg-slate-700/50 border ${stepTypeColors[editableStep.type]}`}>
      <CardContent className="p-3 space-y-2">
        <Input 
          value={editableStep.title}
          onChange={(e) => setEditableStep({...editableStep, title: e.target.value})}
          className="bg-slate-900/50 border-slate-700/50 text-white font-semibold"
        />
        <Textarea 
          value={editableStep.description}
          onChange={(e) => setEditableStep({...editableStep, description: e.target.value})}
          className="bg-slate-900/50 border-slate-700/50 text-white text-sm"
          rows={2}
        />
        <Select 
          value={editableStep.type} 
          onValueChange={(value) => setEditableStep({...editableStep, type: value as WorkflowStep['type']})}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white">
            <SelectValue placeholder="Typ kroku" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="action">Akcja</SelectItem>
            <SelectItem value="condition">Warunek</SelectItem>
            <SelectItem value="delay">Opóźnienie</SelectItem>
            <SelectItem value="parallel">Równoległy</SelectItem>
          </SelectContent>
        </Select>

        {renderStepInputs()}
        
        <div className="flex justify-end space-x-2">
          <Button size="sm" variant="ghost" onClick={onCancel}>Anuluj</Button>
          <Button size="sm" className="bg-gradient-secondary" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Zapisz
          </Button>
        </div>
      </CardContent>
    </Card>
  )
};
