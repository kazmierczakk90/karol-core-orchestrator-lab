
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCommands } from '@/hooks/useCommands';
import { CoreCommand } from '@/types/commands';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CommandDropdownProps {
  onCommandSelect: (commandText: string) => void;
  className?: string;
}

const CommandDropdown: React.FC<CommandDropdownProps> = ({ 
  onCommandSelect, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { commands, searchCommands, getCommandsByCategory } = useCommands();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtrowane komendy na podstawie wyszukiwania
  const filteredCommands = searchQuery 
    ? searchCommands(searchQuery)
    : commands.slice(0, 20); // Ograniczenie do 20 najpopularniejszych

  // Grupowanie komend według kategorii
  const commandsByCategory = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, CoreCommand[]>);

  const handleCommandClick = (command: CoreCommand) => {
    const commandText = command.syntax.startsWith('&') 
      ? command.syntax 
      : `&${command.syntax}`;
    onCommandSelect(commandText);
    setIsOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const getCategoryColor = (category: string) => {
    const colors = {
      'dashboard': 'bg-blue-500/10 text-blue-400',
      'memory': 'bg-purple-500/10 text-purple-400',
      'admin': 'bg-red-500/10 text-red-400',
      'analytics': 'bg-green-500/10 text-green-400',
      'quantum': 'bg-cyan-500/10 text-cyan-400',
      'cognitive': 'bg-orange-500/10 text-orange-400',
      'evolution': 'bg-pink-500/10 text-pink-400',
      'voice': 'bg-yellow-500/10 text-yellow-400',
      'system': 'bg-gray-500/10 text-gray-400'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/10 text-gray-400';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`bg-slate-900/50 border-slate-700/50 text-white hover:bg-slate-700 ${className}`}
        >
          <Terminal className="h-4 w-4 mr-2" />
          Komendy
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 bg-slate-800 border-slate-700 p-0" 
        align="start"
      >
        <div className="p-3 border-b border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              ref={searchInputRef}
              placeholder="Wyszukaj komendy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border-slate-700/50 text-white pl-10"
            />
          </div>
        </div>

        <ScrollArea className="max-h-96">
          <div className="p-2">
            {Object.keys(commandsByCategory).length === 0 ? (
              <div className="text-center text-slate-400 py-4">
                Nie znaleziono komend
              </div>
            ) : (
              Object.entries(commandsByCategory).map(([category, categoryCommands]) => (
                <div key={category} className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={`text-xs uppercase ${getCategoryColor(category)}`}>
                      {category}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {categoryCommands.length} komend
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {categoryCommands.map((command) => (
                      <button
                        key={command.id}
                        onClick={() => handleCommandClick(command)}
                        className="w-full text-left p-2 rounded hover:bg-slate-700/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <code className="text-cyan-400 font-mono text-sm">
                                {command.name}
                              </code>
                              {command.aiIntegrated && (
                                <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                                  AI
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 truncate">
                              {command.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-2 border-t border-slate-700 text-xs text-slate-500 bg-slate-900/30">
          <div className="flex items-center justify-between">
            <span>Łącznie: {filteredCommands.length} komend</span>
            <span>Naciśnij ⌘+K aby otworzyć paletę komend</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CommandDropdown;
