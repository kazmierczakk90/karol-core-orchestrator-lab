
import { FUKOMessage, Agent } from '@/types/fuko';

const executeSystemCommand = (command: string): string => {
  const commands: Record<string, string> = {
    '/send_sms_to_physio': 'SMS sent to physiotherapist',
    '/alert_physio_if_inactive': 'Alert system activated',
    '/owner_dashboard': 'Dashboard updated with latest KPIs',
    '/ceo_decision': 'CEO decision process initiated',
    '/sales_insights': 'Sales insights generated',
    '/operations_onboard': 'Onboarding process started',
    '/agent0_optimize': 'Optimization analysis completed',
    '/controlling_alert': 'Financial alert generated',
    '/marketing_audit': 'Marketing audit initiated'
  };
  
  return commands[command] || `Unknown command: ${command}`;
};

const executeAgentCommand = (command: string): string => {
  const commands: Record<string, string> = {
    '&style-shift': 'Agent style modification initiated',
    '&activate-agent': 'Agent activation sequence started',
    '&freeze-evolution': 'Evolution process frozen',
    '&snapshot-system': 'System snapshot created'
  };
  
  return commands[command] || `Unknown agent command: ${command}`;
};

export const processCommand = (command: string, agent: Agent): string => {
  if (command.startsWith('/')) {
    return executeSystemCommand(command);
  } else if (command.startsWith('&')) {
    return executeAgentCommand(command);
  } else {
    return `Processed: ${command} by ${agent.name}`;
  }
};
