
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap } from 'lucide-react';
import { useFuko, CreateFUKOMessageData } from '@/hooks/useFuko';

const FukoCreateMessage = () => {
  const { createFukoMessage } = useFuko();

  const [newMessage, setNewMessage] = useState<Partial<CreateFUKOMessageData>>({
    F: '',
    U: '',
    K: '',
    O: '',
    P: '',
    Z: '',
    K2: '',
    source_agent: '@ceo',
    priority: 'medium'
  });

  const handleCreateFUKOMessage = () => {
    if (!newMessage.F || !newMessage.U || !newMessage.K2) {
      alert('Funkcja (F), Uzasadnienie (U) i Komenda (K2) są wymagane');
      return;
    }
    createFukoMessage(newMessage as CreateFUKOMessageData);
    setNewMessage({
      F: '', U: '', K: '', O: '', P: '', Z: '', K2: '', source_agent: '@ceo', priority: 'medium'
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="F" className="text-slate-300">F - Funkcja (Function)</Label>
        <Input
          id="F"
          value={newMessage.F}
          onChange={(e) => setNewMessage({...newMessage, F: e.target.value})}
          placeholder="Co agent ma wykonać"
          className="bg-slate-900/50 border-slate-700/50 text-white"
        />
      </div>
      <div>
        <Label htmlFor="U" className="text-slate-300">U - Uzasadnienie (Justification)</Label>
        <Input
          id="U"
          value={newMessage.U}
          onChange={(e) => setNewMessage({...newMessage, U: e.target.value})}
          placeholder="Dlaczego to robi"
          className="bg-slate-900/50 border-slate-700/50 text-white"
        />
      </div>
      <div>
        <Label htmlFor="K" className="text-slate-300">K - Kontekst (Context)</Label>
        <Input
          id="K"
          value={newMessage.K}
          onChange={(e) => setNewMessage({...newMessage, K: e.target.value})}
          placeholder="Warunki działania"
          className="bg-slate-900/50 border-slate-700/50 text-white"
        />
      </div>
      <div>
        <Label htmlFor="O" className="text-slate-300">O - Oczekiwany efekt (Expected outcome)</Label>
        <Input
          id="O"
          value={newMessage.O}
          onChange={(e) => setNewMessage({...newMessage, O: e.target.value})}
          placeholder="Co ma się wydarzyć"
          className="bg-slate-900/50 border-slate-700/50 text-white"
        />
      </div>
      <div>
        <Label htmlFor="P" className="text-slate-300">P - Próg aktywacji (Activation trigger)</Label>
        <Input
          id="P"
          value={newMessage.P}
          onChange={(e) => setNewMessage({...newMessage, P: e.target.value})}
          placeholder="Kiedy to uruchomić"
          className="bg-slate-900/50 border-slate-700/50 text-white"
        />
      </div>
      <div>
        <Label htmlFor="Z" className="text-slate-300">Z - Zależność (Dependencies)</Label>
        <Input
          id="Z"
          value={newMessage.Z}
          onChange={(e) => setNewMessage({...newMessage, Z: e.target.value})}
          placeholder="Od czego zależy wykonanie"
          className="bg-slate-900/50 border-slate-700/50 text-white"
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="K2" className="text-slate-300">K2 - Komenda (Command)</Label>
        <Input
          id="K2"
          value={newMessage.K2}
          onChange={(e) => setNewMessage({...newMessage, K2: e.target.value})}
          placeholder="/command lub &agent-command"
          className="bg-slate-900/50 border-slate-700/50 text-white font-mono"
        />
      </div>
      <div className="flex space-x-4 col-span-2">
        <Button onClick={handleCreateFUKOMessage} className="bg-blue-600 hover:bg-blue-700">
          <Zap className="h-4 w-4 mr-2" />
          Create FUKO Message
        </Button>
      </div>
    </div>
  );
};

export default FukoCreateMessage;
