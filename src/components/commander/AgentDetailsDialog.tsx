
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Save, X, BarChart, Activity, Clock, Star } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  opis: string;
  tags: string[];
  status?: string;
  performance?: number;
}

interface AgentDetailsDialogProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => void;
  mode: 'view' | 'edit';
}

const AgentDetailsDialog = ({ agent, isOpen, onClose, onSave, mode }: AgentDetailsDialogProps) => {
  const [editedAgent, setEditedAgent] = useState<Agent | null>(agent);
  const [newTag, setNewTag] = useState('');

  if (!agent || !editedAgent) return null;

  const handleSave = () => {
    onSave(editedAgent);
    onClose();
  };

  const addTag = () => {
    if (newTag && !editedAgent.tags.includes(newTag)) {
      setEditedAgent({
        ...editedAgent,
        tags: [...editedAgent.tags, newTag]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedAgent({
      ...editedAgent,
      tags: editedAgent.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'standby': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <span>{mode === 'edit' ? 'Edit Agent' : 'Agent Details'}: {agent.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Agent Status Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-cyan-400" />
                <div className="text-2xl font-bold text-white">
                  {agent.performance || 85}%
                </div>
                <div className="text-sm text-slate-400">Performance</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <BarChart className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">
                  {Math.floor(Math.random() * 100) + 50}
                </div>
                <div className="text-sm text-slate-400">Tasks Completed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold text-white">
                  {Math.floor(Math.random() * 24)}h
                </div>
                <div className="text-sm text-slate-400">Uptime Today</div>
              </CardContent>
            </Card>
          </div>

          {/* Agent Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agentId" className="text-slate-300">Agent ID</Label>
              <Input
                id="agentId"
                value={editedAgent.id}
                disabled={mode === 'view'}
                onChange={(e) => setEditedAgent({...editedAgent, id: e.target.value})}
                className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="agentName" className="text-slate-300">Name</Label>
              <Input
                id="agentName"
                value={editedAgent.name}
                disabled={mode === 'view'}
                onChange={(e) => setEditedAgent({...editedAgent, name: e.target.value})}
                className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="agentDescription" className="text-slate-300">Description</Label>
            <Textarea
              id="agentDescription"
              value={editedAgent.opis}
              disabled={mode === 'view'}
              onChange={(e) => setEditedAgent({...editedAgent, opis: e.target.value})}
              className="bg-slate-900/50 border-slate-700/50 text-white mt-1"
              rows={3}
            />
          </div>

          {/* Status */}
          {agent.status && (
            <div>
              <Label className="text-slate-300">Status</Label>
              <div className="mt-1">
                <Badge className={getStatusColor(agent.status)}>
                  {agent.status}
                </Badge>
              </div>
            </div>
          )}

          {/* Tags Management */}
          <div>
            <Label className="text-slate-300">Tags</Label>
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                {editedAgent.tags.map((tag) => (
                  <Badge key={tag} className="bg-slate-600/50 text-slate-300">
                    {tag}
                    {mode === 'edit' && (
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              
              {mode === 'edit' && (
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add new tag..."
                    className="bg-slate-900/50 border-slate-700/50 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">Add</Button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} className="border-slate-600">
              Cancel
            </Button>
            {mode === 'edit' && (
              <Button onClick={handleSave} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentDetailsDialog;
