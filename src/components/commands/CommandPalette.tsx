
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Command, Search, Terminal, Zap } from 'lucide-react';
import { useCommands } from '@/hooks/useCommands';
import { CoreCommand } from '@/types/commands';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { commands, executeCommand, searchCommands } = useCommands();

  // Filtrowane komendy
  const filteredCommands = searchQuery 
    ? searchCommands(searchQuery)
    : commands.slice(0, 10);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K lub Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          setSearchQuery('');
          setSelectedIndex(0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            handleCommandExecute(filteredCommands[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleCommandExecute = (command: CoreCommand) => {
    executeCommand(command.name);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'dashboard': 'bg-blue-500/20 text-blue-400',
      'memory': 'bg-purple-500/20 text-purple-400',
      'admin': 'bg-red-500/20 text-red-400',
      'analytics': 'bg-green-500/20 text-green-400',
      'quantum': 'bg-cyan-500/20 text-cyan-400',
      'cognitive': 'bg-orange-500/20 text-orange-400',
      'evolution': 'bg-pink-500/20 text-pink-400',
      'voice': 'bg-yellow-500/20 text-yellow-400',
      'system': 'bg-gray-500/20 text-gray-400'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center space-x-2">
            <Terminal className="h-5 w-5" />
            <span>Command Palette</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Wpisz nazwę komendy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border-slate-700/50 text-white pl-10"
              autoFocus
            />
          </div>

          {/* Commands List */}
          <ScrollArea className="max-h-96">
            <div className="space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <Command className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nie znaleziono komend</p>
                  <p className="text-sm mt-1">Spróbuj innej frazy wyszukiwania</p>
                </div>
              ) : (
                filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => handleCommandExecute(command)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      index === selectedIndex
                        ? 'bg-blue-600/30 border border-blue-500/50'
                        : 'hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <code className="text-cyan-400 font-mono text-sm">
                            {command.name}
                          </code>
                          
                          <Badge className={`text-xs ${getCategoryColor(command.category)}`}>
                            {command.category}
                          </Badge>
                          
                          {command.aiIntegrated && (
                            <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-slate-300 mb-1">
                          {command.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>Moduł: {command.module}</span>
                          <span>Typ: {command.executionType}</span>
                          {command.requiredRole && (
                            <span>Wymagana rola: {command.requiredRole}</span>
                          )}
                        </div>
                      </div>
                      
                      {index === selectedIndex && (
                        <div className="text-xs text-blue-400 ml-4">
                          ⏎ Enter
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-slate-700 pt-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-4">
                <span>↑↓ Nawigacja</span>
                <span>⏎ Wykonaj</span>
                <span>Esc Zamknij</span>
              </div>
              <span>{filteredCommands.length} komend</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
