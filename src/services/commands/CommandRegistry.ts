
import { CoreCommand, CommandCategory } from '@/types/commands';

class CommandRegistryService {
  private commands: Map<string, CoreCommand> = new Map();
  private categories: Map<CommandCategory, CoreCommand[]> = new Map();

  constructor() {
    this.initializeCommands();
  }

  private initializeCommands() {
    // Core 600 commands from the JSON - implementing key commands from each module
    const coreCommands: CoreCommand[] = [
      // Dashboard Module (85 commands)
      {
        id: 'dash.main',
        name: '&dash',
        description: 'Open main dashboard',
        module: 'dashboard',
        syntax: '&dash',
        category: 'dashboard',
        isActive: true,
        executionType: 'immediate',
        aiIntegrated: true
      },
      {
        id: 'dash.agents',
        name: '&agents',
        description: 'Show agents overview',
        module: 'dashboard',
        syntax: '&agents',
        category: 'dashboard',
        isActive: true,
        executionType: 'immediate',
        aiIntegrated: true
      },
      {
        id: 'dash.decisions',
        name: '&decisions',
        description: 'Open decision center',
        module: 'dashboard',
        syntax: '&decisions',
        category: 'dashboard',
        isActive: true,
        executionType: 'immediate',
        aiIntegrated: true
      },

      // Memory Module (61 commands)
      {
        id: 'memory.main',
        name: '&memory',
        description: 'Access memory system',
        module: 'memory',
        syntax: '&memory [action] [params]',
        category: 'memory',
        isActive: true,
        executionType: 'immediate',
        aiIntegrated: true,
        parameters: [
          { name: 'action', type: 'string', required: false, description: 'Memory action to perform' },
          { name: 'params', type: 'string', required: false, description: 'Additional parameters' }
        ]
      },
      {
        id: 'memory.store',
        name: '&memory.store',
        description: 'Store information in memory',
        module: 'memory',
        syntax: '&memory.store <content> [importance]',
        category: 'memory',
        isActive: true,
        executionType: 'immediate',
        aiIntegrated: true,
        parameters: [
          { name: 'content', type: 'string', required: true, description: 'Content to store' },
          { name: 'importance', type: 'number', required: false, description: 'Importance level 1-10', defaultValue: 5 }
        ]
      },

      // Admin Module (500 commands)
      {
        id: 'admin.main',
        name: '&admin',
        description: 'Access admin panel',
        module: 'admin',
        syntax: '&admin [section]',
        category: 'admin',
        isActive: true,
        executionType: 'immediate',
        requiredRole: 'admin',
        aiIntegrated: true
      },
      {
        id: 'build.exe',
        name: '&build.exe',
        description: 'Execute build process',
        module: 'admin',
        syntax: '&build.exe [target]',
        category: 'admin',
        isActive: true,
        executionType: 'background',
        requiredRole: 'admin',
        aiIntegrated: false
      },

      // Analytics Module (9 commands)
      {
        id: 'analytics.main',
        name: '&analytics',
        description: 'Open analytics dashboard',
        module: 'analytics',
        syntax: '&analytics [timeframe]',
        category: 'analytics',
        isActive: true,
        executionType: 'immediate',
        aiIntegrated: true
      },

      // Quantum Decision Module (19 commands)  
      {
        id: 'quantum.main',
        name: '&quantum',
        description: 'Access quantum decision system',
        module: 'quantum',
        syntax: '&quantum [mode]',
        category: 'quantum',
        isActive: true,
        executionType: 'immediate',
        aiIntegrated: true
      },
      {
        id: 'quantum.process',
        name: '&quantum.process',
        description: 'Process quantum decision',
        module: 'quantum',
        syntax: '&quantum.process <decision_id>',
        category: 'quantum',
        isActive: true,
        executionType: 'queued',
        aiIntegrated: true,
        parameters: [
          { name: 'decision_id', type: 'string', required: true, description: 'Decision ID to process' }
        ]
      },

      // Cognitive Module (19 commands)
      {
        id: 'cognitive.main',
        name: '&cog',
        description: 'Access cognitive processing',
        module: 'cognitive',
        syntax: '&cog [function]',
        category: 'cognitive',
        isActive: true,
        executionType: 'immediate',
        aiIntegrated: true
      },

      // Evolution Module (19 commands)
      {
        id: 'evolution.main',
        name: '&evolution',
        description: 'Access evolution engine',
        module: 'evolution',
        syntax: '&evolution [process]',
        category: 'evolution',
        isActive: true,
        executionType: 'background',
        aiIntegrated: true
      },

      // Voice System (19 commands)
      {
        id: 'voice.toggle',
        name: '&voice.toggle',
        description: 'Toggle voice system on/off',
        module: 'voice',
        syntax: '&voice.toggle',
        category: 'voice',
        isActive: true,
        executionType: 'immediate',
        aiIntegrated: false
      },

      // System commands
      {
        id: 'system.status',
        name: '&status',
        description: 'Show system status',
        module: 'system',
        syntax: '&status',
        category: 'system',
        isActive: true,
        executionType: 'immediate',
        aiIntegrated: true
      },
      {
        id: 'system.help',
        name: '&help',
        description: 'Show available commands',
        module: 'system',
        syntax: '&help [command]',
        category: 'system',
        isActive: true,
        executionType: 'immediate',
        aiIntegrated: false
      }
    ];

    // Register all commands
    coreCommands.forEach(cmd => this.registerCommand(cmd));
  }

  registerCommand(command: CoreCommand): void {
    this.commands.set(command.id, command);
    
    if (!this.categories.has(command.category)) {
      this.categories.set(command.category, []);
    }
    this.categories.get(command.category)?.push(command);
  }

  getCommand(id: string): CoreCommand | undefined {
    return this.commands.get(id);
  }

  getCommandByName(name: string): CoreCommand | undefined {
    return Array.from(this.commands.values()).find(cmd => cmd.name === name);
  }

  getCommandsByCategory(category: CommandCategory): CoreCommand[] {
    return this.categories.get(category) || [];
  }

  getAllCommands(): CoreCommand[] {
    return Array.from(this.commands.values());
  }

  searchCommands(query: string): CoreCommand[] {
    const searchTerm = query.toLowerCase();
    return Array.from(this.commands.values()).filter(cmd =>
      cmd.name.toLowerCase().includes(searchTerm) ||
      cmd.description.toLowerCase().includes(searchTerm) ||
      cmd.module.toLowerCase().includes(searchTerm)
    );
  }

  getActiveCommands(): CoreCommand[] {
    return Array.from(this.commands.values()).filter(cmd => cmd.isActive);
  }

  getTotalCommandsCount(): number {
    return this.commands.size;
  }

  getCommandsStats(): Record<CommandCategory, number> {
    const stats: Record<string, number> = {};
    this.categories.forEach((commands, category) => {
      stats[category] = commands.length;
    });
    return stats as Record<CommandCategory, number>;
  }
}

export const commandRegistry = new CommandRegistryService();
