
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFuko } from '@/hooks/useFuko';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

const FukoMessages = () => {
  const { messages, isLoadingMessages } = useFuko();

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {isLoadingMessages && <p className="text-slate-300">Loading messages...</p>}
      {messages?.map((message) => (
        <Card key={message.id} className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(message.priority)}>
                  {message.priority}
                </Badge>
                <Badge className={getStatusColor(message.status)}>
                  {message.status}
                </Badge>
                <span className="text-sm text-slate-400">
                  {message.source_agent} → {message.target_agent || 'routing...'}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-cyan-400 font-semibold">F (Funkcja):</p>
                <p className="text-white">{message.F}</p>
              </div>
              <div>
                <p className="text-cyan-400 font-semibold">U (Uzasadnienie):</p>
                <p className="text-white">{message.U}</p>
              </div>
              <div>
                <p className="text-cyan-400 font-semibold">K (Kontekst):</p>
                <p className="text-white">{message.K}</p>
              </div>
              <div>
                <p className="text-cyan-400 font-semibold">O (Oczekiwany efekt):</p>
                <p className="text-white">{message.O}</p>
              </div>
              <div>
                <p className="text-cyan-400 font-semibold">P (Próg aktywacji):</p>
                <p className="text-white">{message.P}</p>
              </div>
              <div>
                <p className="text-cyan-400 font-semibold">Z (Zależność):</p>
                <p className="text-white">{message.Z}</p>
              </div>
              <div className="col-span-2">
                <p className="text-cyan-400 font-semibold">K2 (Komenda):</p>
                <p className="text-white font-mono">{message.K2}</p>
              </div>
              {message.execution_result && (
                <div className="col-span-2">
                  <p className="text-green-400 font-semibold">Wynik wykonania:</p>
                  <p className="text-green-300">{message.execution_result}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FukoMessages;
