
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rss } from 'lucide-react';

const ExternalFeedMonitorModule = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-lime-400 flex items-center space-x-2">
          <Rss className="h-5 w-5" />
          <span>External Feed Monitor</span>
        </CardTitle>
        <Badge variant="outline" className="text-lime-400">@watcher-core</Badge>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center text-slate-400">
          <p>Subskrypcja zewnętrznych źródeł</p>
          <p className="text-xs mt-2">RSS/API + aktywator + Fetch now</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalFeedMonitorModule;
