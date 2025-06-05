
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Eye, EyeOff } from 'lucide-react';
import { keyboardService } from '@/services/keyboardService';

const KeyboardShortcuts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const shortcuts = keyboardService.getKeyBindings();

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, typeof shortcuts>);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'FUKO Commands': return 'border-cyan-500/50 bg-cyan-500/10';
      case 'Agent Control': return 'border-green-500/50 bg-green-500/10';
      case 'System Commands': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'Emergency': return 'border-red-500/50 bg-red-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
      >
        <Keyboard className="h-4 w-4 mr-2" />
        Shortcuts
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md max-h-96 overflow-hidden">
      <Card className="bg-slate-800/95 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center space-x-2">
              <Keyboard className="h-5 w-5" />
              <span>Keyboard Shortcuts</span>
            </CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-slate-300">
            Press any key combination to execute commands
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-h-80 overflow-y-auto">
          {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
            <div key={category} className={`p-3 rounded-lg border ${getCategoryColor(category)}`}>
              <h3 className="font-semibold text-white mb-2 text-sm">{category}</h3>
              <div className="space-y-1">
                {shortcuts.map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className="font-mono text-xs bg-slate-700/50">
                      {shortcut.key}
                    </Badge>
                    <span className="text-slate-300 ml-2">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyboardShortcuts;
