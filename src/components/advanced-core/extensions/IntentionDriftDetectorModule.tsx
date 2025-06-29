
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass } from 'lucide-react';

const IntentionDriftDetectorModule = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center space-x-2">
          <Compass className="h-5 w-5" />
          <span>Intention Drift Detector</span>
        </CardTitle>
        <Badge variant="outline" className="text-orange-400">@router</Badge>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center text-slate-400">
          <p>Wykrywa odchylenia intencji</p>
          <p className="text-xs mt-2">Input intencji → analiza wykonania</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntentionDriftDetectorModule;
