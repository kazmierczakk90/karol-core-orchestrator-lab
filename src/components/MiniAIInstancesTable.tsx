
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Brain, Play, Pause, Settings, Trash2, Plus, Activity } from 'lucide-react';

interface MiniAIInstance {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'paused' | 'training' | 'error';
  executions: number;
  accuracy: number;
  createdAt: Date;
  lastExecution?: Date;
  memoryUsage: number;
  capabilities: string[];
}

const MiniAIInstancesTable = () => {
  const [instances, setInstances] = useState<MiniAIInstance[]>([
    { id: 'mini_1', name: 'Content Creator AI', model: 'GPT-4', status: 'active', executions: 45, accuracy: 94, createdAt: new Date(), lastExecution: new Date(), memoryUsage: 67, capabilities: ['writing', 'editing', 'research'] },
    { id: 'mini_2', name: 'Data Analyzer AI', model: 'Claude-3', status: 'active', executions: 78, accuracy: 98, createdAt: new Date(), lastExecution: new Date(), memoryUsage: 82, capabilities: ['analysis', 'visualization', 'reports'] },
    { id: 'mini_3', name: 'Voice Assistant AI', model: 'Whisper', status: 'paused', executions: 23, accuracy: 89, createdAt: new Date(), lastExecution: new Date(), memoryUsage: 34, capabilities: ['speech', 'transcription', 'voice'] },
    { id: 'mini_4', name: 'Image Processor AI', model: 'DALL-E', status: 'training', executions: 12, accuracy: 76, createdAt: new Date(), lastExecution: new Date(), memoryUsage: 91, capabilities: ['images', 'generation', 'editing'] },
    { id: 'mini_5', name: 'Code Generator AI', model: 'Codex', status: 'active', executions: 156, accuracy: 92, createdAt: new Date(), lastExecution: new Date(), memoryUsage: 58, capabilities: ['coding', 'debugging', 'optimization'] }
  ]);

  const statusColors = {
    active: 'bg-green-500/20 text-green-400',
    paused: 'bg-yellow-500/20 text-yellow-400',
    training: 'bg-blue-500/20 text-blue-400',
    error: 'bg-red-500/20 text-red-400'
  };

  const getMemoryColor = (usage: number) => {
    if (usage < 50) return 'text-green-400';
    if (usage < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const toggleInstanceStatus = (instanceId: string) => {
    setInstances(prev => prev.map(instance => 
      instance.id === instanceId 
        ? { ...instance, status: instance.status === 'active' ? 'paused' : 'active' }
        : instance
    ));
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span>Mini AI Instances</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Zarządzanie instancjami Mini AI w systemie
            </CardDescription>
          </div>
          
          <Button className="bg-gradient-primary hover:bg-gradient-secondary">
            <Plus className="h-4 w-4 mr-2" />
            Create Instance
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700/50">
              <TableHead className="text-slate-300">Instance</TableHead>
              <TableHead className="text-slate-300">Model</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead className="text-slate-300">Executions</TableHead>
              <TableHead className="text-slate-300">Accuracy</TableHead>
              <TableHead className="text-slate-300">Memory</TableHead>
              <TableHead className="text-slate-300">Capabilities</TableHead>
              <TableHead className="text-slate-300">Last Used</TableHead>
              <TableHead className="text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instances.map((instance) => (
              <TableRow key={instance.id} className="border-slate-700/50 hover:bg-slate-700/30">
                <TableCell>
                  <div>
                    <div className="font-semibold text-white">{instance.name}</div>
                    <div className="text-slate-400 text-sm font-mono">{instance.id}</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {instance.model}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <Badge className={statusColors[instance.status]}>
                    {instance.status}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-slate-400" />
                    <span className="text-white font-semibold">{instance.executions}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-white font-semibold">{instance.accuracy}%</span>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${getMemoryColor(instance.memoryUsage)}`}>
                      {instance.memoryUsage}%
                    </span>
                    <div className="w-16 bg-slate-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          instance.memoryUsage < 50 ? 'bg-green-500' : 
                          instance.memoryUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${instance.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {instance.capabilities.slice(0, 2).map((capability) => (
                      <Badge key={capability} className="bg-slate-600/50 text-slate-300 text-xs">
                        {capability}
                      </Badge>
                    ))}
                    {instance.capabilities.length > 2 && (
                      <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                        +{instance.capabilities.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-slate-400 text-sm">
                    {instance.lastExecution?.toLocaleDateString() || 'Never'}
                  </span>
                </TableCell>
                
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-cyan-400"
                      onClick={() => toggleInstanceStatus(instance.id)}
                    >
                      {instance.status === 'active' ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-blue-400"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 hover:border-red-400 text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MiniAIInstancesTable;
