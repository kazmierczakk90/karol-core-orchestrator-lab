
import { FUKOMessage, Agent, DecisionRule, KPIData } from '@/types/fuko';
import { findBestAgent } from './fuko/routing';
import { processCommand } from './fuko/commands';
import { executeScenario } from './fuko/scenarios';

export class FUKOCore {
  private agents: Map<string, Agent> = new Map();
  private messages: FUKOMessage[] = [];
  private rules: DecisionRule[] = [];
  private kpiData: KPIData = {};
  private alerts: string[] = [];

  constructor() {
    this.initializeAgents();
    this.initializeRules();
  }

  // FUKO-CORE Layer: Creating decision statements
  createFUKOMessage(
    F: string, U: string, K: string, O: string, 
    P: string, Z: string, K2: string,
    sourceAgent: string, priority: FUKOMessage['priority'] = 'medium'
  ): FUKOMessage {
    const message: FUKOMessage = {
      id: `fuko_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      F, U, K, O, P, Z, K2,
      sourceAgent,
      priority,
      status: 'pending'
    };

    this.messages.unshift(message);
    this.routeMessage(message);
    return message;
  }

  // FUKO-ROUTING Layer: Route messages to appropriate agents
  private routeMessage(message: FUKOMessage): void {
    const agentList = Array.from(this.agents.values());
    const targetAgent = findBestAgent(agentList, message);
    
    if (targetAgent) {
      message.targetAgent = targetAgent.id;
      message.status = 'processing';
      this.executeMessage(message, targetAgent);
    } else {
      message.status = 'failed';
      this.alerts.push(`No suitable agent found for: ${message.F}`);
    }
  }

  // FUKO-MEMORY Layer: Log all decisions
  private executeMessage(message: FUKOMessage, agent: Agent): void {
    try {
      const result = processCommand(message.K2, agent);
      message.executionResult = result;
      message.status = 'completed';
      
      agent.performance = Math.min(100, agent.performance + 2);
      agent.lastUpdate = new Date().toLocaleString();
      
      this.generateFollowUp(message, result);
      
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        message.status = 'failed';
        message.executionResult = `Execution failed: ${errorMessage}`;
        agent.performance = Math.max(0, agent.performance - 5);
    }
  }

  private generateFollowUp(originalMessage: FUKOMessage, result: string): void {
    if (result.includes('alert') && !result.includes('failed')) {
      this.createFUKOMessage(
        'monitor_alert_response',
        'Following up on generated alert',
        'alert_system_active',
        'Ensure alert was processed',
        'alert_generated',
        'alert_system',
        '/verify_alert_handling',
        '@guardian-core',
        'high'
      );
    }
  }

  // FUKO-ALERTS Layer: Scan rules and generate alerts
  checkKPIThresholds(): void {
    Object.entries(this.kpiData).forEach(([key, data]) => {
      if (data.value < data.threshold) {
        this.createFUKOMessage(
          `optimize_${key}`,
          `KPI ${key} below threshold (${data.value}/${data.threshold})`,
          `system_performance_monitoring`,
          `Restore ${key} to acceptable levels`,
          `${key} < ${data.threshold}`,
          'monitoring_system',
          `/optimize_${key}`,
          '@controlling',
          'urgent'
        );
      }
    });
  }

  // FUKO-SCENARIOS Layer: Aggregate multiple FUKOs into logical scenarios
  executeScenario(scenarioName: string, context: Record<string, any>): void {
    executeScenario(scenarioName, context, this.createFUKOMessage.bind(this));
  }

  // Initialize default agents
  private initializeAgents(): void {
    this.agents.clear();
  }

  private initializeRules(): void {
    this.rules = [];
    this.kpiData = {};
  }

  // Public getter methods
  getMessages(): FUKOMessage[] { return [...this.messages]; }
  getAgents(): Agent[] { return Array.from(this.agents.values()); }
  getAlerts(): string[] { return [...this.alerts]; }
  getKPIData(): KPIData { return { ...this.kpiData }; }
  
  // Update KPI data
  updateKPI(key: string, value: number): void {
    if (this.kpiData[key]) {
      const oldValue = this.kpiData[key].value;
      this.kpiData[key].value = value;
      this.kpiData[key].lastUpdate = new Date();
      this.kpiData[key].trend = value > oldValue ? 'up' : value < oldValue ? 'down' : 'stable';
      
      this.checkKPIThresholds();
    }
  }

  // Agent management
  activateAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = 'active';
      agent.lastUpdate = new Date().toLocaleString();
      return true;
    }
    return false;
  }

  deactivateAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = 'dormant';
      agent.lastUpdate = new Date().toLocaleString();
      return true;
    }
    return false;
  }
}

export const fukoCore = new FUKOCore();
