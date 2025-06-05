
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface QuickActionsProps {
  onExecuteAction: (action: string) => void;
}

const QuickActions = ({ onExecuteAction }: QuickActionsProps) => {
  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => onExecuteAction('style-shift')}
          >
            Style Shift
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-cyan-500/50 text-cyan-400"
            onClick={() => onExecuteAction('activate-agent')}
          >
            Activate Agent
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-yellow-500/50 text-yellow-400"
            onClick={() => onExecuteAction('freeze-evolution')}
          >
            Freeze Evolution
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-red-500/50 text-red-400"
            onClick={() => onExecuteAction('emergency-stop')}
          >
            Emergency Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
