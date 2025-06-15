
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pin, Play, Pause, Trash2 } from 'lucide-react';
import { MiniAI } from '@/types/miniAI';

interface MiniAICardProps {
  miniAI: MiniAI;
  onExecute: (miniAI: MiniAI) => void;
  onToggle: (miniAI: MiniAI) => void;
  onPin: (miniAI: MiniAI) => void;
  onDelete: (miniAIId: string) => void;
}

const MiniAICard = ({ miniAI, onExecute, onToggle, onPin, onDelete }: MiniAICardProps) => {
  const getStatusColor = (isActive: boolean | null) => {
    return isActive
      ? 'bg-green-500/20 text-green-400 border-green-500/50'
      : 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  const getTypeColor = (type: string) => {
    return type === 'standard-tool'
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      : 'bg-purple-500/20 text-purple-400 border-purple-500/50';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-sm flex items-center space-x-2">
              <span>{miniAI.name}</span>
              {miniAI.is_pinned && <Pin className="h-3 w-3 text-yellow-400" />}
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1">
              {miniAI.description}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Badge className={getTypeColor(miniAI.type)}>
            {miniAI.type === 'standard-tool' ? 'Narzędzie' : 'Mini App'}
          </Badge>
          <Badge className={getStatusColor(miniAI.is_active)}>
            {miniAI.is_active ? 'Aktywny' : 'Nieaktywny'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => onExecute(miniAI)}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-xs"
            disabled={!miniAI.is_active}
          >
            <Play className="h-3 w-3 mr-1" />
            Uruchom
          </Button>
          <Button
            onClick={() => onToggle(miniAI)}
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 text-xs"
          >
            {miniAI.is_active ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
          <Button
            onClick={() => onPin(miniAI)}
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 text-xs"
          >
            <Pin className="h-3 w-3" />
          </Button>
          <Button
            onClick={() => onDelete(miniAI.id)}
            size="sm"
            variant="outline"
            className="border-red-600 text-red-400 text-xs"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniAICard;
