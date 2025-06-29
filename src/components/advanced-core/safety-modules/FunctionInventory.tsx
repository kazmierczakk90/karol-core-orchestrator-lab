
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const FunctionInventory = () => {
  const [functions] = useState([
    {
      id: 1,
      name: 'createMetaDecision',
      agent: '@meta-orchestrator',
      status: 'Unique',
      lastUsed: '2 min ago',
      callCount: 47
    },
    {
      id: 2,
      name: 'processDecision',
      agent: '@decision-router',
      status: 'Duplicate',
      lastUsed: '5 min ago',
      callCount: 23
    },
    {
      id: 3,
      name: 'updateAgentState',
      agent: '@state-keeper',
      status: 'Unique',
      lastUsed: '1 min ago',
      callCount: 89
    }
  ]);

  const getStatusColor = (status: string) => {
    return status === 'Unique' 
      ? 'bg-green-500/20 text-green-400'
      : 'bg-red-500/20 text-red-400';
  };

  const getStatusIcon = (status: string) => {
    return status === 'Unique' 
      ? <CheckCircle className="h-4 w-4" />
      : <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Card className="bg-slate-800/50 border-indigo-800/30">
      <CardHeader>
        <CardTitle className="text-indigo-400 flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Function Inventory Engine</span>
          <Badge variant="outline" className="text-indigo-400">@function-indexer</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-indigo-400 text-xl font-bold">{functions.length}</div>
              <div className="text-slate-400 text-sm">Total Functions</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-green-400 text-xl font-bold">
                {functions.filter(f => f.status === 'Unique').length}
              </div>
              <div className="text-slate-400 text-sm">Unique</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-red-400 text-xl font-bold">
                {functions.filter(f => f.status === 'Duplicate').length}
              </div>
              <div className="text-slate-400 text-sm">Duplicates</div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600/50">
                  <TableHead className="text-slate-300">Function</TableHead>
                  <TableHead className="text-slate-300">Agent</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Usage</TableHead>
                  <TableHead className="text-slate-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {functions.map((func) => (
                  <TableRow key={func.id} className="border-slate-600/50">
                    <TableCell>
                      <div className="text-white font-mono text-sm">{func.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {func.agent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(func.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(func.status)}
                          <span>{func.status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-300 text-sm">
                        {func.callCount} calls
                      </div>
                      <div className="text-slate-400 text-xs">
                        {func.lastUsed}
                      </div>
                    </TableCell>
                    <TableCell>
                      {func.status === 'Duplicate' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          Fix
                        </Button>
                      )}
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

export default FunctionInventory;
