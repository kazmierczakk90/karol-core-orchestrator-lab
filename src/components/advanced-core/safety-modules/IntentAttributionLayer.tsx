
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GitBranch, User, Bot, Cog } from 'lucide-react';

const IntentAttributionLayer = () => {
  const [selectedSource, setSelectedSource] = useState('all');
  const [decisions] = useState([
    {
      id: 1,
      decision: 'Create new meta-decision',
      source: 'user',
      attribution: 'Manual prompt execution',
      timestamp: new Date().toISOString(),
      agent: '@meta-orchestrator'
    },
    {
      id: 2,
      decision: 'Auto-backup system state',
      source: 'system',
      attribution: 'Scheduled maintenance',
      timestamp: new Date().toISOString(),
      agent: '@state-keeper'
    },
    {
      id: 3,
      decision: 'Route decision to CEO agent',
      source: 'agent',
      attribution: 'Priority threshold exceeded',
      timestamp: new Date().toISOString(),
      agent: '@decision-router'
    }
  ]);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'user': return <User className="h-4 w-4" />;
      case 'system': return <Cog className="h-4 w-4" />;
      case 'agent': return <Bot className="h-4 w-4" />;
      default: return <GitBranch className="h-4 w-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'user': return 'bg-blue-500/20 text-blue-400';
      case 'system': return 'bg-green-500/20 text-green-400';
      case 'agent': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredDecisions = selectedSource === 'all' 
    ? decisions 
    : decisions.filter(d => d.source === selectedSource);

  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center space-x-2">
          <GitBranch className="h-5 w-5" />
          <span>Intent Attribution Layer</span>
          <Badge variant="outline" className="text-blue-400">@intent-core</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-white font-medium">Filter by Source</div>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-slate-700/50 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600/50">
                  <TableHead className="text-slate-300">Decision</TableHead>
                  <TableHead className="text-slate-300">Source</TableHead>
                  <TableHead className="text-slate-300">Agent</TableHead>
                  <TableHead className="text-slate-300">Attribution</TableHead>
                  <TableHead className="text-slate-300">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDecisions.map((decision) => (
                  <TableRow key={decision.id} className="border-slate-600/50">
                    <TableCell>
                      <div className="text-white text-sm">{decision.decision}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSourceColor(decision.source)}>
                        <div className="flex items-center space-x-1">
                          {getSourceIcon(decision.source)}
                          <span className="capitalize">{decision.source}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-slate-600/50 text-slate-300">
                        {decision.agent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-300 text-sm">{decision.attribution}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-400 text-sm">
                        {new Date(decision.timestamp).toLocaleTimeString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntentAttributionLayer;
