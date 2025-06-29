
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HardDrive, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FailoverDaemon = () => {
  const { toast } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [snapshots] = useState([
    {
      id: 1,
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      type: 'Auto',
      size: '2.4MB',
      status: 'Complete'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      type: 'Manual',
      size: '2.3MB',
      status: 'Complete'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      type: 'Auto',
      size: '2.2MB',
      status: 'Complete'
    }
  ]);

  const createSnapshot = async () => {
    setIsBackingUp(true);
    toast({
      title: "Creating Snapshot",
      description: "@state-keeper is backing up system state...",
    });

    setTimeout(() => {
      setIsBackingUp(false);
      toast({
        title: "Snapshot Created",
        description: "System state successfully backed up",
      });
    }, 2000);
  };

  useEffect(() => {
    // Auto-backup every 10 minutes
    const interval = setInterval(() => {
      createSnapshot();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-800/50 border-green-800/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center space-x-2">
          <HardDrive className="h-5 w-5" />
          <span>Failover & Snapshot Daemon</span>
          <Badge variant="outline" className="text-green-400">@state-keeper</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">System Backup Status</div>
              <div className="text-slate-400 text-sm">Auto-backup every 10 minutes</div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500/20 text-green-400">
                Active
              </Badge>
              <Button
                onClick={createSnapshot}
                disabled={isBackingUp}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {isBackingUp ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg">
            <div className="p-4 border-b border-slate-600/50">
              <h3 className="text-white font-medium">Recent Snapshots</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600/50">
                  <TableHead className="text-slate-300">Timestamp</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Size</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshots.map((snapshot) => (
                  <TableRow key={snapshot.id} className="border-slate-600/50">
                    <TableCell className="text-slate-300 text-sm">
                      {new Date(snapshot.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        snapshot.type === 'Auto' 
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }>
                        {snapshot.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      {snapshot.size}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/20 text-green-400">
                        {snapshot.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                      >
                        Restore
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

export default FailoverDaemon;
