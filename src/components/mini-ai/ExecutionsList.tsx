
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { MiniAI, MiniAIExecution } from '@/types/miniAI';

interface ExecutionsListProps {
  executions: MiniAIExecution[];
  miniAIs: MiniAI[];
}

const ExecutionsList = ({ executions, miniAIs }: ExecutionsListProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400">Historia Wykonań</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {executions.slice(0, 10).map((execution) => {
            const miniAI = miniAIs.find(m => m.id === execution.miniAIId);
            return (
              <div key={execution.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-700/50">
                <div>
                  <div className="text-white text-sm font-medium">
                    {miniAI?.name || 'Unknown Mini AI'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {execution.executedAt.toLocaleString()} • {execution.executionTime}ms
                  </div>
                </div>
                <Badge className={
                  execution.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                    : execution.status === 'error'
                    ? 'bg-red-500/20 text-red-400 border-red-500/50'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                }>
                  {execution.status}
                </Badge>
              </div>
            );
          })}
          {executions.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Brak wykonań. Uruchom Mini AI aby zobaczyć historię.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutionsList;
