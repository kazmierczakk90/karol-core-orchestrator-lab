
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Brain, Play, Pause, Settings, Trash2, Plus, Bot } from 'lucide-react';
import { useMiniAI } from '@/hooks/useMiniAI';
import { MiniAI } from '@/types/miniAI';
import { Skeleton } from '@/components/ui/skeleton';
import { AddMiniAIModal } from '@/components/mini-ai/AddMiniAIModal';

const MiniAIInstancesTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    miniAIs = [], 
    isLoading, 
    createMiniAI, 
    isCreating,
    updateMiniAI,
    deleteMiniAI
  } = useMiniAI();

  const statusColors: { [key: string]: string } = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-gray-500/20 text-gray-400',
  };

  const toggleInstanceStatus = (instance: MiniAI) => {
    if (!instance) return;
    const newIsActive = !instance.is_active;
    updateMiniAI({ id: instance.id, is_active: newIsActive });
  };

  return (
    <>
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
            
            <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-primary hover:bg-gradient-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Create Instance
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-700/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700/50">
                    <TableHead className="text-slate-300">Instance</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">Category</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Last Updated</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {miniAIs.map((instance) => (
                    <TableRow key={instance.id} className="border-slate-700/50 hover:bg-slate-700/30">
                      <TableCell>
                        <div>
                          <div className="font-semibold text-white">{instance.name}</div>
                          <div className="text-slate-400 text-sm font-mono">{instance.description}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className="bg-blue-500/20 text-blue-400">
                          {instance.type}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {instance.category && (
                           <Badge className="bg-purple-500/20 text-purple-400">
                            {instance.category}
                           </Badge>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={instance.is_active ? statusColors.active : statusColors.inactive}>
                          {instance.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                                      
                      <TableCell>
                        <span className="text-slate-400 text-sm">
                          {instance.updated_at ? new Date(instance.updated_at).toLocaleDateString() : 'Never'}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 hover:border-cyan-400"
                            onClick={() => toggleInstanceStatus(instance)}
                          >
                            {instance.is_active ? (
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
                            onClick={() => deleteMiniAI(instance.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!isLoading && miniAIs.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No Mini AI instances found</p>
              <p>Click "Create Instance" to add one.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <AddMiniAIModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onMiniAIAdded={createMiniAI}
        isCreating={isCreating}
      />
    </>
  );
};

export default MiniAIInstancesTable;
