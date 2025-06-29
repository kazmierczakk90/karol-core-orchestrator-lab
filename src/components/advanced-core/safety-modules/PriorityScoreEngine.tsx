
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Target, Circle } from 'lucide-react';

const PriorityScoreEngine = () => {
  const [decisions] = useState([
    {
      id: 1,
      prompt: 'Analyze system performance metrics',
      priority: 'Critical',
      score: 9,
      agent: '@meta-orchestrator',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      prompt: 'Update agent configuration',
      priority: 'Medium',
      score: 5,
      agent: '@config-manager',
      timestamp: new Date().toISOString()
    },
    {
      id: 3,
      prompt: 'Generate daily report',
      priority: 'Low',
      score: 2,
      agent: '@report-generator',
      timestamp: new Date().toISOString()
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500/20 text-red-400';
      case 'High': return 'bg-orange-500/20 text-orange-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-red-400';
    if (score >= 6) return 'text-orange-400';
    if (score >= 4) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className="bg-slate-800/50 border-yellow-800/30">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Priority Score Engine</span>
          <Badge variant="outline" className="text-yellow-400">@priority-core</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-red-400 text-xl font-bold">1</div>
              <div className="text-slate-400 text-sm">Critical</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-orange-400 text-xl font-bold">0</div>
              <div className="text-slate-400 text-sm">High</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-yellow-400 text-xl font-bold">1</div>
              <div className="text-slate-400 text-sm">Medium</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <div className="text-green-400 text-xl font-bold">1</div>
              <div className="text-slate-400 text-sm">Low</div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600/50">
                  <TableHead className="text-slate-300">Prompt/Decision</TableHead>
                  <TableHead className="text-slate-300">Agent</TableHead>
                  <TableHead className="text-slate-300">Priority</TableHead>
                  <TableHead className="text-slate-300">Score</TableHead>
                  <TableHead className="text-slate-300">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decisions.map((decision) => (
                  <TableRow key={decision.id} className="border-slate-600/50">
                    <TableCell>
                      <div className="text-white text-sm">{decision.prompt}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {decision.agent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(decision.priority)}>
                        <Circle className="h-3 w-3 mr-1 fill-current" />
                        {decision.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`text-xl font-bold ${getScoreColor(decision.score)}`}>
                        {decision.score}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue placeholder="Edit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
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

export default PriorityScoreEngine;
