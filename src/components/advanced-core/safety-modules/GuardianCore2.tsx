
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, AlertTriangle, Zap } from 'lucide-react';

const GuardianCore2 = () => {
  const [autoFixMode, setAutoFixMode] = useState(true);
  const [semanticDrifts] = useState([
    {
      id: 1,
      source: '@ceo-core',
      target: '@voice-core',
      driftType: 'Semantic',
      severity: 'Medium',
      description: 'Tone inconsistency detected',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      source: '@decision-router',
      target: '@meta-orchestrator',
      driftType: 'Style',
      severity: 'Low',
      description: 'Response format deviation',
      timestamp: new Date().toISOString()
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-500/20 text-red-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-orange-800/30">
      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Guardian Core 2.0</span>
          <Badge variant="outline" className="text-orange-400">@guardian-core</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Auto-Fix Mode</div>
              <div className="text-slate-400 text-sm">Automatically correct semantic drifts</div>
            </div>
            <Switch
              checked={autoFixMode}
              onCheckedChange={setAutoFixMode}
            />
          </div>

          <div className="bg-slate-700/50 rounded-lg">
            <div className="p-4 border-b border-slate-600/50">
              <h3 className="text-white font-medium flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span>Semantic Drift Detection</span>
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600/50">
                  <TableHead className="text-slate-300">Source → Target</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Severity</TableHead>
                  <TableHead className="text-slate-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semanticDrifts.map((drift) => (
                  <TableRow key={drift.id} className="border-slate-600/50">
                    <TableCell>
                      <div className="text-white text-sm font-mono">
                        {drift.source} → {drift.target}
                      </div>
                      <div className="text-slate-400 text-xs">{drift.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {drift.driftType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(drift.severity)}>
                        {drift.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Fix
                      </Button>
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

export default GuardianCore2;
