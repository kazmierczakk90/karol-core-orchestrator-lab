
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';

const FUKOStats = () => {
  const fukoStats = {
    totalMessages: 45,
    completed: 38,
    pending: 5,
    failed: 2,
    efficiency: 89
  };

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
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-slate-300">Pending</span>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
              {fukoStats.pending}
            </Badge>
          </div>

          <div className="pt-3 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Efficiency</span>
              <span className="text-cyan-400 font-semibold">{fukoStats.efficiency}%</span>
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
