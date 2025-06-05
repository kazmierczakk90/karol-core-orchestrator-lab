
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FUKOMessage } from '@/types/fuko';

interface FUKOStatsProps {
  messages: FUKOMessage[];
}

const FUKOStats = ({ messages }: FUKOStatsProps) => {
  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400">FUKO Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-300">Messages Today</span>
            <span className="text-white">{messages.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Completed</span>
            <span className="text-green-400">
              {messages.filter(m => m.status === 'completed').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Processing</span>
            <span className="text-blue-400">
              {messages.filter(m => m.status === 'processing').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Failed</span>
            <span className="text-red-400">
              {messages.filter(m => m.status === 'failed').length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FUKOStats;
