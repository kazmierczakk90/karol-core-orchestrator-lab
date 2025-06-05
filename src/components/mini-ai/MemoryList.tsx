
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';
import { MemoryEntry } from '@/types/miniAI';

interface MemoryListProps {
  memory: MemoryEntry[];
}

const MemoryList = ({ memory }: MemoryListProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400">Pamięć Agentów</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {memory.slice(0, 10).map((entry) => (
            <div key={entry.id} className="p-3 bg-slate-900/50 rounded border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                  Ważność: {entry.importance}/5
                </Badge>
                <Badge className={
                  entry.memoryType === 'permanent' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                }>
                  {entry.memoryType}
                </Badge>
              </div>
              <div className="text-sm text-slate-300 mb-1">
                {entry.content.substring(0, 200)}...
              </div>
              <div className="text-xs text-slate-400">
                {entry.timestamp.toLocaleString()} • Agent: {entry.agentId}
              </div>
            </div>
          ))}
          {memory.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Pamięć jest pusta. Wykonaj akcje aby tworzyć wspomnienia.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryList;
