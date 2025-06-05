
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import { MiniAI } from '@/types/miniAI';

interface MiniAIHeaderProps {
  miniAIs: MiniAI[];
}

const MiniAIHeader = ({ miniAIs }: MiniAIHeaderProps) => {
  return (
    <Card className="bg-slate-800/50 border-blue-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <span>Mini AI - Współpracujące Agenty</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              System dynamicznych rozszerzeń AI z funkcją pamięci i tworzenia artefaktów
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
              {miniAIs.filter(m => m.isActive).length} aktywnych
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              {miniAIs.filter(m => m.isPinned).length} przypiętych
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MiniAIHeader;
