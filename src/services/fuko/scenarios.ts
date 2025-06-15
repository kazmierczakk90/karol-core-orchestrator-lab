
import { FUKOMessage } from '@/types/fuko';

type CreateFUKOMessageFn = (
    F: string, U: string, K: string, O: string, 
    P: string, Z: string, K2: string,
    sourceAgent: string, priority?: FUKOMessage['priority']
) => FUKOMessage;


const createSeniorHealthScenario = (context: Record<string, any>, createFUKOMessage: CreateFUKOMessageFn): void => {
  createFUKOMessage(
    'check_activity_status',
    'Monitor senior health activity',
    `user_id: ${context.userId}`,
    'Ensure daily activity compliance',
    'daily_check_trigger',
    'health_monitoring_system',
    '/check_activity_log',
    '@health-monitor'
  );
};

const createLeadNurturingScenario = (context: Record<string, any>, createFUKOMessage: CreateFUKOMessageFn): void => {
  createFUKOMessage(
    'nurture_lead',
    'Convert lead to customer',
    `lead_id: ${context.leadId}, score: ${context.score}`,
    'Increase conversion probability',
    'lead_score > 70',
    'crm_system',
    '/send_personalized_offer',
    '@sales-agent'
  );
};

const createSystemOptimizationScenario = (context: Record<string, any>, createFUKOMessage: CreateFUKOMessageFn): void => {
  createFUKOMessage(
    'optimize_system_performance',
    'Maintain optimal system efficiency',
    'system_load_monitoring',
    'Reduce resource usage by 15%',
    'cpu_usage > 80%',
    'monitoring_tools',
    '/optimize_resource_allocation',
    '@system-optimizer'
  );
};

const createEmergencyResponseScenario = (context: Record<string, any>, createFUKOMessage: CreateFUKOMessageFn): void => {
  createFUKOMessage(
    'emergency_protocol',
    'Handle critical system alert',
    `alert_type: ${context.alertType}`,
    'Resolve critical issue within 5 minutes',
    'critical_alert_detected',
    'emergency_systems',
    '/activate_emergency_protocol',
    '@guardian-core',
    'urgent'
  );
};

const scenarios: Record<string, (context: Record<string, any>, createFUKOMessage: CreateFUKOMessageFn) => void> = {
  'senior_health_check': createSeniorHealthScenario,
  'lead_nurturing': createLeadNurturingScenario,
  'system_optimization': createSystemOptimizationScenario,
  'emergency_response': createEmergencyResponseScenario
};

export const executeScenario = (scenarioName: string, context: Record<string, any>, createFUKOMessage: CreateFUKOMessageFn): void => {
  const scenarioFunction = scenarios[scenarioName];
  if (scenarioFunction) {
    scenarioFunction(context, createFUKOMessage);
  }
};
