
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Webhook } from 'lucide-react';

const WebhookPlaygroundModule = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center space-x-2">
          <Webhook className="h-5 w-5" />
          <span>Webhook Playground</span>
        </CardTitle>
        <Badge variant="outline" className="text-red-400">@api-router</Badge>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center text-slate-400">
          <p>Tworzenie i testowanie webhooków</p>
          <p className="text-xs mt-2">Token, endpoint, body preview</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookPlaygroundModule;
