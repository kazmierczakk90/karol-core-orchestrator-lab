
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Brain, MessageSquare, Settings } from 'lucide-react';

const QuickActions = () => {
  const handleAction = (action: string) => {
    console.log(`Executing quick action: ${action}`);
    // Add action handlers here
  };

  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => handleAction('activate-all')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Brain className="h-4 w-4 mr-2" />
            Activate All
          </Button>
          <Button 
            onClick={() => handleAction('echo-mode')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Echo Mode
          </Button>
          <Button 
            onClick={() => handleAction('emergency')}
            className="bg-red-600 hover:bg-red-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            Emergency
          </Button>
          <Button 
            onClick={() => handleAction('settings')}
            variant="outline"
            className="border-slate-600 text-slate-300"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
