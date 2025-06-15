
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageSquare, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useFuko } from '@/hooks/useFuko';
import { Skeleton } from '@/components/ui/skeleton';

const FUKOStats = () => {
  const { messages, isLoadingMessages } = useFuko();

  const fukoStats = useMemo(() => {
    if (!messages) {
      return { totalMessages: 0, completed: 0, pending: 0, failed: 0, efficiency: 0 };
    }

    const totalMessages = messages.length;
    const completed = messages.filter(m => m.status === 'completed').length;
    const pending = messages.filter(m => m.status === 'pending' || m.status === 'processing').length;
    const failed = messages.filter(m => m.status === 'failed').length;
    const efficiency = totalMessages > 0 ? (completed / totalMessages) * 100 : 0;

    return { totalMessages, completed, pending, failed, efficiency };
  }, [messages]);

  if (isLoadingMessages) {
    return (
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>FUKO-PZK Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>FUKO-PZK Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-slate-300">Total Messages</span>
            </div>
            <span className="text-white font-semibold">{fukoStats.totalMessages}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-300">Completed</span>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              {fukoStats.completed}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 text-yellow-400 animate-spin" />
              <span className="text-sm text-slate-300">In Progress</span>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
              {fukoStats.pending}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-slate-300">Failed</span>
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
              {fukoStats.failed}
            </Badge>
          </div>

          <div className="pt-3 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Efficiency</span>
              <span className="text-cyan-400 font-semibold">{fukoStats.efficiency.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className="bg-cyan-500 h-2 rounded-full"
                style={{ width: `${fukoStats.efficiency}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FUKOStats;
