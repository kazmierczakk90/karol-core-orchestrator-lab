import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SystemConnection, ConnectionType } from '@/types/system';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type NewConnection = Omit<SystemConnection, 'id' | 'created_at' | 'last_ping' | 'uptime' | 'requests' | 'errors' | 'response_time' | 'status'>;

const AddConnectionModal = ({ isOpen, onClose }: AddConnectionModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ConnectionType>('api');
  const [endpoint, setEndpoint] = useState('');
  const [error, setError] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addConnectionMutation = useMutation({
    mutationFn: async (newConnection: NewConnection) => {
      const { data, error } = await supabase.from('system_connections').insert([
        { 
          ...newConnection,
          status: 'disconnected',
          last_ping: new Date().toISOString(),
          response_time: 0,
          uptime: 100,
          requests: 0,
          errors: 0,
        }
      ]).select();
      
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast({
        title: "Connection Added",
        description: "The new connection has been successfully added.",
      });
      handleClose();
    },
    onError: (error: Error) => {
      setError(`Failed to add connection: ${error.message}`);
      toast({
        title: "Error",
        description: `Failed to add connection: ${error.message}`,
        variant: "destructive",
      });
    }
  });


  const handleSubmit = () => {
    if (!name || !endpoint) {
      setError('Name and Endpoint are required.');
      return;
    }
    setError('');

    addConnectionMutation.mutate({
      name,
      description,
      type,
      endpoint,
    });
  };
  
  const handleClose = () => {
    // Reset form state on close
    setName('');
    setDescription('');
    setType('api');
    setEndpoint('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-cyan-800/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Add New Connection</DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure a new system connection. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-slate-300">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-slate-800 border-slate-700 focus:ring-cyan-500" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-slate-300">
              Description
            </Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 bg-slate-800 border-slate-700 focus:ring-cyan-500" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right text-slate-300">
              Type
            </Label>
            <Select value={type} onValueChange={(value: ConnectionType) => setType(value)}>
              <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="integration">Integration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endpoint" className="text-right text-slate-300">
              Endpoint
            </Label>
            <Input id="endpoint" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="col-span-3 bg-slate-800 border-slate-700 focus:ring-cyan-500" placeholder="https://api.example.com/v1" />
          </div>
          {error && <p className="col-span-4 text-red-400 text-sm text-center">{error}</p>}
          {addConnectionMutation.isError && <p className="col-span-4 text-red-400 text-sm text-center">{(addConnectionMutation.error as Error).message}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="border-slate-700 hover:bg-slate-800">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-gradient-primary hover:bg-gradient-secondary" disabled={addConnectionMutation.isPending}>
            {addConnectionMutation.isPending ? 'Saving...' : 'Save Connection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddConnectionModal;
