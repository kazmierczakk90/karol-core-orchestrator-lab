
import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { commandRegistry } from '@/services/commands/CommandRegistry';
import { commandParser } from '@/services/commands/CommandParser';
import { commandExecutor } from '@/services/commands/CommandExecutor';
import { CoreCommand, CommandExecutionResult, CommandContext } from '@/types/commands';
import { toast } from 'sonner';

export const useCommands = () => {
  const [executionHistory, setExecutionHistory] = useState<string[]>([]);

  // Get all commands
  const { data: commands = [], isLoading: isLoadingCommands } = useQuery({
    queryKey: ['commands'],
    queryFn: () => commandRegistry.getAllCommands(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Execute command mutation
  const executeCommandMutation = useMutation({
    mutationFn: async ({ 
      commandText, 
      context = {} 
    }: { 
      commandText: string; 
      context?: CommandContext 
    }) => {
      const parsedCommand = commandParser.parseCommand(commandText);
      
      if (!parsedCommand) {
        throw new Error('Invalid command format');
      }

      if (!parsedCommand.isValid) {
        throw new Error(`Command validation failed: ${parsedCommand.errors.join(', ')}`);
      }

      return commandExecutor.executeCommand(parsedCommand, context);
    },
    onSuccess: (result: CommandExecutionResult, variables) => {
      if (result.success) {
        toast.success(result.message);
        setExecutionHistory(prev => [...prev.slice(-9), variables.commandText]);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: Error) => {
      toast.error(`Command execution failed: ${error.message}`);
    }
  });

  // Search commands
  const searchCommands = useCallback((query: string): CoreCommand[] => {
    return commandRegistry.searchCommands(query);
  }, []);

  // Get command suggestions
  const getCommandSuggestions = useCallback((partialInput: string): CoreCommand[] => {
    return commandParser.getCommandSuggestions(partialInput);
  }, []);

  // Get commands by category
  const getCommandsByCategory = useCallback((category: string): CoreCommand[] => {
    return commandRegistry.getCommandsByCategory(category as any);
  }, []);

  // Validate command
  const validateCommand = useCallback((commandText: string) => {
    const parsedCommand = commandParser.parseCommand(commandText);
    return {
      isValid: !!parsedCommand?.isValid,
      errors: parsedCommand?.errors || [],
      command: parsedCommand?.command
    };
  }, []);

  // Execute command
  const executeCommand = useCallback((commandText: string, context?: CommandContext) => {
    executeCommandMutation.mutate({ commandText, context });
  }, [executeCommandMutation]);

  // Get command stats
  const getStats = useCallback(() => {
    return {
      total: commandRegistry.getTotalCommandsCount(),
      byCategory: commandRegistry.getCommandsStats(),
      active: commandRegistry.getActiveCommands().length
    };
  }, []);

  return {
    // Data
    commands,
    executionHistory,
    
    // Loading states
    isLoadingCommands,
    isExecuting: executeCommandMutation.isPending,
    
    // Actions
    executeCommand,
    searchCommands,
    getCommandSuggestions,
    getCommandsByCategory,
    validateCommand,
    getStats,
    
    // Clear history
    clearHistory: () => setExecutionHistory([])
  };
};
