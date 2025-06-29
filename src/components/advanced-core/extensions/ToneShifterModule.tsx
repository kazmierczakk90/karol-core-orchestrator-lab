
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2 } from 'lucide-react';

const ToneShifterModule = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-teal-400 flex items-center space-x-2">
          <Volume2 className="h-5 w-5" />
          <span>Tone Shifter</span>
        </CardTitle>
        <Badge variant="outline" className="text-teal-400">@voice-core</Badge>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center text-slate-400">
          <p>Dynamiczna zmiana tonu wypowiedzi</p>
          <p className="text-xs mt-2">Inspirujący, surowy, profesjonalny</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToneShifterModule;
