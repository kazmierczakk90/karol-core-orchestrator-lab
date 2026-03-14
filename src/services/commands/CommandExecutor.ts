import { supabase } from '@/integrations/supabase/db';
import { CoreCommand, CommandExecutionResult, CommandContext } from '@/types/commands';
import { ParsedCommand } from './CommandParser';
import { toast } from 'sonner';

class CommandExecutorService {
  async executeCommand(
    parsedCommand: ParsedCommand, 
    context: CommandContext = {}
  ): Promise<CommandExecutionResult> {
    const startTime = Date.now();
    
    try {
      // Validate command
      if (!parsedCommand.isValid) {
        return {
          success: false,
          message: `Command validation failed: ${parsedCommand.errors.join(', ')}`,
          timestamp: new Date().toISOString(),
          executionTime: Date.now() - startTime
        };
      }

      // Check permissions
      const hasPermission = await this.checkPermissions(parsedCommand.command, context);
      if (!hasPermission) {
        return {
          success: false,
          message: 'Insufficient permissions to execute this command',
          timestamp: new Date().toISOString(),
          executionTime: Date.now() - startTime
        };
      }

      // Log command execution
      await this.logCommandExecution(parsedCommand, context);

      // Execute command based on type
      const result = await this.executeCommandByType(parsedCommand, context);

      // Log result
      await this.logCommandResult(parsedCommand, result, context);

      return {
        ...result,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('Command execution error:', error);
      return {
        success: false,
        message: `Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };
    }
  }

  private async executeCommandByType(
    parsedCommand: ParsedCommand, 
    context: CommandContext
  ): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    const { command, args } = parsedCommand;

    switch (command.id) {
      case 'dash.main':
        return this.executeDashboardCommand();
      
      case 'dash.agents':
        return this.executeAgentsCommand();
      
      case 'dash.decisions':
        return this.executeDecisionsCommand();
      
      case 'memory.main':
        return this.executeMemoryCommand(args);
      
      case 'memory.store':
        return this.executeMemoryStoreCommand(args);
      
      case 'admin.main':
        return this.executeAdminCommand(args);
      
      case 'analytics.main':
        return this.executeAnalyticsCommand(args);
      
      case 'quantum.main':
        return this.executeQuantumCommand(args);
      
      case 'quantum.process':
        return this.executeQuantumProcessCommand(args);
      
      case 'cognitive.main':
        return this.executeCognitiveCommand(args);
      
      case 'evolution.main':
        return this.executeEvolutionCommand(args);
      
      case 'voice.toggle':
        return this.executeVoiceToggleCommand();
      
      case 'system.status':
        return this.executeSystemStatusCommand();
      
      case 'system.help':
        return this.executeHelpCommand(args);
      
      default:
        // AI-integrated commands - delegate to OpenAI Assistant
        if (command.aiIntegrated) {
          return this.executeAIIntegratedCommand(parsedCommand, context);
        }
        
        return {
          success: false,
          message: `Command implementation not found: ${command.id}`
        };
    }
  }

  private async executeDashboardCommand(): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    // Navigate to dashboard
    window.location.hash = '#dashboard';
    toast.success('Dashboard opened');
    return {
      success: true,
      message: 'Dashboard opened successfully',
      data: { route: '#dashboard' }
    };
  }

  private async executeAgentsCommand(): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    window.location.hash = '#agents';
    toast.success('Agents overview opened');
    return {
      success: true,
      message: 'Agents overview opened successfully',
      data: { route: '#agents' }
    };
  }

  private async executeDecisionsCommand(): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    window.location.hash = '#decisions';
    toast.success('Decision center opened');
    return {
      success: true,
      message: 'Decision center opened successfully',
      data: { route: '#decisions' }
    };
  }

  private async executeMemoryCommand(args: Record<string, any>): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    const action = args.action || 'view';
    window.location.hash = `#memory?action=${action}`;
    toast.success('Memory system accessed');
    return {
      success: true,
      message: `Memory system accessed with action: ${action}`,
      data: { action, route: '#memory' }
    };
  }

  private async executeMemoryStoreCommand(args: Record<string, any>): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    try {
      const { data, error } = await supabase
        .from('memory_entries')
        .insert({
          content: args.content,
          importance: args.importance || 5,
          memory_type: 'user_command',
          context: 'Command execution storage'
        });

      if (error) throw error;

      toast.success('Information stored in memory');
      return {
        success: true,
        message: `Information stored successfully with importance level ${args.importance || 5}`,
        data: { content: args.content, importance: args.importance || 5 }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to store in memory: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async executeSystemStatusCommand(): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    try {
      // Get basic system metrics
      const { data: sessionsData } = await supabase.from('chat_sessions').select('count');
      const { data: agentsData } = await supabase.from('agents').select('count');
      const { data: decisionsData } = await supabase.from('meta_decisions').select('count');

      const status = {
        system: 'operational',
        activeSessions: sessionsData?.[0]?.count || 0,
        activeAgents: agentsData?.[0]?.count || 0,
        pendingDecisions: decisionsData?.[0]?.count || 0,
        timestamp: new Date().toISOString()
      };

      toast.success('System status retrieved');
      return {
        success: true,
        message: 'System status retrieved successfully',
        data: status
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get system status: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async executeHelpCommand(args: Record<string, any>): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    const commandName = args.command;
    
    if (commandName) {
      // Show help for specific command
      // This would open a help modal or navigate to help page
      window.location.hash = `#help?command=${commandName}`;
      return {
        success: true,
        message: `Help opened for command: ${commandName}`,
        data: { command: commandName }
      };
    } else {
      // Show general help
      window.location.hash = '#help';
      return {
        success: true,
        message: 'Help system opened',
        data: { route: '#help' }
      };
    }
  }

  private async executeAIIntegratedCommand(
    parsedCommand: ParsedCommand, 
    context: CommandContext
  ): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    // This would integrate with the OpenAI Assistant for complex command processing
    return {
      success: true,
      message: `AI-integrated command ${parsedCommand.command.name} queued for processing`,
      data: { 
        command: parsedCommand.command.name,
        args: parsedCommand.args,
        aiIntegrated: true
      }
    };
  }

  // Placeholder implementations for other commands
  private async executeAdminCommand(args: Record<string, any>): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    window.location.hash = '#admin';
    toast.success('Admin panel opened');
    return { success: true, message: 'Admin panel opened successfully' };
  }

  private async executeAnalyticsCommand(args: Record<string, any>): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    window.location.hash = '#analytics';
    toast.success('Analytics dashboard opened');
    return { success: true, message: 'Analytics dashboard opened successfully' };
  }

  private async executeQuantumCommand(args: Record<string, any>): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    window.location.hash = '#quantum';
    toast.success('Quantum decision system accessed');
    return { success: true, message: 'Quantum decision system accessed successfully' };
  }

  private async executeQuantumProcessCommand(args: Record<string, any>): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    return { success: true, message: `Quantum decision ${args.decision_id} queued for processing` };
  }

  private async executeCognitiveCommand(args: Record<string, any>): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    window.location.hash = '#cognitive';
    toast.success('Cognitive processing accessed');
    return { success: true, message: 'Cognitive processing accessed successfully' };
  }

  private async executeEvolutionCommand(args: Record<string, any>): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    window.location.hash = '#evolution';
    toast.success('Evolution engine accessed');
    return { success: true, message: 'Evolution engine accessed successfully' };
  }

  private async executeVoiceToggleCommand(): Promise<Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>> {
    // This would integrate with the voice service
    toast.success('Voice system toggled');
    return { success: true, message: 'Voice system toggled successfully' };
  }

  private async checkPermissions(command: CoreCommand, context: CommandContext): Promise<boolean> {
    // Basic permission check - can be enhanced
    if (command.requiredRole === 'admin') {
      // Check if user has admin role
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        return profile?.role === 'admin';
      } catch {
        return false;
      }
    }
    
    return true; // Default: allow execution
  }

  private async logCommandExecution(parsedCommand: ParsedCommand, context: CommandContext): Promise<void> {
    try {
      const { error } = await supabase.from('logs').insert({
        log_type: 'command_execution',
        agent_id: 'command-system',
        message: `Executing command: ${parsedCommand.command.name}`,
        details: {
          command: parsedCommand.command.name,
          args: parsedCommand.args,
          context: JSON.parse(JSON.stringify(context)) // Ensure proper JSON serialization
        }
      });

      if (error) {
        console.error('Failed to log command execution:', error);
      }
    } catch (error) {
      console.error('Failed to log command execution:', error);
    }
  }

  private async logCommandResult(
    parsedCommand: ParsedCommand, 
    result: Omit<CommandExecutionResult, 'timestamp' | 'executionTime'>, 
    context: CommandContext
  ): Promise<void> {
    try {
      const { error } = await supabase.from('analytics').insert({
        event_type: 'command_executed',
        agent_id: 'command-system',
        description: `Command execution result: ${parsedCommand.command.name}`,
        context: JSON.stringify({
          command: parsedCommand.command.name,
          success: result.success,
          message: result.message,
          executionContext: JSON.parse(JSON.stringify(context)) // Ensure proper JSON serialization
        }),
        value: result.success ? 1 : 0
      });

      if (error) {
        console.error('Failed to log command result:', error);
      }
    } catch (error) {
      console.error('Failed to log command result:', error);
    }
  }
}

export const commandExecutor = new CommandExecutorService();
