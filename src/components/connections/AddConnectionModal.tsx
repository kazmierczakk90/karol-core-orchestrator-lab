
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SystemConnection, ConnectionType } from '@/types/system';
import { v4 as uuidv4 } from 'uuid';

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddConnection: (connection: SystemConnection) => void;
}

const AddConnectionModal = ({ isOpen, onClose, onAddConnection }: AddConnectionModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ConnectionType>('api');
  const [endpoint, setEndpoint] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name || !endpoint) {
      setError('Name and Endpoint are required.');
      return;
    }
    setError('');

    const newConnection: SystemConnection = {
      id: `conn_${uuidv4().substring(0, 8)}`,
      name,
      description,
      type,
      endpoint,
      status: 'disconnected', // New connections start as disconnected
      lastPing: new Date(),
      responseTime: 0,
      uptime: 0,
      requests: 0,
      errors: 0,
    };
    onAddConnection(newConnection);
    handleClose();
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="border-slate-700 hover:bg-slate-800">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-gradient-primary hover:bg-gradient-secondary">Save Connection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddConnectionModal;
