
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Workflow, Plus, Play } from 'lucide-react';
import { WorkflowTemplate } from '@/types/workflow';

interface WorkflowSidebarProps {
  workflows: WorkflowTemplate[];
  selectedWorkflow: WorkflowTemplate | null;
  isRunning: boolean;
  onSelectWorkflow: (workflow: WorkflowTemplate) => void;
  onExecuteWorkflow: (workflow: WorkflowTemplate) => void;
  onNewWorkflow: () => void;
}

export const WorkflowSidebar = ({
  workflows,
  selectedWorkflow,
  isRunning,
  onSelectWorkflow,
  onExecuteWorkflow,
  onNewWorkflow,
}: WorkflowSidebarProps) => {
  return (
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
              onClick={() => onSelectWorkflow(JSON.parse(JSON.stringify(workflow)))}
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
                    className="bg-gradient-success hover:bg-gradient-secondary disabled:opacity-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExecuteWorkflow(workflow);
                    }}
                    disabled={isRunning}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    {isRunning && selectedWorkflow?.id === workflow.id ? 'Running...' : 'Run'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {workflows.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Workflow className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No workflow templates found.</p>
              <p className="text-sm">Click "New Workflow" to create one.</p>
            </div>
          )}

          <Button
            className="w-full bg-gradient-primary hover:bg-gradient-secondary"
            onClick={onNewWorkflow}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
