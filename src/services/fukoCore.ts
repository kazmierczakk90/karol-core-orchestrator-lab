
import { FUKOMessage, Agent, DecisionRule, KPIData } from '@/types/fuko';

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
    const targetAgent = this.findBestAgent(message);
    if (targetAgent) {
      message.targetAgent = targetAgent.id;
      message.status = 'processing';
      this.executeMessage(message, targetAgent);
    } else {
      message.status = 'failed';
      this.alerts.push(`No suitable agent found for: ${message.F}`);
    }
  }

  private findBestAgent(message: FUKOMessage): Agent | null {
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => agent.status === 'active')
      .filter(agent => this.checkDependencies(message.Z, agent));
    
    if (availableAgents.length === 0) return null;
    
    // Score agents based on competency and capabilities match
    return availableAgents.reduce((best, current) => 
      current.competencyScore > best.competencyScore ? current : best
    );
  }

  private checkDependencies(dependencies: string, agent: Agent): boolean {
    const requiredDeps = dependencies.split(',').map(dep => dep.trim());
    return requiredDeps.every(dep => 
      agent.capabilities.some(cap => cap.includes(dep))
    );
  }

  // FUKO-MEMORY Layer: Log all decisions
  private executeMessage(message: FUKOMessage, agent: Agent): void {
    try {
      // Simulate execution based on command
      const result = this.processCommand(message.K2, message, agent);
      message.executionResult = result;
      message.status = 'completed';
      
      // Update agent performance
      agent.performance = Math.min(100, agent.performance + 2);
      agent.lastUpdate = new Date().toLocaleString();
      
      // Generate follow-up if needed
      this.generateFollowUp(message, result);
      
    } catch (error) {
      message.status = 'failed';
      message.executionResult = `Execution failed: ${error}`;
      agent.performance = Math.max(0, agent.performance - 5);
    }
  }

  private processCommand(command: string, message: FUKOMessage, agent: Agent): string {
    // Command processing logic
    if (command.startsWith('/')) {
      return this.executeSystemCommand(command, message, agent);
    } else if (command.startsWith('&')) {
      return this.executeAgentCommand(command, message, agent);
    } else {
      return `Processed: ${command} by ${agent.name}`;
    }
  }

  private executeSystemCommand(command: string, message: FUKOMessage, agent: Agent): string {
    const commands = {
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
  }

  private executeAgentCommand(command: string, message: FUKOMessage, agent: Agent): string {
    const commands = {
      '&style-shift': 'Agent style modification initiated',
      '&activate-agent': 'Agent activation sequence started',
      '&freeze-evolution': 'Evolution process frozen',
      '&snapshot-system': 'System snapshot created'
    };
    
    return commands[command] || `Unknown agent command: ${command}`;
  }

  private generateFollowUp(originalMessage: FUKOMessage, result: string): void {
    // Generate automatic follow-up FUKO messages based on results
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
    const scenarios = {
      'senior_health_check': this.createSeniorHealthScenario,
      'lead_nurturing': this.createLeadNurturingScenario,
      'system_optimization': this.createSystemOptimizationScenario,
      'emergency_response': this.createEmergencyResponseScenario
    };

    const scenarioFunction = scenarios[scenarioName];
    if (scenarioFunction) {
      scenarioFunction.call(this, context);
    }
  }

  private createSeniorHealthScenario(context: Record<string, any>): void {
    this.createFUKOMessage(
      'check_activity_status',
      'Monitor senior health activity',
      `user_id: ${context.userId}`,
      'Ensure daily activity compliance',
      'daily_check_trigger',
      'health_monitoring_system',
      '/check_activity_log',
      '@health-monitor'
    );
  }

  private createLeadNurturingScenario(context: Record<string, any>): void {
    this.createFUKOMessage(
      'nurture_lead',
      'Convert lead to customer',
      `lead_id: ${context.leadId}, score: ${context.score}`,
      'Increase conversion probability',
      'lead_score > 70',
      'crm_system',
      '/send_personalized_offer',
      '@sales-agent'
    );
  }

  private createSystemOptimizationScenario(context: Record<string, any>): void {
    this.createFUKOMessage(
      'optimize_system_performance',
      'Maintain optimal system efficiency',
      'system_load_monitoring',
      'Reduce resource usage by 15%',
      'cpu_usage > 80%',
      'monitoring_tools',
      '/optimize_resource_allocation',
      '@system-optimizer'
    );
  }

  private createEmergencyResponseScenario(context: Record<string, any>): void {
    this.createFUKOMessage(
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
  }

  // Initialize default agents
  private initializeAgents(): void {
    const agentDefinitions = [
      { id: '@ceo', name: 'CEO Core', category: 'core', mode: 'CEO', capabilities: ['decision_making', 'strategic_planning'] },
      { id: '@voice-core', name: 'Voice Core', category: 'core', mode: 'ECHO', capabilities: ['voice_synthesis', 'communication'] },
      { id: '@guardian-core', name: 'Guardian Core', category: 'core', mode: 'LIVE', capabilities: ['monitoring', 'security', 'alerts'] },
      { id: '@router', name: 'Router Core', category: 'system', mode: 'LIVE', capabilities: ['routing', 'load_balancing'] },
      { id: '@controlling', name: 'Controlling Agent', category: 'system', mode: 'CEO', capabilities: ['kpi_monitoring', 'financial_analysis'] },
      { id: '@system-admin', name: 'System Admin', category: 'system', mode: 'LIVE', capabilities: ['system_management', 'optimization'] },
      { id: '@party-app', name: 'PartyApp Agent', category: 'project', mode: 'CREATIVE', capabilities: ['event_management', 'social_features'] },
      { id: '@sky-solution', name: 'Sky Solution', category: 'project', mode: 'CREATIVE', capabilities: ['ai_automation', 'workflow'] },
      { id: '@fuko-lang', name: 'FUKO Language Core', category: 'fuko', mode: 'CEO', capabilities: ['language_processing', 'command_parsing'] },
      { id: '@karol-core', name: 'Karol Core', category: 'core', mode: 'CEO', capabilities: ['identity_management', 'core_decisions'] }
    ];

    agentDefinitions.forEach(def => {
      const agent: Agent = {
        ...def,
        status: 'active',
        performance: 85 + Math.random() * 15,
        lastUpdate: new Date().toLocaleString(),
        dependencies: [],
        competencyScore: 70 + Math.random() * 30
      } as Agent;
      
      this.agents.set(agent.id, agent);
    });
  }

  private initializeRules(): void {
    this.rules = [
      {
        id: 'kpi_threshold_check',
        name: 'KPI Threshold Monitoring',
        condition: 'kpi_value < threshold',
        action: 'generate_optimization_fuko',
        priority: 1,
        isActive: true
      },
      {
        id: 'agent_performance_low',
        name: 'Low Agent Performance',
        condition: 'agent.performance < 50',
        action: 'initiate_agent_recovery',
        priority: 2,
        isActive: true
      }
    ];

    // Initialize sample KPI data
    this.kpiData = {
      'sales_conversion': { value: 67, threshold: 70, trend: 'down', lastUpdate: new Date() },
      'system_performance': { value: 89, threshold: 85, trend: 'up', lastUpdate: new Date() },
      'user_engagement': { value: 43, threshold: 60, trend: 'down', lastUpdate: new Date() },
      'agent_efficiency': { value: 92, threshold: 80, trend: 'stable', lastUpdate: new Date() }
    };
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
      
      // Check thresholds after update
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

// Global FUKO Core instance
export const fukoCore = new FUKOCore();
