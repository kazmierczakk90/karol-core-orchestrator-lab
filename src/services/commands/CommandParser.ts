
import { CoreCommand, CommandParameter } from '@/types/commands';
import { commandRegistry } from './CommandRegistry';

export interface ParsedCommand {
  command: CoreCommand;
  args: Record<string, any>;
  rawInput: string;
  isValid: boolean;
  errors: string[];
}

class CommandParserService {
  parseCommand(input: string): ParsedCommand | null {
    const trimmedInput = input.trim();
    
    // Check if input starts with & (command prefix)
    if (!trimmedInput.startsWith('&')) {
      return null;
    }

    // Split command and arguments
    const parts = trimmedInput.split(' ');
    const commandName = parts[0];
    const argsParts = parts.slice(1);

    // Find command in registry
    const command = commandRegistry.getCommandByName(commandName);
    if (!command) {
      return {
        command: {} as CoreCommand,
        args: {},
        rawInput: input,
        isValid: false,
        errors: [`Unknown command: ${commandName}`]
      };
    }

    // Parse arguments
    const { args, errors } = this.parseArguments(command.parameters || [], argsParts);

    return {
      command,
      args,
      rawInput: input,
      isValid: errors.length === 0,
      errors
    };
  }

  private parseArguments(parameters: CommandParameter[], argsParts: string[]): {
    args: Record<string, any>;
    errors: string[];
  } {
    const args: Record<string, any> = {};
    const errors: string[] = [];

    // Set default values
    parameters.forEach(param => {
      if (param.defaultValue !== undefined) {
        args[param.name] = param.defaultValue;
      }
    });

    // Parse provided arguments
    let argIndex = 0;
    for (const param of parameters) {
      if (argIndex >= argsParts.length) {
        if (param.required) {
          errors.push(`Missing required parameter: ${param.name}`);
        }
        continue;
      }

      const argValue = argsParts[argIndex];
      const parsedValue = this.parseArgumentValue(argValue, param.type);
      
      if (parsedValue.error) {
        errors.push(`Invalid ${param.type} value for parameter ${param.name}: ${argValue}`);
      } else {
        args[param.name] = parsedValue.value;
      }

      argIndex++;
    }

    return { args, errors };
  }

  private parseArgumentValue(value: string, type: CommandParameter['type']): {
    value: any;
    error?: string;
  } {
    try {
      switch (type) {
        case 'string':
          return { value: value };
        case 'number':
          const numValue = Number(value);
          if (isNaN(numValue)) {
            return { value: null, error: 'Not a valid number' };
          }
          return { value: numValue };
        case 'boolean':
          const boolValue = value.toLowerCase();
          if (!['true', 'false', '1', '0', 'yes', 'no'].includes(boolValue)) {
            return { value: null, error: 'Not a valid boolean' };
          }
          return { value: ['true', '1', 'yes'].includes(boolValue) };
        case 'array':
          return { value: value.split(',').map(v => v.trim()) };
        case 'object':
          try {
            return { value: JSON.parse(value) };
          } catch {
            return { value: null, error: 'Not valid JSON' };
          }
        default:
          return { value: value };
      }
    } catch (error) {
      return { value: null, error: 'Parse error' };
    }
  }

  getCommandSuggestions(partialInput: string): CoreCommand[] {
    if (!partialInput.startsWith('&')) {
      return [];
    }

    const query = partialInput.slice(1).toLowerCase();
    return commandRegistry.searchCommands(query).slice(0, 10);
  }

  validateCommandSyntax(command: CoreCommand, args: Record<string, any>): string[] {
    const errors: string[] = [];
    
    if (!command.parameters) {
      return errors;
    }

    command.parameters.forEach(param => {
      if (param.required && args[param.name] === undefined) {
        errors.push(`Missing required parameter: ${param.name}`);
      }
    });

    return errors;
  }
}

export const commandParser = new CommandParserService();
