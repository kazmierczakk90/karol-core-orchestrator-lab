
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw } from 'lucide-react';

const RetrospectiveReflectorModule = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-fuchsia-400 flex items-center space-x-2">
          <RotateCcw className="h-5 w-5" />
          <span>Retrospective Reflector</span>
        </CardTitle>
        <Badge variant="outline" className="text-fuchsia-400">@evolution-tracker</Badge>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center text-slate-400">
          <p>Ocena jakości decyzji z perspektywy czasu</p>
          <p className="text-xs mt-2">Ocena + "czy zrobiłbyś to samo dziś?"</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetrospectiveReflectorModule;
