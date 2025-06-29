
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette } from 'lucide-react';

const StyleTransferEngineModule = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-indigo-400 flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Style Transfer Engine</span>
        </CardTitle>
        <Badge variant="outline" className="text-indigo-400">@style-core</Badge>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center text-slate-400">
          <p>Nadpisywanie stylu odpowiedzi</p>
          <p className="text-xs mt-2">Select from → to + slider siły transferu</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleTransferEngineModule;
