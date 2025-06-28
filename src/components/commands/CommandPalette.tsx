
import { useState, useEffect, useRef } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Zap, Brain, Settings, BarChart3, Search, X } from 'lucide-react';
import { commandRegistry } from '@/services/commands/CommandRegistry';
import { commandParser } from '@/services/commands/CommandParser';
import { commandExecutor } from '@/services/commands/CommandExecutor';
import { CoreCommand, CommandCategory } from '@/types/commands';
import { toast } from 'sonner';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommand, setSelectedCommand] = useState<CoreCommand | null>(null);
  const [executionHistory, setExecutionHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSelectedCommand(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getCategoryIcon = (category: CommandCategory) => {
    const iconMap = {
      dashboard: BarChart3,
      memory: Brain,
      admin: Settings,
      analytics: BarChart3,
      quantum: Zap,
      cognitive: Brain,
      evolution: Zap,
      transcendence: Zap,
      voice: Terminal,
      security: Settings,
      orchestrator: Settings,
      storage: Settings,
      diagnostics: Settings,
      logging: Terminal,
      planning: BarChart3,
      scenarios: Terminal,
      inspector: Search,
      feedback: Terminal,
      system: Terminal
    };
    
    return iconMap[category] || Terminal;
  };

  const getCategoryColor = (category: CommandCategory) => {
    const colorMap = {
      dashboard: 'bg-blue-500/20 text-blue-400',
      memory: 'bg-purple-500/20 text-purple-400',
      admin: 'bg-red-500/20 text-red-400',
      analytics: 'bg-green-500/20 text-green-400',
      quantum: 'bg-yellow-500/20 text-yellow-400',
      cognitive: 'bg-indigo-500/20 text-indigo-400',
      evolution: 'bg-pink-500/20 text-pink-400',
      transcendence: 'bg-cyan-500/20 text-cyan-400',
      voice: 'bg-orange-500/20 text-orange-400',
      security: 'bg-red-600/20 text-red-300',
      orchestrator: 'bg-teal-500/20 text-teal-400',
      storage: 'bg-gray-500/20 text-gray-400',
      diagnostics: 'bg-amber-500/20 text-amber-400',
      logging: 'bg-slate-500/20 text-slate-400',
      planning: 'bg-lime-500/20 text-lime-400',
      scenarios: 'bg-emerald-500/20 text-emerald-400',
      inspector: 'bg-violet-500/20 text-violet-400',
      feedback: 'bg-rose-500/20 text-rose-400',
      system: 'bg-zinc-500/20 text-zinc-400'
    };
    
    return colorMap[category] || 'bg-gray-500/20 text-gray-400';
  };

  const handleCommandSelect = async (command: CoreCommand) => {
    setSelectedCommand(command);
    setIsOpen(false);
    
    // If command has no parameters, execute immediately
    if (!command.parameters || command.parameters.length === 0) {
      await executeCommand(command.name);
    }
  };

  const executeCommand = async (commandText: string) => {
    try {
      const parsedCommand = commandParser.parseCommand(commandText);
      
      if (!parsedCommand) {
        toast.error('Invalid command format');
        return;
      }

      if (!parsedCommand.isValid) {
        toast.error(`Command error: ${parsedCommand.errors.join(', ')}`);
        return;
      }

      const result = await commandExecutor.executeCommand(parsedCommand);
      
      if (result.success) {
        toast.success(result.message);
        setExecutionHistory(prev => [...prev.slice(-9), commandText]); // Keep last 10
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Command execution failed');
      console.error('Command execution error:', error);
    }
  };

  const filteredCommands = searchQuery
    ? commandRegistry.searchCommands(searchQuery)
    : commandRegistry.getActiveCommands();

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    if (!groups[command.category]) {
      groups[command.category] = [];
    }
    groups[command.category].push(command);
    return groups;
  }, {} as Record<CommandCategory, CoreCommand[]>);

  const stats = commandRegistry.getCommandsStats();
  const totalCommands = commandRegistry.getTotalCommandsCount();

  return (
    <>
      {/* Command Palette Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="fixed bottom-4 right-4 z-50 bg-slate-800/90 border-cyan-500/50 text-cyan-400 hover:bg-slate-700/90"
      >
        <Terminal className="h-4 w-4 mr-2" />
        Command Palette
        <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Command Dialog */}
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-slate-800 border-slate-700">
          <CommandInput 
            ref={inputRef}
            placeholder="Type a command or search... (e.g., &dash, &memory, &help)"
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="bg-slate-900 border-slate-700 text-white"
          />
          <CommandList className="bg-slate-800">
            <CommandEmpty>No commands found.</CommandEmpty>
            
            {Object.entries(groupedCommands).map(([category, commands]) => {
              const Icon = getCategoryIcon(category as CommandCategory);
              return (
                <CommandGroup key={category} heading={
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="capitalize">{category}</span>
                    <Badge variant="secondary" className="text-xs">
                      {commands.length}
                    </Badge>
                  </div>
                }>
                  {commands.map((command) => (
                    <CommandItem
                      key={command.id}
                      onSelect={() => handleCommandSelect(command)}
                      className="hover:bg-slate-700 text-white"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <code className="text-cyan-400 font-mono bg-slate-900/50 px-2 py-1 rounded text-xs">
                            {command.name}
                          </code>
                          <span className="text-slate-300">{command.description}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {command.aiIntegrated && (
                            <Badge className="bg-blue-500/20 text-blue-400 text-xs">AI</Badge>
                          )}
                          <Badge className={`text-xs ${getCategoryColor(command.category)}`}>
                            {command.executionType}
                          </Badge>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </div>
      </CommandDialog>

      {/* Command Stats Card */}
      <Card className="fixed bottom-20 right-4 w-80 bg-slate-800/90 border-cyan-500/30 z-40">
        <CardHeader className="pb-2">
          <CardTitle className="text-cyan-400 text-sm flex items-center space-x-2">
            <Terminal className="h-4 w-4" />
            <span>Command System</span>
          </CardTitle>
          <CardDescription className="text-slate-300 text-xs">
            600 Core Commands Available
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs">Total Commands:</span>
            <Badge className="bg-green-500/20 text-green-400">{totalCommands}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(stats).slice(0, 6).map(([category, count]) => (
              <div key={category} className="flex justify-between">
                <span className="text-slate-400 capitalize">{category}:</span>
                <span className="text-cyan-400">{count}</span>
              </div>
            ))}
          </div>
          {executionHistory.length > 0 && (
            <div className="border-t border-slate-700 pt-2">
              <div className="text-slate-400 text-xs mb-1">Recent:</div>
              <div className="space-y-1">
                {executionHistory.slice(-3).map((cmd, idx) => (
                  <code key={idx} className="text-xs text-cyan-400 bg-slate-900/50 px-1 py-0.5 rounded block">
                    {cmd}
                  </code>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Command Details */}
      {selectedCommand && (
        <Card className="fixed top-4 right-4 w-96 bg-slate-800/95 border-cyan-500/50 z-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-cyan-400 text-sm">Command Details</CardTitle>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setSelectedCommand(null)}
                className="h-6 w-6 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <code className="text-cyan-400 font-mono bg-slate-900/50 px-2 py-1 rounded">
                {selectedCommand.name}
              </code>
            </div>
            <p className="text-slate-300 text-sm">{selectedCommand.description}</p>
            <div className="text-xs space-y-1">
              <div><span className="text-slate-400">Module:</span> <span className="text-white">{selectedCommand.module}</span></div>
              <div><span className="text-slate-400">Syntax:</span> <code className="text-cyan-400">{selectedCommand.syntax}</code></div>
              <div><span className="text-slate-400">Type:</span> <span className="text-white">{selectedCommand.executionType}</span></div>
            </div>
            {selectedCommand.parameters && selectedCommand.parameters.length > 0 && (
              <div className="space-y-2">
                <div className="text-slate-400 text-xs">Parameters:</div>
                {selectedCommand.parameters.map((param, idx) => (
                  <div key={idx} className="bg-slate-900/50 p-2 rounded text-xs">
                    <div className="flex items-center space-x-2">
                      <code className="text-cyan-400">{param.name}</code>
                      <Badge className="text-xs">{param.type}</Badge>
                      {param.required && <Badge variant="destructive" className="text-xs">required</Badge>}
                    </div>
                    {param.description && (
                      <p className="text-slate-400 mt-1">{param.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Button 
              onClick={() => executeCommand(selectedCommand.name)}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              Execute Command
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CommandPalette;
